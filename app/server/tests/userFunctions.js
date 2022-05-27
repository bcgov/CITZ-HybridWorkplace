const endpoint = process.env.API_REF;
const supertest = require('supertest');
const request = supertest(endpoint);

class UserFunctions{
    registerList;

    constructor(){
        this.registerList = [];
    }

    async register(name, email, password) {
        if (!email.includes('@')){
            email += '@gov.bc.ca';
        }
        let response = await request.post('/register')
                                    .send({
                                        "name": name,
                                        "email": email,
                                        "password": password
                                    });
        registerList.push({ 
                            user:   {
                                        name: name,
                                        email: email,
                                        password: password
                                    },
                            response: response
                        });
        return response;
    }

    async deleteUsers() {
        for (let i = 0; i < registerList.length; i++){
            let loginResponse = await request.post('/login')
            .set('accept', 'application/json')
            .set('Content-Type', 'application/json')
            .send({
                "name": registerList[i].user.name,
                "password": registerList[i].user.password
            });

            let deleteResponse = await request.delete(`/user/${registerList[i].user.name}`)
                            .set('accept', '*/*')
                            .set('Authorization', `bearer ${loginResponse.body.token}`);
        }
    }
}

module.exports = { UserFunctions };