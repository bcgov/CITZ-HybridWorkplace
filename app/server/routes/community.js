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
* @author [Jayna Bettesworth](bettesworthjayna@gmail.com)
* @module
*/

const express = require('express');
const router = express.Router();

const Community = require('../models/community.model');

// Create community
router.post('/', async (req, res) => {
    try {

        if (await Community.exists({ title: req.body.title })) {
            res.status(403).send("Community already exists.");
        } else {
            let community = await Community.create(req.body);
            res.status(201).json(community);
        }

    } catch (err) {
        res.status(400)
        .send('Bad Request. The Community in the body of the Request is either missing or malformed. ' + err);
    }
});

// Get all communities
router.get('/', async (req, res) => {
    try {
        const communities = await Community.find( {}, '', { sort: { _id: -1 } }).exec();

        if (!communities) res.sendStatus(404);

        res.status(200).json(communities);
    } catch (err) {
        res.status(400).send('Bad Request: ' + err);
    }
});

// Get community by title
router.get('/:title', async (req, res) => {
    try {
        const community = await Community.findOne({ title: req.params.title }).exec();

        if (!community) res.sendStatus(404);

        res.status(200).json(community);
    } catch (err) {
        res.status(400).send('Bad Request: ' + err);
    }
});

// Edit community by title
//FIX ME: AUTH
router.patch('/:title', async (req, res) => {
    try {
        //FIX ME: AUTH USER IS MODERATOR
        const community = await Community.findOneById({ title: req.params.title }).exec();

        if (!community) res.sendStatus(404);

        // Update post
        await community.save();
        res.status(200).json(community);
    } catch (err) {
        res.status(400).send('Bad Request: ' + err);
    }
});

// Remove community by title
//FIX ME: AUTH
router.delete('/:title', async (req, res) => {
    try {
        const community = await Community.deleteOne({ title: req.params.title }).exec();

        if (!community) res.sendStatus(404);

        //FIX ME: AUTH ONLY MODERATORS OF COMMUNITY
        res.status(200).send('Community removed.');
    } catch (err) {
        res.status(400).send('Bad Request: ' + err);
    }
});

module.exports = router;
