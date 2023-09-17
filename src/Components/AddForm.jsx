import React, { useState, useEffect } from 'react';
import axios from 'axios';


export default function AddForm() {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        company: '',
      });
    
      const [formErrors, setFormErrors] = useState({
        name: '',
        phone: '',
        email: '',
        company: '',
      });
    
      
    
    
      const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (validateForm()) {
          try {
            const response = await axios.post('https://jsonplaceholder.typicode.com/users', formData);
            console.log('Contact added successfully:', response.data);
           
            setFormData({
              name: '',
              phone: '',
              email: '',
              company: '',
            });
          } catch (error) {
            console.error('Error adding contact:', error);
          }
        }
      };
    
      const validateForm = () => {
        let valid = true;
        const newErrors = { ...formErrors };
    
    
        const namePattern = /^[A-Za-z]+\s[A-Za-z]+$/;
        if (!formData.name.match(namePattern)) {
          newErrors.name = 'Name should contain two words with one space';
          valid = false;
        } else {
          newErrors.name = '';
        }
    
        const phonePattern = /^\d{10}$/;
        if (!formData.phone.match(phonePattern)) {
          newErrors.phone = 'Invalid phone number (10 digits)';
          valid = false;
        } else {
          newErrors.phone = '';
        }
    
     
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email.match(emailPattern)) {
          newErrors.email = 'Invalid email address';
          valid = false;
        } else {
          newErrors.email = '';
        }
    
       
        if (formData.company.trim() === '') {
          newErrors.company = ''; 
        }
    
        setFormErrors(newErrors);
        return valid;
      };
  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
    <div className="container w-50">
      <form onSubmit={handleSubmit}>
        <div className="form-group m-5">
          <input
            type="text"
            className={`form-control p-2 ${formErrors.name && 'is-invalid'}`}
            id="name"
            placeholder="Enter your name"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
          />
          {formErrors.name && (
            <div className="invalid-feedback">{formErrors.name}</div>
          )}
        </div>
        <div className="form-group m-5">
          <input
            type="text"
            className={`form-control p-2 ${formErrors.phone && 'is-invalid'}`}
            id="phone"
            placeholder="Enter your phone number"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
          />
          {formErrors.phone && (
            <div className="invalid-feedback">{formErrors.phone}</div>
          )}
        </div>
        <div className="form-group m-5">
          <input
            type="email"
            className={`form-control p-2 ${formErrors.email && 'is-invalid'}`}
            id="email"
            placeholder="Enter your email address"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
          {formErrors.email && (
            <div className="invalid-feedback">{formErrors.email}</div>
          )}
        </div>
        <div className="form-group m-5">
          <input
            type="text"
            className="form-control p-2"
            id="company"
            placeholder="Enter your company name (optional)"
            value={formData.company}
            onChange={(e) =>
              setFormData({ ...formData, company: e.target.value })
            }
          />
        </div>
        <div className='d-flex justify-content-center'>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
        </div>
      </form>
    </div>
  </div>
  )
}
