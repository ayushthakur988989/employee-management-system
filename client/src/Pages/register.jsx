import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../utils/api";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    employeeId: "",
    email: "",
    department: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    setError("");
    setIsSubmitting(true);
    try {
      const registrationData = {
        fullName: formData.fullName,
        employeeId: formData.employeeId,
        email: formData.email,
        department: formData.department,
        password: formData.password,
      };
      await api.post("/users/register", registrationData);
      navigate("/", { state: { message: "Registration successful. Please log in." } });
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
          className="col-lg-6 d-none d-lg-flex flex-column justify-content-center align-items-center text-white p-5 auth-hero"
          style={{
            background: "linear-gradient(135deg,#2563EB,#1E3A8A)",
          }}
        >
          <img
            src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            alt="employee"
            className="img-fluid mb-4 auth-illustration"
          />

          <h1 className="fw-bold text-center auth-title">Employee Management System</h1>

          <p className="text-center px-5 mt-3">
            Create your account to manage employees, attendance,
            payroll and leave records efficiently.
          </p>
        </div>

        {/* Right Section */}
        <div className="col-lg-6 d-flex justify-content-center align-items-center bg-light auth-content">

          <div
            className="card shadow-lg border-0 p-4 auth-card"
          >
            <h2 className="text-center fw-bold mb-2">
              Create Account
            </h2>

            <p className="text-center text-muted mb-4">
              Register your employee account
            </p>

            <form onSubmit={handleSubmit}>
              {error && <div className="alert alert-danger">{error}</div>}

              <div className="mb-3">
                <label className="form-label">
                  Full Name
                </label>

                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter your name"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">
                  Employee ID
                </label>

                <input
                  type="text"
                  className="form-control"
                  placeholder="EMP001"
                  name="employeeId"
                  value={formData.employeeId}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">
                  Email
                </label>

                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">
                  Department
                </label>

                <select
                  className="form-select"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Department</option>
                  <option>HR</option>
                  <option>Development</option>
                  <option>Finance</option>
                  <option>Marketing</option>
                  <option>Sales</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">
                  Password
                </label>

                <input
                  type="password"
                  className="form-control"
                  placeholder="Password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  minLength="8"
                  required
                />
                <div className="form-text">Use at least 8 characters.</div>
              </div>

              <div className="mb-4">
                <label className="form-label">
                  Confirm Password
                </label>

                <input
                  type="password"
                  className="form-control"
                  placeholder="Confirm Password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  minLength="8"
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100 py-2"
              >
                {isSubmitting ? "Registering..." : "Register"}
              </button>

            </form>

            <div className="text-center mt-4">
              Already have an account?{" "}
              <Link to="/" className="text-decoration-none fw-bold">
                Login
              </Link>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

export default Register;
