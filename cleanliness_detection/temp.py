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
    before_img = Image.open("cleanliness_detection/samples/1/before.png")           # Open before image
    transform = T.Compose([T.ToTensor()])                                           # Function to convert to tensor
    before_tensor = transform(before_img).unsqueeze(0)                              # Figure out what unsqueeze(0) does
    before_tensor = before_tensor[:, :3, :, :]
    with torch.no_grad():
        predictions = model(before_tensor)

    # Extract bounding boxes and labels
    boxes = predictions[0]['boxes']
    labels = predictions[0]['labels']
    scores = predictions[0]['scores']


    # Convert the image to a NumPy array for OpenCV visualization
    img_np = cv2.cvtColor(np.array(before_img), cv2.COLOR_RGB2BGR)
    for i, box in enumerate(boxes):
        if scores[i] > 0.5:  # Adjust threshold as needed
            x1, y1, x2, y2 = box.int().tolist()
            cv2.rectangle(img_np, (x1, y1), (x2, y2), (0, 255, 0), 2)
            cv2.putText(img_np, f'Label: {labels[i].item()}', (x1, y1 - 10),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)

    # Display the image with bounding boxes
    plt.imshow(cv2.cvtColor(img_np, cv2.COLOR_BGR2RGB))
    plt.axis('off')
    plt.show()