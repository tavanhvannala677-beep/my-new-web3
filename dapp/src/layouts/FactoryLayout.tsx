import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Layers, FileText } from 'lucide-react';

export const FactoryLayout: React.FC = () => {
  const navItems = [
    { to: '/factory/dashboard', label: 'ພາບລວມໂຮງງານ', sub: 'Overview', icon: LayoutDashboard },
    { to: '/factory/batches', label: 'ຈັດການລັອດ & ຮວມລັອດ (Mass Balance)', sub: 'Batch Management', icon: Layers },
    { to: '/factory/ocr', label: 'ຍື່ນເອກະສານດ່ານ & AI OCR (e-Phyto)', sub: 'Export Clearance', icon: FileText },
  ];

  return (
    <div style={{ flex: 1, display: 'flex', minHeight: 'calc(100vh - 65px)', background: '#edf2e7' }}>
      {/* Factory Sidebar */}
      <aside style={{
        width: '275px',
        background: '#e1e9d8',
        borderRight: '1px solid #ccd8be',
        padding: '28px 18px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
      }}>
        <div>
          <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: '#4d6052', fontWeight: 800, marginBottom: '4px' }}>
            ພໍຣ໌ທອລ 2 (PORTAL 2)
          </div>
          <h2 style={{ fontSize: '17px', fontWeight: 900, color: '#142a1d', margin: 0 }}>
            🏭 ໂຮງງານ ແລະ ຜູ້ສົ່ງອອກ
          </h2>
          <div style={{ fontSize: '12px', color: '#153826', marginTop: '3px', fontWeight: 700 }}>
            ລະບົບແປຮູບ ແລະ ສົ່ງອອກສິນຄ້າກະສິກຳ
          </div>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 14px',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  fontSize: '13px',
                  fontWeight: 700,
                  transition: 'all 0.18s ease',
                  background: isActive ? '#153826' : 'transparent',
                  color: isActive ? '#f4f7f0' : '#3d5244',
                  boxShadow: isActive ? '0 2px 6px rgba(21, 56, 38, 0.25)' : 'none'
                })}
              >
                <Icon size={17} />
                <div>
                  <div>{item.label}</div>
                  <div style={{ fontSize: '10px', opacity: 0.8 }}>{item.sub}</div>
                </div>
              </NavLink>
            );
          })}
        </nav>

        {/* Status card */}
        <div style={{
          marginTop: 'auto',
          background: '#ffffff',
          border: '1px solid #cdd8c4',
          borderRadius: '6px',
          padding: '14px',
          fontSize: '11px',
          color: '#4d6052',
          boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
        }}>
          <div style={{ color: '#153826', fontWeight: 800, marginBottom: '4px' }}>⚡ ເຊື່ອມຕໍ່ສັນຍາອັດສະລິຍະ</div>
          <div>ສັນຍາ: <span style={{ color: '#142a1d', fontWeight: 700 }}>splitOrMergeBatch</span></div>
          <div style={{ marginTop: '2px' }}>ເຄືອຂ່າຍ: LAB Chain (5222)</div>
        </div>
      </aside>

      {/* Main Content Area */}
      <section style={{ flex: 1, padding: '28px 36px', overflowY: 'auto', maxWidth: '1200px' }}>
        <Outlet />
      </section>
    </div>
  );
};
