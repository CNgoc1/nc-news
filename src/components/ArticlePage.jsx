import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

export default function ArticlePage() {
  const { article_id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(
      `https://api-news-lj0j.onrender.com/api/router/articles/${article_id}`
    )
      .then((response) => response.json())
      .then((data) => {
        setArticle(data.article);
        setLoading(false);
      })
      .catch((error) => console.log("Error fetching article:", error));
  }, [article_id]);

  if (loading) {
    return <p>Loading article...</p>;
  }

  if (!article) {
    return <p>Article not found.</p>;
  }
  console.log(article);
  return (
    <div>
      <h2>{article.title}</h2>
      <img src={article.article_img_url} alt={article.title} />
      <p>
        <strong>Topic:</strong> {article.topic}
      </p>
      <p>
        <strong>Author:</strong> {article.author}
      </p>
      <p>{article.body}</p>
    </div>
  );
}
