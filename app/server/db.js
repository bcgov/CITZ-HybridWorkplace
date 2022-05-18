require("dotenv").config();
const mongoose = require("mongoose");

const dbURI = process.env.MONGO_URI;

mongoose.connect(dbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// print message to console when connected to DB
mongoose.connection.on("connected", () => {
  console.log(`Mongoose connected to ${dbURI}`);
});

// print error message to console
// if there is a problem connecting
mongoose.connection.on("error", (err) => {
  console.log(`Mongoose connection error: ${err}`);
});
mongoose.connection.on("disconnected", () => {
  console.log("Mongoose disconnected");
});
