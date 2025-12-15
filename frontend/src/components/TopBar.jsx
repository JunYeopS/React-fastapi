function TopBar({ user, onSignupClick, onLoginClick, onLogout }) {
  return (
    <div className="top-bar">
      {user ? (
        <>
          <span>{user.username}</span>
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