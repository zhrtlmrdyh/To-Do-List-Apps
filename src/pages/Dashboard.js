import React, { useEffect, useState } from 'react';
import API from '../api/api';
import { useNavigate } from 'react-router-dom';
import { logout } from '../utils/auth'; 
import '../styles/Dashboard.css';

export default function Dashboard() {
  const [checklists, setChecklists] = useState([]);
  const [newChecklist, setNewChecklist] = useState('');
  const [loading, setLoading] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      fetchChecklists();
    }
  }, []);

  const fetchChecklists = async () => {
    setLoading(true);
    try {
      const res = await API.get('/checklist');
      setChecklists(res.data.data);
    } catch (err) {
      alert('Gagal mengambil checklist');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!newChecklist.trim()) return;
    setCreateLoading(true);
    try {
      await API.post('/checklist', { name: newChecklist.trim() });
      setNewChecklist('');
      fetchChecklists();
    } catch (err) {
      alert('Gagal menambahkan checklist');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus checklist ini?')) return;
    try {
      await API.delete(`/checklist/${id}`);
      fetchChecklists();
    } catch (err) {
      alert('Gagal menghapus checklist');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleCreate();
    }
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <h1 className="dashboard-title">
            <span className="title-icon">📋</span>
            Dashboard Checklist
          </h1>
          <button
            onClick={() => logout(navigate)}
            className="logout-button"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="dashboard-content">
        {/* Add New Checklist Section */}
        <div className="add-checklist-section">
          <h2 className="section-title">Buat Checklist Baru</h2>
          <div className="add-checklist-form">
            <input
              type="text"
              placeholder="Masukkan nama checklist..."
              value={newChecklist}
              onChange={(e) => setNewChecklist(e.target.value)}
              onKeyPress={handleKeyPress}
              className="checklist-input"
              disabled={createLoading}
            />
            <button
              onClick={handleCreate}
              className="add-button"
              disabled={createLoading || !newChecklist.trim()}
            >
              {createLoading ? (
                <>
                  <span className="loading-spinner"></span>
                  Menambah...
                </>
              ) : (
                <>
                  <span className="button-icon">➕</span>
                  Tambah
                </>
              )}
            </button>
          </div>
        </div>

        {/* Checklists Section */}
        <div className="checklists-section">
          <h2 className="section-title">Daftar Checklist Anda</h2>
          
          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner large"></div>
              <p>Memuat checklist...</p>
            </div>
          ) : checklists.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📝</div>
              <h3>Belum Ada Checklist</h3>
              <p>Mulai dengan membuat checklist pertama Anda di atas!</p>
            </div>
          ) : (
            <div className="checklists-grid">
              {checklists.map((checklist) => (
                <div key={checklist.id} className="checklist-card">
                  <div className="card-header">
                    <h3 className="checklist-name">{checklist.name}</h3>
                    <div className="checklist-meta">
                      <span className="checklist-id">ID: {checklist.id}</span>
                    </div>
                  </div>
                  
                  <div className="card-actions">
                    <button
                      onClick={() => navigate(`/checklist/${checklist.id}`)}
                      className="action-button primary"
                    >
                      <span className="button-icon">👁️</span>
                      Detail
                    </button>
                    <button
                      onClick={() => handleDelete(checklist.id)}
                      className="action-button danger"
                    >
                      <span className="button-icon">🗑️</span>
                      Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}