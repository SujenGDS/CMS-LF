import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../lib/axios";

const Post: React.FC = () => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  // const [category, setCategory] = useState("");
  const [image, setImage] = useState("");
  const [tags, setTags] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      await api.post("/posts", {
        title,
        body,
        // category,
        image,
        tags: tags ? tags.split(",").map((tag) => tag.trim()) : [],
      });

      navigate("/my-posts");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await api.post("/upload/image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log(res.data.url);
      setImage(res.data.url); // set the image URL in your post
    } catch (err) {
      console.error("Upload failed", err);
    }
  };

  return (
    <>
      <Navbar />

      <div className="bg-light min-vh-100 py-5">
        <div className="container" style={{ maxWidth: "760px" }}>
          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-body p-5">
              <h3 className="fw-bold mb-2">Create a New Post </h3>
              <p className="text-muted mb-4">
                Share your thoughts with the world
              </p>

              {error && <div className="alert alert-danger py-2">{error}</div>}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-medium">Title *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter a title"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-medium">Content *</label>
                  <textarea
                    className="form-control"
                    rows={6}
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="Write your post content here..."
                    required
                  />
                </div>

                {/* <div className="mb-3">
                  <label className="form-label fw-medium">Category</label>
                  <input
                    type="text"
                    className="form-control"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="e.g. Tech, Life, Travel"
                  />
                </div> */}

                <div className="mb-3">
                  <label className="form-label">Upload Image</label>
                  <input
                    type="file"
                    className="form-control"
                    accept="image/png, image/jpeg" // restrict to jpg/png
                    onChange={handleImageChange}
                  />
                  {image && (
                    <img
                      src={image}
                      alt="Preview"
                      className="mt-2"
                      style={{ width: "100%" }}
                    />
                  )}
                </div>

                <div className="mb-4">
                  <label className="form-label fw-medium">
                    Tags <small className="text-muted">(comma separated)</small>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="react, design, cms"
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100 py-2 fw-semibold"
                  disabled={loading}
                >
                  {loading ? "Creating..." : "Create Post"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Post;
