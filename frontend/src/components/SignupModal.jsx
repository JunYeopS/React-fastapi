import { useState } from "react";

function SignupModal({ onClose }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/users/signup", {
        method: "POST",
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
        alert(err.detail || "Signup failed");
        return;
      }

      // 성공
      onClose();
      alert("Signup success");
    } catch (e) {
      alert("Network error");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Signup</h2>

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
          <button className="primary-button" onClick={handleSignup}>
            Signup
          </button>
        </div>
      </div>
    </div>
  );
}

export default SignupModal;
