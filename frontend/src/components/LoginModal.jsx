import { useState } from "react";

function LoginModal({ onClose,  onLoginSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/auth/login", {
        method: "POST",
        credentials: "include", // ⭐ 세션 기반 로그인
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.detail || "Login failed");
        return;
      }

      const user = await res.json();
      onLoginSuccess(user);
      // 성공
      onClose();
      alert("Login success");
    } catch (e) {
      alert("Network error");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Login</h2>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="modal-actions">
          <button onClick={onClose}>Cancel</button>
          <button className="primary-button" onClick={handleLogin}>
            Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginModal;
