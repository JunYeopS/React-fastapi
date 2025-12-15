function TopBar({ onSignupClick }) {
  return (
    <div className="top-bar">
      <button className="link-button">Login</button>
      <button className="primary-button" onClick={onSignupClick}>
        Signup
      </button>
    </div>
  );
}

export default TopBar;