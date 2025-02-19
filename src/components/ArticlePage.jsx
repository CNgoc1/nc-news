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
    </div>
  );
}
