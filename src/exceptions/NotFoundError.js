const ClientError = require("./ClientError");

class NotFoundError extends ClientError {
  constructor(message) {
    console.log("err 1");
    super(message, 404);
    console.log("err 2");
    this.name = "NotFoundError";
    console.log("err 3");
  }
}

module.exports = NotFoundError;
