const endpoint = process.env.API_REF;
const supertest = require('supertest');
const request = supertest(endpoint);

class UserFunctions{
    registerList;

    constructor(){
        this.registerList = [];
    }

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

    async deleteUsers() {
        for (let i = 0; i < this.registerList.length; i++){
            await this.delete(this.registerList[i].user.name, this.registerList[i].user.password);
        }
    }

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

    async delete(name, password){
        let loginResponse = await this.login(name, password);

        let deleteResponse = await request.delete(`/user/${name}`)
                            .set('accept', '*/*')
                            .set('Authorization', `bearer ${loginResponse.body.token}`);
        return deleteResponse;
    }

    async logout(name, password){
        let loginResponse = await this.login(name, password);
        let logoutResponse = await request.get('/logout')
            .set('accept', `*/*`)
            .set('Cookie', `jwt=${loginResponse.body.refreshToken}`);
        return logoutResponse;
    }

    async token(name, password){
        let loginResponse = await this.login(name, password);
        let tokenResponse = await request.get('/token')
            .set('Authorization', `bearer ${loginResponse.body.token}`)
            .set('Cookie', `jwt=${loginResponse.body.refreshToken}`);
        return tokenResponse;
    }
}

module.exports = { UserFunctions };
