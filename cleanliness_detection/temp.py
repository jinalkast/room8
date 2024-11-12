import torch
import torchvision
from PIL import Image
import torchvision.transforms as T
import numpy as np
import cv2
import matplotlib.pyplot as plt
from typing import Tuple

CONF_THRESH = 0.5                                                                           # Minimum confidence for object detector
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

class CleanlinessDetector:
    def __init__(self):
        self.model = torchvision.models.detection.fasterrcnn_resnet50_fpn(pretrained=True)   # Load Faster R-CNN model
        self.model.eval()                                                                    # Set to evaluation mode
        self.transform = T.Compose([T.ToTensor()])                                           # Function to convert to tensor

    def process_image(self, img: Image) -> torch.Tensor:
        tsr = self.transform(img).unsqueeze(0)
        tsr = tsr[:, :3, :, :]
        return tsr
    
    def predict(self, img: Image, display=False) -> Tuple[list, list]:
        tsr = self.process_image(img)
        with torch.no_grad():
            predictions = self.model(tsr)
        all_boxes = predictions[0]['boxes']
        all_labels = predictions[0]['labels']
        all_scores = predictions[0]['scores']
        labels, boxes = [], []
        for i, box in enumerate(all_boxes):
            if all_scores[i].item() > CONF_THRESH:
                labels.append(all_labels[i].item())
                boxes.append(box.tolist())
        if(display):
            self.display_image(img, labels, boxes)
        return labels, boxes
    
    def display_image(self, img: Image, labels, boxes):
        img= cv2.cvtColor(np.array(img), cv2.COLOR_RGB2BGR)
        for i, box in enumerate(boxes):
            x1, y1, x2, y2 = [int(b) for b in box]
            cv2.rectangle(img, (x1, y1), (x2, y2), (0, 255, 0), 2)
            cv2.putText(img, COCO_LABELS[labels[i]], (x1, y1 - 10),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)
        plt.imshow(cv2.cvtColor(img, cv2.COLOR_BGR2RGB))
        plt.axis('off')
        plt.show()

if __name__=="__main__":
    cd = CleanlinessDetector()
    # Process images
    before_img = Image.open("cleanliness_detection/samples/1/before.png")
    after_img = Image.open("cleanliness_detection/samples/1/after.png")

    # Extract bounding boxes, labels, and scores for the "before" image
    labels_before, boxes_before = cd.predict(before_img, display=True)
    labels_after, boxes_after = cd.predict(after_img, display=True)  

    new_objects = [COCO_LABELS[i] for i in labels_after if i not in labels_before]
    print("Objects added: " + ", ".join(new_objects))
