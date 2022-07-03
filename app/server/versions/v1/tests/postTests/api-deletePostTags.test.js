const { AuthFunctions } = require('../functions/authFunctions');
const { password, name, email } = require('../functions/randomizer');
const { PostFunctions } = require('../functions/postFunctions');
const { CommunityFunctions } = require('../functions/communityFunctions.js');

let community = new CommunityFunctions();
let auth = new AuthFunctions();
let post = new PostFunctions();


describe('Testing user\'s ability to DELETE Post Tags', () => {
    let loginResponse;
    let response;
    let postResponse;
    let userName = name.gen();
    let userPassword = password.gen();
    let communityName = name.gen();
    let randomText = name.gen();
    let tag1 = 'great';

    beforeAll(async () => {
        // Set up user
        await auth.register(userName, email.gen(), userPassword);
        loginResponse = await auth.login(userName, userPassword);

        // Create some communities
        await community.createCommunity(communityName, randomText, randomText, [{"tag": tag1, "count": 1}], loginResponse.body.token);

        // Join communities
        await community.joinCommunity(communityName, loginResponse.body.token);

        // Create some posts
        postResponse = await post.createPost(randomText, randomText, communityName, loginResponse.body.token);

        // Tag that post
        await post.setPostTags(postResponse.body._id, tag1, loginResponse.body.token);
    });

    afterAll(async ()=> {
        await post.deleteAllPosts();
        await community.deleteCommunity(communityName, loginResponse.body.token);
        await auth.deleteUsers();
    });

    test('User can delete existing post tag.', async () => {
        response = await post.deletePostTags(postResponse.body._id, loginResponse.body.token);
        expect(response.status).toBe(204);
        response = await post.getPostTags(postResponse.body._id, loginResponse.body.token);
        expect(response.body).not.toEqual(
            expect.arrayContaining([{
            "tag": tag1,
            "taggedBy": expect.any(Array),
            "_id": expect.any(String)
          }])
        );
    });

    test('User receives 403 error when post has not been tagged', async () => {
        let tempPostResponse = await post.createPost(randomText, randomText, communityName, loginResponse.body.token);
        response = await post.deletePostTags(tempPostResponse.body._id, loginResponse.body.token);
        expect(response.status).toBe(403);
    });

    test('User receives 401 error when using an invalid token', async () => {
        await post.setPostTags(postResponse.body._id, tag1, loginResponse.body.token);
        response = await post.deletePostTags(postResponse.body._id, 'invalidtokensRus');
        expect(response.status).toBe(401);
    });

    // TODO: Currently returns 400
    test('User receives 404 error when trying to delete tags from non-existant post', async () => {
        response = await post.deletePostTags('htkeiodjkfldsjifo', loginResponse.body.token);
        expect(response.status).toBe(404);
    });
});
