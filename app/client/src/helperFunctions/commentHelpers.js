/**
 *
 * @author Zach Bourque
 * @param {object} comment
 * @param {string} userId
 * @returns {string} String that represents what vote the user has voted on the post
 *
 */
export const getUserVote = (userId, comment) => {
  if (comment.upvotes.users.includes(userId)) {
    return "up";
  }

  if (comment.downvotes.users.includes(userId)) {
    return "down";
  }

  return null;
};

export const reshapeCommentForFrontend = (userId, comment) => ({
  ...comment,
  userVote: getUserVote(userId, comment),
});

export const reshapeCommentsForFrontend = (userId, comments) =>
  comments.map((comment) => reshapeCommentForFrontend(userId, comment));
