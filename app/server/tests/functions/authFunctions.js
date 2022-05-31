const endpoint = process.env.API_REF;
const supertest = require('supertest');
const request = supertest(endpoint);

class AuthFunctions{
    registerList; // Tracks registered users for later clean up.

    constructor(){
        this.registerList = [];
    }

    // Registers a user. Adds this new user to registerList for later clean up.
    async register(name, email, password) {
        let registerResponse = await request.post('/register')
                                    .send({
                                        "name": name,
                                        "email": email,
                                        "password": password
                                    });
        this.registerList.push({ 
                            user:   {
                                        name: name,
                                        email: email,
                                        password: password
                                    },
                            response: registerResponse
                        });
        return registerResponse;
    }

    // Deletes any users registered in this instance of UserFunctions
    async deleteUsers() {
        for (let i = 0; i < this.registerList.length; i++){
            await this.delete(this.registerList[i].user.name, this.registerList[i].user.password);
        }
    }

    // Logs an existing user in
    async login(name, password){
        let loginResponse = await request.post('/login')
            .set('accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Credentials', 'Include')
            .send({
                "name": name,
                "password": password
            });
        return loginResponse;
    }

    // Deletes an existing user
    async delete(name, password){
        let loginResponse = await this.login(name, password);

        let deleteResponse = await request.delete(`/user/${ name }`)
                            .set('accept', '*/*')
                            .set('Authorization', `bearer ${ loginResponse.body.token }`);
        return deleteResponse;
    }
}

module.exports = { AuthFunctions };
