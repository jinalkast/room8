import torch
import torchvision
from PIL import Image
import torchvision.transforms as T
import numpy as np
import cv2
import matplotlib.pyplot as plt

class CleanlinessDetector:
    def __init__(self):
        pass

    def forward(self):
        pass

if __name__=="__main__":
    model = torchvision.models.detection.fasterrcnn_resnet50_fpn(pretrained=True)   # Load Faster R-CNN model
    model.eval()                                                                    # Set to evaluation mode
    transform = T.Compose([T.ToTensor()])                                           # Function to convert to tensor

    # Process the "before" image
    before_img = Image.open("cleanliness_detection/samples/2/before.png")
    before_tensor = transform(before_img).unsqueeze(0)                              # Adds batch dimension
    before_tensor = before_tensor[:, :3, :, :]                                      # Ensures RGB channels only

    with torch.no_grad():
        predictions_before = model(before_tensor)

    # Extract bounding boxes, labels, and scores for the "before" image
    boxes_before = predictions_before[0]['boxes']
    labels_before = predictions_before[0]['labels']
    scores_before = predictions_before[0]['scores']

    label_numbers_before = [labels_before[i].item() for i in range(len(scores_before)) if scores_before[i] > 0.5]
    print("Detected label numbers in 'before' image:", label_numbers_before)

    # Convert the "before" image to a NumPy array for OpenCV visualization
    img_np_before = cv2.cvtColor(np.array(before_img), cv2.COLOR_RGB2BGR)
    for i, box in enumerate(boxes_before):
        if scores_before[i] > 0.5:
            x1, y1, x2, y2 = box.int().tolist()
            cv2.rectangle(img_np_before, (x1, y1), (x2, y2), (0, 255, 0), 2)
            cv2.putText(img_np_before, f'Label: {labels_before[i].item()}', (x1, y1 - 10),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)

    # Process the "after" image
    after_img = Image.open("cleanliness_detection/samples/2/after.png")
    after_tensor = transform(after_img).unsqueeze(0)
    after_tensor = after_tensor[:, :3, :, :]

    with torch.no_grad():
        predictions_after = model(after_tensor)

    # Extract bounding boxes, labels, and scores for the "after" image
    boxes_after = predictions_after[0]['boxes']
    labels_after = predictions_after[0]['labels']
    scores_after = predictions_after[0]['scores']

    label_numbers_after = [labels_after[i].item() for i in range(len(scores_after)) if scores_after[i] > 0.5]
    print("Detected label numbers in 'after' image:", label_numbers_after)

    print(f"Here are the objects that have been added to the space: {[val for val in label_numbers_after if val not in label_numbers_before]}")

    # Convert the "after" image to a NumPy array for OpenCV visualization
    img_np_after = cv2.cvtColor(np.array(after_img), cv2.COLOR_RGB2BGR)
    for i, box in enumerate(boxes_after):
        if scores_after[i] > 0.5:
            x1, y1, x2, y2 = box.int().tolist()
            cv2.rectangle(img_np_after, (x1, y1), (x2, y2), (255, 0, 0), 2)  # Using a different color for clarity
            cv2.putText(img_np_after, f'Label: {labels_after[i].item()}', (x1, y1 - 10),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 0, 0), 2)

    # Display the "after" image
    plt.imshow(cv2.cvtColor(img_np_after, cv2.COLOR_BGR2RGB))
    plt.axis('off')
    plt.title("After Image")
    plt.show()