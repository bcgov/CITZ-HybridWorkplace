const { AuthFunctions } = require('./functions/authFunctions');
const { password, name, email } = require('./functions/randomizer');
const { PostFunctions } = require('./functions/postFunctions');
const community = require('./functions/communityFunctions');

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
});
