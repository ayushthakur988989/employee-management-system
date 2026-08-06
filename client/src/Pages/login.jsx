import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import api from "../utils/api";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      const { data } = await api.post("/users/login", formData);
      localStorage.setItem("token", data.token);
      navigate("/home");
    } catch (requestError) {
      setError(
        requestError.response?.data?.message
        || "Cannot reach the backend. Start the server and confirm it is running on port 5000."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container-fluid auth-page">
      <div className="row min-vh-100">
        

        {/* Left Section */}
        <div
          className="col-lg-6 d-flex flex-column justify-content-center align-items-center text-white p-5 auth-hero"
          style={{
            background: "linear-gradient(135deg, #2563EB, #1E40AF)",
          }}
        >
          <img
            src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            alt="Employee"
            className="img-fluid mb-4 auth-illustration"
          />

          <h1 className="fw-bold mb-3 text-center auth-title">
            Employee Management System
          </h1>

          <p className="text-center fs-5 w-75">
            Manage employees, attendance, payroll and leave records
            efficiently with a secure management platform.
          </p>

          
        </div>

        {/* Right Section */}
        <div className="col-lg-6 col-12 d-flex justify-content-center align-items-center bg-light auth-content">

          <div
            className="card shadow-lg border-0 p-4 auth-card"
          >
            <div className="text-center mb-4">
              <h2 className="fw-bold">Welcome Back 👋</h2>
              <p className="text-muted">
                Login to your account
              </p>
            </div>

            <form onSubmit={handleLogin}>
              {error && <div className="alert alert-danger">{error}</div>}

              <div className="mb-3">
                <label className="form-label fw-semibold">
                  Email Address
                </label>

                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">
                  Password
                </label>

                <input
                  type="password"
                  className="form-control"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>

              <div className="d-flex justify-content-between mb-4">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                  />

                  <label className="form-check-label">
                    Remember Me
                  </label>
                </div>

                <Link
                  to="/forgot-password"
                  className="text-decoration-none"
                >
                  Forgot Password?
                </Link>
              </div>

              <button
                className="btn btn-primary w-100 py-2 fw-bold"
              >
                {isSubmitting ? "Logging in..." : "Login"}
              </button>

            </form>

            <div className="text-center mt-4">
              <span className="text-muted">
                Don't have an account?
              </span>

              <Link
                to="/register"
                className="text-decoration-none fw-bold ms-2"
              >
                Register
              </Link>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

export default Login;
