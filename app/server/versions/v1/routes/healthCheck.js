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
 * @author [Zach Bourque](zachbourque01@gmail.com)
 * @module
 */

const express = require("express");

const router = express.Router();

/**
 * @swagger
 * paths:
 *  /api/health:
 *    get:
 *      tags:
 *        - API
 *      summary: Returns "API is running!" if the endpoint is working.
 *      responses:
 *        '200':
 *          description: API is running!
 */

router.get("/", async (req, res) => res.status(200).send("API is running!"));

module.exports = router;
