const URL1 = 'http://localhost:3001/api/flights';
const URL2 = 'http://localhost:3001/api/sessions';


async function getPlaneInfo(type){
  const response = await fetch(URL1+type, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const plane = await response.json();
  if (response.ok) {
    let vect = plane.map((p) => {
        return { destination: p.destination, date: p.date, type: p.type, row: p.row, seat: p.seat, seat_status: p.seat_status, user: p.user };
    });
    return vect;
  } else {
    throw plane; 
  }  
}

async function getBookings(){
  const response = await fetch(URL1+'/bookings', {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const plane = await response.json();
  if (response.ok) {
    let vect = plane.map((p) => {
        return { destination: p.destination, date: p.date, type: p.type, row: p.row, seat: p.seat, seat_status: p.seat_status, user: p.user };
    });
    //console.log(vect);
    return vect;
  } else {
    throw plane; 
  }
}

async function bookSeats(type, seats) {
  const objectToPass = { seats: seats };
  //console.log(JSON.stringify(objectToPass));
  try {
    const response = await fetch(URL1 + '/' + type, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(objectToPass)
    });

    // Check if the response was successful
    if (response.ok) {
      //console.log("RESPONSE OK");
      return;
    } else {
      //console.log("RESPONSE NOT OK");
      const errorData = await response.json();
      const { error, seatId } = errorData;
      throw new Error(`${error} Seat ID: ${seatId}`);
    }
  } catch (error) {
    //console.log('Error booking seats:', error.message);
    throw error;
  }
}

async function deleteReservation(type){
  //console.log('TYPE: ' + type);
  try{
    const response = await fetch(URL1 + '/' + type, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Check if the response was successful
    if (response.ok) {
      //console.log("RESPONSE OK");
      return;
    } else {
      //console.log("RESPONSE NOT OK");
      throw new Error('Error Deleting Reservation: ' + response.status);
    }
  }catch(error){
    //console.log('Error Deleting Reservation:', error.message);
    throw new Error('Error Deleting Reservation: ' + response.status);
  }
}

/*
* Login Part
*/

async function logIn(credentials) {
  //console.log('API: ' + URL2);
  let response = await fetch(URL2, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });
  if (response.ok) {
    //console.log('RISPOSTA OK')
    const user = await response.json();
    return user;
  } else {
    const errDetail = await response.json();
    throw errDetail.message;
  }
}

async function logOut() {
  await fetch(URL2+'/current', {
    method: 'DELETE', 
    credentials: 'include' 
  });
}

async function getUserInfo() {
  const response = await fetch(URL2+'/current', {
    credentials: 'include'
  });
  const userInfo = await response.json();
  if (response.ok) {
    return userInfo;
  } else {
    throw userInfo;  // an object with the error coming from the server
  }
}

const API = { logIn, logOut, getUserInfo, getPlaneInfo, getBookings, bookSeats, deleteReservation }
export default API;
