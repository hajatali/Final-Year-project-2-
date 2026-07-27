import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate successful registration
    alert("Account created successfully! Please login.");
    navigate("/"); // Redirect back to Login page
  };

  return (
    <div className="container-fluid vh-100">
      <div className="row h-100">

        {/* Left Side Branding */}
        <div className="col-md-6 d-flex flex-column justify-content-center align-items-center bg-primary text-white">
          <h1 className="display-4 fw-bold">Data Guard</h1>
          <p className="lead text-center px-4">
            Join Secure Information Analysis & Management System
          </p>
        </div>

        {/* Right Side Signup Form */}
        <div className="col-md-6 d-flex justify-content-center align-items-center">
          <div className="card shadow p-4" style={{ width: "400px" }}>
            <h2 className="text-center mb-4">Create Account</h2>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Create a password"
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary w-100">
                Sign Up
              </button>
            </form>

            <p className="text-center mt-3">
              Already have an account?{" "}
              <Link to="/">Login</Link>
            </p>

          </div>
        </div>

      </div>
    </div>
  );
}

export default Signup;