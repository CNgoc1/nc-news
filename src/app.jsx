import "./App.css";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import ArticleList from "./components/ArticleList";
import Home from "./components/Home";
import { useState } from "react";

function App() {
  const [user, setUser] = useState(null);

  return (
    <>
      <Header />
      <Routes>
        <Route
          path="/"
          element={<Home user={user} setUser={setUser} />}
        ></Route>
        <Route path="/articles" element={<ArticleList user={user} />}></Route>
      </Routes>
    </>
  );
}

export default App;
