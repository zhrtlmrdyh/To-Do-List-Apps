import React, { useEffect, useState } from 'react';
import API from '../api/api';
import { useParams, useNavigate } from 'react-router-dom';

export default function ItemDetail() {
  const { id, itemId } = useParams(); // id = checklistId
  const [item, setItem] = useState(null);
  const [newName, setNewName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchItemDetail();
  }, []);

  const fetchItemDetail = async () => {
    try {
      const res = await API.get(`/checklist/${id}/item/${itemId}`);
      setItem(res.data.data);
      setNewName(res.data.data.name);
    } catch (err) {
      alert('Gagal mengambil detail item');
    }
  };

  const handleRename = async () => {
    try {
      await API.put(`/checklist/${id}/item/rename/${itemId}`, {
        itemName: newName,
      });
      fetchItemDetail(); // refresh
    } catch (err) {
      alert('Gagal mengganti nama item');
    }
  };

  const handleToggleStatus = async () => {
    try {
      await API.put(`/checklist/${id}/item/${itemId}`);
      fetchItemDetail(); // refresh
    } catch (err) {
      alert('Gagal mengganti status');
    }
  };

  const handleDelete = async () => {
    try {
      await API.delete(`/checklist/${id}/item/${itemId}`);
      navigate(`/checklist/${id}`);
    } catch (err) {
      alert('Gagal menghapus item');
    }
  };

  if (!item) return <p>Loading...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2>🔍 Detail Item</h2>

      <p><strong>Nama:</strong> {item.name}</p>
      <p><strong>Status:</strong> {item.itemCompletionStatus ? '✅ Selesai' : '❌ Belum selesai'}</p>

      <div style={{ marginTop: 20 }}>
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <button onClick={handleRename}>Ganti Nama</button>
      </div>

      <div style={{ marginTop: 10 }}>
        <button onClick={handleToggleStatus}>Toggle Status</button>
        <button onClick={handleDelete} style={{ marginLeft: 10 }}>Hapus Item</button>
        <button onClick={() => navigate(`/checklist/${id}`)} style={{ marginLeft: 10 }}>
          🔙 Kembali
        </button>
      </div>
    </div>
  );
}
