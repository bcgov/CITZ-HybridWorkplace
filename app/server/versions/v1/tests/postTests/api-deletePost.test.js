const { AuthFunctions } = require('../functions/authFunctions');
const { password, name, email } = require('../functions/randomizer');
const { PostFunctions } = require('../functions/postFunctions');
const { CommunityFunctions } = require('../functions/communityFunctions.js');

let community = new CommunityFunctions();
let auth = new AuthFunctions();
let post = new PostFunctions();

describe('Testing user\'s ability to delete posts from their communities', () => {
    let loginResponse;
    let response;
    let userName = name.gen();
    let userPassword = password.gen();
    let postResponse;

    beforeAll(async () => {
        // Set up user
        await auth.register(userName, email.gen(), userPassword);
        loginResponse = await auth.login(userName, userPassword);
        // Create some communities
        await community.createCommunity('Thundercats', 'Meow', 'Always feeding time', [], loginResponse.body.token);
        // Join communities
        await community.joinCommunity('Thundercats', loginResponse.body.token);
        // Create some posts
        postResponse = await post.createPost('Thundercats Charge!', 'GOGOGO', 'Thundercats', loginResponse.body.token);
    });

    afterAll(async ()=> {
        await post.deleteAllPosts();
        await community.deleteCommunity('Thundercats', loginResponse.body.token);
        await auth.deleteUsers();
    });

    test('User can delete posts by id - returns 204', async () => {
        response = await post.deletePost(postResponse.body._id, loginResponse.body.token);
        expect(response.status).toBe(204); // Post deleted
        response = await post.getPostById(postResponse.body._id, loginResponse.body.token);
        expect(response.status).toBe(404); // Post now gone
    });

    test('User cannot delete posts with an invalid token - returns 401', async () => {
        let tempPostResponse = await post.createPost('Thundercats Charge!', 'GOGOGO', 'Thundercats', loginResponse.body.token); // Create post
        response = await post.deletePost(tempPostResponse.body._id, 'badbadbad');
        expect(response.status).toBe(401); // Post not deleted, invalid token
        response = await post.getPostById(tempPostResponse.body._id, loginResponse.body.token);
        expect(response.status).toBe(200); // Post still there
    });

    // TODO: Currently returns 400
    test('User cannot delete posts when not the author of the post - returns 403', async () => {
        await auth.register('Timmy', 'timmy@gmail.com', 'thetimster123!'); // Make new user
        let tempLoginResponse = await auth.login('Timmy', 'thetimster123!');
        postResponse = await post.createPost('Thundercats Charge!', 'GOGOGO', 'Thundercats', tempLoginResponse.body.token); // New user posts

        response = await post.deletePost(postResponse.body._id, loginResponse.body.token); // Original user tries to delete
        expect(response.status).toBe(403); // Post not deleted
    });

    // TODO: Currently returns 400
    test('User cannot delete posts when not part of the community - returns 403', async () => {
        let tempLoginResponse = await auth.login('Timmy', 'thetimster123!'); // Log in as new user
        postResponse = await post.createPost('Thundercats Charge!', 'GOGOGO', 'Thundercats', tempLoginResponse.body.token); // Post
        await community.leaveCommunity('Thundercats', tempLoginResponse.body.token); // Leave community
        response = await post.deletePost(postResponse.body._id, tempLoginResponse.body.token); // Try to delete post
        expect(response.status).toBe(403); // Post not deleted
    });

    test('User cannot delete posts with an invalid id - returns 404', async () => {
        response = await post.deletePost('showmeyourid', loginResponse.body.token);
        expect(response.status).toBe(404); // Post does not exist
    });
});
