import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../lib/axios";

interface Post {
  id: number; 
  title: string;
  body: string;
  author: string;
  category?: string;
  image?: string;
  tags?: string[];
  created_at: string; 
}

const SinglePost: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await api.get<Post>(`/posts/${id}`);
        setPost(res.data);
      } catch (err) {
        console.error("Error fetching post:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  return (
    <>
      <Navbar />

      <div className="bg-light min-vh-100 py-5">
        <div className="container" style={{ maxWidth: "820px" }}>
          {loading ? (
            <div className="text-center mt-5 fs-5 text-muted">Loading...</div>
          ) : !post ? (
            <div className="text-center mt-5 fs-5 text-danger">
              Post not found
            </div>
          ) : (
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
              {post.image && (
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-100"
                  style={{
                    height: "360px",
                    objectFit: "contain",
                  }}
                />
              )}

              <div className="card-body p-5">
                <h1 className="fw-bold mb-3">{post.title}</h1>

                <p className="text-muted mb-4">
                  By <strong>{post.author}</strong> ·{" "}
                  {new Date(post.created_at).toLocaleDateString()}
                </p>

                {post.tags && post.tags.length > 0 && (
                  <div className="mb-4">
                    {post.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="badge rounded-pill bg-primary bg-opacity-10 text-primary me-2"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                <p style={{ lineHeight: 1.8, fontSize: "1.1rem" }}>
                  {post.body}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SinglePost;
