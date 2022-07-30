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

const ResponseError = require("../classes/responseError");
const { agenda } = require("../../../db");
const defineOfflineStatusJob = require("../jobs/defineOfflineStatusJob");
const User = require("../models/user.model");

const setOnlineStatus = async (req, res, next) => {
  try {
    // Set online status
    await User.updateOne({ _id: req.user.id }, { online: true });
    // Define job for offline status
    await defineOfflineStatusJob(agenda, req.user.id);
    // Reschedule offline status
    await agenda.schedule("in 5 minutes", `offlineStatus-${req.user.id}`);
  } catch (err) {
    if (err instanceof ResponseError)
      return res.status(err.status).send(err.message);
    return res.status(400).send(`Bad Request: ${err}`);
  }
  next();
};

module.exports = setOnlineStatus;
