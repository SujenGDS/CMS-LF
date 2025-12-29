import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface LoginProps {
  setIsLoggedIn?: (value: boolean) => void;
}

const Login: React.FC<LoginProps> = ({ setIsLoggedIn }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("http://localhost:5000/auth/login", {
        email,
        password,
      });

      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      setIsLoggedIn && setIsLoggedIn(true);
      navigate("/home");
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center bg-light">
      <div className="container">
        <div className="row justify-content-center shadow-lg rounded overflow-hidden bg-white">
         
          <div className="col-md-6 d-none d-md-flex align-items-center justify-content-center bg-primary bg-opacity-10">
            <img
              src="cms.png"
              alt="Login illustration"
              className="img-fluid p-4"
              style={{ maxHeight: "380px" }}
            />
          </div>

    
          <div className="col-md-6 p-5">
            <h3 className="fw-bold mb-2">Welcome Back </h3>
            <p className="text-muted mb-4">Login to continue</p>

            {error && <div className="alert alert-danger py-2">{error}</div>}

            <form onSubmit={handleLogin}>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="form-label">Password</label>

                <div className="input-group">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                  />
                  <span
                    className="input-group-text bg-white"
                    style={{ cursor: "pointer" }}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <i
                      className={
                        showPassword ? "bi bi-eye-fill" : "bi bi-eye-slash-fill"
                      }
                    ></i>
                  </span>
                </div>
              </div>

              <button className="btn btn-primary w-100 py-2 fw-semibold">
                Login
              </button>
            </form>

            <p className="mt-3 text-muted text-center">
              Don’t have an account?{" "}
              <span
                className="text-primary fw-semibold"
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/register")}
              >
                Register
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
