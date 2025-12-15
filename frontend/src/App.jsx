import { useState } from 'react'
import TopBar from "./components/TopBar";
import SignupModal from "./components/SignupModal";
import './App.css'

function App() {
  const [showSignup, setShowSignup] = useState(false);

  return (
    <div className="app-container">
      <TopBar onSignupClick={() => setShowSignup(true)} />

      <main>
        <h1>게시판</h1>
        <p>App main content goes here</p>
      </main>

      {showSignup && (
        <SignupModal onClose={() => setShowSignup(false)} />
      )}
    </div>
  );
}

export default App
