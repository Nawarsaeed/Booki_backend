const mongoose = require("mongoose");
const winston = require("winston");

module.exports = function () {
  mongoose
    .connect("mongodb+srv://dbBooki:Booki123@booki.zwuoi.mongodb.net/test", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    })
    .then(() => {
      winston.info("Connected to MongoDB");
    });
};
