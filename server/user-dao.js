'use strict';
/* Data Access Object (DAO) module for accessing users */

const sqlite = require('sqlite3').verbose();
const crypto = require('crypto');

// open the database
const db = new sqlite.Database('flights.sqlite', (err) => {
  if (err) throw err;
});

exports.getUserById = (id) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM users WHERE id = ?';
    db.get(sql, [id], (err, row) => {
      if (err)
        reject(err);
      else if (row === undefined)
        resolve({ error: 'User not found.' });
      else {
        // by default, the local strategy looks for "username": not to create confusion in server.js, we can create an object with that property
        const user = { id: row.id, username: row.email, name: row.name }
        resolve(user);
      }
    });
  });
};

exports.getUser = (email, password) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM users WHERE email = ?';
    db.get(sql, [email], (err, row) => {
      console.log('ROW: ' + row.id + ' ' + row.name + ' ' + row.email + ' ' + row.hash + ' ' + row.salt);
      if (err) { reject(err); }
      else if (row === undefined) { resolve(false); }
      else {
        const user = { id: row.id, username: row.email, name: row.name };

        const salt = row.salt;
        crypto.scrypt(password, salt, 32, (err, hashedPassword) => {
          console.log('CRYPTO SCRIPT');
          if (err) reject(err);

          const passwordHex = Buffer.from(row.hash, 'hex');
          //console.log('PWD_HEX:' + passwordHex);

          if (!crypto.timingSafeEqual(passwordHex, hashedPassword)) {
            console.log('PWD NOT OK')
            resolve(false);
          }
          else {
            console.log('PWD OK')
            resolve(user);
          }
        });
      }
    });
  });
};
