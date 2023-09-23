import { useState, useEffect } from 'react';
import './index.css';
import { Link, Outlet } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import jwt_decode from 'jwt-decode';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const [bg, setbg] = useState({
    backgroundColor: 'white',
    color: 'black',
  });
  const toggle = () => {
    if (bg.backgroundColor === 'white') {
      setbg({
        backgroundColor: 'black',
        color: 'white',
      });
    } else {
      setbg({
        backgroundColor: 'white',
        color: 'black',
      });
    }
  };
  const navigate = useNavigate();

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.setItem('logoutFlag', 'true');
    navigate('/login');
  };

  // Check if the token is expired
  const isTokenExpired = () => {
    const token = localStorage.getItem('token');
    if (!token) return true;
    const decodedToken = jwt_decode(token);
    const currentTime = Date.now() / 1000;
    return decodedToken.exp < currentTime;
  };
  const isLoggedOut = localStorage.getItem('logoutFlag') === 'true';
  useEffect(() => {
    if (isTokenExpired()) {
      handleLogout();
    }
  }, [isLoggedOut, navigate]);

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      <div className="App" style={bg}>
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
          <a className="navbar-brand" href="#">
            CRM
          </a>
          <button
            className="navbar-toggler"
            type="button"
            onClick={toggleMenu}
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div
            className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`}
          >
            <ul className="navbar-nav ml-auto">
              <li className="nav-item active">
                <Link
                  className="nav-link"
                  to="/app"
                  onClick={closeMenu}
                >
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link"
                  href="#"
                  onClick={closeMenu} 
                >
                  Leads
                </a>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link"
                  to="/app/add"
                  onClick={closeMenu} 
                >
                  Add Contacts
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link"
                  to="#"
                  onClick={closeMenu} 


                >
                  Accounts
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link"
                  to="#"
                  onClick={closeMenu} 

                 
                >
                  Deals
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link"
                  to="#"
                  onClick={closeMenu} 

          
                >
                  Meetings
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link"
                  to="#"
                  onClick={closeMenu} 

                
                >
                  Reports
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link"
                  to="#"
                  onClick={closeMenu} 

                
                >
                  Services
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link"
                  to="#"
                  onClick={closeMenu} 

                 
                >
                  Projects
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link"
                  to="#"
                  onClick={closeMenu} 

                  
                >
                  ...
                </Link>
              </li>
              <li className="nav-item">
                <button
                  className="btn btn-secondary btn-sm mt-1"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
          <div className="form-check form-switch ms-3">
            <input
              className="form-check-input"
              type="checkbox"
              role="switch"
              id="flexSwitchCheckDefault"
              onClick={toggle}
            />
          </div>
        </nav>

        <Outlet />
      </div>
    </>
  );
}

export default App;
