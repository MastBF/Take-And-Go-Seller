import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../assets/styles/Login.css"; // Стили для логина
import { BASE_URL } from "../../utils/api";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Проверка токена при загрузке страницы
  // useEffect(() => {
  //   const token = localStorage.getItem("uuidAccessToken");
  //   if (token) {
  //     navigate("/orders");
  //   }
  // }, [navigate]);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/v1/Authentication/login`,
        { email, password },
        {
          headers: {
            Accept: "*/*",
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      const token = response.data.token;
      localStorage.setItem("uuidAccessToken", token);

      if (response.status === 200) {
        navigate("/orders");
      } else {
        setError("Failed to log in. Please check your email and password.");
      }
    } catch (err) {
      console.error("Error logging in:", err);

      if (err.response && err.response.status === 405) {
        setError("Method Not Allowed: Please check the API endpoint or request method.");
      } else {
        setError("An error occurred while logging in. Please try again later.");
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>
        {error && <p className="error-message">{error}</p>}
        <div className="login-form">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <div className="password-container">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <label className="checkbox">
              <input
                type="checkbox"
                checked={showPassword}
                onChange={togglePasswordVisibility}
              />
              <span></span>
              Show Password
            </label>
          </div>
          <button type="button" onClick={handleLogin}>
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
