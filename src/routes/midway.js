let jwt = require('jsonwebtoken');
// const config = require('./config.js');
let user = require('./authenticate');
const db = require("../db/db");

//To check buyer and seller authentication token
let checkToken = (req, res, next) => {
  console.log("pppppppppppppppp")
  let token = req.headers['x-access-token'] || req.headers['authorization'];
  if (token) {
    console.log("qqqqqqqqqqqqq")
    jwt.verify(token, 'prnv', (err, decoded) => {
      console.log("wwwwwwwwwwww");

      if (err) {
        console.log("erroe here");
        //  res.json({ status: 401, error: { message: 'Unauthorised' } });
        let err = new Error('unautherize');
        err.status = 401;
        throw err;
      }
      else {
        if (user.user != undefined) {
          console.log("11111111")
          if ((user.user.username == decoded.username) && (user.user.password == decoded.password)) {
              console.log("asasasa");
              req.decoded = decoded;
              next();
          }
          else {
            console.log("bbbb")
            let err = new Error('unautherize');
            err.status = 401;
            res.status(err.status || 500);
            res.json({
              error: {
                status: 401,
                massage: err.message
              }
            });
          }
        }
      }
    });
  } else {
    console.log("erroe here123");
    let err = new Error('noToken');
    err.status = 111;
    throw err;
  }
};

module.exports = {
  checkToken: checkToken
} 