import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../../api";

export default function ArticlePage() {
  const { article_id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [votes, setVotes] = useState(0);
  const [hasVoted, setHasVoted] = useState(false);
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    api("GET", `/router/articles/${article_id}`)
      .then((response) => {
        if (response && response.data) {
          setArticle(response.data.article);
          setVotes(response.data.article.votes);
          setLoading(false);
        }
      })
      .catch(() => {
        setError("Error fetching article.");
        setLoading(false);
      });
  }, [article_id]);

  if (loading) {
    return <p>Loading article...</p>;
  }

  if (!article) {
    return <p>Article not found.</p>;
  }

  function handleVote(voteChange) {
    if (hasVoted === voteChange) {
      setVotes((prevVotes) => prevVotes - voteChange);
      setHasVoted(null);

      api("PATCH", `/router/articles/${article_id}`, null, {
        inc_votes: -voteChange,
      }).catch(() => {
        setVotes((prevVotes) => prevVotes + voteChange);
        setHasVoted(voteChange);
        setError("Could not update vote. Please try again.");
      });
    } else {
      const previousVote = hasVoted || 0;
      setVotes((prevVotes) => prevVotes - previousVote + voteChange);
      setHasVoted(voteChange);

      api("PATCH", `/router/articles/${article_id}`, null, {
        inc_votes: voteChange - previousVote,
      }).catch(() => {
        setVotes((prevVotes) => prevVotes + previousVote - voteChange);
        setHasVoted(previousVote);
        setError("Could not update vote. Please try again.");
      });
    }
  }

  function handleCommentSubmit(event) {
    event.preventDefault();
    if (newComment.lenth === 0) return;

    setSubmitting(true);
    setError(null);
    setComments((prev) => [
      { author: "Current User", body: newComment },
      ...prev,
    ]);

    api("POST", `/router/articles/${article_id}/comments`, null, {
      body: newComment,
      username: "Current User",
    })
      .then(
        (res) =>
          res?.data?.comment &&
          setComments((prev) => [res.data.comment, ...prev.slice(1)])
      )
      .catch(() => {
        setError("Failed to post comment. Please try again.");
        setComments((prev) => prev.slice(1));
      })
      .finally(() => {
        setSubmitting(false);
        setNewComment("");
      });
  }

  return (
    <div>
      <h2>{article.title}</h2>
      <img src={article.article_img_url} alt={article.title} />
      <p>Topic: {article.topic}</p>
      <p>Author: {article.author}</p>
      <p>{article.body}</p>

      <div>
        <p>Votes: {votes}</p>
        <button onClick={() => handleVote(1)}>Upvote</button>
        <button onClick={() => handleVote(-1)}>Downvote</button>
      </div>

      <div>
        <h3>Comments</h3>
        <form onSubmit={handleCommentSubmit}>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            required
          />
          <button type="submit">
            {submitting ? "Posting..." : "Post Comment"}
          </button>
        </form>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <ul>
          {comments.map((comment, index) => (
            <li key={index}>
              {comment.author}: {comment.body}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
