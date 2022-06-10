const { AuthFunctions } = require('../functions/authFunctions');
const { password, name, email } = require('../functions/randomizer');
const { PostFunctions } = require('../functions/postFunctions');
const { CommunityFunctions } = require('../functions/communityFunctions.js');

let community = new CommunityFunctions();
let auth = new AuthFunctions();
let post = new PostFunctions();

describe('Testing user\'s ability to get posts from their communities', () => {
    let loginResponse;
    let response;
    let userName = name.gen();
    let userPassword = password.gen();

    beforeAll(async () => {
        // Set up user
        await auth.register(userName, email.gen(), userPassword);
        loginResponse = await auth.login(userName, userPassword);
        // Create some communities
        await community.createCommunity('Thundercats', 'Meow', 'Always feeding time', [], loginResponse.body.token);
        await community.createCommunity('Skeletor\'s Revenge', 'What?', 'No He-man', [], loginResponse.body.token);
        // Join communities
        await community.joinCommunity('Thundercats', loginResponse.body.token);
        await community.joinCommunity('Skeletor\'s Revenge', loginResponse.body.token);
        // Create some posts
        await post.createPost('Thundercats GO!', 'GOGOGO', 'Thundercats', loginResponse.body.token);
        await post.createPost('He-man No!', 'Ahahah', 'Skeletor\'s Revenge', loginResponse.body.token);
    });

    afterAll(async ()=> {
        await post.deleteAllPosts();
        await community.deleteCommunity('Thundercats', loginResponse.body.token);
        await community.deleteCommunity('Skeletor\'s Revenge', loginResponse.body.token);
        await auth.deleteUsers();
    });

    test('All posts are returned upon request - returns 200', async () => {
        response = await post.getAllPosts(loginResponse.body.token);
        expect(response.status).toBe(200);
        let post1, post2;
        response.body.forEach(element => {
            if (element.title == 'Thundercats GO!')
                post1 = true;
            if (element.title == 'He-man No!')
                post2 = true;
        });
        expect(post1).toBe(true);
        expect(post2).toBe(true);
    });

    test('Post with specific ID is returned - returns 200', async () => {
        let postResponse = await post.createPost('Meow Mix', 'Please deliver', 'Thundercats', loginResponse.body.token);
        let id = postResponse.body._id;
        response = await post.getPostById(id, loginResponse.body.token);
        expect(response.status).toBe(200);
    });

    // TODO: Currently returns 400
    test('Post with a non-existant id is not returned - returns 404', async () => {
        response = await post.getPostById('whoablackbetty', loginResponse.body.token);
        expect(response.status).toBe(404);
    });

    test('Post is not returned when using invalid token - returns 401', async () => {
        let postResponse = await post.createPost('Meow Mix', 'Please deliver', 'Thundercats', loginResponse.body.token);
        let id = postResponse.body._id;
        response = await post.getPostById(id, 'mytokenisnotgood');
        expect(response.status).toBe(401);
    });

    // TODO: Currently returns 401, but user is authorized, just not for this.
    test('Post is not returned if user is not part of that community - returns 403', async () => {
        let postResponse = await post.createPost('Meow Mix', 'Please deliver', 'Thundercats', loginResponse.body.token);
        let id = postResponse.body._id;
        await auth.register('Pete', 'pete@gmail.com', userPassword);
        let tempLoginResponse = await auth.login('Pete', 'pete@gmail.com');
        response = await post.getPostById(id, tempLoginResponse.body.token);
        expect(response.status).toBe(403);
    });
});
