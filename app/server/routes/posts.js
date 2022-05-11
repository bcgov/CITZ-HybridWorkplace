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

 const Post = require('../models/post.model')

 router.post('/', async (req, res) => {
    console.log(req.body)
    try {
        
        await Post.create ({
            title: req.body.title,
            message: req.body.message,
            creator: req.body.creator,
            community: req.body.community,
        })
       
        res.json({ status: 'ok' })
    } catch (err) {
       
        res.json({ status: 'error', error: err })
    }
})

router.get('/', async (req, res) => {
    Post.find({ })
        .then((data)=>{
            console.log(data);
            res.json(data);
        })
        .catch((error) =>{
            console.log(error);
        });

})

module.exports = router;
