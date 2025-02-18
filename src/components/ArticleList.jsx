import React, { useState, useEffect } from "react";

export default function ArticleList() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://api-news-lj0j.onrender.com/api/router/articles")
      .then((response) => response.json())
      .then((data) => {
        setArticles(data);
        setLoading(false);
      })
      .catch((error) => console.log("Error fetching articles:", error));
  }, []);

  if (loading) {
    return <p>Loading articles...</p>;
  }

  return (
    <div>
      {articles.articles.map((article) => (
        <div key={article.article_id}>
          <img src={article.article_img_url} alt={article.title} />
          <h3>{article.title}</h3>
          <span>Topic: {article.topic}</span>
          <br />
          <span>Author: {article.author}</span>
        </div>
      ))}
    </div>
  );
}
