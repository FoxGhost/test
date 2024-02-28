'use strict';

const express = require('express');
const morgan = require('morgan'); // logging middleware
const {check, validationResult} = require('express-validator'); // validation middleware
const passport = require('passport'); // auth middleware
const LocalStrategy = require('passport-local').Strategy; // username and password for login
const session = require('express-session'); // enable sessions
//const dayjs = require('dayjs');
const userDao = require('./user-dao'); // module for accessing the user info in the DB
const cors = require('cors');

/*** Set up Passport ***/
// set up the "username and password" login strategy
// by setting a function to verify username and password
passport.use(new LocalStrategy(
  function(username, password, done) {
    userDao.getUser(username, password).then((user) => {
      if (!user)
        return done(null, false, { message: 'Incorrect username and/or password.' });
        
      return done(null, user);
    })
  }
));

// serialize and de-serialize the user (user object <-> session)
// we serialize the user id and we store it in the session: the session is very small in this way
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// starting from the data in the session, we extract the current (logged-in) user
passport.deserializeUser((id, done) => {
  userDao.getUserById(id)
    .then(user => {
      done(null, user); // this will be available in req.user
    }).catch(err => {
      done(err, null);
    });
});


// init express
const app = new express();
const port = 3001;

// set-up the middlewares
app.use(morgan('dev'));
app.use(express.json());
const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
};
app.use(cors(corsOptions)); // NB: Usare solo per sviluppo e per l'esame! Altrimenti indicare dominio e porta corretti

// custom middleware: check if a given request is coming from an authenticated user
const isLoggedIn = (req, res, next) => {
  if(req.isAuthenticated())
    return next();
  
  return res.status(401).json({ error: 'Not authenticated'});
}

// set up the session
app.use(session({
  // by default, Passport uses a MemoryStore to keep track of the sessions
  secret: 'wge8d239bwd93rkskb',   //personalize this random string, should be a secret value
  resave: false,
  saveUninitialized: false 
}));

// then, init passport
app.use(passport.initialize());
app.use(passport.session());

const flightsDao = require('./flights-dao'); // module for accessing the flights table in the DB


/*** Flights APIs ***/

// GET /api/flights/bookings
app.get('/api/flights/bookings', isLoggedIn, async (req, res) => {
  //console.log('api');
  flightsDao.getBookings(req.user.id)
    .then((rows) => res.status(200).json(rows))
    .catch(error => res.status(500).json(error));
 });


app.get('/api/flights/:type',
  async (req, res) => {
    try {
      await flightsDao.getFlight(req.params.type)
      .then(seats => res.status(200).json(seats))
      .catch((err) => res.status(500).json(err));

    } 
    catch (error) {
      res.status(500).json(error)
    }
  }
);


app.put('/api/flights/:type', isLoggedIn, async (req, res) => {
  //console.log(req.body);
  //check type
  //check seats
  
  switch (req.params.type) {
    case 'L':{
      const row_max = 25;
      const letter = ['A', 'B', 'C', 'D', 'E', 'F'];
      req.body.seats.forEach(s => {
        const l = s.substring(s.length-1,s.length);
        if(!letter.includes(l)){
          res.sendStatus(500);
        }
        const n = parseInt(s.substring(0, s.length-1));
        if(n > row_max){
          res.sendStatus(500);
        }
      });
      break;
    }
    case 'M':{
      const row_max = 20;
      const letter = ['A', 'B', 'C', 'D', 'E'];
      req.body.seats.forEach(s => {
        const l = s.substring(s.length-1,s.length);
        if(!letter.includes(l)){
          res.sendStatus(500);
        }
        const n = parseInt(s.substring(0, s.length-1));
        if(n > row_max){
          res.sendStatus(500);
        }
      });
      break;
    }
    
    case 'S':{
      const row_max = 15;
      const letter = ['A', 'B', 'C', 'D'];
      req.body.seats.forEach(s => {
        const l = s.substring(s.length-1,s.length);
        if(!letter.includes(l)){
          res.sendStatus(500);
        }
        const n = parseInt(s.substring(0, s.length-1));
        if(n > row_max){
          res.sendStatus(500);
        }
      });
      break;
    }
  
    default:
      res.sendStatus(500);
      break;
  }

  try {
    await flightsDao.bookSeats(req.params.type, req.body.seats, req.user.id);
    res.sendStatus(200); // Send 200 OK response
  } catch (error) {
    //console.error('Error booking seats:', error);
    if (error.message.startsWith('Seats already booked:')) {
      const seatId = error.message.split(':')[1].trim();
      res.status(409).json({ error: 'Seats already booked', seatId: seatId });
    } else {
      res.sendStatus(500); // Send 500 Internal Server Error response
    }
  }
});

app.delete('/api/flights/:type', isLoggedIn, async (req, res) => {
    //console.log(req.body);
    //console.log(req.user);
    //console.log(req.params.type);

    if(req.params.type !== 'L' && req.params.type !== 'M' && req.params.type !== 'S'){
      res.sendStatus(500);
    }
    
    try {
      await flightsDao.deleteReservation(req.params.type, req.user.id);
      res.sendStatus(200); // Send 200 OK response 
    } 
    catch(error){
      //console.error('Error deleting reservation:', error);
      res.sendStatus(500); // Send 500 Internal Server Error response
    }
  }
);

/*** Users APIs ***/

// POST /sessions 
// login
app.post('/api/sessions', passport.authenticate('local'), (req,res) => {
  // If this function gets called, authentication was successful.
  // `req.user` contains the authenticated user.
  res.json(req.user);
});


// DELETE /sessions/current 
// logout
app.delete('/api/sessions/current', (req, res) => {
  req.logout( ()=> { res.end(); } );
});

// GET /sessions/current
// check whether the user is logged in or not
app.get('/api/sessions/current', (req, res) => {  if(req.isAuthenticated()) {
    res.status(200).json(req.user);}
  else
    res.status(401).json({error: 'Unauthenticated user!'});;
});


// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
