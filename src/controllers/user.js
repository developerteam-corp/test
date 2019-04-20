import BaseAPIController from "./BaseAPIController";
import db from "../models";
import md5 from "md5";
import jwt from "jsonwebtoken";

export class UserController extends BaseAPIController {
  register = (req, res, next) => {
    db.user.findOne({ email: req.body.email }).then(user => {
      if (!user) {
        req.body.password = md5(req.body.password);
        db.user.create(req.body).then(data => {
          var expiredIn = 60 * 60;
          const token = jwt.sign(
            {
              token: data._id
            },
            "secret_key",
            {
              expiresIn: expiredIn
            }
          );
          data = JSON.parse(JSON.stringify(data));
          data.accessToken = token;
          res.json({ error: 0, data: data });
        });
      } else {
        res.status(400).json({ error: 1, message: "Email already exist!" });
      }
    });
  };

  login = (req, res, next) => {
    db.user.findOne({ email: req.body.email }).then(data => {
      if (data) {
        if (data.password == md5(req.body.password)) {
          var expiredIn = 0;
          if (req.body.remember_me) {
            expiredIn = 24 * 60 * 60 * 30;
          } else {
            expiredIn = 60 * 60;
          }
          const token = jwt.sign(
            {
              token: data._id
            },
            "secret_key",
            {
              expiresIn: expiredIn
            }
          );
          data = JSON.parse(JSON.stringify(data));
          data.accessToken = token;
          res.json({ error: 0, data: data });
        } else {
          res.status(400).json({ error: 1, message: "Wrong password!" });
        }
      } else {
        res.status(400).json({ error: 1, message: "Invalid email!" });
      }
    });
  };
}

const controller = new UserController();
export default controller;
