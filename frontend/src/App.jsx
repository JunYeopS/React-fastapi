import { useEffect, useState } from 'react'
import TopBar from "./components/TopBar";
import SignupModal from "./components/SignupModal";
import LoginModal from "./components/LoginModal";
import PostingLists from "./components/PostingLists";

import './App.css'

function App() {
  const [user, setUser] = useState(null);
  const [showSignup, setShowSignup] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  // 앱 시작 시 로그인 상태 확인
  useEffect(() => {
    fetch("http://127.0.0.1:8000/auth/me", {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => setUser(data))
      .catch(() => setUser(null));
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("http://127.0.0.1:8000/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } finally {
      setUser(null);
    }
  };

  return (
    <div className="app-container">
      <TopBar 
        user={user}
        onSignupClick={() => setShowSignup(true)} 
        onLoginClick={() => setShowLogin(true)}
        onLogout={handleLogout}
      />

      <main>
        <h1>게시판</h1>
        <PostingLists />
      </main>

      {showLogin && (
        <LoginModal 
          onClose={() => setShowLogin(false)} 
          onLoginSuccess={(u) => setUser(u)}
        />
      )}

      {showSignup && (
        <SignupModal onClose={() => setShowSignup(false)} />
      )}
    </div>

  );
}

export default App
