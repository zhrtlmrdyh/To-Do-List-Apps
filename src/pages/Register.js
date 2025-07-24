import React, { useState } from 'react';
import API from '../api/api';
import { useNavigate } from 'react-router-dom';
import '../styles/Register.css';

export default function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(0);
  const navigate = useNavigate();

  // Fungsi untuk validasi password strength
  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return Math.min(strength, 4);
  };

  const getStrengthText = (strength) => {
    switch (strength) {
      case 0:
      case 1: return { text: 'Sangat Lemah', class: 'weak' };
      case 2: return { text: 'Lemah', class: 'fair' };
      case 3: return { text: 'Cukup Kuat', class: 'good' };
      case 4: return { text: 'Kuat', class: 'strong' };
      default: return { text: '', class: '' };
    }
  };

  // Fungsi validasi form
  const validateForm = () => {
    const errors = {};
    
    // Username validation
    if (!form.username.trim()) {
      errors.username = 'Username wajib diisi';
    } else if (form.username.trim().length < 3) {
      errors.username = 'Username minimal 3 karakter';
    } else if (form.username.trim().length > 20) {
      errors.username = 'Username maksimal 20 karakter';
    } else if (!/^[a-zA-Z0-9_]+$/.test(form.username.trim())) {
      errors.username = 'Username hanya boleh huruf, angka, dan underscore';
    }

    // Email validation
    if (!form.email.trim()) {
      errors.email = 'Email wajib diisi';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      errors.email = 'Format email tidak valid';
    }

    // Password validation
    if (!form.password) {
      errors.password = 'Password wajib diisi';
    } else if (form.password.length < 6) {
      errors.password = 'Password minimal 6 karakter';
    } else if (form.password.length > 50) {
      errors.password = 'Password maksimal 50 karakter';
    }

    // Confirm password validation
    if (!form.confirmPassword) {
      errors.confirmPassword = 'Konfirmasi password wajib diisi';
    } else if (form.password !== form.confirmPassword) {
      errors.confirmPassword = 'Password tidak cocok';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setForm({ ...form, [field]: value });
    
    // Clear error messages when user starts typing
    if (error) setError('');
    if (success) setSuccess('');
    if (fieldErrors[field]) {
      setFieldErrors({ ...fieldErrors, [field]: '' });
    }

    // Update password strength
    if (field === 'password') {
      setPasswordStrength(calculatePasswordStrength(value));
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) {
      setError('Mohon periksa kembali data yang Anda masukkan');
      return;
    }

    setLoading(true);
    
    // Prepare request data - PENTING: Jangan normalize username ke lowercase
    // Biarkan username sesuai input user untuk konsistensi dengan login
    const requestData = {
      username: form.username.trim(), // Trim saja, jangan lowercase
      email: form.email.trim().toLowerCase(), // Email boleh lowercase
      password: form.password // Jangan trim password
    };
    
    console.log('🔄 Register attempt:', {
      username: requestData.username,
      email: requestData.email,
      passwordLength: requestData.password.length,
      timestamp: new Date().toISOString()
    });

    try {
      // Send register request
      const response = await API.post('/register', requestData);
      
      console.log('✅ Register berhasil:', response.data);
      
      setSuccess(`✅ Registrasi berhasil! Akun "${requestData.username}" telah dibuat. Silakan login.`);
      
      // Clear form
      setForm({ username: '', email: '', password: '', confirmPassword: '' });
      setPasswordStrength(0);
      
      // Redirect ke login setelah 2 detik
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      
    } catch (err) {
      console.error('❌ Register Error:', err.response?.data || err.message);
      
      let errorMessage = 'Registrasi gagal! Silakan coba lagi.';
      
      if (err.response?.status === 400) {
        const backendMessage = err.response.data?.message || err.response.data?.error;
        errorMessage = backendMessage || 'Data yang dimasukkan tidak valid';
      } else if (err.response?.status === 409) {
        errorMessage = 'Username atau email sudah terdaftar';
      } else if (err.response?.status === 422) {
        errorMessage = 'Data tidak valid atau tidak lengkap';
      } else if (err.response?.status === 500) {
        errorMessage = 'Server error. Silakan coba lagi nanti.';
      } else if (err.code === 'ECONNABORTED') {
        errorMessage = 'Request timeout. Silakan coba lagi.';
      } else if (!navigator.onLine) {
        errorMessage = 'Tidak ada koneksi internet.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const strengthInfo = getStrengthText(passwordStrength);

  return (
    <div className="register-container">
      <div className="register-header">
        <h1 className="register-title">Buat Akun Baru</h1>
        <p className="register-subtitle">Bergabunglah dengan kami hari ini</p>
      </div>

      <form onSubmit={handleRegister} className="register-form">
        {error && (
          <div className="error-message">
            <strong>Oops!</strong> {error}
          </div>
        )}

        {success && (
          <div className="success-message">
            <strong>Berhasil!</strong> {success}
          </div>
        )}
        
        <div className="input-group">
          <label className="input-label">Username</label>
          <input
            placeholder="username123 (huruf, angka, underscore)"
            value={form.username}
            onChange={(e) => handleInputChange('username', e.target.value)}
            className={`register-input ${fieldErrors.username ? 'error' : ''}`}
            disabled={loading}
            autoComplete="username"
          />
          {fieldErrors.username && (
            <div className="field-error">⚠️ {fieldErrors.username}</div>
          )}
        </div>

        <div className="input-group">
          <label className="input-label">Email</label>
          <input
            placeholder="contoh@email.com"
            type="email"
            value={form.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className={`register-input ${fieldErrors.email ? 'error' : ''}`}
            disabled={loading}
            autoComplete="email"
          />
          {fieldErrors.email && (
            <div className="field-error">⚠️ {fieldErrors.email}</div>
          )}
        </div>

        <div className="input-group">
          <label className="input-label">Password</label>
          <input
            placeholder="Minimal 6 karakter"
            type="password"
            value={form.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            className={`register-input ${fieldErrors.password ? 'error' : ''}`}
            disabled={loading}
            autoComplete="new-password"
          />
          {form.password && (
            <div className="strength-meter">
              <div className={`strength-bar strength-${strengthInfo.class}`}></div>
            </div>
          )}
          {form.password && (
            <div className={`strength-text strength-${strengthInfo.class}-text`}>
              Kekuatan Password: {strengthInfo.text}
            </div>
          )}
          {fieldErrors.password && (
            <div className="field-error">⚠️ {fieldErrors.password}</div>
          )}
        </div>

        <div className="input-group">
          <label className="input-label">Konfirmasi Password</label>
          <input
            placeholder="Ulangi password yang sama persis"
            type="password"
            value={form.confirmPassword}
            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
            className={`register-input ${fieldErrors.confirmPassword ? 'error' : ''}`}
            disabled={loading}
            autoComplete="new-password"
          />
          {fieldErrors.confirmPassword && (
            <div className="field-error">⚠️ {fieldErrors.confirmPassword}</div>
          )}
        </div>

        <button type="submit" className="register-button" disabled={loading}>
          {loading && <span className="loading-spinner"></span>}
          {loading ? 'Sedang Mendaftar...' : 'Daftar Sekarang'}
        </button>

        <p className="register-login-link">
          Sudah punya akun? <a href="/login">Masuk di sini</a>
        </p>
      </form>
    </div>
  );
}