import "./App.css";
import { Routes, Route } from "react-router";
import Footer from "./Footer";
import Header from "./Header";
import Home from "./Home";
import Articles from "./ArticleList";
import { useState } from "react";

function App() {
  const [user, setUser] = useState(null);

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home user={user} setUser={setUser} />} />
        <Route
          path="/articles/:article_id"
          element={<ArticleList user={user} />}
        ></Route>
      </Routes>
      <Footer />
    </>
  );
}

export default App;
