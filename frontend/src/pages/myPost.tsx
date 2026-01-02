import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../lib/axios";
import { Navigate, useNavigate } from "react-router-dom";

interface Post {
  id: number;
  title: string;
  body: string;
  author: string;
  image?: string;
  tags?: string[];
  created_at: string;
}

const MyPost: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editBody, setEditBody] = useState("");
  const [editImage, setEditImage] = useState("");
  const [editTags, setEditTags] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);

  const navigate = useNavigate();

  const fetchMyPosts = async () => {
    try {
      const res = await api.get<Post[]>("/posts/myPosts");
      setPosts(res.data);
    } catch {
      setError("Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyPosts();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this post?")) return;

    try {
      await api.delete(`/posts/${id}`);
      setPosts((prev) => prev.filter((p) => p.id !== id));
    } catch {
      alert("Delete failed");
    }
  };

  const openEdit = (post: Post) => {
    setEditingPost(post);
    setEditTitle(post.title);
    setEditBody(post.body);
    setEditImage(post.image || "");
    setEditTags(post.tags ? post.tags.join(", ") : "");
  };

  const handleImageUpload = async (file: File) => {
    try {
      setUploadingImage(true);
      const formData = new FormData();
      formData.append("image", file);

      const res = await api.post("/upload/image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setEditImage(res.data.url);
    } catch {
      alert("Image upload failed");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleUpdate = async () => {
    if (!editingPost) return;
    try {
      await api.put(`/posts/${editingPost.id}`, {
        title: editTitle,
        body: editBody,
        image: editImage,
        tags: editTags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      });
      setEditingPost(null);
      fetchMyPosts();
    } catch {
      alert("Update failed");
    }
  };

  return (
    <>
      <Navbar />

      <div className="container mt-4">
        <h1 className="mb-4">My Posts</h1>

        {loading && <p>Loading...</p>}
        {error && <p className="text-danger">{error}</p>}
        {!loading && posts.length === 0 && (
          <p>You haven’t created any posts yet.</p>
        )}

        <div className="row">
          {posts.map((post) => (
            <div
              key={post.id}
              className="col-md-6 mb-4"
              style={{ cursor: "pointer" }}
              onClick={() => navigate(`/posts/${post.id}`)}
            >
              <div className="card h-100 shadow-sm rounded-4 hover-shadow">
                {post.image && (
                  <img
                    src={post.image}
                    alt={post.title}
                    className="card-img-top rounded-top-4"
                    style={{ height: 200, objectFit: "cover" }}
                  />
                )}

                <div className="card-body d-flex flex-column">
                  <h5>{post.title}</h5>
                  <p className="text-muted flex-grow-1">
                    {post.body.length > 100
                      ? post.body.slice(0, 100) + "..."
                      : post.body}
                  </p>

                  {post.tags && post.tags.length > 0 && (
                    <div className="mb-2">
                      {post.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="badge rounded-pill bg-primary bg-opacity-10 text-primary me-1"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <small className="text-muted mb-2">
                    Created: {new Date(post.created_at).toLocaleDateString()}
                  </small>

                  <div className="mt-auto d-flex gap-2">
                    <button
                      className="btn btn-sm btn-outline-primary flex-grow-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        openEdit(post);
                      }}
                    >
                      Edit
                    </button>

                    <button
                      className="btn btn-sm btn-outline-danger flex-grow-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(post.id);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {editingPost && (
          <div className="modal d-block" style={{ background: "#00000088" }}>
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5>Edit Post</h5>
                  <button
                    className="btn-close"
                    onClick={() => setEditingPost(null)}
                  />
                </div>

                <div className="modal-body">
                  <input
                    className="form-control mb-2"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    placeholder="Title"
                  />

                  <textarea
                    className="form-control mb-2"
                    rows={4}
                    value={editBody}
                    onChange={(e) => setEditBody(e.target.value)}
                    placeholder="Content"
                  />

                  <label className="form-label fw-semibold">Change Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    className="form-control mb-2"
                    onChange={(e) =>
                      e.target.files && handleImageUpload(e.target.files[0])
                    }
                  />

                  {uploadingImage && (
                    <p className="text-muted small">Uploading image...</p>
                  )}

                  {editImage && (
                    <img
                      src={editImage}
                      alt="preview"
                      className="img-fluid rounded mb-3"
                      style={{ maxHeight: 200 }}
                    />
                  )}

                  <input
                    className="form-control"
                    placeholder="Tags (comma separated)"
                    value={editTags}
                    onChange={(e) => setEditTags(e.target.value)}
                  />
                </div>

                <div className="modal-footer">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setEditingPost(null)}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={handleUpdate}
                    disabled={uploadingImage}
                  >
                    {uploadingImage ? "Uploading..." : "Save Changes"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>
        {`
          .hover-shadow:hover {
            box-shadow: 0 10px 20px rgba(0,0,0,0.15) !important;
            transition: box-shadow 0.3s ease-in-out;
          }
        `}
      </style>
    </>
  );
};

export default MyPost;
