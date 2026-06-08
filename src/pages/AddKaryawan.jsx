import { useEffect, useState } from 'react';
import { createKaryawan, getJabatan, getKlien, getPenempatan } from '../api';

const EMPTY = { id_karyawan: '', nama: '', email: '', no_telp: '', alamat: '', id_jabatan: '', id_klien:'', id_penempatan: '' };

export default function AddKaryawan() {
  const [form, setForm] = useState(EMPTY);
  const [msg, setMsg] = useState({ text: '', ok: false });
  const [loading, setLoading] = useState(false);

  const [positions, setPositions] = useState([])
  const [clients, setClients] = useState([])
  const [placements, setPlacements] = useState([])

  useEffect(() => {
    async function fetchPositions() {
      setLoading(true);
      try {
        const r = await getJabatan();
        setPositions(r.data);
      }
      catch { setMsg('Gagal memuat data.'); }
      finally { setLoading(false); }
    }
    async function fetchClients() {
      setLoading(true);
      try {
        const r = await getKlien();
        setClients(r.data);
      }
      catch { setMsg('Gagal memuat data.'); }
      finally { setLoading(false); }
    }
    async function fetchPlacements() {
      setLoading(true);
      try {
        const r = await getPenempatan();
        setPlacements(r.data);
      }
      catch { setMsg('Gagal memuat data.'); }
      finally { setLoading(false); }
    }
    fetchPositions()
    fetchClients()
    fetchPlacements()
  }, [])

  console.log(positions, clients,placements, "test")

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true); setMsg({ text: '', ok: false });
    try {
      await createKaryawan(form);
      setMsg({ text: 'Karyawan berhasil ditambahkan!', ok: true });
      setForm(EMPTY);
    } catch (err) {
      setMsg({ text: err.response?.data?.error || 'Terjadi kesalahan.', ok: false });
    } finally { setLoading(false); }
  }

  const fields = [
    { key: 'id_karyawan', label: 'ID Karyawan', placeholder: 'contoh: KRY003', type: 'text' },
    { key: 'nama', label: 'Nama Lengkap', placeholder: 'Masukkan nama lengkap', type: 'text' },
    { key: 'email', label: 'Email', placeholder: 'budi@email.com', type: 'email' },
    { key: 'no_telp', label: 'No. Telepon', placeholder: '08xxx', type: 'text' },
    { key: 'alamat', label: 'Alamat', placeholder: 'Masukkan alamat', type: 'text' },
  ];

  const inputCls = "bg-surface border border-border rounded-lg px-3.5 py-3 text-text text-sm outline-none focus:border-accent/50 transition-colors w-full";
  const labelCls = "text-[11px] font-semibold text-muted tracking-wider uppercase";

  return (
    <div className="p-9 flex-1 max-w-2xl bg-white mt-10 rounded-xl mx-8 lg:mx-auto">
      <h2 className="text-2xl font-black mb-1" style={{ fontFamily: 'var(--font-display)' }}>Tambah Karyawan</h2>
      <p className="text-muted text-sm mb-7">Isi data karyawan baru di bawah ini</p>

      {msg.text && (
        <div className={`rounded-lg px-4 py-3 text-sm mb-6 border ${msg.ok
            ? 'bg-accent/10 border-accent/30 text-accent'
            : 'bg-danger/10 border-danger/30 text-red-400'
          }`}>
          {msg.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-x-5 gap-y-2 mb-7">
          {fields.map(f => (
            <div key={f.key} className="flex flex-col gap-1.5">
              <label className={labelCls}>{f.label}</label>
              <input
                className={inputCls}
                type={f.type}
                placeholder={f.placeholder}
                value={form[f.key]}
                onChange={set(f.key)}
                required
              />
            </div>
          ))}
          <div className="flex flex-col gap-1.5">
            <label className={labelCls}>Jabatan</label>
            <select className={inputCls} value={form.id_jabatan} onChange={set('id_jabatan')} required>
              <option value="">— Pilih Jabatan —</option>
              {positions.map(j => <option key={j.id_jabatan} value={j.id_jabatan}>{j.nama_jabatan}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelCls}>Klien</label>
            <select className={inputCls} value={form.id_klien} onChange={set('id_klien')} required>
              <option value="">— Pilih Klien —</option>
              {clients.map(j => <option key={j.id_klien} value={j.id_klien}>{j.nama_klien}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelCls}>Penempatan</label>
            <select className={inputCls} value={form.id_penempatan} onChange={set('id_penempatan')} required>
              <option value="">— Pilih Lokasi Penempatan —</option>
              {placements.map(j => <option key={j.id_kota} value={j.id_kota}>{j.nama_kota}</option>)}
            </select>
          </div>
        </div>

        <button
          className="bg-accent text-bg px-7 py-3.5 rounded-lg font-black text-sm cursor-pointer disabled:opacity-60 hover:opacity-90 transition-opacity"
          style={{ fontFamily: 'var(--font-display)' }}
          disabled={loading}
        >
          {loading ? 'Menyimpan...' : '+ Simpan Karyawan'}
        </button>
      </form>
    </div>
  );
}
