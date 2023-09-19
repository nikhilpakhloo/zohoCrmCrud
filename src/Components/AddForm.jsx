import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const node_url = 'http://localhost:5000';

export default function AddForm() {
  const [formData, setFormData] = useState({
 
    First_Name: '',
    Last_Name: '',
    Phone: '',
    Email: '',
  });

  const [formErrors, setFormErrors] = useState({
    First_Name: '',
    Last_Name: '',
    Phone: '',
    Email: '',
  });
  const navigate = useNavigate()

  const handleSaveClick = (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        const newContact = {
        
          First_Name: formData.First_Name,
          Last_Name: formData.Last_Name,
          Phone: formData.Phone,
          Email: formData.Email,
        };

        axios
          .post(`${node_url}`, newContact)
          .then((response) => {
            console.log('Contact created successfully:', response.data);
           

            setFormData({
              id: Math.floor(Math.random() * 1000000),
              First_Name: '',
              Last_Name: '',
              Phone: '',
              Email: '',
            });
            navigate("/app")
          })
          .catch((error) => {
            console.error('Error creating contact:', error);
          });
      } catch (error) {
        console.error('Error adding contact:', error);
      }
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { ...formErrors };

    // Validate First Name
    if (!formData.First_Name.trim()) {
      newErrors.First_Name = 'First Name is required';
      valid = false;
    } else {
      newErrors.First_Name = '';
    }

    // Validate Last Name
    if (!formData.Last_Name.trim()) {
      newErrors.Last_Name = 'Last Name is required';
      valid = false;
    } else {
      newErrors.Last_Name = '';
    }

    // Validate Phone
    const phonePattern = /^\d{10}$/;
    if (!formData.Phone.match(phonePattern)) {
      newErrors.Phone = 'Invalid phone number (10 digits)';
      valid = false;
    } else {
      newErrors.Phone = '';
    }

    // Validate Email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.Email.match(emailPattern)) {
      newErrors.Email = 'Invalid email address';
      valid = false;
    } else {
      newErrors.Email = '';
    }

    setFormErrors(newErrors);
    return valid;
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="container w-50">
        <form onSubmit={handleSaveClick}>
          <div className="form-group m-5">
            <input
              type="text"
              className={`form-control p-2 ${
                formErrors.First_Name && 'is-invalid'
              }`}
              id="First_Name"
              placeholder="Enter your First Name"
              value={formData.First_Name}
              onChange={(e) =>
                setFormData({ ...formData, First_Name: e.target.value })
              }
            />
            {formErrors.First_Name && (
              <div className="invalid-feedback">{formErrors.First_Name}</div>
            )}
          </div>
          <div className="form-group m-5">
            <input
              type="text"
              className={`form-control p-2 ${
                formErrors.Last_Name && 'is-invalid'
              }`}
              id="Last_Name"
              placeholder="Enter your Last Name"
              value={formData.Last_Name}
              onChange={(e) =>
                setFormData({ ...formData, Last_Name: e.target.value })
              }
            />
            {formErrors.Last_Name && (
              <div className="invalid-feedback">{formErrors.Last_Name}</div>
            )}
          </div>
          <div className="form-group m-5">
            <input
              type="text"
              className={`form-control p-2 ${
                formErrors.Phone && 'is-invalid'
              }`}
              id="Phone"
              placeholder="Enter your Phone number"
              value={formData.Phone}
              onChange={(e) =>
                setFormData({ ...formData, Phone: e.target.value })
              }
            />
            {formErrors.Phone && (
              <div className="invalid-feedback">{formErrors.Phone}</div>
            )}
          </div>
          <div className="form-group m-5">
            <input
              type="email"
              className={`form-control p-2 ${
                formErrors.Email && 'is-invalid'
              }`}
              id="Email"
              placeholder="Enter your Email address"
              value={formData.Email}
              onChange={(e) =>
                setFormData({ ...formData, Email: e.target.value })
              }
            />
            {formErrors.Email && (
              <div className="invalid-feedback">{formErrors.Email}</div>
            )}
          </div>
          <div className="d-flex justify-content-center">
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
