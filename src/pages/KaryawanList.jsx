import { useState, useEffect, useCallback } from 'react';
import { getKaryawan, getKaryawanById, deleteKaryawan } from '../api';
import { useDebounce } from '../hooks/useDebounce';

export default function KaryawanList() {
  const [list, setList] = useState([]);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300)
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const fetchList = useCallback(async () => {
    setLoading(true);
    try { const r = await getKaryawan(debouncedSearch); setList(r.data); }
    catch { setMsg('Gagal memuat data.'); }
    finally { setLoading(false); }
  }, [debouncedSearch])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchList();
  }, [fetchList]);

  async function openDetail(id) {
    try { const r = await getKaryawanById(id); setDetail(r.data); }
    catch { setMsg('Gagal memuat detail.'); }
  }

  async function handleDelete(id) {
    if (!confirm(`Hapus karyawan ${id}?`)) return;
    try {
      await deleteKaryawan(id);
      setMsg('Karyawan berhasil dihapus.');
      if (detail?.id_karyawan === id) setDetail(null);
      fetchList();
    } catch { setMsg('Gagal menghapus.'); }
  }

  const cols = ['ID', 'Nama', 'Email', 'Jabatan', 'Klien', 'Penempatan', 'Aksi'];

  return (
    <div className="p-9 flex-1 h-screen overflow-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-7 flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-black mb-1" style={{ fontFamily: 'var(--font-display)' }}>Daftar Karyawan</h2>
          <p className="text-muted text-sm">{list.length} karyawan terdaftar</p>
        </div>
        <input
          className="bg-surface border border-border rounded-lg px-4 py-2.5 text-text text-sm outline-none w-64 focus:border-accent/40 transition-colors"
          placeholder="🔍  Cari karyawan"
          value={search} onChange={e => setSearch(e.target.value)}
        />
      </div>

      {msg && (
        <div
          className="bg-surface2 border border-border rounded-lg px-4 py-2.5 text-sm text-muted mb-5 cursor-pointer"
          onClick={() => setMsg('')}
        >
          {msg} ×
        </div>
      )}

      <div className="flex gap-6 items-start">
        {/* Table */}
        <div className="flex-1 bg-surface border border-border rounded-xl overflow-hidden">
          {loading ? (
            <div className="p-10 text-center text-muted">Memuat...</div>
          ) : list.length === 0 ? (
            <div className="p-10 text-center text-muted">Tidak ada data.</div>
          ) : (
            <table className="w-full border-collapse overflow-auto">
              <thead>
                <tr>
                  {cols.map(h => (
                    <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold tracking-widest text-muted bg-surface2 border-b border-border uppercase">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {list.map(k => (
                  <tr
                    key={k.id_karyawan}
                    onClick={() => openDetail(k.id_karyawan)}
                    className={`border-b border-border cursor-pointer transition-colors hover:bg-surface2
                      ${detail?.id_karyawan === k.id_karyawan ? 'bg-accent/5' : ''}`}
                  >
                    <td className="px-4 py-3 text-sm">
                      <code className="font-mono text-xs bg-surface2 px-2 py-1 rounded text-accent2">{k.id_karyawan}</code>
                    </td>
                    <td className="px-4 py-3 text-sm">{k.nama}</td>
                    <td className="px-4 py-3 text-sm text-muted">{k.email}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className="text-[11px] bg-accent2/10 text-accent2 px-2.5 py-1 rounded-full font-semibold">{k.nama_jabatan}</span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {k.nama_klien}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {k.nama_kota}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <button
                        onClick={e => { e.stopPropagation(); handleDelete(k.id_karyawan); }}
                        className="bg-danger/10 border border-danger/20 text-red-400 rounded-md px-3 py-1 text-xs cursor-pointer hover:bg-danger/20 transition-colors"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Detail Panel */}
        {detail && (
          <div className="w-[280px] shrink-0 bg-surface border border-border rounded-xl p-5">
            <div className="flex justify-between items-center mb-5">
              <span className="text-[11px] font-semibold text-muted tracking-widest uppercase">Detail Biodata</span>
              <button onClick={() => setDetail(null)} className="bg-transparent border-none text-muted text-lg cursor-pointer leading-none">×</button>
            </div>

            <div className="w-14 h-14 rounded-full bg-accent/15 text-accent flex items-center justify-center text-2xl font-black mb-3" style={{ fontFamily: 'var(--font-display)' }}>
              {detail.nama?.[0]?.toUpperCase()}
            </div>
            <h3 className="text-lg font-bold mb-2" style={{ fontFamily: 'var(--font-display)' }}>{detail.nama}</h3>
            <span className="text-[11px] bg-accent2/10 text-accent2 px-2.5 py-1 rounded-full font-semibold">{detail.nama_jabatan}</span>

            <div className="mt-5 flex flex-col">
              {[
                ['ID', detail.id_karyawan],
                ['Klien', detail.nama_klien],
                ['Email', detail.email],
                ['Telepon', detail.no_telp],
                ['Alamat', detail.alamat],
                ['Gaji Pokok', `Rp ${Number(detail.gaji_pokok).toLocaleString('id-ID')}`],
                ['Penempatan', detail.nama_kota],
              ].map(([label, val]) => (
                <div key={label} className="flex justify-between py-2.5 border-b border-border gap-2">
                  <span className="text-xs text-muted shrink-0">{label}</span>
                  <span className="text-xs text-right break-words">{val}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
