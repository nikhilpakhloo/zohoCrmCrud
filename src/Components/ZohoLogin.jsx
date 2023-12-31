import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


const ZohoLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const [loggedIn, setLoggedIn] = useState(false);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  //----------------------------------getAuth from node server---------------------------------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/authenticate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        const { token } = data;

        // Store the token in local storage for future requests
        localStorage.setItem('token', token);

        navigate('/app');
      } else {
        alert('Invalid credentials. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while logging in. Please try again later.');
    }
  };
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login'); 
  };



  return (
    <>


      <div className="login d-flex align-items-center">
        <div className="container mt-5 " >
          <div className="row justify-content-center">
            <div className="col-md-6">
              <div className="card">
                <div className="card-body">
                  <h2 className="text-center mb-4">Zoho CRM Login</h2>
                  <form onSubmit={handleSubmit}>
                    <div className="form-group mt-3">
                      <label>Email:</label>
                      <input
                        type="email"
                        className="form-control"
                        placeholder="Enter your email"
                        value={email}
                        onChange={handleEmailChange}
                        required
                      />
                    </div>
                    <div className="form-group mt-3">
                      <label>Password:</label>
                      <input
                        type="password"
                        className="form-control"
                        placeholder="Enter your password"
                        value={password}
                        onChange={handlePasswordChange}
                        required
                      />
                    </div >
                    <div className='d-flex justify-content-center'>
                      <button type="submit" className="btn btn-primary btn-block mt-3 ">Log In</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>


          </div>

        </div>

      </div>
    </>
  );
};


export default ZohoLogin;
