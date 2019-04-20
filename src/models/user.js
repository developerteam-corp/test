import mongoose from "mongoose";
import connection from "../db.js";
let Schema = mongoose.Schema;

let UserSchema = new Schema(
  {
    email: String,
    password: String
  },
  {
    timestamps: true
  }
);

module.exports = connection.conn.model("USER", UserSchema);
