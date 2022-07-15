export const isUserInCommunity = (userId, community) => {
  return community.members.includes(userId);
};

export const isUserModerator = (userId, community) => {
  return !!community.moderators.find((mod) => mod.userId === userId);
};

export const reshapeCommunityForFrontend = (userId, community) => {
  return {
    ...community,
    userIsInCommunity: isUserInCommunity(userId, community),
    userIsModerator: isUserModerator(userId, community),
  };
};

export const reshapeCommunitiesForFrontend = (userId, communities) => {
  return communities.map((comm) => ({
    ...comm,
    userIsInCommunity: isUserInCommunity(userId, comm),
    userIsModerator: isUserModerator(userId, comm),
  }));
};
