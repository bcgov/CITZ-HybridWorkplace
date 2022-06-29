require("dotenv").config();
const Agenda = require("agenda");
const mongoose = require("mongoose");
const moment = require("moment");
const color = require("ansi-colors");

const Community = require("./models/community.model");
const Options = require("./models/options.model");

const optionsCollection = require("./dbInit/optionsCollection");
const newCommunitiesDigestDaily = require("./jobs/newCommunitiesDigestDaily");

const dbURI = `${process.env.MONGO_REF}://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@${process.env.MONGO_REF}:${process.env.MONGO_PORT}/${process.env.MONGO_DATABASE_NAME}`;

mongoose.connect(dbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// print error message to console
// if there is a problem connecting
mongoose.connection.on("error", (err) => {
  console.error(`Mongoose connection error: ${err}`);
});

const db = mongoose.connection;

const agenda = new Agenda({ db: { address: dbURI } });

mongoose.connection.once("open", () => {
  console.log(
    color.bold.greenBright(`Mongoose connected successfully to ${dbURI}`)
  );
  mongoose.connection.db.listCollections().toArray(async (err, names) => {
    if (err) {
      console.log(err);
    } else {
      console.log(
        color.bold.magenta(`MongoDB collections: ${JSON.stringify(names)}`)
      );
      const collections = Object.keys(names).map((key) => names[key].name);
      // Create options collection if it doesn't exist
      if (!collections.includes("options")) {
        // Creating options collection
        db.createCollection("options");
        console.log(color.yellow("Options collection created."));
      } else {
        // Remove and re-create collection so changes can be made
        db.dropCollection("options");
        db.createCollection("options");
        console.log(
          color.yellow("Options collection removed and then re-created.")
        );
      }
      if ((await Options.count()) === 0) {
        // Options collection is empty
        await Options.insertMany(optionsCollection);
        console.log(color.yellow("Options collection initialized."));
      }
      // Create Welcome community if it doesn't already exist
      const timeStamp = moment().format("MMMM Do YYYY, h:mm:ss a");
      if (collections.includes("community")) {
        if (!(await Community.exists({ title: "Welcome" }))) {
          // Create Welcome community
          await Community.create({
            title: "Welcome",
            description: "Welcome to The Neighbourhood",
            creator: " ",
            createdOn: timeStamp,
            latestActivity: timeStamp,
            rules: " ",
            members: [],
          });
          console.log(color.yellow("Welcome community created."));
        } else {
          // Welcome community exists, ensure createdOn and latestActivity are set
          const { createdOn, latestActivity } = await Community.findOne({
            title: "Welcome",
          });
          if (!createdOn) {
            await Community.updateOne(
              { title: "Welcome" },
              { $set: { createdOn: timeStamp } }
            );
            console.log(
              color.yellow(`Welcome community 'createdOn' set to ${timeStamp}.`)
            );
          }
          if (!latestActivity) {
            await Community.updateOne(
              { title: "Welcome" },
              { $set: { latestActivity: timeStamp } }
            );
            console.log(
              color.yellow(
                `Welcome community 'latestActivity' set to ${timeStamp}.`
              )
            );
          }
        }
      }
    }
  });
});

mongoose.connection.on("disconnected", () => {
  console.log("Mongoose disconnected");
});

newCommunitiesDigestDaily(agenda);

// Agenda | Job scheduling
(async function () {
  await agenda.start();
  agenda.now("newCommunities");
})();

async function graceful() {
  await agenda.stop();
}

process.on("SIGTERM", graceful);
process.on("SIGINT", graceful);
