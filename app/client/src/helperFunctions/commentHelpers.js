/**
 *
 * @author Zach Bourque
 * @param {object} comment
 * @param {string} userId
 * @returns {string} String that represents what vote the user has voted on the post
 *
 */
export const getUserVote = (comment, userId) => {
  if (comment.upvotes.users.includes(userId)) {
    return "up";
  }

  if (comment.downvotes.users.includes(userId)) {
    return "down";
  }

  return null;
};

export const reshapeCommentForFrontend = (comment, userId) => ({
  ...comment,
  userVote: getUserVote(comment, userId),
});

export const reshapeCommentsForFrontend = (comments, userId) =>
  comments.map((comment) => ({
    ...comment,
    userVote: getUserVote(comment, userId),
  }));
