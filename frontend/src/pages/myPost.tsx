import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

interface Post {
  _id: string;
  title: string;
  body: string;
  category?: string;
  image?: string; // image URL
  tags?: string[];
}

const MyPost: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editBody, setEditBody] = useState("");
  // const [editCategory, setEditCategory] = useState("");
  const [editImage, setEditImage] = useState("");
  const [editTags, setEditTags] = useState("");

  const token = localStorage.getItem("token");

  const fetchMyPosts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/posts/myPosts", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPosts(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyPosts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      await axios.delete(`http://localhost:5000/posts/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPosts(posts.filter((p) => p._id !== id));
    } catch (err) {
      alert("Delete failed");
    }
  };

  const openEdit = (post: Post) => {
    setEditingPost(post);
    setEditTitle(post.title);
    setEditBody(post.body);
    // setEditCategory(post.category || "");
    setEditImage(post.image || "");
    setEditTags(post.tags ? post.tags.join(", ") : "");
  };

  const handleUpdate = async () => {
    if (!editingPost) return;

    try {
      await axios.put(
        `http://localhost:5000/posts/${editingPost._id}`,
        {
          title: editTitle,
          body: editBody,
          // category: editCategory,
          image: editImage,
          tags: editTags
            .split(",")
            .map((tag) => tag.trim())
            .filter((tag) => tag !== ""),
        },

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setEditingPost(null);
      fetchMyPosts();
    } catch (err) {
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
          <p>You have not created any posts yet.</p>
        )}

        {posts.map((post) => (
          <div className="card mb-3 shadow-sm" key={post._id}>
            <div className="card-body">
              <h5>{post.title}</h5>
              <p>{post.body}</p>
              {post.category && (
                <span className="badge bg-secondary me-2">{post.category}</span>
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

        {/* Edit Modal */}
        {editingPost && (
          <div className="modal d-block" style={{ background: "#00000088" }}>
            <div className="modal-dialog">
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
                  />
                  <textarea
                    className="form-control mb-2"
                    rows={4}
                    value={editBody}
                    onChange={(e) => setEditBody(e.target.value)}
                  />

                  <input
                    className="form-control mb-2"
                    placeholder="Image URL"
                    value={editImage}
                    onChange={(e) => setEditImage(e.target.value)}
                  />

                  {editImage && (
                    <img
                      src={editImage}
                      alt="preview"
                      className="img-fluid rounded mb-2"
                      style={{ maxHeight: "200px" }}
                    />
                  )}

                  <input
                    className="form-control mb-2"
                    placeholder="Tags (comma separated)"
                    value={editTags}
                    onChange={(e) => setEditTags(e.target.value)}
                  />
                  {/* <input
                    className="form-control"
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    placeholder="Category"
                  /> */}
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setEditingPost(null)}
                  >
                    Cancel
                  </button>
                  <button className="btn btn-primary" onClick={handleUpdate}>
                    Save Changes
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
