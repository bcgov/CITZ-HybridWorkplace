const { AuthFunctions } = require('./functions/authFunctions');
const { password, name, email } = require('./functions/randomizer');
const { PostFunctions } = require('./functions/postFunctions');
const community = require('./functions/communityFunctions');

let auth = new AuthFunctions();
let post = new PostFunctions();

describe('Testing user\'s ability to make posts', () => {
    let loginResponse;
    let response;
    let userName = name.gen();
    let userPassword = password.gen();

    beforeAll(async () => {
        await auth.register(userName, email.gen(), userPassword);
        loginResponse = await auth.login(userName, userPassword);
    });

    afterAll(async ()=> {
        await post.deleteAllPosts();
        await auth.deleteUsers();
    })

    test('Post can successfully be created - returns 201', async () => {
        response = await post.createPost('My first post', 'Check this out', 'Welcome', loginResponse.body.token);
        expect(response.status).toBe(201);
    });

    test('Post that matches existing post fails - returns 403', async () => {
        response = await post.createPost('My first post', 'Check this out', 'Welcome', loginResponse.body.token);
        expect(response.status).toBe(403);
    });

    test('Post with non-existant community fails - returns 404', async () => {
        response = await post.createPost('My first post', 'Check this out', 'SonicOCFanclub', loginResponse.body.token);
        expect(response.status).toBe(404);
    });

    test('Post on community user doesn\'t belong to fails - returns 403', async () => {
        await community.createCommunity('TempCommunity', 'test', 'no rules', [], loginResponse.body.token)
        response = await post.createPost('My first post', 'Check this out', 'matt', loginResponse.body.token);
        await community.deleteCommunity('TempCommunity', loginResponse.body.token);
        expect(response.status).toBe(403);
    });

    test('Post when user is not logged in fails - returns 401', async () => {
        response = await post.createPost('My last post', 'Check this out', 'Welcome', 'noToken');
        expect(response.status).toBe(401);
    });
});

describe('Testing posts with unexpected inputs', () => {
    let loginResponse;
    let response;
    let userName = name.gen();
    let userPassword = password.gen();

    beforeAll(async () => {
        await auth.register(userName, email.gen(), userPassword);
        loginResponse = await auth.login(userName, userPassword);
    });

    afterAll(async ()=> {
        await post.deleteAllPosts();
        await auth.deleteUsers();
    })

    test('Post creation is refused when a bad token is given - returns 403', async () => {
        response = await post.createPost('My first post', 'Check this out', 'Welcome', 'mybadtoken');
        expect(response.status).toBe(403);
    });

    test('Post creation is refused when an empty string for a title is given - returns 403', async () => {
        response = await post.createPost('', 'Check this out', 'Welcome', loginResponse.body.token);
        expect(response.status).toBe(403);
    });

    test('Post creation is refused when a non-existant community is given - returns 404', async () => {
        response = await post.createPost('My last post', 'Check this out', 'DogsOnFrogs', loginResponse.body.token);
        expect(response.status).toBe(404);
    });
});
