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
from pathlib import Path
from datetime import datetime
import csv
import detectron2
from detectron2.engine import DefaultPredictor
from detectron2.config import get_cfg
from detectron2 import model_zoo
from detectron2.structures import Instances
from detectron2.utils.visualizer import Visualizer
from detectron2.data import MetadataCatalog


CONF_THRESH = 0.5                                                                           # min confidence for object detector
DIST_THRESH = 15                                                                            # max number of pixels for object that moved slightly to still be considered in same spot                                                                     #
IOU_THRESH = 0.8                                                                            # min IOU threshold for object to be considered in same spot
# Faster R-CNN is trained on COCO dataset
COCO_LABELS = {
    0: "person", 1: "bicycle", 2: "car", 3: "motorcycle", 4: "airplane", 5: "bus", 6: "train", 7: "truck", 8: "boat",
    9: "traffic light", 10: "fire hydrant", 11: "stop sign", 12: "parking meter", 13: "bench", 14: "bird", 15: "cat", 
    16: "dog", 17: "horse", 18: "sheep", 19: "cow", 20: "elephant", 21: "bear", 22: "zebra", 23: "giraffe", 24: "backpack", 
    25: "umbrella", 26: "handbag", 27: "tie", 28: "suitcase", 29: "frisbee", 30: "skis", 31: "snowboard", 32: "sports ball", 
    33: "kite", 34: "baseball bat", 35: "baseball glove", 36: "skateboard", 37: "surfboard", 38: "tennis racket", 39: "bottle", 
    40: "wine glass", 41: "cup", 42: "fork", 43: "knife", 44: "spoon", 45: "bowl", 46: "banana", 47: "apple", 48: "sandwich", 
    49: "orange", 50: "broccoli", 51: "carrot", 52: "hot dog", 53: "pizza", 54: "donut", 55: "cake", 56: "chair", 57: "couch", 
    58: "potted plant", 59: "bed", 60: "dining table", 61: "toilet", 62: "TV", 63: "laptop", 64: "mouse", 65: "remote", 
    66: "keyboard", 67: "cell phone", 68: "microwave", 69: "oven", 70: "toaster", 71: "sink", 72: "refrigerator", 73: "book", 
    74: "clock", 75: "vase", 76: "scissors", 77: "teddy bear", 78: "hair drier", 79: "toothbrush"
}


SCORE_WEIGHTS = {
    "person": [0, 0, 0], "bicycle": [0, 0, 0], "car": [0, 0, 0], "motorcycle": [0, 0, 0], "airplane": [0, 0, 0],
    "bus": [0, 0, 0], "train": [0, 0, 0], "truck": [0, 0, 0], "boat": [0, 0, 0], "traffic light": [0, 0, 0],
    "fire hydrant": [0, 0, 0], "stop sign": [0, 0, 0], "parking meter": [0, 0, 0], "bench": [0, 0, 0],
    "bird": [0, 0, 0], "cat": [0, 0, 0], "dog": [0, 0, 0], "horse": [0, 0, 0], "sheep": [0, 0, 0],
    "cow": [0, 0, 0], "elephant": [0, 0, 0], "bear": [0, 0, 0], "zebra": [0, 0, 0], "giraffe": [0, 0, 0],
    "backpack": [-2, 2, 0], "umbrella": [-1, 1, 0], "handbag": [-1, 1, 0], "tie": [-1, 1, 0], "suitcase": [-2, 2, 0],
    "frisbee": [-1, 1, 0], "skis": [-3, 3, 0], "snowboard": [-3, 3, 0], "sports ball": [-1, 1, 0], "kite": [-1, 1, 0],
    "baseball bat": [-2, 2, 0], "baseball glove": [-1, 1, 0], "skateboard": [-2, 2, 0], "surfboard": [-3, 3, 0], "tennis racket": [-2, 2, 0],
    "bottle": [-1.5, 1.5, 0], "wine glass": [-1, 1, 0], "cup": [-1, 1, 0], "fork": [-0.5, 0.5, 0], "knife": [-0.5, 0.5, 0],
    "spoon": [-0.5, 0.5, 0], "bowl": [-1, 1, 0], "banana": [-1, 1, 0], "apple": [-1, 1, 0], "sandwich": [-1, 1, 0],
    "orange": [0, 0, 0], "broccoli": [-1, 1, 0], "carrot": [-1, 1, 0], "hot dog": [-1, 1, 0], "pizza": [-2, 2, 0],
    "donut": [0, 0, 0], "cake": [0, 0, 0], "chair": [0, 0, 0], "couch": [0, 0, 0], "potted plant": [0, 0, 0],
    "bed": [0, 0, 0], "dining table": [0, 0, 0], "toilet": [0, 0, 0], "TV": [0, 0, 0], "laptop": [0, 0, 0],
    "mouse": [0, 0, 0], "remote": [0, 0, 0], "keyboard": [-2, 2, 0], "cell phone": [0, 0, 0], "microwave": [0, 0, 0],
    "oven": [0, 0, 0], "toaster": [0, 0, 0], "sink": [0, 0, 0], "refrigerator": [0, 0, 0], "book": [0, 0, 0],
    "clock": [0, 0, 0], "vase": [0, 0, 0], "scissors": [0, 0, 0], "teddy bear": [0, 0, 0], "hair drier": [0, 0, 0],
    "toothbrush": [0, 0, 0]
}

"""Define a class to represent a detection"""
class HouseObject:
    def __init__(self, label: int, bbox: list, mask: np.array = None) -> 'HouseObject':
        self.label = label
        self.x1, self.y1, self.x2, self.y2 = [int(b) for b in bbox]
        self.mask = mask

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
        # Load a Detectron2 model (Mask R-CNN)
        self.cfg = get_cfg()
        self.cfg.merge_from_file(model_zoo.get_config_file("COCO-InstanceSegmentation/mask_rcnn_R_50_FPN_3x.yaml"))
        self.cfg.MODEL.WEIGHTS = model_zoo.get_checkpoint_url("COCO-InstanceSegmentation/mask_rcnn_R_50_FPN_3x.yaml")
        self.cfg.MODEL.ROI_HEADS.SCORE_THRESH_TEST = 0.5  # Set a confidence threshold
        self.cfg.MODEL.DEVICE = "cuda" if torch.cuda.is_available() else "cpu"  # Use GPU if available

        # Create predictor
        self.model = DefaultPredictor(self.cfg)                                                               # set to evaluation mode
        self.transform = T.Compose([T.ToTensor()])                                           # function to convert to tensor

    """Convert image to tensor"""
    def process_image(self, img: Image) -> torch.Tensor:
        tsr = self.transform(img).unsqueeze(0)
        tsr = tsr[:, :3, :, :]                          # only keep RGB channels
        return tsr
    

    """Pixel-wise image differencing to return a binary mask of change regions"""
    def frame_diff(self, before: np.array, after: np.array, min_area:int = 100, display: bool = False) -> np.array:
        # Convert to grayscale
        gray1 = cv2.cvtColor(np.array(before), cv2.COLOR_BGR2GRAY)
        gray2 = cv2.cvtColor(np.array(after), cv2.COLOR_BGR2GRAY)

        # Compute absolute difference
        diff = cv2.absdiff(gray1, gray2)

        # Threshold the difference to create a binary mask
        _, binary_mask = cv2.threshold(diff, 30, 255, cv2.THRESH_BINARY)

        # Find contours in the binary mask
        contours, _ = cv2.findContours(binary_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

        # Create a blank mask of the same size as the input image, with 3 channels
        mask = np.zeros_like(before, dtype=np.uint8)

        # Draw filled rectangles based on contours
        for contour in contours:
            x, y, w, h = cv2.boundingRect(contour)
            area = w * h
            if area >= min_area:  # Ignore small changes based on area threshold
                cv2.rectangle(mask, (x, y), (x + w, y + h), (255, 255, 255), thickness=cv2.FILLED)

        # Display frame differencing results
        if display:
            cv2.imshow("Rectangular Mask", mask)
            cv2.waitKey(0)
            cv2.destroyAllWindows()

        return mask
    
    """ok"""
    def combine_image_mask(self, before_img: Image, after_img: Image, display: bool = False) -> [Image, Image]:
        mask = self.frame_diff(before_img, after_img, min_area=200)
        mask = Image.fromarray(np.uint8(mask)).convert('RGB')

        # Convert PIL images to NumPy arrays
        before_img = np.array(before_img.convert("RGB"))
        after_img = np.array(after_img.convert("RGB"))
        mask = np.array(mask)

        # Convert RGB to BGR for OpenCV processing
        before_img = cv2.cvtColor(before_img, cv2.COLOR_RGB2BGR)
        after_img = cv2.cvtColor(after_img, cv2.COLOR_RGB2BGR)
        mask = cv2.cvtColor(mask, cv2.COLOR_RGB2BGR)  

        kernel = np.ones((5,5), np.uint8)
        mask = cv2.dilate(mask, kernel, iterations=2)

        # Apply the mask
        before_img = cv2.bitwise_and(before_img, mask)
        after_img = cv2.bitwise_and(after_img, mask)

        # Convert BGR back to RGB
        before_img = cv2.cvtColor(before_img, cv2.COLOR_BGR2RGB)
        after_img = cv2.cvtColor(after_img, cv2.COLOR_BGR2RGB)

        # Convert back to PIL
        before_img = Image.fromarray(before_img)
        after_img = Image.fromarray(after_img)

        # Display if required
        if display:
            before_img.show(title="Before Mask")
            after_img.show(title="After Mask")

        return [before_img, after_img]

    
    """Given an image, return list of objects detected"""
    def detect_objects(self, img: Image, display=False) -> list[HouseObject]:
        # Load image
        img_rgb = cv2.cvtColor(np.array(img), cv2.COLOR_BGR2RGB)

        # Run detection
        outputs = self.model(img_rgb)

        # Extract instances
        instances = outputs["instances"]
        boxes = instances.pred_boxes.tensor.cpu().numpy()  # Bounding boxes
        masks = instances.pred_masks.cpu().numpy() if instances.has("pred_masks") else None
        classes = instances.pred_classes.cpu().numpy()  # Class indices
        scores = instances.scores.cpu().numpy()  # Confidence scores

        # Metadata for COCO classes
        metadata = MetadataCatalog.get(self.cfg.DATASETS.TRAIN[0])
        class_names = metadata.get("thing_classes", None)

        extracted_objects = []
        house_objects = []
        
        for i, (box, class_id) in enumerate(zip(boxes, classes)):
            x1, y1, x2, y2 = map(int, box)
            mask = masks[i] if masks is not None else None

            house_objects.append(HouseObject(label=class_id, bbox=[x1, y1, x2, y2], mask=mask))

        return house_objects

    
    """Find all objects in 2 images and identify what was added, removed, and moved"""
    def calculate_difference(self, before_img: Image, after_img: Image) -> Tuple[list[HouseObject], list[HouseObject], list[HouseObject]]:
        added, removed, moved = [], [], []
        objects_before = self.detect_objects(before_img)
        objects_after = self.detect_objects(after_img)
        centroids_before = np.array([obj.centroid for obj in objects_before])
        centroids_after = np.array([obj.centroid for obj in objects_after])

        nbrs = NearestNeighbors(n_neighbors=1).fit(centroids_before)
        dists, inds = nbrs.kneighbors(centroids_after)

        objects_before_cp = objects_before.copy()
        objects_after_cp = objects_after.copy()

        # case 1: object didn't move (disregard these objects)
        for obj2, dist, idx in zip(objects_after_cp, dists, inds):
            obj1 = objects_before_cp[idx[0]]
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
        objects_before_classes = [obj.class_num for obj in objects_before]
        objects_after_classes = [obj.class_num for obj in objects_after]
        
        moved_class_nums = list(set(objects_before_classes) & set(objects_after_classes))
        for n in moved_class_nums:
            before_matches = [obj for obj in objects_before if obj.class_num == n]
            after_matches = [obj for obj in objects_after if obj.class_num == n]
            moved.append([before_matches, after_matches])

        return added, removed, moved


    """Scoring algorithm"""
    def calculate_cleanliness_score(self, added: list[HouseObject], removed: list[HouseObject], moved: list[HouseObject]) -> float:
        score = 0
        for i in added:
            score += SCORE_WEIGHTS.get(i)[0]
        for j in removed:
            score += SCORE_WEIGHTS.get(j)[1]
        return score

    """Draw boxes and show classes for objects detected in image"""
    def annotate_image(self, img: Image, objects: list[HouseObject], display=False) -> plt.figure:
        """Draw boxes, show classes, and overlay masks for objects detected in image"""
        img = cv2.cvtColor(np.array(img), cv2.COLOR_RGB2BGR)
        overlay = img.copy()

        for obj in objects:
            x1, y1, x2, y2 = obj.bbox
            
            # Draw instance mask if available
            if obj.mask is not None:
                mask = obj.mask.astype(np.uint8) * 255  # Convert to uint8 (0-255)
                color = np.random.randint(0, 255, (3,), dtype=int).tolist()  # Random color
                
                for c in range(3):
                    overlay[:, :, c] = np.where(mask > 0, 
                                                overlay[:, :, c] * 0.5 + color[c] * 0.5, 
                                                overlay[:, :, c])
            
            # Draw bounding box
            cv2.rectangle(img, (x1, y1), (x2, y2), (0, 255, 0), 2)
            cv2.putText(img, obj.class_name, (x1, y1 - 10),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)
        
        # Blend overlay with original image
        img = cv2.addWeighted(overlay, 0.6, img, 0.4, 0)
        
        img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        f = plt.figure()
        axarr = f.add_subplot(1,1,1)
        if display:
            axarr.imshow(img_rgb)
        axarr.axis('off')  # Hide axis
        return f

    """Exporting annotated before/after images and csv file to export_results folder"""
    def export_results(self, before_fig: plt.figure, after_fig: plt.figure, added: list[HouseObject], removed: list[HouseObject], moved: list[HouseObject]):
        FORMATTED_DATETIME = datetime.now().strftime("%Y-%m-%d %Hh-%Mm-%Ss")

        # Path and making folder
        FOLDER_PATH = Path(f"{Path(__file__).parent}/exported_results/{FORMATTED_DATETIME}")
        FOLDER_PATH.mkdir(parents=True, exist_ok=True)

        before_fig.savefig(FOLDER_PATH / 'before.svg', format='svg', dpi=1200)
        after_fig.savefig(FOLDER_PATH / 'after.svg', format='svg', dpi=1200)

        # Writing to the CSV
        csv_path = FOLDER_PATH / "results.csv"

        with open(csv_path, 'w', newline='') as file:
            writer = csv.writer(file)
            # Headers of CSV
            fields = ["Added", "Removed", "Moved", "Score"]

            max_length = max(len(added), len(removed), len(moved))

            writer.writerow(fields)

            for i in range(max_length):
                added_obj = added[i] if i < len(added) else ""
                removed_obj = removed[i] if i < len(removed) else ""
                moved_obj = moved[i] if i < len(moved) else ""

                # Calculate scores for added, removed, and moved objects
                added_score = SCORE_WEIGHTS.get(added_obj, [0, 0, 0])[0] if added_obj else 0
                removed_score = SCORE_WEIGHTS.get(removed_obj, [0, 0, 0])[1] if removed_obj else 0
                moved_score = SCORE_WEIGHTS.get(moved_obj, [0, 0, 0])[2] if moved_obj else 0

                # Calculate total score for the row
                total_score = added_score + removed_score + moved_score

                # Write row
                writer.writerow([added_obj, removed_obj, moved_obj, total_score])

if __name__=="__main__":
    cd = CleanlinessDetector()
    # Process images
    before_img = Image.open("cleanliness_detection/samples/1/before.png")
    after_img = Image.open("cleanliness_detection/samples/1/after.png")

    [before_mask, after_mask] = cd.combine_image_mask(before_img, after_img, display=True)

    # added, removed, moved = cd.calculate_difference(before_img, after_img)
    # added = [obj.class_name for obj in added]
    # removed = [obj.class_name for obj in removed]
    # moved = [obj[0][0].class_name for obj in moved]

    # cleanliness_score = cd.calculate_cleanliness_score(added, removed, moved)

    # print("Objects added: " + ", ".join(added))
    # print("Objects removed: " + ", ".join(removed))
    # print("Objects moved: " + ", ".join(moved))

    # print(f"Cleanliness score for this iteration is: {cleanliness_score}")

    objects_before = cd.detect_objects(before_mask)
    before_img = cd.annotate_image(before_img, objects_before, True)
    objects_after = cd.detect_objects(after_mask)
    after_img = cd.annotate_image(after_img, objects_after, True)
    added,removed,moved=[],[],[]
    cd.export_results(before_img, after_img, added, removed, moved)
