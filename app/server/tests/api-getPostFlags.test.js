const { AuthFunctions } = require('./functions/authFunctions');
const { password, name, email } = require('./functions/randomizer');
const { PostFunctions } = require('./functions/postFunctions');
const community = require('./functions/communityFunctions');

let auth = new AuthFunctions();
let post = new PostFunctions();


describe('Testing user\'s ability to GET Post Flags', () => {
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

    test('User can get existing flags made with their account - returns 200', async () => {
        await post.setPostFlags(postResponse.body._id, flags[2], loginResponse.body.token);
        await post.setPostFlags(postResponse.body._id, flags[0], loginResponse.body.token);
        response = await post.getPostFlags(postResponse.body._id, loginResponse.body.token);
        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(2);
    });

    // TODO: currently returns 400
    test('User cannot get flags with an invalid post id - returns 404', async () => {
        await post.setPostFlags(postResponse.body._id, flags[1], loginResponse.body.token);
        response = await post.getPostFlags('invalidID', loginResponse.body.token);
        expect(response.status).toBe(404);
    });

    // TODO: currently returns 401
    test('User cannot get flags with an invalid token - returns 403', async () => {
        await post.setPostFlags(postResponse.body._id, flags[4], loginResponse.body.token);
        response = await post.getPostFlags(postResponse.body._id, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyOWY4YTI3NDI0MDdmMWViZmUwZjVmMiIsInVzZXJuYW1lIjoiaGVscCIsImVtYWlsIjoiaGVscEBnb3YuYmMuY2EiLCJpYXQiOjE2NTQ3MTA4MDIsImV4cCI6MTY1NDcxMTQwMn0.xCEveZWfewI6dTmoifcqWT2Zyg0w8nzAxd9RSGiiTmA');
        expect(response.status).toBe(403);
    });
});
