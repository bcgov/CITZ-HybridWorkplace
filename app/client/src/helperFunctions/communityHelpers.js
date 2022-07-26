/**
 *
 * @param {String} userId
 * @param {Object} community
 * @returns Boolean representing if the user is in the given community
 */
export const isUserInCommunity = (userId, community) => {
  return community.members.includes(userId);
};

/**
 *
 * @param {String} userId
 * @param {Object} community
 * @returns Boolean representing if the user is a moderator of the given community
 */
export const isUserModerator = (userId, community) => {
  return !!community.moderators.find((mod) => mod.userId === userId);
};

/**
 *
 * @param {String} userId
 * @param {Object} community
 * @returns Community Object with a userIsInCommunity boolean and a userIsModerator boolean
 * @todo //TODO: Add more simplified fields in the community object to aid in use of data
 */
export const reshapeCommunityForFrontend = (userId, community) => {
  return {
    ...community,
    userIsInCommunity: isUserInCommunity(userId, community),
    userIsModerator: isUserModerator(userId, community),
  };
};

/**
 *
 * @param {String} userId
 * @param {Array} communities
 * @returns Array of community objects with userIsInCommunity and userIsModerator boolean on each object
 * @todo //TODO: Add more simplified fields in the community object to aid in use of data
 */
export const reshapeCommunitiesForFrontend = (userId, communities) => {
  return communities.map((comm) => reshapeCommunityForFrontend(userId, comm));
};
