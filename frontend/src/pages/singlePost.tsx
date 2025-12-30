import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
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

const SinglePost: React.FC = () => {
  const { id } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await api.get<Post>(`/posts/${id}`);
        setPost(res.data);
      } catch (err) {
        console.error("Error fetching post", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="text-center mt-5">Loading...</div>
      </>
    );
  }

  if (!post) {
    return (
      <>
        <Navbar />
        <div className="text-center mt-5">Post not found</div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="bg-light min-vh-100 py-5">
        <div className="container" style={{ maxWidth: "820px" }}>
          <div className="card border-0 shadow-sm rounded-4">
            {post.image && (
              <img
                src={post.image}
                alt={post.title}
                className="rounded-top-4"
                style={{
                  width: "100%",
                  height: "360px",
                  objectFit: "contain",
                }}
              />
            )}

            <div className="card-body p-5">
              <h2 className="fw-bold mb-3">{post.title}</h2>

              <p className="text-muted mb-4">
                By <strong>{post.author}</strong> ·{" "}
                {new Date(post.createdAt).toLocaleDateString()}
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

              <p
                style={{
                  lineHeight: "1.8",
                  fontSize: "1.05rem",
                }}
              >
                {post.body}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SinglePost;
