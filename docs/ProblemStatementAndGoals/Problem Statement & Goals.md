

# Problem Statement and Goals

Team 19

Mohammed (Zayn) Abed  
Maged Armanios  
Jinal Kasturiarachchi  
Jane Klavir  
Harshil Patel

Table 1: Revision History

| Date | Developer(s) | Change |
| :---- | :---- | :---- |
| 2024-09-24 | Mohammed, Maged, Jinal, Jane, Harshil | Version 1.0 |

# 1 \- Problem Statement

## 1.1 \- Problem

A common experience that the vast majority of the human population encounters is a shared living arrangement, whether that be with family members or, prevalently in post-secondary studies, roommates. This scenario offers a number of challenges, including the maintenance of shared spaces such as a kitchen or living room. As the power dynamic between roommates are typically equal, it can often feel cumbersome to reach out to a roommate and complain about the mess that they leave behind in a common space. This friction can be avoided by setting a standard for the cleanliness that is expected of any and all members of the same residence. Our project aims to deliver a camera system, paired with an application, which assesses the cleanliness of a shared space (before an individual enters, and after they exit). Additionally, the application will include features that will benefit users who have roommates by addressing other issues that may rise from the living arrangement, such as splitting shared expenses, scheduling activities and chores, and encouraging communication between members.

## 1.2 \- Inputs and Outputs

Some of the high-level inputs of the problem include:

* Users  
* Camera system  
* Sensors

Additionally, some of the outputs are as follows:

* An application hosting various tools for people in shared living spaces such as:   
  * Assessment of cleanliness  
  * Calculated splitting of expenses  
* An algorithm / AI model to determine the difference in cleanliness / neatness of an indoor environment  
* User documentation  
* Developer documentation  
  * Software requirements specification  
  * Function descriptions  
  * Verification & Validation plan  
  * Project timeline

## 1.3 \- Stakeholders

The stakeholders of this project are members of any shared living situation, but it is primarily directed towards students who live in student housing/campus residence.

## 1.4 \- Environment

### 1.4.1 \- Hardware Environment

The hardware environment mainly consists of the camera and sensor system that will be installed in the shared space. The camera will be used to capture images of the area, while the sensor(s) will be used to detect when someone enters and/or exists.

### 1.4.2 \- Software Environment

The software environment is twofold. For the cleanliness detection system, an algorithm will need to be produced in order to assess the space. Besides that, there must also be a full-stack web and/or mobile application developed, for the assessment to be displayed, along with the other additional functionality that was previously mentioned (bill splitter, scheduler, group chat, etc.)

# 2 \- Goals

| Category | Specific Goal | Explanation |
| ----- | ----- | ----- |
| Quality of output | The kitchen monitor must have a grading system to assess cleanliness, and the outputted grades must be consistent and backed with evidence. | To ensure trust and mitigate conflict within the user base, the system must be fair and objective. |
| Ease of use | The camera must be easy for users to set-up and link to their smartphones. After initial set-up, it should operate autonomously. | If the device was to require constant user intervention post-setup, people would not be compelled to adapt the system. In addition, the device always operating autonomously eliminates the opportunity for users to not follow steps, whether it is out of forgetfulness or dishonesty. |
| Privacy/ security | The application must keep user data private and never share confidential information with advertisers or other parties. It should not extract information from user footage to use for training the general model, and should not save/store any footage. | It is a fundamental users’ right to be protected and their information not be exploited. |
| Robustness | The kitchen monitor must adapt for different lighting and atmospheric conditions that may be expected of a kitchen at any time of day. | It is critical the application is effective in all reasonable conditions and use cases. Otherwise, it would not be usable. |
| Technical feature | The application must implement a bill-splitter where users can input/approve each other’s purchases and keep track of amounts owed. | Helpful feature that helps the application achieve its mission as conveyed in the problem statement. |
| Technical feature | The application must implement a scheduler for roommates to ‘book’ spaces, create chore schedules, and check off items when complete. | Helpful feature that helps the application achieve its mission as conveyed in the problem statement. |

# 3 \- Stretch Goals

| Category | Specific Goal | Explanation |
| ----- | ----- | ----- |
| Quality of output | The cleanliness detector does object detection and includes item-level results (i.e. items a person uses/leaves behind in the kitchen) as part of its output. | The specificity of the output would make the scoring algorithm as objective as possible, and would lay-out the precise steps users can take to improve their cleanliness. |
| Active learning | The system allows users to select a cleanliness detection model that adapts to the specific living space and learns its features. It then uses its learnings to curate a specific instance of its general classification algorithm. This curated algorithm is used solely for that user group. | Beyond the generic algorithm, having this mechanism would make results more individualized and better-suited for specific environments.   |
| Communication | The application implements a group chat feature for the participants of the shared living space. | In conjunction with all the other features of this app, an in-app group chat would completely eliminate the need for users to rely on multiple apps to manage their communication and usage regarding the shared living space. In addition, it would ensure the group chat experience is seamless for all users despite varying devices and operating systems. |

# 4 \- Challenge Level and Extras

Challenge level: General  
Extras:

* User documentation  
* Additional features  
  * An application suite providing tools to assist those in shared living situations such as a bill splitting calculator, a chore scheduling tool, and a messaging platform. 

# 

# Appendix \- Reflection

1. **What went well while writing this deliverable?**

Generally speaking, the writing of this deliverable went pretty smoothly. I will speak about this more in the following question, but after getting over the hurdles of defining our project and what we wanted it to be (after much back and forth), it was straightforward to take a look at the different sections of the deliverable and what they were asking, and produce a document that we’re all proud of.

2. **What pain points did you experience during this deliverable, and how did you resolve them?**

A large majority of the pain points that we experienced during this deliverable were due to the uncertainties that we had coming into this phase of the project. Initially, we were debating between two options for our project, one from the list of potential projects, and the other being this one, our original idea. There was a lot of back and forth, and it took us quite a bit of time to meet with the potential supervisors as well. Eventually, we reached a settling point on this concept, while securing a supervisor for the project as well. This reassurance is what allowed us to focus on defining the scope of the problem, and cleared up the confusion about what content we wanted to deliver in this paper.

3. **How did you and your team adjust the scope of your goals to ensure they are suitable for a Capstone project (not overly ambitious but also of appropriate complexity for a senior design project)?**

Initially we had very large ambitions for the project that we wanted to deliver, however, we were able to adjust our expectations after having an initial discussion with our supervisor. Since he has much more domain knowledge than us, we were asked many questions that we were unsure about or still had to explore. This left us asking ourselves even more questions, which helped narrow down the scope of what we want to achieve in our project. To be specific, a main point that we hadn’t discussed at all was the issue of privacy, which seems quite obvious when discussing a camera system that’s installed in an area such as a kitchen, but we have since made many considerations regarding privacy and will continue doing so moving forward.  
