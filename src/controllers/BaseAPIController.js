export default class BaseAPIController {
  // constructor() {
  //     this._db = db;
  // }

  handleErrorResponse(res, err, next) {
    res.status(400).send(errorHandler(err));
  }

  handleSuccessResponse(res, next) {
    res.json({
      status: "SUCCESS"
    });
  }
}
