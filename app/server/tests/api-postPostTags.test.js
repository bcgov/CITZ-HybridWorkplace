const { AuthFunctions } = require('./functions/authFunctions');
const { password, name, email } = require('./functions/randomizer');
const { PostFunctions } = require('./functions/postFunctions');
const community = require('./functions/communityFunctions');

let auth = new AuthFunctions();
let post = new PostFunctions();


describe('Testing user\'s ability to POST Post Tags', () => {
    let loginResponse;
    let response;
    let postResponse;
    let userName = name.gen();
    let userPassword = password.gen();
    let communityName = name.gen();
    let randomText = name.gen();
    let tag1 = 'great';
    let tag2 = 'not so great';

    beforeAll(async () => {
        // Set up user
        await auth.register(userName, email.gen(), userPassword);
        loginResponse = await auth.login(userName, userPassword);

        // Create some communities
        await community.createCommunity(communityName, randomText, randomText, [{"tag": tag1, "count": 1}], loginResponse.body.token);

        // Join communities
        await community.joinCommunity(communityName, loginResponse.body.token);

        // Add available tags to community
        await community.setCommunityTags(communityName, tag2, loginResponse.body.token);

        // Create some posts
        postResponse = await post.createPost(randomText, randomText, communityName, loginResponse.body.token);
    });

    afterAll(async ()=> {
        await post.deleteAllPosts();
        await community.deleteCommunity(communityName, loginResponse.body.token);
        await auth.deleteUsers();
    });

    test('User can tag post when already defined in community tags', async () => {
        await post.setPostTags(postResponse.body._id, tag1, loginResponse.body.token);
        response = await post.getPostTags(postResponse.body._id, loginResponse.body.token);
        expect(response.status).toBe(200);
        expect(response.body).toEqual(
            expect.arrayContaining([{
            "tag": tag1,
            "taggedBy": expect.any(Array),
            "_id": expect.any(String)
          }])
        );
    });

    test('Trying to tag the post again with the same tag returns 403', async () => {
        response = await post.setPostTags(postResponse.body._id, tag1, loginResponse.body.token);
        expect(response.status).toBe(403);
        response = await post.getPostTags(postResponse.body._id, loginResponse.body.token);
        expect(response.status).toBe(200);
        expect(response.body).toEqual(
            expect.arrayContaining([{
            "tag": tag1,
            "taggedBy": expect.any(Array),
            "_id": expect.any(String)
          }])
        );
    });

    test('After trying to add a second tag, user cannot retrieve that tag as well (AKA tag not added)', async () => {
        await post.setPostTags(postResponse.body._id, tag1, loginResponse.body.token); // Just in case first test doesn't run
        response = await post.setPostTags(postResponse.body._id, tag2, loginResponse.body.token);
        expect(response.status).toBe(403);
        response = await post.getPostTags(postResponse.body._id, loginResponse.body.token);
        expect(response.status).toBe(200);
        expect(response.body).not.toEqual(
            expect.arrayContaining([{
            "tag": tag2,
            "taggedBy": expect.any(Array),
            "_id": expect.any(String)
          }])
        );
        expect(response.body).toEqual(
            expect.arrayContaining([{
            "tag": tag1,
            "taggedBy": expect.any(Array),
            "_id": expect.any(String)
          }])
        );
    });

    test('User cannot add a tag to a post if it is not defined in the community', async () => {
        response = await post.setPostTags(postResponse.body._id, 'Undefined Tag', loginResponse.body.token);
        expect(response.status).toBe(403);
        response = await post.getPostTags(postResponse.body._id, loginResponse.body.token);
        expect(response.status).toBe(200);
        expect(response.body).not.toEqual(
            expect.arrayContaining([{
            "tag": "Undefined Tag",
            "taggedBy": expect.any(Array),
            "_id": expect.any(String)
          }])
        );
    });

    test('User cannot tag post when providing a non-existant post id - returns 404', async () => {
        response = await post.setPostTags('kdls;hiowkl;sdkhflw', 'bad post id', loginResponse.body.token);
        expect(response.status).toBe(404);
    });

    test('User cannot tag post when providing an invalid user token - returns 403', async () => {
        response = await post.setPostTags(postResponse.body._id, 'bad token', 'kdslfhsdfhiuwhl');
        expect(response.status).toBe(403);
    });
});
