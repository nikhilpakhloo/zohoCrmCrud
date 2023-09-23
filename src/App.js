import { useState, useEffect } from 'react';
import './index.css';
import { Link, Outlet } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
function App() {
  const [bg, setbg] = useState({
    backgroundColor: "white",
    color: "black"
  })
  const toggle = () => {
    if (bg.backgroundColor === "white") {
      setbg({
        backgroundColor: "black",
        color: "white"
      })
    } else {
      setbg({
        backgroundColor: "white",
        color: "black"

      })
    }
  }
  const navigate = useNavigate()

  //handle logout

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.setItem('logoutFlag', 'true');
    navigate('/login');
  };

  //istoken expired
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
  return (
    <>
      <div className="App" style={bg}>
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark" >
          <a className="navbar-brand" href="#">CRM</a>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item active">
                <Link className="nav-link" to="#">Home</Link>

              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">Leads</a>
              </li>
              <li className="nav-item">
                <Link className='nav-link' to="/app/add">Add_Contacts</Link>

              </li>
              <li className="nav-item active">
                <Link className="nav-link" to="#">Accounts</Link>

              </li>
              <li className="nav-item active">
                <Link className="nav-link" to="#">Deals</Link>

              </li>
              <li className="nav-item active">
                <Link className="nav-link" to="#">Meetings</Link>

              </li>
              <li className="nav-item active">
                <Link className="nav-link" to="#">Reports</Link>

              </li>
              <li className="nav-item active">
                <Link className="nav-link" to="#">Services</Link>

              </li>
              <li className="nav-item active">
                <Link className="nav-link" to="#">Projects</Link>

              </li>
              <li className="nav-item active">
                <Link className="nav-link" to="#">...</Link>

              </li>

            </ul>
            <div>
              <button className='btn btn-secondary btn-sm' onClick={handleLogout}>Logout</button>
            </div>

          </div>

          <div className="form-check form-switch">
            <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" onClick={toggle} />
          </div>

        </nav>
        <Outlet />


      </div>
    </>
  );
}

export default App;
