import math
import torch
import torchvision
from PIL import Image
import torchvision.transforms as T
import numpy as np
import cv2
import matplotlib.pyplot as plt
from typing import Tuple
from sklearn.neighbors import NearestNeighbors

CONF_THRESH = 0.5                                                                           # min confidence for object detector
DIST_THRESH = 15                                                                            # max number of pixels for object that moved slightly to still be considered in same spot                                                                     #
IOU_THRESH = 0.8                                                                            # min IOU threshold for object to be considered in same spot
# Faster R-CNN is trained on COCO dataset
COCO_LABELS = {                                                                             # COCO class label mapping
    1: "person", 2: "bicycle", 3: "car", 4: "motorcycle", 5: "airplane",
    6: "bus", 7: "train", 8: "truck", 9: "boat", 10: "traffic light",
    11: "fire hydrant", 13: "stop sign", 14: "parking meter", 15: "bench",
    16: "bird", 17: "cat", 18: "dog", 19: "horse", 20: "sheep",
    21: "cow", 22: "elephant", 23: "bear", 24: "zebra", 25: "giraffe",
    27: "backpack", 28: "umbrella", 31: "handbag", 32: "tie", 33: "suitcase",
    34: "frisbee", 35: "skis", 36: "snowboard", 37: "sports ball", 38: "kite",
    39: "baseball bat", 40: "baseball glove", 41: "skateboard", 42: "surfboard", 43: "tennis racket",
    44: "bottle", 46: "wine glass", 47: "cup", 48: "fork", 49: "knife",
    50: "spoon", 51: "bowl", 52: "banana", 53: "apple", 54: "sandwich",
    55: "orange", 56: "broccoli", 57: "carrot", 58: "hot dog", 59: "pizza",
    60: "donut", 61: "cake", 62: "chair", 63: "couch", 64: "potted plant",
    65: "bed", 67: "dining table", 70: "toilet", 72: "TV", 73: "laptop",
    74: "mouse", 75: "remote", 76: "keyboard", 77: "cell phone", 78: "microwave",
    79: "oven", 80: "toaster", 81: "sink", 82: "refrigerator", 84: "book",
    85: "clock", 86: "vase", 87: "scissors", 88: "teddy bear", 89: "hair drier",
    90: "toothbrush"
}

"""Define a class to represent a detection"""
class HouseObject:
    def __init__(self, label: int, bbox: list) -> 'HouseObject':
        self.label = label
        self.x1, self.y1, self.x2, self.y2 = [int(b) for b in bbox]

    """x1, y1, x2, y2"""
    @property
    def bbox(self) -> list[int]:
        return [self.x1, self.y1, self.x2, self.y2]
    
    """Centroid coordinates"""
    @property
    def centroid(self) -> list[int]:
        return [int((self.x2 - self.x1)/2), int((self.y2 - self.y1)/2)] 
    
    """Class label"""
    @property
    def class_num(self) -> str:
        return self.label

    """Class label"""
    @property
    def class_name(self) -> str:
        return COCO_LABELS[self.label]
    
    """Distance between 2 house objects"""
    def distance(self, other: 'HouseObject') -> float:
        x1, y1 = self.centroid
        x2, y2 = other.centroid
        return math.sqrt((x2-x1)^2 + (y2-y1)^2)

    """Intersection over union of 2 house objects"""
    def iou(self, other: 'HouseObject') -> float:
        x_min1, y_min1, x_max1, y_max1 = self.bbox
        x_min2, y_min2, x_max2, y_max2 = other.bbox

        # calculate intersection
        x_min_inter = max(x_min1, x_min2)
        y_min_inter = max(y_min1, y_min2)
        x_max_inter = min(x_max1, x_max2)
        y_max_inter = min(y_max1, y_max2)

        # no intersection
        if x_min_inter >= x_max_inter or y_min_inter >= y_max_inter:
            return 0  

        intersection_area = (x_max_inter - x_min_inter) * (y_max_inter - y_min_inter)

        # calculate union
        bbox1_area = (x_max1 - x_min1) * (y_max1 - y_min1)
        bbox2_area = (x_max2 - x_min2) * (y_max2 - y_min2)
        union_area = bbox1_area + bbox2_area - intersection_area

        return intersection_area / union_area



class CleanlinessDetector:
    def __init__(self) -> 'CleanlinessDetector':
        self.model = torchvision.models.detection.fasterrcnn_resnet50_fpn(pretrained=True)   # load Faster R-CNN model
        self.model.eval()                                                                    # set to evaluation mode
        self.transform = T.Compose([T.ToTensor()])                                           # function to convert to tensor

    """Convert image to tensor"""
    def process_image(self, img: Image) -> torch.Tensor:
        tsr = self.transform(img).unsqueeze(0)
        tsr = tsr[:, :3, :, :]                          # only keep RGB channels
        return tsr
    
    """Given an image, return list of objects detected"""
    def detect_objects(self, img: Image, display=False) -> list[HouseObject]:
        tsr = self.process_image(img)
        with torch.no_grad():                           # no gradient => something about reducing complexity
            predictions = self.model(tsr)
        bboxes = predictions[0]['boxes']                # (x1, y1, x2, y2) for each detection
        labels = predictions[0]['labels']               # COCO class #
        scores = predictions[0]['scores']               # confidence score
        objects = []
        # only consider predictions for objects over the confidence threshold
        for i, box in enumerate(bboxes):
            if scores[i].item() > CONF_THRESH:
                objects.append(HouseObject(labels[i].item(), [b.item() for b in box]))
        if(display):
            self.display_image(img, objects)
        return objects
    
    """Find all objects in 2 images and identify what was added, removed, and moved"""
    def calculate_difference(self, before_img: Image, after_img: Image) -> Tuple[list[HouseObject], list[HouseObject], list[HouseObject]]:
        added, removed, moved = [], [], []
        objects_before = self.detect_objects(before_img, display=False)
        objects_after = self.detect_objects(after_img, display=False)
        centroids_before = np.array([obj.centroid for obj in objects_before])
        centroids_after = np.array([obj.centroid for obj in objects_after])

        nbrs = NearestNeighbors(n_neighbors=1).fit(centroids_before)
        dists, inds = nbrs.kneighbors(centroids_after)

        objects_before_cp = objects_before.copy()
        objects_after_cp = objects_after.copy()

        # case 1: object didn't move (disregard these objects)
        for obj1, dist, idx in zip(objects_before_cp, dists, inds):
            obj2 = objects_after_cp[idx[0]]
            if dist <= DIST_THRESH and obj1.iou(obj2) > IOU_THRESH and obj1.class_num == obj2.class_num:
                objects_before.remove(obj1)
                objects_after.remove(obj2)

        # case 2: object was added to scene
        objects_after_cp = objects_after.copy()
        objects_before_classes = [obj.class_num for obj in objects_before]

        for obj in objects_after_cp:
            if obj.class_num not in objects_before_classes:
                added.append(obj)
                objects_after.remove(obj)

        # case 3: object removed from scene
        objects_before_cp = objects_before.copy()
        objects_after_classes = [obj.class_num for obj in objects_after]

        for obj in objects_before_cp:
            if obj.class_num not in objects_after_classes:
                removed.append(obj)
                objects_before.remove(obj)

        # case 4: object moved
        moved = list(set(objects_before) & set(objects_after))

        return added, removed, moved

    """Idk"""
    def calculate_cleanliness_score(self, moved: list[HouseObject], added: list[HouseObject], removed: list[HouseObject]) -> float:
        score = 0
        return score
    
    """Draw bboxes and show classes for objects detected in image"""
    def display_image(self, img: Image, objects: HouseObject) -> None:
        img= cv2.cvtColor(np.array(img), cv2.COLOR_RGB2BGR)
        for i, obj in enumerate(objects):
            x1, y1, x2, y2 = obj.bbox
            cv2.rectangle(img, (x1, y1), (x2, y2), (0, 255, 0), 2)
            cv2.putText(img, obj.class_name, (x1, y1 - 10),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)
        plt.imshow(cv2.cvtColor(img, cv2.COLOR_BGR2RGB))
        plt.axis('off')
        plt.show()


if __name__=="__main__":
    cd = CleanlinessDetector()
    # Process images
    before_img = Image.open("cleanliness_detection/samples/1/before.png")
    after_img = Image.open("cleanliness_detection/samples/1/after.png")

    added, removed, moved = cd.calculate_difference(before_img, after_img)
    added = [obj.class_name for obj in added]
    removed = [obj.class_name for obj in removed]
    moved = [obj.class_name for obj in moved]
    print("Objects added: " + ", ".join(added))
    print("Objects removed: " + ", ".join(removed))
    print("Objects moved: " + ", ".join(moved))
