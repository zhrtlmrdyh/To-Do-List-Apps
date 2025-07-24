import React, { useState } from 'react';
import API from '../api/api';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Reset error state

    // Validasi form Login
    if (!form.username || !form.password) {
      setError('Username dan Password harus diisi!');
      return;
    }

    setLoading(true);
    console.log('🔄 Mengirim request login...', { username: form.username });

    try {
      const res = await API.post('/login', {
        username: form.username.trim(),
        password: form.password
      });
      
      console.log('📥 Response dari server:', res.data);

      const token = res.data?.data?.token || res.data?.token;

      if (!token) {
        throw new Error('Token tidak ditemukan dalam response');
      }

      // Clear localStorage sebelum set token baru
      localStorage.clear();
      localStorage.setItem('token', token);
      
      console.log('✅ Login berhasil. Token tersimpan');
      
      // Navigate dengan replace untuk menghindari back ke login
      navigate('/dashboard', { replace: true });
      
    } catch (err) {
      console.error('❌ Login gagal:', err);
      
      let errorMessage = 'Login gagal! Silakan coba lagi.';
      
      if (err.response?.status === 401) {
        errorMessage = 'Username atau password salah.';
      } else if (err.response?.status === 500) {
        errorMessage = 'Server error. Silakan coba lagi nanti.';
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (!navigator.onLine) {
        errorMessage = 'Tidak ada koneksi internet.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setForm({ ...form, [field]: value });
    if (error) setError(''); // Clear error when user starts typing
  };

  return (
    <div className="login-container">
      <div className="login-header">
        <h1 className="login-title">Welcome Back!</h1>
        <p className="login-subtitle">Silakan masuk ke akun Anda</p>
      </div>

      <form onSubmit={handleSubmit} className="login-form">
        {error && (
          <div className="error-message">
            <strong>Oops!</strong> {error}
          </div>
        )}
        
        <div className="input-group">
          <input
            placeholder="Masukkan username Anda"
            value={form.username}
            onChange={(e) => handleInputChange('username', e.target.value)}
            className="login-input"
            disabled={loading}
            autoComplete="username"
          />
        </div>

        <div className="input-group">
          <input
            placeholder="Masukkan password Anda"
            type="password"
            value={form.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            className="login-input"
            disabled={loading}
            autoComplete="current-password"
          />
        </div>

        <button type="submit" className="login-button" disabled={loading}>
          {loading && <span className="loading-spinner"></span>}
          {loading ? 'Sedang Masuk...' : 'Masuk'}
        </button>

        <p className="login-register-link">
          Belum punya akun? <a href="/register">Daftar sekarang</a>
        </p>
      </form>
    </div>
  );
}