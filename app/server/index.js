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

 const express = require('express')
 const app = express()

 const port = process.env.PORT || 5000;
 const cors = require('cors')
 const mongoose = require('mongoose')
 const User = require('./models/user.model')
 const jwt = require('jsonwebtoken')
 const bcrypt = require('bcryptjs') //encrypting passwords
 
  app.use(cors()) //middleware
  app.use(express.json())
 


  mongoose.connect('mongodb://localhost:27017/TheNeighborhood')
 
 app.post('/api/register', async (req, res) => {
     console.log(req.body)
     try {
         
         const newPassword = await bcrypt.hash(req.body.password, 10)
         
         await User.create ({
             name: req.body.name,
             email: req.body.email,
             password: newPassword,
         })
        
         res.json({ status: 'ok' })
     } catch (err) {
        
         res.json({ status: 'error', error: 'Duplicate email' })
     }
 })


 
 app.post('/api/login', async (req, res) => {
     const user = await User.findOne({
         name: req.body.name,
     })
 
     if (!user) {
         return { status: 'error', error: 'Invalid login' }
     }
 
     const isPasswordValid = await bcrypt.compare(
         req.body.password,
         user.password
     )
 
     if (isPasswordValid) {
         const token = jwt.sign(
             {
                 name: user.name,
                 email: user.email,
             },
             'secret123'
         )
 
         return res.json({ status: 'ok', user: token })
     } else {
         return res.json({ status: 'error', user: false })
     }
 })
 

 app.get('/api/quote', async (req, res) => {
     const token = req.headers['x-access-token']
 
     try {
         const decoded = jwt.verify(token, 'secret123')
         const email = decoded.email
         const user = await User.findOne({ email: email })
 
         return res.json({ status: 'ok', quote: user.quote, name: user.name })
     } catch (error) {
         console.log(error)
         res.json({ status: 'error', error: 'invalid token' })
     }
 })
 
 app.post('/api/quote', async (req, res) => {
     const token = req.headers['x-access-token']
 
     try {
         const decoded = jwt.verify(token, 'secret123')
         const email = decoded.email
         await User.updateOne(
             { email: email },
             { $set: { quote: req.body.quote } }
         )
 
         return res.json({ status: 'ok' })
     } catch (error) {
         console.log(error)
         res.json({ status: 'error', error: 'invalid token' })
     }
 })
 
 app.get('/api/profile', async (req, res) => {
    const token = req.headers['x-access-token']

    try {
        const decoded = jwt.verify(token, 'secret123')
        const email = decoded.email
        const user = await User.findOne({ email: email })

        return res.json({ status: 'ok', name: user.name, email: user.email, fullName: user.fullName, bio: user.bio, title: user.title, quote:user.quote })
    } catch (error) {
        console.log(error)
        res.json({ status: 'error', error: 'invalid token' })
    }
})

app.post('/api/profile', async (req, res) => {
    const token = req.headers['x-access-token']

    try {
        const decoded = jwt.verify(token, 'secret123')
        const email = decoded.email
        await User.updateOne(
            { email: email },
            { $set: { fullName: req.body.fullName } },
        )

        return res.json({ status: 'ok' })
    } catch (error) {
        console.log(error)
        res.json({ status: 'error', error: 'invalid token' })
    }
})

app.get('/api/editprofile', async (req, res) => {
    const token = req.headers['x-access-token']

    try {
        const decoded = jwt.verify(token, 'secret123')
        const email = decoded.email
        const user = await User.findOne({ email: email })

        return res.json({ status: 'ok', name: user.name, email: user.email, fullName: user.fullName, bio: user.bio, title: user.title, quote:user.quote })
    } catch (error) {
        console.log(error)
        res.json({ status: 'error', error: 'invalid token' })
    }
})

app.post('/api/editprofile', async (req, res) => {
    const token = req.headers['x-access-token']

    try {
        const decoded = jwt.verify(token, 'secret123')
        const email = decoded.email
        await User.updateMany(
            { email: email },
            { $set: { fullName: req.body.fullName, title: req.body.title, bio: req.body.bio} },
            
        )

        return res.json({ status: 'ok' })
    } catch (error) {
        console.log(error)
        res.json({ status: 'error', error: 'invalid token' })
    }
})

 app.listen(port, () => {
     console.log(`Server started on port ${port}`)
 })



