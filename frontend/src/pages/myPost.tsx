import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../lib/axios";

interface Post {
  _id: string;
  title: string;
  body: string;
  category?: string;
  image?: string;
  tags?: string[];
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

  const fetchMyPosts = async () => {
    try {
      const res = await api.get("/posts/myPosts");
      setPosts(res.data);
    } catch (err) {
      setError("Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyPosts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this post?")) return;

    try {
      await api.delete(`/posts/${id}`);
      setPosts((prev) => prev.filter((p) => p._id !== id));
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
      await api.put(`/posts/${editingPost._id}`, {
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

        {posts.map((post) => (
          <div className="card mb-3 shadow-sm" key={post._id}>
            <div className="card-body">
              <h5>{post.title}</h5>
              <p>{post.body}</p>

              {post.image && (
                <img
                  src={post.image}
                  alt="post"
                  className="img-fluid rounded mb-2"
                  style={{ maxHeight: 200 }}
                />
              )}

              <div className="mt-3">
                <button
                  className="btn btn-sm btn-outline-primary me-2"
                  onClick={() => openEdit(post)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => handleDelete(post._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}

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
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        handleImageUpload(e.target.files[0]);
                      }
                    }}
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
    </>
  );
};

export default MyPost;
