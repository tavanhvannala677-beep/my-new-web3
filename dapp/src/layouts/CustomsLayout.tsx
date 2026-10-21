import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { QrCode, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const CustomsLayout: React.FC = () => {
  const navTabs = [
    { to: '/customs/scan', label: 'ສະແກນ QR / ຄົ້ນຫາລັອດ', sub: 'Scan & Search', icon: QrCode },
    { to: '/customs/trace/LA-COF-2026-001', label: 'ຄວາມຈິງດຽວລະດັບຊາດ ★', sub: 'Verified by Labchain', icon: ShieldCheck },
    { to: '/customs/release', label: 'ໃບຜ່ານດ່ານຊ່ອງຂຽວ', sub: '15-min Fast Pass', icon: CheckCircle2 },
  ];

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#edf2e7' }}>
      {/* Sub Header Navigation for Customs */}
      <div style={{
        background: '#e1e9d8',
        borderBottom: '1px solid #ccd8be',
        padding: '12px 24px'
      }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '22px' }}>🇱🇦 ⇄ 🇨🇳</span>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 900, color: '#142a1d' }}>
                ດ່ານສຸລະກາກອນລົດໄຟ ລາວ-ຈີນ (ດ່ານບໍ່ເຕັນ - ໂມ່ຮານ / 磨憨口岸)
              </div>
              <div style={{ fontSize: '11px', color: '#153826', fontWeight: 700 }}>
                ຊ່ອງທາງກວດປ່ອຍສິນຄ້າລ່ວງໜ້າ GACC / NSWA+ Pre-Arrival Clearance
              </div>
            </div>
          </div>

          <nav style={{ display: 'flex', gap: '6px' }}>
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <NavLink
                  key={tab.to}
                  to={tab.to}
                  style={({ isActive }) => ({
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    fontSize: '12.5px',
                    fontWeight: 700,
                    textDecoration: 'none',
                    transition: 'all 0.18s ease',
                    background: isActive ? '#153826' : '#ffffff',
                    color: isActive ? '#f4f7f0' : '#3d5244',
                    border: isActive ? '1px solid #153826' : '1px solid #cdd8c4',
                    boxShadow: isActive ? '0 2px 6px rgba(21, 56, 38, 0.2)' : 'none'
                  })}
                >
                  <Icon size={14} />
                  <span>{tab.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>

      <div style={{ flex: 1, padding: '24px', maxWidth: '1240px', margin: '0 auto', width: '100%' }}>
        <Outlet />
      </div>
    </div>
  );
};
