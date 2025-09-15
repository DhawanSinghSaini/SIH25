import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Login.css";

export default function Login({ onClose }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await axios.post("/api/auth/login", {
        email,
        password,
      });


      localStorage.setItem("access_token", response.data.access_token);

      navigate("/dashboard");
      onClose?.(); 
    } catch (err) {
      if (err.response) {
        setError(err.response.data.detail || "Invalid credentials");
      } else {
        setError("Network error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <button className="close-button" onClick={onClose}>
          ✖
        </button>

        <h2 className="popup-title">FRA Atlas Login</h2>
        {error && (
          <div className="popup-error">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <label className="block mb-2 font-medium">Email</label>
          <input
            type="email"
            className="w-full p-2 mb-4 border border-gray-300 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label className="block mb-2 font-medium">Password</label>
          <input
            type="password"
            className="w-full p-2 mb-4 border border-gray-300 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="text-center mt-4">
          <button
            className="text-blue-600 hover:underline text-sm"
            onClick={() => navigate("/forgot-password")}
          >
            Forgot Password?
          </button>
        </div>
      </div>
    </div>
  );
}
