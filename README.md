# Room8
Date of project start: September 24, 2024

Developer Names:
- Mohammed Abed
- Maged Armanios
- Jinal Kasturiarachchi
- Jane Klavir
- Harshil Patel


## Motivation
Living with roommates can be difficult, especially when it comes to keeping shared spaces clean, managing expenses, and ensuring everyone does their part. These challenges often lead to misunderstandings, frustration, and even conflict due to lack of accountability among roommates. Even with a set schedule for chores and cleaning sometimes you could get overwhelmed with work or school and forget that it's your week to clean the washroom.

Right now roommates rely on methods that are scattered such as sticky notes on a wall that start peeling off after a week use of third party apps such as [Splitwise](https://www.splitwise.com/) and a calendar on the refrigerator which never got updated after September. The problem with these tools is that they do not communicate with each other and there is no centralized way to track all household responsibilities and activities efficiently. 

In fact, [The Centre for Innovation in Campus Mental Health](https://campusmentalhealth.ca/), a project aiming to support Ontario post-secondary campuses in their commitment to student mental health and wellbeing consisting, the problem with poor communication with roommates. They reported that 17% of students experience conflicts with roommates which led to increased stress levels as well as a significant decrease in academic performance [[Source Here](https://campusmentalhealth.ca/infosheets/how-to-get-along-with-your-roommate/)]. Stress from household conflicts can impact mental health and even academic performance. If tasks are neglected, shared spaces become messy, leading to frustration and even bigger disputes. Our goal is to eliminate these pain points with a more efficient solution.

## Repository Structure
The folders and files for this project are as follows:
.github - Includes issue templates for the project and GitHub actions workflows
.vscode - Includes IDE settings for VsCode
camera_software - Includes all relevant files & code for the camera system's motion capture software 
cleanliness - Includes all relevant files & code for the AI powered cleanliness detection system
docs - Project documentation
room8 - Includes all relevant files & code for the frontend application
screenshots - README file screenshots

## Application Architecture
![App Architecture Diagram](/screenshots/room8_app_architecture.png)
### Frontend 
The frontend is built entirely using Next.js and Typescript. Core libraries used in development are the Supabase package to communicate to the backend and Jest for unit testing. The application also communicates with [Twilio](https://www.twilio.com/en-us) to provide SMS notifications ot users.

### Backend & Database 
The backend database is hosted on [Supabase](https://supabase.com/) and is communicated with by the various components of the application using the respective programming language's Supabase package.

### AI Microservice (Cleanliness Detection AI)
The AI microservice is built using Meta's [Detectron 2](https://github.com/facebookresearch/detectron2) and wrapped in [Flask API](https://flask.palletsprojects.com/en/stable/) to create HTTP routes where the camera system can a before and after image for processing.

After processing the images, the AI service uploads the results directly to the database over an HTTP API call exposed by Supabase.

### Camera Software
The camera software was built using Python with the addition of numpy. It can be loaded into any piece of hardware that can run the executable and has a camera. It utilization HTTPS requests to upload the data to the AI service and comes preloaded with a cameraID which is attached to each call.

## Sample Screenshots
### Frontend Application
#### Dashboard
![Frontend Dashboard Page](/screenshots/dashboard.png)
#### Chore Scheduler 
![Chore Scheduler Home Page](/screenshots/chore_scheduler.png)
#### Bill Splitter
![Bill Splitter Home Page](/screenshots/bill_splitter.png)
![Create Bill Modal](/screenshots/bill_splitter_create.png)
#### Chatbot 
![Chatbot Activated page](/screenshots/chatbot_activated.png)
#### House Management
![House Management Page](/screenshots/house_management.png)
#### Profile
![Profile Page](/screenshots/user_profile.png)

### AI Cleanliness Detection
#### Before & After Image With Mask
This screenshot shows the before and after images uploaded to the detector alongside a mask showing where the most changes occurred.
!['before, after, and mask image](/screenshots/ai_bfr_aftr_mask.png)
#### Before and after with all objects detected
The AI detection system then tries to detect all objects in the each image
!['before image with all objects detected](/screenshots/ai_bfr_everything.png)
!['After image with all objects detected](/screenshots/ai_aftr_everything.png)
#### Final results
Then system will then use the mask to filter out objects based on whether or not they are in the mask
!['AI final image](/screenshots/ai_changes.png)



### Camera System
#### No Motion Detected
!['Camera W/O Detected Motion](/screenshots/camera_no_motion.png)
#### Motion Detected
!['Camera W Detected Motion](/screenshots/camera_motion.png)