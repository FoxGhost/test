'use strict';
const sqlite = require('sqlite3').verbose();

// open the database
const db = new sqlite.Database('flights.sqlite', (err) => {
    if (err) throw err;
  });

exports.getFlight = (type) => {

    return new Promise((resolve, reject) => {
        
        const sql = 'SELECT * FROM flights WHERE type = ?';
        db.all(sql, [type], (err, rows) => {
            if (err) { reject(err); }
            resolve(rows);
        });
    });
}

exports.getBookings = (userID) => {

    //console.log(userID);

    return new Promise((resolve, reject) => {
        const sql = 'select * from flights where user = ?';
        db.all(sql, [userID], function(err, vals) {
        if (err) reject(err);
        resolve(vals);
    });
});

}

exports.bookSeats = (type, seats, userID) => {
    return new Promise((resolve, reject) => {
        const sqlParams = [];
        sqlParams.push(userID);
        sqlParams.push(type);

        const sqlParamsV = [];
        sqlParamsV.push(type);
        sqlParamsV.push(userID);
        /*create query to verify if seats are already booked*/
        const sql1V = 'SELECT row, seat FROM flights WHERE type = ? and seat_status = 1 AND user!= ? AND (';
        const sql2V = '(row = ? AND seat = ?) OR ';
        const sql3V = sql1V + sql2V.repeat(seats.length);
        const sqlV = sql3V.substring(0, sql3V.length - 3) + ')';
        /*create query to book seats */
        const sql1 = 'UPDATE flights SET seat_status = 1, user = ? WHERE type = ? AND (';
        const sql2 = '(row = ? AND seat = ?) OR '
        const sql3 = sql1 + sql2.repeat(seats.length);
        //console.log(sql3);
        const sql = sql3.substring(0,sql3.length-3) + ')';

        /*separate seat id in row and letter and push in param vector*/
        seats.forEach((seatId) => {
            const matches = seatId.match(/^(\d+)([A-Za-z])$/);
            if (matches && matches.length === 3) {
                const row = parseInt(matches[1]);
                const seat = matches[2];
                sqlParams.push(row, seat);
                sqlParamsV.push(row, seat);
            }
        });

        //console.log(sql);
        //console.log(sqlParams);
        //console.log(seats.length);

        /*Does the user has a booking for this flight?*/ 
        const query = "SELECT * FROM flights WHERE type = ? and user = ?"

        db.all(query, [type, userID], (err, rows) => {
          if (err) {
            reject(err);
          }
          else if (rows.length > 0){
            reject(new Error(`User alredy booked this flight: ${type}`));
          }
        });

        /*check if booked by other user if not booked*/ 
        db.all(sqlV, sqlParamsV, (err, rows) => {
            //console.log('INSIDE SELECT');
            if (err) {
              reject(err);
            } else if (rows.length > 0) {
              //console.log('ROWS ALREADY BOOKED: ' + rows.join(', '));  
              const alreadyBookedSeats = rows.map((row) => `${row.row}${row.seat}`);
              reject(new Error(`Seats already booked: ${alreadyBookedSeats.join(', ')}`));
            } else {
              db.run(sql, sqlParams, function (err) {
                if (err) {
                  reject(err);
                } else {
                  resolve(this.changes);
                }
              });
            }
          });
    });
        
}

exports.deleteReservation = (type, userID) => {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE flights SET seat_status = 0, user = 0 WHERE type = ? AND user = ?';
        db.run(sql, [type, userID], (err, row) => {
            if (err){
                reject(err);
            }
            else{
                resolve(this.changes);
            }
        });
    });
    
}