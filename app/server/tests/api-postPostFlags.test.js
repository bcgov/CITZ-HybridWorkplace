const { AuthFunctions } = require('./functions/authFunctions');
const { password, name, email } = require('./functions/randomizer');
const { PostFunctions } = require('./functions/postFunctions');
const { CommunityFunctions } = require('./functions/communityFunctions.js');

let community = new CommunityFunctions();
let auth = new AuthFunctions();
let post = new PostFunctions();


describe('Testing user\'s ability to POST Post Flags', () => {
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

    test('User can flag posts with flags that exist in dropdown', async () => {
        response = await post.setPostFlags(postResponse.body._id, flags[2], loginResponse.body.token);
        expect(response.status).toBe(204);
        response = await post.getPostFlags(postResponse.body._id, loginResponse.body.token);
        expect(response.body).toEqual(
            expect.arrayContaining([{
            "_id": expect.any(String),
            "flag": flags[2],
            "flaggedBy": expect.any(Array)
          }])
        );
    });

    test('User cannot flag posts with flags that do not exist in dropdown - returns 403', async () => {
        response = await post.setPostFlags(postResponse.body._id, `I just don't like them`, loginResponse.body.token);
        expect(response.status).toBe(403);
        response = await post.getPostFlags(postResponse.body._id, loginResponse.body.token);
        expect(response.body).not.toEqual(
            expect.arrayContaining([{
            "_id": expect.any(String),
            "flag": `I just don't like them`,
            "flaggedBy": expect.any(Array)
          }])
        );
    });

    test('User can flag posts multiple times, but flag only added if unique - returns 204', async () => {
        // Trying to add same tag
        await post.setPostFlags(postResponse.body._id, flags[3], loginResponse.body.token);
        response = await post.setPostFlags(postResponse.body._id, flags[3], loginResponse.body.token);
        expect(response.status).toBe(204);
        response = await post.getPostFlags(postResponse.body._id, loginResponse.body.token);
        expect(response.body).toEqual(
            expect.arrayContaining([{
            "_id": expect.any(String),
            "flag": flags[3],
            "flaggedBy": expect.any(Array)
          }])
        );
        expect(response.body).toHaveLength(1);
        // Second, unique tag added
        response = await post.setPostFlags(postResponse.body._id, flags[4], loginResponse.body.token);
        expect(response.status).toBe(204);
        response = await post.getPostFlags(postResponse.body._id, loginResponse.body.token);
        expect(response.body).toEqual(
            expect.arrayContaining([{
            "_id": expect.any(String),
            "flag": flags[4],
            "flaggedBy": expect.any(Array)
          }])
        );
        expect(response.body).toHaveLength(2);
    });

    // TODO: currently returns 400
    test('User cannot flag posts using an invalid post id - returns 404', async () => {
        response = await post.setPostFlags('jjdoijoj324jk', flags[0], loginResponse.body.token);
        expect(response.status).toBe(404);
    });

    test('User cannot flag posts using an invalid token - returns 403', async () => {
        response = await post.setPostFlags(postResponse.body._id, flags[0], 'invalidToken');
        expect(response.status).toBe(403);
    });
});
