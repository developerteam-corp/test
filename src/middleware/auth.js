import jwt from "jsonwebtoken";
import moment from "moment";
import db from "../models"
module.exports = {
   requiresAdmin(req, res, next) {
       return new Promise((resolve, reject) => {
           const token = req.headers.token;
           if (token) {
               jwt.verify(token, "secret_key", (err, docs) => {
                   if (err) {
                       res.status(401).send({ error: 1, message: "Invalid Token" });
                   } else {
                       const endTime = moment().unix();
                       const loginTime = docs.exp;
                       if (loginTime > endTime) {
                           req.token = docs.token;
                           db.user.findOne({ _id: req.token }).then((user) => {
                               if (user) {
                                   req.user = user;
                                   next();
                               } else {
                                   res.status(401).send({ error: 1, message: "You Are Not Authorized" });
                               }
                           });
                       }
                   }
               });
           } else {
               res.status(401).send({ error: 1, message: "User is not logged in" });
           }
       })
   }
}