import cv2
import numpy as np
import matplotlib.pyplot as plt
import time 
import requests
import io

INACTIVITY_TIME_REQUIRED = 60*0.1  # 20 SECS minute
MIN_COUNTER_AREA = 500  # Define your minimum area threshold
CAMERA_ID = 'd49c90ae-7b59-47e3-b5e6-604f16026185'
ALGO_MICROSERVICE_URL = 'http://127.0.0.1:8000'

def upload_frames_to_server(beforeFrame, afterFrame):
    print("Uploading frames to server...")
    # Convert frames to JPEG format
    _, beforeFrame_encoded = cv2.imencode('.jpg', beforeFrame)
    _, afterFrame_encoded = cv2.imencode('.jpg', afterFrame)

    # Convert encoded frames wto bytes
    beforeFrame_bytes = beforeFrame_encoded.tobytes()
    afterFrame_bytes = afterFrame_encoded.tobytes()

    # Create file-like objects from bytes
    beforeFrame_file = io.BytesIO(beforeFrame_bytes)
    afterFrame_file = io.BytesIO(afterFrame_bytes)

    # Create a dictionary of files to send in the request
    files = {
        'before': ('before.jpg', beforeFrame_file, 'image/jpeg'),
        'after': ('after.jpg', afterFrame_file, 'image/jpeg')
    }

    # Send the POST request
    response = requests.post(f'{ALGO_MICROSERVICE_URL}/upload/{CAMERA_ID}', files=files)

    # Check the response status
    if response.status_code == 200:
        print("Frames uploaded successfully")
    else:
        print(f"Failed to upload frames. Status code: {response.text}")

def main():
    cap = cv2.VideoCapture(0)
    backSub = cv2.createBackgroundSubtractorMOG2()
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3))

    if not cap.isOpened():
        print("Error opening video file")
        return

    # Allow the camera to warm up
    time.sleep(2.0)

    detected_motion = False
    last_motion_time_detected = None
    ret, beforeFrame = cap.read() # Capture starting frame as first before frame
    triggered = False

    while cap.isOpened():
        # Capture frame-by-frame
        ret, frame = cap.read()
        if not ret:
            print("Failed to grab a frame")
            break

        # Apply background subtraction
        fg_mask = backSub.apply(frame)

        # Apply global threshold to remove shadows
        retval, mask_thresh = cv2.threshold(fg_mask, 180, 255, cv2.THRESH_BINARY)

        # Apply erosion to remove noise
        mask_eroded = cv2.morphologyEx(mask_thresh, cv2.MORPH_OPEN, kernel)
        
        # Find contours 
        contours, hierarchy = cv2.findContours(mask_eroded, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        large_contours = [cnt for cnt in contours if cv2.contourArea(cnt) > MIN_COUNTER_AREA]

        if (len(large_contours) > 0):
            cv2.putText(frame, "Motion Detected", (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)
            last_motion_time_detected = time.time()
            triggered = False
        else:        
            
            if (last_motion_time_detected is not None):
                time_since_last_motion = time.time() - last_motion_time_detected
                if time_since_last_motion > INACTIVITY_TIME_REQUIRED and not triggered:
                    try:
                        upload_frames_to_server(beforeFrame, frame)
                    except Exception as e:
                        print(f"Failed to upload frames: {e}")
                    # Update beforeFrame to the current frame
                    beforeFrame = frame
                    # Set triggered to True to prevent multiple uploads
                    triggered = True
                cv2.putText(frame, f"Time since last motion: {time_since_last_motion:.2f} seconds", (10, 60), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
            
            cv2.putText(frame, "No Motion Detected", (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
                
	
        # Draw contours on the frame & Display the resulting frame
        frame_ct = cv2.drawContours(frame.copy(), large_contours, -1, (0, 255, 0), 2)
        cv2.imshow('Frame_final', frame_ct)
        
        # Wait 1 ms and check if 'q' was pressed to exit
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    # Release the capture and destroy all windows
    cap.release()
    cv2.destroyAllWindows()

if __name__ == '__main__':
    main()




# import cv2
# import numpy as np
# import time 

# INACTIVITY_TIME_REQUIRED = 60*1 # 1 minute

# def upload_frames_to_server(beforeFrame, afterFrame):
#     print("Uploading frames to server...")

# def main():
#     cap = cv2.VideoCapture(0)
#     if not cap.isOpened():
#         print("Error: Could not open video stream.")
#         return
    
    # # Allow the camera to warm up
    # time.sleep(2.0)

#     last_mean = 0
#     detected_motion = False
#     last_motion_time_detected = time.time()
#     ret, beforeFrame = cap.read()
#     triggered = False

#     while(cap.isOpened()):
#         ret, frame = cap.read()
#         gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
#         result = np.abs(np.mean(gray) - last_mean)
#         last_mean= np.mean(gray)
#         if result > 0.1:
        #     print("Motion detected!")
        #     detected_motion = True
        #     triggered = False
        # else:
        #     detected_motion = False
        
        # if detected_motion:
        #     cv2.putText(frame, "Motion Detected", (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)
        #     last_motion_time_detected = time.time()
        # else:
        #     time_since_last_motion = time.time() - last_motion_time_detected
        #     cv2.putText(frame, "No Motion Detected", (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
        #     cv2.putText(frame, f"Time since last motion: {time_since_last_motion:.2f} seconds", (10, 60), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
        #     if time_since_last_motion > INACTIVITY_TIME_REQUIRED and not triggered:
        #         upload_frames_to_server(beforeFrame, frame)
        #         triggered = True
                
#         if (cv2.waitKey(1) & 0xFF == ord('q')):
#             break
        
#         cv2.imshow('frame', frame)


#     cap.release()
#     cv2.destroyAllWindows()

# if __name__ == '__main__':
#     main()