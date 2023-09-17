import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';


import Dashboard from './Components/Dashboard';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AddForm from './Components/AddForm';
import App from './App';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(

  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<App />}>
          <Route index element={<Dashboard />} />
          <Route path='/add' element={<AddForm />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

