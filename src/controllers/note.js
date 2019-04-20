import BaseAPIController from "./BaseAPIController";
import db from "../models";
import { ObjectID } from "mongodb";
export class NoteController extends BaseAPIController {
  createNote = (req, res, next) => {
    if (req.body.noteId) {
      db.note
        .find({
          $or: [{ _id: ObjectID(req.body.noteId) }, { noteId: req.body.noteId }]
        })
        .then(findResponse => {
          req.body.trancheNo = findResponse.length + 1;
          db.note.create(req.body).then(data => {
            res.json({ error: 0, data: data });
          });
        });
    } else {
      req.body.noteId = null;
      db.note.create(req.body).then(data => {
        db.note
          .update({ _id: data._id }, { $set: { parentNoteId: data._id } })
          .then(updateResponse => {
            res.json({ error: 0, data: data });
          });
      });
    }
  };

  listNotes = (req, res, next) => {
    let notes = [];
    db.note.find({}).then(data => {
      data = JSON.parse(JSON.stringify(data));
      data.forEach((item, key) => {
        if (!item.noteId) {
          notes.push(item);
        }
      });
      // data = JSON.parse(JSON.stringify(data));
      findTranche(notes, data, [], result => {
        res.json({ error: 0, data: result });
      });
    });
  };

  updateNote = (req, res, next) => {
    db.note.update({ _id: req.body._id }, req.body).then(data => {
      res.json({ error: 0, data: data });
    });
  };

  deleteNote = (req, res, next) => {
    db.note.findOne({ _id: ObjectID(req.params.mongoId) }).then(data => {
      if (data.noteId) {
        db.note.remove({ _id: req.params.mongoId }).then(removeResponse => {
          res.json({ error: 0, data: removeResponse });
        });
      } else {
        db.note
          .find({ noteId: data.parentNoteId })
          .sort({ createdAt: 1 })
          .then(findResult => {
            if (findResult[0]) {
              db.note
                .remove({ _id: req.params.mongoId })
                .then(removeResponse => {
                  db.note
                    .update(
                      { _id: findResult[0]._id },
                      {
                        $set: { parentNoteId: data.parentNoteId, noteId: null }
                      }
                    )
                    .then(updateResponse => {
                      res.json({ error: 0, data: removeResponse });
                    });
                });
            } else {
              db.note
                .remove({ _id: req.params.mongoId })
                .then(removeResponse => {
                  res.json({ error: 0, data: removeResponse });
                });
            }
          });
      }
    });
  };

  getNoteByTemplateId = (req, res, next) => {
    db.note.findOne({ templateId: req.params.templateId }).then(data => {
      if (data) {
        res.json(data);
      } else {
        res.status(400).json("no data found for given template id");
      }
    });
  };
}

function findTranche(notes, data, result, callback) {
  if (notes.length) {
    var note = notes.splice(0, 1)[0];
    findTrancheForNote(note, data, [], tranches => {
      // note["tranches"] = tranches;
      tranches.forEach(item => {
        result.push(item);
      });
      if (notes.length) {
        findTranche(notes, data, result, callback);
      } else {
        callback(result);
      }
    });
  } else {
    callback(result);
  }
}
function findTrancheForNote(note, data, tranches, callback) {
  let trancheNo = 1;
  // note["tranches"] = trancheNo;
  note.trancheNo= trancheNo;
  tranches.push(note);
  data.forEach(item => {
    if (item.noteId == note.parentNoteId) {
      trancheNo++;
      item.trancheNo = trancheNo;
      tranches.push(item);
    }
  });
  callback(tranches);
}

const controller = new NoteController();
export default controller;
