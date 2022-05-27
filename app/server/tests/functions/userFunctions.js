require('dotenv').config();
const supertest = require('supertest');
const endpoint = process.env.API_REF;
const request = supertest(endpoint);
  
function loginUser(username,password){
    return request
        .post('/login')
        .send({
            "name": username,
            "password": password
        });
} 

module.exports = {loginUser};
