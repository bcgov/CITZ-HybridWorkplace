/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable node/no-unpublished-require */
/* eslint-disable class-methods-use-this */
const supertest = require("supertest");

const endpoint = process.env.API_REF;
const request = supertest(endpoint);

class CommentFunctions {
  createComment(message, post, token) {
    return request
      .post("/comment")
      .set({ authorization: `Bearer ${token}` })
      .send({ message, post });
  }

  getCommentsByPost(postId, token) {
    return request
      .get(`/comment/post/${postId}`)
      .set({ authorization: `Bearer ${token}` });
  }

  getCommentsById(id, token) {
    return request
      .get(`/comment/${id}`)
      .set({ authorization: `Bearer ${token}` });
  }

  patchComment(id, newMessage, newPost, token) {
    return request
      .patch(`/comment/${id}`)
      .set({ authorization: `Bearer ${token}` })
      .send({ message: newMessage, post: newPost });
  }

  deleteComment(id, token) {
    return request
      .delete(`/comment/${id}`)
      .set({ authorization: `Bearer ${token}` });
  }

  setCommentReply(id, message, token) {
    return request
      .post(`/comment/reply/${id}`)
      .set({ authorization: `Bearer ${token}` })
      .send({ message });
  }

  getCommentsReply(id, token) {
    return request
      .get(`/comment/reply/${id}`)
      .set({ authorization: `Bearer ${token}` });
  }

  setCommentVote(id, vote, token) {
    return request
      .get(`/comment/vote/${id}`)
      .set({ authorization: `Bearer ${token}` })
      .query(`vote=${vote}`);
  }
}

module.exports = { CommentFunctions };
