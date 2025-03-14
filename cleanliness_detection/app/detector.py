import math
import torch
from PIL import Image
import numpy as np
import cv2
import matplotlib.pyplot as plt
from typing import Tuple
from pathlib import Path
from datetime import datetime
import csv
from detectron2.engine import DefaultPredictor
from detectron2.config import get_cfg
from detectron2 import model_zoo
from detectron2.data import MetadataCatalog

BLACKLIST = ['sink', 'oven', 'fridge', 'refrigerator', 'microwave', 'toaster', 'stove', 'table', 'dishwasher']

CONF_THRESH = 0.5                                                                           # Increased confidence threshold
DIST_THRESH = 30                                                                            # Increased distance threshold
IOU_THRESH = 0.6                                                                            # Decreased IOU threshold for better matching
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

"""Class representing a detection"""
class HouseObject:
    def __init__(self, label: int, bbox: list, score: float, mask: np.array = None) -> None:
        self.label = label
        self.x1, self.y1, self.x2, self.y2 = [int(b) for b in bbox]
        self.mask = mask
        self.score = score  # Added confidence score

    """x1, y1, x2, y2"""
    @property
    def bbox(self) -> list[int]:
        return [self.x1, self.y1, self.x2, self.y2]
    
    """Centroid coordinates"""
    @property
    def centroid(self) -> list[int]:
        return [int(self.x1 + (self.x2 - self.x1)/2), int(self.y1 + (self.y2 - self.y1)/2)]  # Fixed centroid calculation
    
    """COCO Class number key"""
    @property
    def class_num(self) -> int:  # Changed return type to int
        return self.label

    """COCO Class label/ name"""
    @property
    def class_name(self) -> str:
        return COCO_LABELS[self.label]
    
    """Mask of object silhouette"""
    @property
    def object_mask(self) -> np.array:
        return self.mask
    
    """Distance between 2 house objects"""
    def distance(self, other: 'HouseObject') -> float:
        x1, y1 = self.centroid
        x2, y2 = other.centroid
        return math.sqrt((x2-x1)**2 + (y2-y1)**2)

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
    
    def __str__(self) -> str:
        return f"{self.class_name} (conf: {self.score:.2f})"

"""Class for object detection and cleanliness assessment algorithms"""
class CleanlinessDetector:
    def __init__(self) -> None:
        # Init Mask R-CNN (i.e. instance segmentation) detector
        self.cfg = get_cfg()
        self.cfg.merge_from_file(model_zoo.get_config_file("COCO-InstanceSegmentation/mask_rcnn_R_50_FPN_3x.yaml"))
        self.cfg.MODEL.WEIGHTS = model_zoo.get_checkpoint_url("COCO-InstanceSegmentation/mask_rcnn_R_50_FPN_3x.yaml")
        self.cfg.MODEL.ROI_HEADS.SCORE_THRESH_TEST = CONF_THRESH
        self.cfg.MODEL.DEVICE = "cuda" if torch.cuda.is_available() else "cpu"

        # Create predictor
        self.model = DefaultPredictor(self.cfg)                                                  
    
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
    
    """Enhanced method to combine image with mask"""
    def combine_image_mask(self, before_img: Image, after_img: Image, display: bool = False):
        # Convert PIL images to NumPy arrays for processing
        before_np = np.array(before_img.convert("RGB"))
        after_np = np.array(after_img.convert("RGB"))
        
        # Convert RGB to BGR for OpenCV processing
        before_cv = cv2.cvtColor(before_np, cv2.COLOR_RGB2BGR)
        after_cv = cv2.cvtColor(after_np, cv2.COLOR_RGB2BGR)
        
        # Generate difference mask with larger minimum area
        mask = self.frame_diff(before_cv, after_cv, min_area=300, display=display)
        
        # Apply a more aggressive dilation to ensure we capture full objects
        kernel = np.ones((7, 7), np.uint8)
        mask = cv2.dilate(mask, kernel, iterations=3)
        
        # Convert mask to PIL for visualization if needed
        mask_pil = Image.fromarray(mask).convert('RGB')
        
        # Don't filter the original images too aggressively
        # Instead of bitwise_and, use the mask to enhance differences
        # Create slightly modified versions that highlight differences
        highlighted_before = before_cv.copy()
        highlighted_after = after_cv.copy()
        
        # Add a semi-transparent overlay to areas outside the mask
        for c in range(3):
            highlighted_before[:, :, c] = np.where(
                mask[:, :, c] == 0,
                highlighted_before[:, :, c] * 0.7,  # Dim areas outside mask
                highlighted_before[:, :, c]
            )
            highlighted_after[:, :, c] = np.where(
                mask[:, :, c] == 0,
                highlighted_after[:, :, c] * 0.7,  # Dim areas outside mask
                highlighted_after[:, :, c]
            )
        
        # Convert back to RGB for PIL
        highlighted_before = cv2.cvtColor(highlighted_before, cv2.COLOR_BGR2RGB)
        highlighted_after = cv2.cvtColor(highlighted_after, cv2.COLOR_BGR2RGB)
        
        # Convert to PIL images
        before_result = Image.fromarray(highlighted_before)
        after_result = Image.fromarray(highlighted_after)
        
        # Display if required
        if display:
            fig, axs = plt.subplots(1, 3, figsize=(15, 5))
            axs[0].imshow(before_result)
            axs[0].set_title('Before (Highlighted)')
            axs[0].axis('off')
            
            axs[1].imshow(after_result)
            axs[1].set_title('After (Highlighted)')
            axs[1].axis('off')
            
            axs[2].imshow(mask_pil)
            axs[2].set_title('Mask')
            axs[2].axis('off')
            
            plt.tight_layout()
            plt.show()
        
        # Return both the highlighted and original images
        return [before_img, after_img, before_result, after_result]
    
    """Given an image, return list of objects detected with improved filtering"""
    def detect_objects(self, img: Image, display: bool = False) -> list[HouseObject]:
        # Init return list
        house_objects = []

        # Load image
        img_rgb = np.array(img.convert("RGB"))

        # Run detection
        outputs = self.model(img_rgb)

        # Extract instances
        instances = outputs["instances"]
        boxes = instances.pred_boxes.tensor.cpu().numpy()  # Bounding boxes
        masks = instances.pred_masks.cpu().numpy() if instances.has("pred_masks") else None
        classes = instances.pred_classes.cpu().numpy()  # Class indices
        scores = instances.scores.cpu().numpy()  # Confidence scores

        # Append detections to return, including scores
        for i, (box, class_id, score) in enumerate(zip(boxes, classes, scores)):
            x1, y1, x2, y2 = map(int, box)
            mask = masks[i] if masks is not None else None
            
            # Filter small detections
            width, height = x2 - x1, y2 - y1
            if width < 10 or height < 10:
                continue
                
            house_objects.append(HouseObject(
                label=class_id, 
                bbox=[x1, y1, x2, y2], 
                score=score,
                mask=mask
            ))

        if display:
            self.annotate_image(img, house_objects, display=True)

        return [house_objects[i] for i in range(len(house_objects)) if house_objects[i].class_name.lower() not in BLACKLIST]
    
    """Completely rewritten difference calculation algorithm with better matching"""
    def calculate_difference(self, before_img: Image, after_img: Image) -> Tuple[list[HouseObject], list[HouseObject], list[list[HouseObject]]]:
        # Get objects from before and after images
        objects_before = self.detect_objects(before_img)
        objects_after = self.detect_objects(after_img)
        
        # Lists to store results
        added = []
        removed = []
        moved = []
        
        # If either list is empty, handle special case
        if len(objects_before) == 0:
            return objects_after, [], []  # All objects are added
        if len(objects_after) == 0:
            return [], objects_before, []  # All objects are removed
        
        # Create a matrix to keep track of matching
        matched_before = [False] * len(objects_before)
        matched_after = [False] * len(objects_after)
        
        # First pass: Match objects of the same class with high IoU (same object, didn't move)
        for i, obj_before in enumerate(objects_before):
            for j, obj_after in enumerate(objects_after):
                # Skip already matched objects
                if matched_before[i] or matched_after[j]:
                    continue
                
                # Check if same class
                if obj_before.class_num == obj_after.class_num:
                    # Check distance and IoU
                    dist = obj_before.distance(obj_after)
                    iou = obj_before.iou(obj_after)
                    
                    if dist < DIST_THRESH or iou > IOU_THRESH:
                        # Mark both as matched
                        matched_before[i] = True
                        matched_after[j] = True
                        break
        
        # Second pass: Match objects of the same class with lower IoU (same object, moved)
        for i, obj_before in enumerate(objects_before):
            if matched_before[i]:
                continue  # Skip already matched
                
            before_list = [obj_before]
            after_list = []
            
            for j, obj_after in enumerate(objects_after):
                if matched_after[j]:
                    continue  # Skip already matched
                
                # Check if same class
                if obj_before.class_num == obj_after.class_num:
                    # Mark both as matched
                    matched_before[i] = True
                    matched_after[j] = True
                    after_list.append(obj_after)
            
            if after_list:  # If we found at least one match
                moved.append([before_list, after_list])
        
        # Collect unmatched objects
        for i, obj_before in enumerate(objects_before):
            if not matched_before[i]:
                removed.append(obj_before)
                
        for j, obj_after in enumerate(objects_after):
            if not matched_after[j]:
                added.append(obj_after)
        
        return added, removed, moved

    """Draw boxes and show classes for objects detected in image"""
    def annotate_image(self, img: Image, objects: list[HouseObject], display=False) -> plt.figure:
        # Convert PIL.Image to NumPy array (RGB)
        img_np = np.array(img.convert("RGB"))
        
        # Copy image for overlay
        overlay = img_np.copy()

        for obj in objects:
            x1, y1, x2, y2 = obj.bbox
            # Use confidence score to determine color brightness
            color_intensity = int(min(255, obj.score * 255))
            color = (0, color_intensity, 0)  # Brighter green for higher confidence

            # Draw bounding box on overlay
            cv2.rectangle(overlay, (x1, y1), (x2, y2), color, 2)
            
            # Add label with confidence score
            label = f"{obj.class_name} ({obj.score:.2f})"
            cv2.putText(overlay, label, (x1, y1 - 10),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 2)

            # Draw instance mask if available
            if obj.mask is not None:
                mask = obj.mask.astype(np.uint8) * 255  # Convert mask to 0-255 range
                color_mask = np.random.randint(0, 255, (3,), dtype=int).tolist()  # Random color
                
                # Create a colored mask overlay
                mask_overlay = np.zeros_like(overlay)
                for c in range(3):
                    mask_overlay[:, :, c] = np.where(mask > 0, color_mask[c], 0)
                
                # Blend the mask with the image
                alpha = 0.3  # Transparency factor
                mask_indices = mask > 0
                for c in range(3):
                    overlay[:, :, c] = np.where(
                        mask_indices, 
                        overlay[:, :, c] * (1 - alpha) + mask_overlay[:, :, c] * alpha,
                        overlay[:, :, c]
                    )

        # Blend overlay with original image
        annotated_img = cv2.addWeighted(overlay, 0.7, img_np, 0.3, 0)

        # Display using Matplotlib
        f = plt.figure(figsize=(12, 8))
        axarr = f.add_subplot(1, 1, 1)
        axarr.imshow(annotated_img)  # Matplotlib expects RGB
        axarr.axis('off')  # Hide axis
        
        # Add object count
        axarr.set_title(f"Detected {len(objects)} objects", fontsize=14)

        # Display using OpenCV
        if display:
            cv2.imshow("Annotated Image", cv2.cvtColor(annotated_img, cv2.COLOR_RGB2BGR))
            cv2.waitKey(0)
            cv2.destroyAllWindows()

        return f

    """Improved annotation of changes with better visualization"""
    def annotate_changes(self, img: Image, added: list[HouseObject], moved: list, removed: list[HouseObject]=None, display=False) -> plt.figure:
        # Convert PIL.Image to a NumPy array (RGB)
        img_np = np.array(img.convert("RGB"))

        # Make a copy for overlay
        overlay = img_np.copy()
        
        # Create a legend for the colors
        legend = {
            "Moved": (0, 255, 0),    # Green
            "Added": (0, 0, 255),    # Blue
            "Removed": (255, 0, 0)   # Red (not visible but for completeness)
        }

        # Draw added objects in green
        for obj in added:
            x1, y1, x2, y2 = obj.bbox
            color = legend["Added"]
            cv2.rectangle(overlay, (x1, y1), (x2, y2), color, 2)
            label = f"{obj.class_name}"
            cv2.putText(overlay, label, (x1, y1 - 10),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 2)

        # Draw moved objects in blue
        for move_pair in moved:
            if len(move_pair) != 2:
                continue
                
            before_objs, after_objs = move_pair
            
            for obj in after_objs:
                x1, y1, x2, y2 = obj.bbox
                color = legend["Moved"]
                cv2.rectangle(overlay, (x1, y1), (x2, y2), color, 2)
                label = f"{obj.class_name}"
                cv2.putText(overlay, label, (x1, y1 - 10),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 2)

        # Blend overlay with original image
        annotated_img = cv2.addWeighted(overlay, 0.7, img_np, 0.3, 0)

        # Create a figure
        f = plt.figure(figsize=(12, 8))
        axarr = f.add_subplot(1, 1, 1)
        axarr.imshow(annotated_img)
        axarr.axis('off')
        
        # Add a title with counts
        title = f"Changes: {len(added)} Added, {len(moved)} Moved"
        if removed:
            title += f", {len(removed)} Removed"
        axarr.set_title(title, fontsize=14)
        
        # Add a legend
        legend_patches = []
        import matplotlib.patches as mpatches
        for label, color in legend.items():
            # Convert BGR to RGB for matplotlib
            rgb_color = (color[2]/255, color[1]/255, color[0]/255)
            patch = mpatches.Patch(color=rgb_color, label=label)
            legend_patches.append(patch)
        
        axarr.legend(handles=legend_patches, loc='lower right')

        # Display using OpenCV if requested
        if display:
            cv2.imshow("Changes", cv2.cvtColor(annotated_img, cv2.COLOR_RGB2BGR))
            cv2.waitKey(0)
            cv2.destroyAllWindows()

        return f

    """Exporting annotated before/after images and csv file to export_results folder"""
    def export_results(self, before_fig: plt.figure, after_fig: plt.figure, changes_fig: plt.figure, added: list[HouseObject], removed: list[HouseObject], moved: list[HouseObject]) -> None:
        FORMATTED_DATETIME = datetime.now().strftime("%Y-%m-%d %Hh-%Mm-%Ss")

        # Path and making folder
        FOLDER_PATH = Path(f"{Path(__file__).parent}/exported_results/{FORMATTED_DATETIME}")
        FOLDER_PATH.mkdir(parents=True, exist_ok=True)

        before_fig.savefig(FOLDER_PATH / 'before.svg', format='svg', dpi=1200)
        after_fig.savefig(FOLDER_PATH / 'after.svg', format='svg', dpi=1200)
        changes_fig.savefig(FOLDER_PATH / 'changes.svg', format='svg', dpi=1200)

        # # Writing to the CSV
        # csv_path = FOLDER_PATH / "results.csv"

        # with open(csv_path, 'w', newline='') as file:
        #     writer = csv.writer(file)
        #     # Headers of CSV
        #     fields = ["Added", "Removed", "Moved"]

        #     max_length = max(len(added), len(removed), len(moved))

        #     writer.writerow(fields)

        #     for i in range(max_length):
        #         added_obj = added[i] if i < len(added) else ""
        #         removed_obj = removed[i] if i < len(removed) else ""
        #         moved_obj = moved[i] if i < len(moved) else ""

        #         # # Calculate scores for added, removed, and moved objects
        #         # added_score = SCORE_WEIGHTS.get(added_obj, [0, 0, 0])[0] if added_obj else 0
        #         # removed_score = SCORE_WEIGHTS.get(removed_obj, [0, 0, 0])[1] if removed_obj else 0
        #         # moved_score = SCORE_WEIGHTS.get(moved_obj, [0, 0, 0])[2] if moved_obj else 0

        #         # # Calculate total score for the row
        #         # total_score = added_score + removed_score + moved_score

        #         # Write row
        #         writer.writerow([added_obj, removed_obj, moved_obj])
        tasklist = []
        for added_item in added:
            tasklist.append(f"{added_item} added")
        for moved_item in moved:
            tasklist.append(f"{moved_item[0][0]} moved")
        for removed_item in removed:
            tasklist.append(f"{removed_item} removed")
        return tasklist

def main(before, after):
    cd = CleanlinessDetector()
    # Process images
    before_img = Image.open(before)
    after_img = Image.open(after)

    # Get the original and highlighted versions
    before_orig, after_orig, before_highlighted, after_highlighted = cd.combine_image_mask(before_img, after_img, display=True)

    # Use the original images for detection, but the highlights help us visualize
    # Detect objects in the before and after images
    objects_before = cd.detect_objects(before_highlighted, True)
    objects_after = cd.detect_objects(after_highlighted, True)

    print(f"Detected {len(objects_before)} objects in before image")
    print(f"Detected {len(objects_after)} objects in after image")

    # Calculate the differences using the same original images
    added, removed, moved = cd.calculate_difference(before_orig, after_orig)

    print(f"Added: {len(added)}")
    print(f"Removed: {len(removed)}")
    print(f"Moved: {len(moved)}")

    # Annotate the before and after images
    before_fig = cd.annotate_image(before_orig, objects_before, True)
    after_fig = cd.annotate_image(after_orig, objects_after, True)

    # Annotate the changes in the after image
    changes_fig = cd.annotate_changes(after_orig, added, moved, removed, True)

    cd.export_results(before_fig, after_fig, changes_fig, added, removed, moved)

if __name__ == "__main__":
    main("cleanliness_detection/samples/5/before.jpeg", "cleanliness_detection/samples/5/after.jpeg")