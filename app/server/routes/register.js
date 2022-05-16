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
<<<<<<< HEAD

const express = require("express");
=======
>>>>>>> 96fddc2 ([refs hwp-277] Docker Hotloading)

const router = express.Router();

const bcrypt = require("bcryptjs"); // hashing passwords

const User = require("../models/user.model");

// Register User
<<<<<<< HEAD
router.post("/", async (req, res) => {
=======
router.post('/', async (req, res) => {
>>>>>>> 96fddc2 ([refs hwp-277] Docker Hotloading)
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    if (
      await User.exists({
        $or: [{ name: req.body.name }, { email: req.body.email }],
      })
    )
<<<<<<< HEAD
      return res.status(403).send("IDIR or email already exists.");
=======
      res.status(403).send('IDIR or email already exists.');
>>>>>>> 96fddc2 ([refs hwp-277] Docker Hotloading)

    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });

<<<<<<< HEAD
    return res.status(201).send("Registered.");
  } catch (err) {
    return res.status(400).send(`Bad Request: ${err}`);
=======
    res.status(201).send('Registered.');
  } catch (err) {
    res.status(400).send('Bad Request: ' + err);
>>>>>>> 96fddc2 ([refs hwp-277] Docker Hotloading)
  }
});

module.exports = router;
