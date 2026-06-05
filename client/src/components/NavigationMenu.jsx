function NavigationMenu({ onLogout }) {
  return (
    <div className="mb-3">
      <button className="btn btn-outline-primary me-2">
        Dashboard
      </button>

      <button
        className="btn btn-outline-danger"
        onClick={onLogout}
      >
        Logout
      </button>
    </div>
  );
}

export default NavigationMenu;