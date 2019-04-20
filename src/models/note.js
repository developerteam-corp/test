import mongoose from "mongoose";
import connection from "../db.js";
let Schema = mongoose.Schema;

let NoteSchema = new Schema(
  {
    name: String,
    description: String,
    status_completed: { type: Boolean, default: false },
    noteId: String,
    parentNoteId: String,
    templateId: String
  },
  {
    strict: false,
    timestamps: true
  }
);

module.exports = connection.conn.model("NOTE", NoteSchema);
