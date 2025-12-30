import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import api from "../lib/axios";

interface Post {
  _id: string;
  title: string;
  body: string;
  author: string;
  category?: string;
  image?: string;
  tags?: string[];
  createdAt: string;
}

const Home: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [search, setSearch] = useState("");
  const [refresh, setRefresh] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await api.get<Post[]>("/posts");

        const sortedPosts = res.data.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setPosts(sortedPosts);
        setFilteredPosts(sortedPosts);
      } catch (err) {
        console.error("Error fetching posts:", err);
      }
    };

    fetchPosts();
  }, [refresh]);

  useEffect(() => {
    if (!search.trim()) {
      setFilteredPosts(posts);
    } else {
      const lowerSearch = search.toLowerCase();
      setFilteredPosts(
        posts.filter(
          (post) =>
            post.title.toLowerCase().includes(lowerSearch) ||
            post.body.toLowerCase().includes(lowerSearch)
        )
      );
    }
  }, [search, posts]);

  return (
    <>
      <Navbar setRefresh={setRefresh} />

      <div className="bg-light py-5 min-vh-100">
        <div className="container">
          <h2 className="text-center fw-bold mb-4">Latest Posts </h2>

          <div className="mb-4 d-flex justify-content-center">
            <input
              type="text"
              className="form-control shadow-sm"
              style={{ maxWidth: "500px" }}
              placeholder="Search posts by title or content..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {filteredPosts.length === 0 && (
            <p className="text-center text-muted">No posts found.</p>
          )}

          <div className="row">
            {filteredPosts.map((post) => (
              <div
                key={post._id}
                className="col-md-6 col-lg-4 mb-4"
                style={{ cursor: "pointer" }}
                onClick={() => navigate(`/posts/${post._id}`)}
              >
                <div className="card h-100 border-0 shadow-sm rounded-4">
                  {post.image && (
                    <img
                      src={post.image}
                      alt={post.title}
                      className="card-img-top rounded-top-4"
                      style={{
                        width: "100%",
                        height: "200px",
                        objectFit: "cover", // ✅ correct
                      }}
                    />
                  )}

                  <div className="card-body d-flex flex-column">
                    <h5 className="fw-semibold mb-2">{post.title}</h5>

                    <p className="text-muted flex-grow-1">
                      {post.body.length > 120
                        ? post.body.slice(0, 120) + "..."
                        : post.body}
                    </p>

                    {post.tags && post.tags.length > 0 && (
                      <div className="mb-2">
                        {post.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="badge rounded-pill bg-primary bg-opacity-10 text-primary me-1"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <small className="text-muted mt-auto">
                      By <span className="fw-medium">{post.author}</span>
                      <br />
                      {new Date(post.createdAt).toLocaleDateString()}
                    </small>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
