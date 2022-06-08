const { AuthFunctions } = require('./functions/authFunctions');
const { password, name, email } = require('./functions/randomizer');
const { PostFunctions } = require('./functions/postFunctions');
const community = require('./functions/communityFunctions');

let auth = new AuthFunctions();
let post = new PostFunctions();

describe('Testing user\'s ability to edit posts from their communities', () => {
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

    test('User can edit posts by id - returns 204', async () => {
        response = await post.editPost(postResponse.body._id, 'Thundercats Retreat!', 'Hijacked', 'Thundercats', loginResponse.body.token);
        expect(response.status).toBe(204); // Post edited
        response = await post.getPostById(postResponse.body._id, loginResponse.body.token);
        expect(response.body.title).toBe('Thundercats Retreat!'); // Post title should match updated title
    });

    test('User cannot edit posts with an invalid id - returns 404', async () => {
        response = await post.editPost('D78943207', 'Thundercats Retreat!', 'Hijacked', 'Thundercats', loginResponse.body.token);
        expect(response.status).toBe(404); // Post not edited
    });

    test('User cannot edit posts where the community does not exist - returns 404', async () => {
        response = await post.editPost(postResponse.body._id, 'Thundercats Retreat!', 'Hijacked', 'BobsBurgers', loginResponse.body.token);
        expect(response.status).toBe(404); // Post not edited
    });

    test('User cannot edit posts where token is invalid - returns 403', async () => {
        response = await post.editPost(postResponse.body._id, 'Thundercats Retreat!', 'Hijacked', 'Thundercats', 'flip those burgers');
        expect(response.status).toBe(403); // Post not edited
    });

    test('User cannot edit posts where the user is no longer in the community - returns 403', async () => {
        await community.leaveCommunity('Thundercats', loginResponse.body.token);
        response = await post.editPost(postResponse.body._id, 'Thundercats Retreat!', 'Hijacked', 'Thundercats', loginResponse.body.token);
        expect(response.status).toBe(403); // Post not edited
    });
});
