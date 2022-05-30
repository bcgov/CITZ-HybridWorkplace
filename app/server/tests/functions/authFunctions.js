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
            .send({
                "name": name,
                "password": password
            });
        return loginResponse;
    }

    // Tries to log in user with less secure configs
    async loginInsecure(name, password){
        let loginResponse = await request.post('/login')
            .set('accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Credentials', 'Include')
            .set('Cookie', 'samesite=lax; path=./')
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

    // TODO: Logs out an existing user - needs update
    async logout(name, password){
        let loginResponse = await this.login(name, password);
        let logoutResponse = await request.get('/logout')
            .set('accept', `*/*`)
            .set('Cookie', `jwt=${ loginResponse.body.refreshToken }`);
        return logoutResponse;
    }

    // TODO: Retrieves a new token for an existing user - needs update
    async token(name, password){
        let loginResponse = await this.login(name, password);
        let tokenResponse = await request.get('/token')
            .set('Authorization', `bearer ${ loginResponse.body.token }`)
            .set('Cookie', `jwt=${ loginResponse.body.refreshToken }`);
        return tokenResponse;
    }
}

module.exports = { AuthFunctions };
