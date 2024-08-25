const InvariantError = require("../../exceptions/InvariantError");
const { SongSchema } = require("./schema");

const SongValidator = {
  validateSong: (payload) => {
    console.log("v1");
    const validationResult = SongSchema.validate(payload);
    console.log("v2");

    if (validationResult.error) {
      console.log("v3");
      throw new InvariantError(validationResult.error.message);
    }
    console.log("v4");
  },
};

module.exports = SongValidator;
