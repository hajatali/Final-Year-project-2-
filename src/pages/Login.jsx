import { Link } from "react-router-dom";

function Login() {
  return (
    <div className="container-fluid vh-100">
      <div className="row h-100">

        {/* Left Side */}
        <div className="col-md-6 d-flex flex-column justify-content-center align-items-center bg-primary text-white">
          <h1 className="display-4 fw-bold">Data Guard</h1>
          <p className="lead text-center px-4">
            Secure Information Analysis & Management System
          </p>
        </div>

        {/* Right Side */}
        <div className="col-md-6 d-flex justify-content-center align-items-center">
          <div className="card shadow p-4" style={{ width: "400px" }}>
            <h2 className="text-center mb-4">Login</h2>

            <form>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter your email"
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Enter your password"
                />
              </div>

              <button className="btn btn-primary w-100">
                Login
              </button>
            </form>

            <p className="text-center mt-3">
              Don't have an account?{" "}
              <Link to="/signup">Sign Up</Link>
            </p>

          </div>
        </div>

      </div>
    </div>
  );
}

export default Login;