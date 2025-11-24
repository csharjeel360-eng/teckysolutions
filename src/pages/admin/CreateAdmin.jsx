import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import Notification from '../../components/UI/Notification';
import { authAPI } from '../../services/api';

const CreateAdmin = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setNotification({ show: false, message: '', type: '' });

    try {
      const response = await authAPI.createAdmin({
        name: form.name,
        email: form.email,
        password: form.password
      });

      if (response.data?.success) {
        setNotification({ show: true, message: 'Admin created successfully. Please sign in.', type: 'success' });
        // short delay then redirect to admin login
        setTimeout(() => navigate('/admin/login'), 1200);
      } else {
        setNotification({ show: true, message: response.data?.message || 'Failed to create admin', type: 'error' });
      }
    } catch (err) {
      console.error('Create admin error', err);
      const msg = err.response?.data?.message || err.message || 'Server error while creating admin';
      setNotification({ show: true, message: msg, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12">
      <div className="w-full max-w-md bg-white p-8 rounded shadow">
        <h2 className="text-2xl font-semibold mb-4">Create Admin (Dev)</h2>

        {notification.show && (
          <Notification
            type={notification.type}
            message={notification.message}
            onClose={() => setNotification({ ...notification, show: false })}
          />
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            placeholder="Administrator name"
          />

          <Input
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            placeholder="admin@example.com"
          />

          <Input
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
            placeholder="Choose a strong password"
          />

          <div>
            <Button type="submit" variant="primary" loading={loading} className="w-full">
              Create Admin
            </Button>
          </div>
        </form>

        <div className="mt-4 text-sm text-gray-600">
          <p>After creating the admin you'll be redirected to the admin login page.</p>
          <p className="mt-2 text-xs text-red-600">Warning: this route is public; remove or protect it in production.</p>
        </div>
      </div>
    </div>
  );
};

export default CreateAdmin;
