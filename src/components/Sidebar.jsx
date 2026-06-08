export default function Sidebar({ page, setPage, admin, onLogout }) {
  const nav = [
    { id: 'list', label: 'Daftar Karyawan', icon: '◈' },
    { id: 'add',  label: 'Tambah Karyawan', icon: '+' },
  ];

  return (
    <aside className="w-[220px] h-screen bg-surface border-r border-border flex flex-col px-4 py-7 shrink-0">

      <div className="flex items-center gap-2.5 mb-9 px-2">
        <span className="text-[11px] font-black tracking-[3px] text-accent bg-accent/10 px-2 py-1 rounded" style={{fontFamily:'var(--font-display)'}}>KMS</span>
        <span className="font-bold text-base" style={{fontFamily:'var(--font-display)'}}>Karyawan</span>
      </div>

      <nav className="flex flex-col gap-1 flex-1">
        {nav.map(n => (
          <button
            key={n.id}
            onClick={() => setPage(n.id)}
            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-left cursor-pointer transition-all border-none
              ${page === n.id
                ? 'bg-accent/10 text-accent'
                : 'bg-transparent text-muted hover:text-text hover:bg-surface2'
              }`}
          >
            <span className="text-base w-5 text-center">{n.icon}</span>
            {n.label}
          </button>
        ))}
      </nav>

      <div className="border-t border-border pt-4 flex flex-col gap-2.5">
        <div className="flex items-center gap-2 px-1">
          <span className="w-2 h-2 rounded-full bg-accent shrink-0" />
          <span className="text-xs text-muted">{admin}</span>
        </div>
        <button
          onClick={onLogout}
          className="bg-danger/10 border border-danger/20 text-red-400 rounded-lg py-2.5 text-xs cursor-pointer hover:bg-danger/20 transition-colors"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}
