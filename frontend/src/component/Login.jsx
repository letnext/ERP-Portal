import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";


const BASE_URL=import.meta.env.VITE_BASE_URL;

const Login = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(`${BASE_URL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (data.success) {
        // Save session (optional)
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/option");
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Server error. Please try again later.");
    }
  };

  return (
    <div className="login-container">
      {/* ===== Left Section (Form) ===== */}
      <div className="login-left">
        <div className="login-box">
          <h1 className="login-heading">ERP Portal Login</h1>
          <form className="login-form" onSubmit={handleLogin}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleInputChange}
              className="login-input"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleInputChange}
              className="login-input"
              required
            />
            {error && <p className="error-message">{error}</p>}
            <button type="submit" className="login-button">
              Login
            </button>
          </form>
        </div>
      </div>

      {/* ===== Right Section (Image) ===== */}
      <div className="login-right">
        <img src="/login.jpg" alt="Login" className="login-image" />
      </div>
    </div>
  );
};

export default Login;
