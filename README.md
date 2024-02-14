# Fitness Buddy Admin Dashboard

A fullstack MERN application designed to help you keep track of your clients and your personal schedule.

**You can check it out here:** [Fitness Buddy](https://fitness-buddy-hwm.cyclic.app/)

## Built with:
**Vite, React, Express, Node, MongoDB, Flowbite, Tailwind and Cloudinary**

## Why I built this application

As a fitness professional in a previous life, I was often frustrated with the applications used to keep track of appointments and clients. The applications I used were often quite large and utilized by larger companies to keep track of hundreds
of clients, classes, providers etc. I wanted to create a simpler, faster application with a better UI that showed just the essentials in a less verbose and complicated manner. Though this app doesn't have as much functionality as it could, I plan 
to build on it in the future, while keeping the UI clean and easy to use.

## Features:

**Login and Registration**
- create an account and log in
- full form validation to check if all fields are valid and if there are any issues with the user (user already exists or password discrepancy)
  
<img width="1438" alt="Screenshot 2024-02-14 at 11 49 42 AM" src="https://github.com/hun-ah/fitness-buddy-monorepo/assets/103898493/5b57c948-5b62-472a-a10c-55807e9ef240">
<img width="1438" alt="Screenshot 2024-02-14 at 11 50 59 AM" src="https://github.com/hun-ah/fitness-buddy-monorepo/assets/103898493/182d5af8-28f7-4298-9870-d5d92b57e6a7">


**Dashboard Home**
- overview of important client and user data such as active clients, upcoming appointments that day and sessions completed for the month
- quick view of today's appointments including the time, duration, client name and image, all shown within a card component
- easily check in, cancel or delete an appointment from the dashboard page and have the changes be instantly reflected anywhere else in the application that data is utilized

<img width="1427" alt="Screenshot 2024-02-14 at 11 39 10 AM" src="https://github.com/hun-ah/fitness-buddy-monorepo/assets/103898493/7413ab93-5888-4fc8-9512-9092b62cf467">

**Client Page**
- view all clients, both active and inactive
- ability to see name, membership type, status, sessions left and personal info
- search for a client via the search bar
- add a new client

<img width="1426" alt="Screenshot 2024-02-14 at 11 39 29 AM" src="https://github.com/hun-ah/fitness-buddy-monorepo/assets/103898493/280f4ce6-df9c-4235-b46e-496cc65105cb">

**Client and User Profile**
- edit information via text, select and toggle inputs
- add or edit a client image, utilizing Multer and Cloudinary
- delete account or client with an instant redirect to the corresponding route after deletion
  
<img width="1437" alt="Screenshot 2024-02-14 at 11 46 34 AM" src="https://github.com/hun-ah/fitness-buddy-monorepo/assets/103898493/fa94e94b-678c-41eb-b6ae-6cd979dde3fa">
<img width="1438" alt="Screenshot 2024-02-14 at 11 47 37 AM" src="https://github.com/hun-ah/fitness-buddy-monorepo/assets/103898493/22c53f7d-4f6f-40ee-83ca-9e21bbb4173a">

**Appointments**
- view your calendar and toggle between months and days
- easily see which days you have appointments on and navigate specific dates to add, check in, cancel or delete an appointment
- add a new appointment by typing or selecting a client's name and selecting a start/end time
- validate a client has enough sessions or that a correct time has been selected before booking
  
<img width="1437" alt="Screenshot 2024-02-14 at 11 41 32 AM" src="https://github.com/hun-ah/fitness-buddy-monorepo/assets/103898493/cd86e0f3-a445-4fc0-a973-902ba9cca904">

## Optimizations:

**Flowbite**

I've utilized Flowbite components for a lot of the main styling of this application to streamline the UI and save myself creating a ton of custom styles. I did customize certain components, such as padding, theme colours and hover states with custom CSS

**Responsive Design**

Though this is meant to be predominantly a desktop application, I wanted users to be able to access the application from a mobile device if they needed to manage an appointment, view upcoming appointments or make changes to a client's account.
This application works seamlessly on mobile, including a slide-out menu and adjusted styles for smaller devices.

**Context API and Local Storage**

From the beginning, it was apparent that I would need some kind of state management to keep track of the user and client data. I have integrated React's context API to keep track of all client data; such as a list of all clients and each client's
data. The user context contains all data about the current user, including whether they are authenticated or not. I have also created a context to store appointments and for a global loading state. The appointment, client and user context will
set the data into local storage during the user's session and will be removed upon sign-out or session expiration. This way, only certain information will be stored when needed on the user's local machine and limits unnecessary calls to the backend.

**Helper Functions**

As some of my files became bloated, I moved certain functions and variables into separate files and imported them into the components where they needed to be used, such as regex variables, image and string formatting functions and form validation
functions. I also created a separate file that houses all of the related functions to the Calendar component, for working with dates and times.

**Input component**

I initially repeated myself quite a lot with the Flowbite input components, instead of mapping over them and rendering out a single input component. I have started to refactor my code to transition into mapping through all inputs and creating a
props.js file to hold all the input information. I have had some roadblocks with this due to the way I have some of my forms styled and the different kinds of inputs from Flowbite (Text, Select, Toggle etc.) and am still trying to figure out the 
best solution.

**Loading state**

After completing the application, I wanted to improve the user experience by creating loading states for any data waiting to come back from the fetch requests. I created custom loading cards by copying the styling of the corresponding Flowbite 
components. These loading states can be seen on the main dashboard page and the appointments page when clicking on a date with an appointment that hasn't been fetched yet.

**Cookies and Monorepo**

After getting my project hosted (initially front-end on Vercel and back-end on Render) I was having issues with certain browsers cookie settings as well as correctly loading routes. I moved my project into a monorepo and hosted it on Cyclic, to
prevent any cross-origin issues and allow for routing to occur through the back-end, by serving up the final built JS file.

## Lessons Learned:
- Tailwind and Flowbite integration
- image uploading with Multer and Cloudinary
- practice utilizing React's Context API with local storage
- better understanding of CORS and how to work with cookies

## Future Enhancements:

- [ ] payment integration and profit analytics
- [ ] client portal
- [ ] in-app communication between client and provider
- [ ] client-program section, where a client/provider can view past and future workouts planned
