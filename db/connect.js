const mongoose = require("mongoose");

const connectDb = (url) => {
  mongoose.connect(url, {
    useNewUrlParser: true,
  });
  mongoose.connection.on("error", (err) => {
    console.log(err);
  });
  mongoose.connection.on("connected", () => console.log("DataBase connected"));
  mongoose.connection.on("disconnected", () =>
    console.log("DataBase disconnected")
  );
};

module.exports = connectDb;
