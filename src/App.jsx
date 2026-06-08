import { useEffect, useState } from 'react';
import Login from './pages/Login';
import Sidebar from './components/Sidebar';
import KaryawanList from './pages/KaryawanList';
import AddKaryawan from './pages/AddKaryawan';
import './index.css';

export default function App() {
  const [admin, setAdmin] = useState(localStorage.getItem("admin") || null);
  const [page, setPage] = useState('list');

  console.log(admin, "test")
  useEffect(() => {
    localStorage.setItem("admin", admin)
  }, [admin])
  
  if (!admin) return <Login onLogin={setAdmin} />;

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar page={page} setPage={setPage} admin={admin} onLogout={() => setAdmin(null)} />
      <main style={{ flex: 1, background: 'var(--bg)', overflowX: 'auto' }}>
        {page === 'list' ? <KaryawanList /> : <AddKaryawan />}
      </main>
    </div>
  );
}
