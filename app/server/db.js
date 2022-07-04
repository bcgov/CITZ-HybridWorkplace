/* eslint-disable import/no-dynamic-require */
/* eslint-disable no-console */
/* 
 Copyright © 2022 Province of British Columbia
 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

/**
 * Application entry point
 * @author [Brady Mitchell](braden.jr.mitch@gmail.com)
 * @module
 */

const Agenda = require("agenda");
const mongoose = require("mongoose");
const color = require("ansi-colors");

const agendaStartUp = require(`./versions/v${process.env.API_VERSION}/jobs/startUp`);
const mongoStartUp = require(`./versions/v${process.env.API_VERSION}/db/startUp`);

const dbURI = `${process.env.MONGO_REF}://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@${process.env.MONGO_REF}:${process.env.MONGO_PORT}/${process.env.MONGO_DATABASE_NAME}`;

mongoose.connect(dbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Print error message to console if there is a problem connecting
mongoose.connection.on("error", (err) => {
  console.error(`Mongoose connection error: ${err}`);
});

const db = mongoose.connection;
const agenda = new Agenda({ db: { address: dbURI } });

// After successful connection to mongodb
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
      // Operations on collections to be performed on startup
      mongoStartUp(db, collections);
    }
  });
});

mongoose.connection.on("disconnected", () => {
  console.log("Mongoose disconnected");
});

// Agenda | Job scheduling
(async function () {
  await agenda.start();
  await agendaStartUp(agenda);
})();

// Graceful shutdown of agenda operations
async function graceful() {
  await agenda.stop();
}

process.on("SIGTERM", graceful);
process.on("SIGINT", graceful);
