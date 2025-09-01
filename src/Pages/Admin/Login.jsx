import React, { useState } from 'react';
import './CSS/Login.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/admin/login', form);

      if (response.data && response.data.token) {
        localStorage.setItem('adminToken', response.data);
        const adminID = response.data.admin._id;
        localStorage.setItem('adminID', adminID);


        toast.success('Login successful!');
        setInterval(() => {

          navigate('/dashboard')
        }, 2500)
      } else {
        toast.error('Invalid login response');
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(` ${error.response.data.message}`);
      } else {
        toast.error(' Server error');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      <h2 className="admin-login-title">Admin Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          className="admin-login-input"
          type="text"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          required
        />

        <input
          className="admin-login-input"
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <button className="admin-login-button" type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <ToastContainer position="top-center" autoClose={2000} theme="colored" />
    </div>
  );
};

export default Login;
