const mongoose = require("mongoose");

module.exports = gamedb = mongoose
  .connect(config.database, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
  .then(() => console.log("Connected to MongoDB..."))
  .catch(err => {
    console.log("Could not connect to MongoDB...");
    console.log(err);
  });
