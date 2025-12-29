import React from "react";
import Navbar from "../components/Navbar";

interface User {
  name: string;
  email: string;
  role?: string;
  createdAt?: string;
}

const Profile: React.FC = () => {
  const user: User | null = JSON.parse(localStorage.getItem("user") || "null");

  if (!user) {
    return (
      <>
        <Navbar />
        <div className="container mt-5 text-center">
          <h4>No user data found</h4>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="bg-light min-vh-90 py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-6">
              <div className="card shadow-lg border-0 rounded-4">
                <div className="card-body text-center p-5">
                  {/* Avatar */}
                  <div
                    className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center mx-auto mb-3"
                    style={{ width: 90, height: 90, fontSize: 36 }}
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </div>

                  <h4 className="fw-bold">{user.name}</h4>
                  <p className="text-muted mb-1">{user.email}</p>

                  {user.role && (
                    <span className="badge bg-dark rounded-pill px-3 py-2">
                      {user.role}
                    </span>
                  )}

                  <hr className="my-4" />

                  {/* <div className="text-start">
                    <p className="mb-2">
                      <strong>Email:</strong> {user.email}
                    </p>
                    {user.createdAt && (
                      <p className="mb-0">
                        <strong>Joined:</strong>{" "}
                        {new Date(user.createdAt).toLocaleDateString()}
                      </p>
                    )}
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
