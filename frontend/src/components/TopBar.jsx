import { useNavigate } from "react-router-dom";

function TopBar({ user, onSignupClick, onLoginClick, onLogout}) {
    
  const navigate = useNavigate();
  
  return (
    <div className="top-bar">
      {user ? (
        <>
          <span>{user.username}</span>
          <button className="primary-button" onClick={() => navigate("/posting")}>
            Post
          </button>
          <button className="primary-button" onClick={onLogout}>
            Logout
          </button>
        </>
      ) : (
        <>
            <button className="link-button" onClick={onLoginClick}>
                Login
                </button>
            <button className="primary-button" onClick={onSignupClick}>
                Signup
                </button>
        </>
      )}
    </div>
  );
}

export default TopBar;
