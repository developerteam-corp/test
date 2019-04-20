import mongoose from "mongoose";
import bluebird from "bluebird";
mongoose.Promise = bluebird;
import environment from "./environment.js";

let conn = mongoose.createConnection(environment.db);
module.exports = { conn: conn };
