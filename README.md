[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/_8yXOlwa)
# Exam #2: "Posti Aereo"
## Student: s295095 Brunetto Cristian 

# Client side

## React Client Application Routes

- Route `/`: Home Page
- Route `/:type`: in this page are displayed the informations about an airplane and there is the possibility to book seats or delete a reservation, the type is a parameter that identifies a plane
- Route `/login`: this is the page where the user can log in
- Route `/bookings`: this is a page accessible only to the logged in user, here an user can see his bookings and eventually delete them
- Route `*`: page not found, any route that doesn't match the previously mentioned 

# Server side

## API Server

### Authentication
- POST `/api/sessions`
  - log in the user
  - body: username and user password
  - saves the user in session and returns the info of the user does NOT return password or salt
- DELETE `/api/sessions/current`
  - log out the user
  - removes the user from the session
- GET `/api/sessions/current`
  - checks if the user is logged or not

### Database interaction
- GET `/api/flights/:type`
  - get info about a specific flight
  - response body: list of all the seats of that airplane
- GET `/api/flights/bookings`
  - get the info about the reservations of a user  
  - include credentials, only logged in users can perfome this operations
  - response body: list of all the seats of all airplanes where the user has booked a seat
- PUT `/api/flights/:type`
  - book seats
  - include credentials, only logged in users can perfome this operations
  - request body: a list with all the seatIDs desired
- DELETE `/api/flights/:type`
  - delete a booking, an authenticated user can delete his booking for a specific airplane
  - include credentials

## Database Tables

- Table `users` - contains: (id, email, name, hash, salt) it is used during the authentication process and to obtain informations about a user
- Table `flights` - contains: (id, type, row, seat, seat_status, user) every row correspond to a seat in a specific airplane, the primary key is the triple type, row and seat, the seat status indicate if a seat is booked or not, while user is the id of the user that booked that seat, row and seat togher are the seatID.
An airplane could be identifed with the type.

## Main React Components

- `Airplane` (in `./Components/Airplane.js`): principal component, this is used to book tickets for a logged user otherwise only info about the plane are showed. 
Here is possible to book seats in two different ways, selecting from their dispostion or just choose the number of seats desired. If a user has an active reservation for this airplane it is possible to delete it directly from here.
- `Bookings` (in `./Components/Bookings.js`): this component is accessible only for logged in users, it is a sort of profile page where a user can see his bookings and delete them.
- `Layout` (in `./Components/Layout.js`): here is where component position is managed 
- `LoginForm` (in `./Components/Authentication.js`): it allows a user to perfome login 

## Screenshots

![Screenshot](./client/img/screenshot1.png)
![Screenshot](./client/img/screenshot2.png)


## Users Credentials

- cristian.brunetto@polito.it, password
- mario.rossi@polito.it, password 
- john.doe@polito.it, password
- testuser@polito.it, password

