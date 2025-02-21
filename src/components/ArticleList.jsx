import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export default function ArticleList() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const sortBy = searchParams.get("sort_by") || "created_at";
  const order = searchParams.get("order") || "desc";

  useEffect(() => {
    fetch(
      `https://api-news-lj0j.onrender.com/api/router/articles?sort_by=${sortBy}&order=${order}`
    )
      .then((response) => response.json())
      .then((data) => {
        setArticles(data);
        setLoading(false);
      })
      .catch((error) => console.log("Error fetching articles:", error));
  }, [sortBy, order]);

  function handleSortChange(event) {
    setSearchParams({ sort_by: event.target.value, order });
  }

  function handleOrderChange() {
    setSearchParams({
      sort_by: sortBy,
      order: order === "asc" ? "desc" : "asc",
    });
  }

  if (loading) {
    return <p>Loading articles...</p>;
  }

  return (
    <div>
      <div>
        <label>Sort by: </label>
        <select value={sortBy} onChange={handleSortChange}>
          <option value="created_at">Date</option>
          <option value="comment_count">Comment Count</option>
          <option value="votes">Votes</option>
        </select>
        <button onClick={handleOrderChange}>
          {order === "asc" ? "Ascending" : "Descending"}
        </button>
      </div>
      <div>
        {articles.articles.map((article) => (
          <div key={article.article_id}>
            <img src={article.article_img_url} alt={article.title} />
            <h3>{article.title}</h3>
            <span>Topic: {article.topic}</span>
            <br />
            <span>Author: {article.author}</span>
            <br />
            <span>Date: {article.created_at}</span>
            <br />
            <span>Votes: {article.votes}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
