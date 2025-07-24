import React, { useEffect, useState } from 'react';
import API from '../api/api';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/ChecklistDetail.css';

export default function ChecklistDetail() {
  const { id } = useParams();
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [checklistName, setChecklistName] = useState('');
  const [loading, setLoading] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      fetchItems();
      fetchChecklistName();
    }
  }, [id]);

  const fetchChecklistName = async () => {
    try {
      const res = await API.get('/checklist');
      const checklist = res.data.data.find(c => c.id === parseInt(id));
      if (checklist) {
        setChecklistName(checklist.name);
      }
    } catch (err) {
      console.error('Gagal mengambil nama checklist');
    }
  };

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/checklist/${id}/item`);
      setItems(res.data.data || []);
    } catch (err) {
      console.error('Error fetching items:', err);
      alert('Gagal mengambil item');
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async () => {
    if (!newItem.trim()) return;
    setAddLoading(true);
    try {
      await API.post(`/checklist/${id}/item`, { itemName: newItem.trim() });
      setNewItem('');
      fetchItems();
    } catch (err) {
      console.error('Error adding item:', err);
      alert('Gagal menambah item');
    } finally {
      setAddLoading(false);
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (!window.confirm('Yakin ingin menghapus item ini?')) return;
    try {
      await API.delete(`/checklist/${id}/item/${itemId}`);
      fetchItems();
    } catch (err) {
      console.error('Error deleting item:', err);
      alert('Gagal menghapus item');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddItem();
    }
  };

  return (
    <div className="checklist-detail-container">
      {/* Header */}
      <div className="detail-header">
        <div className="header-content">
          <div className="header-info">
            <h1 className="detail-title">
              <span className="title-icon">📝</span>
              {checklistName || 'Detail Checklist'}
            </h1>
            <p className="checklist-id">ID: {id}</p>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="back-button"
          >
            <span className="button-icon">🔙</span>
            Kembali
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="detail-content">
        {/* Add New Item Section */}
        <div className="add-item-section">
          <h2 className="section-title">Tambah Item Baru</h2>
          <div className="add-item-form">
            <input
              type="text"
              placeholder="Masukkan nama item..."
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              onKeyPress={handleKeyPress}
              className="item-input"
              disabled={addLoading}
            />
            <button
              onClick={handleAddItem}
              className="add-item-button"
              disabled={addLoading || !newItem.trim()}
            >
              {addLoading ? (
                <>
                  <span className="loading-spinner"></span>
                  Menambah...
                </>
              ) : (
                <>
                  <span className="button-icon">➕</span>
                  Tambah Item
                </>
              )}
            </button>
          </div>
        </div>

        {/* Items Section */}
        <div className="items-section">
          <div className="section-header">
            <h2 className="section-title">Daftar Item</h2>
            <div className="items-count">
              {items.length} item{items.length !== 1 ? 's' : ''}
            </div>
          </div>

          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner large"></div>
              <p>Memuat item...</p>
            </div>
          ) : items.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <h3>Belum Ada Item</h3>
              <p>Mulai dengan menambahkan item pertama untuk checklist ini!</p>
            </div>
          ) : (
            <div className="items-list">
              {items.map((item, index) => (
                <div key={item.id} className="item-card">
                  <div className="item-header">
                    <div className="item-info">
                      <div className="item-number">#{index + 1}</div>
                      <div className="item-details">
                        <h3 className="item-name">{item.name}</h3>
                        <div className="item-meta">
                          <span className="item-id">ID: {item.id}</span>
                          <span className="item-status">
                            {item.itemCompletionStatus ? '✅ Selesai' : '🔲 Belum selesai'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="item-actions">
                    <button
                      onClick={() => navigate(`/checklist/${id}/item/${item.id}`)}
                      className="action-button primary"
                    >
                      <span className="button-icon">👁️</span>
                      Detail
                    </button>
                    <button
                      onClick={() => handleDeleteItem(item.id)}
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