/**
 *
 * @param {String} userId
 * @param {Object} post
 * @returns Boolean representing if the user is the creator of the given post
 */
export const isUserPostCreator = (userId, post) => {
  return post.creator === userId;
};

/**
 *
 * @param {String} userId
 * @param {Object} post
 * @returns Post Object with a userIsCreator boolean
 * @todo Add more simplified fields in the post object to aid in use of data
 */
export const reshapePostForFrontend = (userId, post) => {
  return {
    ...post,
    userIsCreator: isUserPostCreator(userId, post),
  };
};

/**
 *
 * @param {String} userId
 * @param {Array} post
 * @returns Array of post objects with a userIsCreatr boolean on each object
 * @todo Add more simplified fields in the post objects to aid in use of data
 *
 */
export const reshapePostsForFrontend = (userId, posts) => {
  return posts.map((post) => ({
    ...post,
    userIsCreator: isUserPostCreator(userId, post),
  }));
};
