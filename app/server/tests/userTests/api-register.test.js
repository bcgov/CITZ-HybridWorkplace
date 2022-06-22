/*  
    Testing ability to register user accounts.
*/

const { AuthFunctions } = require('../functions/authFunctions')
const { password, name, email, positive, positiveInt, negative, negativeInt, largeString, characters } = require('../functions/randomizer');

let users = new AuthFunctions(); // build class for user actions


describe('Testing /register endpoint', () => {
    let response;

    describe('Testing optimal inputs for register', () => {
        afterAll(async () => {
            await users.deleteUsers();
        });

        test('new users are registered successfully - returns 201', async () => {
            response = await users.register(name.gen(), email.gen(), password.gen());
            expect(response.status).toBe(201);
        });
    
        test('user attempts to register with name and password already used - returns 403', async () => {
            await users.register('Zack Galafianakis', 'zgalafianakis@gov.bc.ca', 'MyDogHasFleas1!');
            response = await users.register('Zack Galafianakis', 'zgalafianakis@gov.bc.ca', 'MyDogHasFleas1!');
            expect(response.status).toBe(403); // user already exists
        });
    });
    
    describe('Testing limitations on password field', () => { 
        describe('Sending passwords that do not meet specifications', () => {
            afterAll(async () => {
                await users.deleteUsers();
            });

            test('Password doesn\'t meet character specifications - returns 400', async () => {
                response = await users.register(name.gen(), email.gen(), 'badpasswo1!');
                expect(response.status).toBe(403);
            });
        
            test('Password doesn\'t meet number specifications - returns 403', async () => {
                response = await users.register(name.gen(), email.gen(), 'B!adpassword');
                expect(response.status).toBe(403);
            });
        
            test('Password doesn\'t meet symbol specifications - returns 403', async () => {
                response = await users.register(name.gen(), email.gen(), 'Badpassword1');
                expect(response.status).toBe(403);
            });
        
            test('Password doesn\'t meet length specifications - returns 403', async () => {
                response = await users.register(name.gen(), email.gen(), 'hi');
                expect(response.status).toBe(403);
            });
        });
        
        describe('Sending numbers as passwords', () => {
            afterAll(async () => {
                await users.deleteUsers();
            });

            test('Positive integer', async () => {
                response = await users.register(name.gen(), email.gen(), positiveInt.gen());
                expect(response.status).toBe(403);
            });

            test('Positive decimal', async () => {
                response = await users.register(name.gen(), email.gen(), positive.gen());
                expect(response.status).toBe(403);
            });

            test('Negative integer', async () => {
                response = await users.register(name.gen(), email.gen(), negativeInt.gen());
                expect(response.status).toBe(403);
            });

            test('Negative decimal', async () => {
                response = await users.register(name.gen(), email.gen(), negative.gen());
                expect(response.status).toBe(403);
            });

            test('Zero', async () => {
                response = await users.register(name.gen(), email.gen(), 0);
                expect(response.status).toBe(403);
            });
        });

        describe('Sending strings as passwords', () => {
            afterAll(async () => {
                await users.deleteUsers();
            });

            test('Empty string', async () => {
                response = await users.register(name.gen(), email.gen(), '');
                expect(response.status).toBe(403);
            });

            test('Very large string', async () => {
                response = await users.register(name.gen(), email.gen(), largeString.gen());
                expect(response.status).toBe(403);
            });

            test('URL', async () => {
                response = await users.register(name.gen(), email.gen(), 'https://github.com/bcgov/CITZ-HybridWorkplace');
                expect(response.status).toBe(403);
            });

            test('Special characters', async () => {
                response = await users.register(name.gen(), email.gen(), characters.gen());
                expect(response.status).toBe(403);
            });
        });

        describe('Sending other things as passwords', () => {
            afterAll(async () => {
                await users.deleteUsers();
            });

            test('Null', async () => {
                response = await users.register(name.gen(), email.gen(), null);
                expect(response.status).toBe(403);
            });

            test('JS object', async () => {
                response = await users.register(name.gen(), email.gen(), { payload: "object" });
                expect(response.status).toBe(403);
            });

            test('Array', async () => {
                response = await users.register(name.gen(), email.gen(), ['password1', 'password2']);
                expect(response.status).toBe(403);
            });
        });
    });

    describe('Testing limitations on email field', () => {  
        describe('Sending numbers as email', () => {
            afterAll(async () => {
                await users.deleteUsers();
            });

            test('Positive integer', async () => {
                response = await users.register(name.gen(), positiveInt.gen(), password.gen());
                expect(response.status).toBe(403);
            });

            test('Positive decimal', async () => {
                response = await users.register(name.gen(), positive.gen(), password.gen());
                expect(response.status).toBe(403);
            });

            test('Negative integer', async () => {
                response = await users.register(name.gen(), negativeInt.gen(), password.gen());
                expect(response.status).toBe(403);
            });

            test('Negative decimal', async () => {
                response = await users.register(name.gen(), negative.gen(), password.gen());
                expect(response.status).toBe(403);
            });

            test('Zero', async () => {
                response = await users.register(name.gen(), 0, password.gen());
                expect(response.status).toBe(403);
            });
        });

        describe('Sending strings as emails', () => {
            afterAll(async () => {
                await users.deleteUsers();
            });
            
            test('Regular string', async () => {
                response = await users.register(name.gen(), 'notAnEmail', password.gen());
                expect(response.status).toBe(403);
            });

            test('Empty string', async () => {
                response = await users.register(name.gen(), '', password.gen());
                expect(response.status).toBe(403);
            });

            test('Very large string', async () => {
                response = await users.register(name.gen(), largeString.gen(), password.gen());
                expect(response.status).toBe(403);
            });

            test('URL', async () => {
                response = await users.register(name.gen(), 'https://github.com/bcgov/CITZ-HybridWorkplace', password.gen());
                expect(response.status).toBe(403);
            });

            test('Special characters', async () => {
                response = await users.register(name.gen(), characters.gen(), password.gen());
                expect(response.status).toBe(403);
            });
        });

        describe('Sending other things as emails', () => {
            afterAll(async () => {
                await users.deleteUsers();
            });
            
            test('Null', async () => {
                response = await users.register(name.gen(), null, password.gen());
                expect(response.status).toBe(403);
            });

            test('JS object', async () => {
                response = await users.register(name.gen(), { payload: "object" }, password.gen());
                expect(response.status).toBe(403);
            });

            test('Array', async () => {
                response = await users.register(name.gen(), ['email1', 'email2'], password.gen());
                expect(response.status).toBe(403);
            });
        });
    });

    describe('Testing limitations on username field', () => {  
        describe('Sending numbers as username', () => {
            afterAll(async () => {
                await users.deleteUsers();
            });
            
            test('Positive integer', async () => {
                response = await users.register(positiveInt.gen(), email.gen(), password.gen());
                expect(response.status).toBe(403);
            });

            test('Positive decimal', async () => {
                response = await users.register(positive.gen(), email.gen(), password.gen());
                expect(response.status).toBe(403);
            });

            test('Negative integer', async () => {
                response = await users.register(negativeInt.gen(), email.gen(), password.gen());
                expect(response.status).toBe(403);
            });

            test('Negative decimal', async () => {
                response = await users.register(negative.gen(), email.gen(), password.gen());
                expect(response.status).toBe(403);
            });

            test('Zero', async () => {
                response = await users.register(0, email.gen(), password.gen());
                expect(response.status).toBe(403);
            });
        });

        describe('Sending strings as username', () => {
            afterAll(async () => {
                await users.deleteUsers();
            });
            
            test('Empty string', async () => {
                response = await users.register('', email.gen(), password.gen());
                expect(response.status).toBe(403);
            });

            test('Very large string', async () => {
                response = await users.register(largeString.gen(), email.gen(), password.gen());
                expect(response.status).toBe(403);
            });

            test('URL', async () => {
                response = await users.register('https://github.com/bcgov/CITZ-HybridWorkplace', email.gen(), password.gen());
                expect(response.status).toBe(403);
            });

            test('Special characters', async () => {
                response = await users.register(characters.gen(), email.gen(), password.gen());
                expect(response.status).toBe(403);
            });
        });

        describe('Sending other things as username', () => {
            afterAll(async () => {
                await users.deleteUsers();
            });
            
            test('Null', async () => {
                response = await users.register(null, email.gen(), password.gen());
                expect(response.status).toBe(403);
            });

            test('JS object', async () => {
                response = await users.register({ payload: "object" }, email.gen(), password.gen());
                expect(response.status).toBe(403);
            });

            test('Array', async () => {
                response = await users.register(['name1', 'name2'], email.gen(), password.gen());
                expect(response.status).toBe(403);
            });
        });
    });
});
