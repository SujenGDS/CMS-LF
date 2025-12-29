import React, { useState, useEffect, JSX } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/login";
import Home from "./pages/home";
import MyPost from "./pages/myPost";
import Post from "./pages/post";
import Register from "./pages/register";
import SinglePost from "./pages/singlePost";
import Profile from "./pages/profile";

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    if (token && user) {
      setIsLoggedIn(true);
    }
  }, []);

  const PrivateRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
    return isLoggedIn ? children : <Navigate to="/login" />;
  };

  return (
    <Router>
      <Routes>
        {/* Login Page */}
        <Route
          path="/login"
          element={
            isLoggedIn ? (
              <Navigate to="/home" />
            ) : (
              <Login setIsLoggedIn={setIsLoggedIn} />
            )
          }
        />

        {/* Home Page - Protected */}
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />

        {/* MyPosts Page - Protected */}
        <Route
          path="/myPosts"
          element={
            <PrivateRoute>
              <MyPost />
            </PrivateRoute>
          }
        />

        <Route
          path="/post"
          element={
            <PrivateRoute>
              <Post />
            </PrivateRoute>
          }
        />

        <Route
          path="/posts/:id"
          element={
            <PrivateRoute>
              <SinglePost />
            </PrivateRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />

        <Route
          path="/register"
          element={isLoggedIn ? <Navigate to="/login" /> : <Register />}
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
