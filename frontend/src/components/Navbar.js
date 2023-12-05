import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <Link className="navbar-brand" to="/navbar">
        <h2 style={{marginLeft:'0.8em'}}>Auto <span style={{ color: '#34a3c2' }}>I</span>nterview</h2>
      </Link>

      {/* Add the Navbar Toggle button for smaller screens */}
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarSupportedContent" style={{marginRight:'2em'}}>
        <ul className="navbar-nav ml-auto">
          <li className="nav-item active">
            <Link className="nav-link" to="/">
              Register <span className="sr-only">(current)</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/attend">
              Attend Interview
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
