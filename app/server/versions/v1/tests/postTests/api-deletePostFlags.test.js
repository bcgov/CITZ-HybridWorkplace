const { AuthFunctions } = require('../functions/authFunctions');
const { password, name, email } = require('../functions/randomizer');
const { PostFunctions } = require('../functions/postFunctions');
const { CommunityFunctions } = require('../functions/communityFunctions.js');

let community = new CommunityFunctions();
let auth = new AuthFunctions();
let post = new PostFunctions();


describe('Testing user\'s ability to DELETE Post Flags', () => {
    let loginResponse;
    let response;
    let postResponse;
    let userName = name.gen();
    let userPassword = password.gen();
    let communityName = name.gen();
    let randomText = name.gen();
    let flags = ['Inappropriate', 'Hate', 'Harassment or Bullying', 'Spam', 'Misinformation', 'Against Community Rules'];

    beforeAll(async () => {
        // Set up user
        await auth.register(userName, email.gen(), userPassword);
        loginResponse = await auth.login(userName, userPassword);

        // Create some communities
        await community.createCommunity(communityName, randomText, randomText, [], loginResponse.body.token);

        // Join communities
        await community.joinCommunity(communityName, loginResponse.body.token);

        // Create some posts
        postResponse = await post.createPost(randomText, randomText, communityName, loginResponse.body.token);
    });

    afterAll(async ()=> {
        await post.deleteAllPosts();
        await community.deleteCommunity(communityName, loginResponse.body.token);
        await auth.deleteUsers();
    });

    test('User can delete flags that they set - returns 204', async () => {
        await post.setPostFlags(postResponse.body._id, flags[0], loginResponse.body.token);
        response = await post.deletePostFlags(postResponse.body._id, flags[0], loginResponse.body.token);
        expect(response.status).toBe(204);
    });

    test('If user deletes a flag when multiple are present, only the one is deleted', async () => {
        await post.setPostFlags(postResponse.body._id, flags[0], loginResponse.body.token);
        await post.setPostFlags(postResponse.body._id, flags[1], loginResponse.body.token);
        response = await post.deletePostFlags(postResponse.body._id, flags[0], loginResponse.body.token);
        expect(response.status).toBe(204);
        response = await post.getPostFlags(postResponse.body._id, loginResponse.body.token);
        let flaggedArray1 = response.body[0].flaggedBy;
        let flaggedArray2 = response.body[1].flaggedBy;
        expect(flaggedArray1).toHaveLength(0);
        expect(flaggedArray2).toHaveLength(1);
    });

    // TODO: Currently returns 403, but this isn't a restricted action, the flag just isn't there
    test('User cannot delete flags that have not been set - returns 404', async () => {
        response = await post.deletePostFlags(postResponse.body._id, flags[5], loginResponse.body.token);
        expect(response.status).toBe(404); // User has not flagged this
    });

    test('User cannot delete flags that do not exist in acceptable flags list - returns 403', async () => {
        response = await post.deletePostFlags(postResponse.body._id, 'myCustomFlag', loginResponse.body.token);
        expect(response.status).toBe(403);
    });

    // TODO: Currently returns 400, expected 404
    test('User cannot delete flags using an invalid post id - returns 404', async () => {
        await post.setPostFlags(postResponse.body._id, flags[0], loginResponse.body.token);
        response = await post.deletePostFlags('bad id', flags[0], loginResponse.body.token);
        expect(response.status).toBe(404);
    });

    test('User cannot delete flags using an invalid token - returns 401', async () => {
        await post.setPostFlags(postResponse.body._id, flags[4], loginResponse.body.token);
        response = await post.deletePostFlags(postResponse.body._id, flags[4], 'bad token');
        expect(response.status).toBe(401);
    });

    test('User cannot delete flags set by another user - returns 403', async () => {
        // Set up temp user and flag
        await auth.register('Ted', email.gen(), userPassword);
        let tempLoginResponse = await auth.login('Ted', userPassword);
        await community.joinCommunity(communityName, tempLoginResponse.body.token);
        await post.setPostFlags(postResponse.body._id, flags[5], tempLoginResponse.body.token);

        // Original user tries to delete flag
        await post.deletePostFlags(postResponse.body._id, flags[5], loginResponse.body.token);
        response = await post.getPostFlags(postResponse.body._id, loginResponse.body.token);
        let flaggedArray = response.body[0].flaggedBy;
        expect(flaggedArray).toHaveLength(1); // Should still show that 'Ted' flagged it
    });
});
