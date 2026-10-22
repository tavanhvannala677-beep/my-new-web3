import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Smartphone, Factory, ShieldCheck, Home, Shield, QrCode, Sparkles, Layers, Search, ExternalLink } from 'lucide-react';
import { LAO_TRACEABILITY_ADDRESS } from '../contracts/laoNationalTraceability';

export const RootLayout: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'ໜ້າຫຼັກ', sub: 'Hub', icon: Home },
    { path: '/register', label: '1. ຊາວກະສິກອນ', sub: 'Farmer Map', icon: Smartphone, matchPrefix: '/register' },
    { path: '/merge', label: '2. ໂຮງງານລວມລັອດ', sub: 'Factory Merge', icon: Layers, matchPrefix: '/merge' },
    { path: '/ai-dashboard', label: '3. AI Dashboard', sub: 'EUDR & OCR', icon: Sparkles, matchPrefix: '/ai-dashboard' },
    { path: '/customs', label: '4. ດ່ານສຸລະກາກອນ', sub: 'Green Channel', icon: ShieldCheck, matchPrefix: '/customs' },
    { path: '/track/BATCH-LAO-001', label: '5. ຕິດຕາມສິນຄ້າ', sub: 'Track & Trace', icon: Search, matchPrefix: '/track' },
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#edf2e7', color: '#142a1d' }}>
      
      {/* Top Universal Header */}
      <header style={{
        background: '#edf2e7',
        borderBottom: '1px solid #d5dfce',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        boxShadow: '0 2px 6px rgba(20, 42, 29, 0.04)'
      }}>
        <div style={{
          maxWidth: '1380px',
          margin: '0 auto',
          padding: '12px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          {/* Logo & National Badge */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', color: 'inherit' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '8px',
              background: '#153826',
              border: '1.5px solid #b45309',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(21, 56, 38, 0.25)',
              position: 'relative'
            }}>
              <span style={{ fontSize: '20px' }}>🇱🇦</span>
              <div style={{
                position: 'absolute',
                bottom: '-3px',
                right: '-3px',
                width: '14px',
                height: '14px',
                borderRadius: '50%',
                background: '#d97706',
                border: '1.5px solid #ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Shield size={8} color="#ffffff" strokeWidth={3} />
              </div>
            </div>
            <div>
              <div style={{ fontSize: '15px', fontWeight: 900, letterSpacing: '-0.2px', color: '#142a1d', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>ລະບົບຕິດຕາມ ແລະ ກວດສອບຍ້ອນກັບແຫ່ງຊາດ</span>
                <span style={{
                  fontSize: '9.5px',
                  background: '#dcfce7',
                  color: '#15803d',
                  border: '1px solid #86efac',
                  padding: '1px 6px',
                  borderRadius: '4px',
                  fontWeight: 800
                }}>
                  OFFICIAL STATE SYSTEM
                </span>
              </div>
              <div style={{ fontSize: '11px', color: '#4d6052', fontWeight: 700, display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span>Lao National Single Traceability Platform</span>
                <span>•</span>
                <span style={{ color: '#153826', fontWeight: 800 }}>ດຳລັດເລກທີ 328/ລບ</span>
              </div>
            </div>
          </Link>

          {/* Portal Switcher Buttons */}
          <nav style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: '#e0ebd8',
            padding: '4px',
            borderRadius: '8px',
            border: '1px solid #cdd8c4'
          }}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.matchPrefix 
                ? location.pathname.startsWith(item.matchPrefix)
                : location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 14px',
                    borderRadius: '6px',
                    fontSize: '12.5px',
                    fontWeight: 800,
                    textDecoration: 'none',
                    transition: 'all 0.18s ease',
                    background: isActive ? '#153826' : 'transparent',
                    color: isActive ? '#f4f7f0' : '#3d5244',
                    boxShadow: isActive ? '0 2px 6px rgba(21, 56, 38, 0.25)' : 'none',
                    border: '1px solid transparent'
                  }}
                >
                  <Icon size={14} color={isActive ? '#f4f7f0' : '#4d6052'} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </header>
      
      {/* Smart Contract & Network Status Strip */}
      <div style={{
        background: '#153826',
        color: '#dcfce7',
        fontSize: '11px',
        padding: '5px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '10px',
        borderBottom: '1px solid #234d36'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <span>⛓️ <strong>Network:</strong> LAB Chain (Chain ID: 5222)</span>
          <span>•</span>
          <span>📜 <strong>Core Contract:</strong> <code style={{ color: '#ffffff', fontFamily: 'monospace' }}>{LAO_TRACEABILITY_ADDRESS}</code></span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span>RPC: <code style={{ color: '#86efac' }}>https://rpc.labchain.la</code></span>
          <a
            href={`https://explorer.labchain.la/address/${LAO_TRACEABILITY_ADDRESS}`}
            target="_blank"
            rel="noreferrer"
            style={{ color: '#86efac', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '3px', fontWeight: 700 }}
          >
            <span>Explorer</span>
            <ExternalLink size={10} />
          </a>
        </div>
      </div>

      {/* Main Routed Content */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Outlet />
      </main>

      {/* Official Government Footer */}
      <footer style={{
        borderTop: '1.5px solid #cdd8c4',
        padding: '28px 24px 22px 24px',
        fontSize: '12px',
        color: '#4d6052',
        background: '#e4ece0'
      }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Institutional Trust Badges Strip */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
            paddingBottom: '16px',
            borderBottom: '1px solid #cdd8c4'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#153826', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff' }}>
                <Shield size={16} />
              </div>
              <div>
                <div style={{ fontSize: '12.5px', fontWeight: 900, color: '#142a1d' }}>
                  ລະບົບປະຕູດຽວແຫ່ງຊາດ (National Single Window Traceability Gateway)
                </div>
                <div style={{ fontSize: '11px', color: '#55685a' }}>
                  ພັດທະນາຕາມມາດຕະຖານສາກົນ UN/CEFACT ແລະ IPPC e-Phyto
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', fontSize: '10.5px', fontWeight: 800 }}>
              <span style={{ padding: '4px 10px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', color: '#153826' }}>
                🇪🇺 EUDR Reg (EU) 2023/1115
              </span>
              <span style={{ padding: '4px 10px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', color: '#153826' }}>
                🇨🇳 GACC Bilateral Protocol
              </span>
              <span style={{ padding: '4px 10px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', color: '#153826' }}>
                🔒 ISO 22005 & 27001
              </span>
              <span style={{ padding: '4px 10px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', color: '#153826' }}>
                ⛓️ LAB Chain Network (PoA)
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', fontSize: '11px' }}>
            <div>
              © 2026 ສາທາລະນະລັດ ປະຊາທິປະໄຕ ປະຊາຊົນລາວ · ກະຊວງກະສິກຳ ແລະ ປ່າໄມ້ (MAF) ຮ່ວມກັບ ກົມພາສີ ແລະ ຄະນະກຳມະການ Labchain Consortium.
            </div>
            <div style={{ color: '#153826', fontWeight: 700 }}>
              ດຳລັດເລກທີ 328/ລບ · ລະບົບປົກປ້ອງຄວາມປອດໄພຂໍ້ມູນລະດັບສູງສຸດ (Tamper-Proof)
            </div>
          </div>

        </div>
      </footer>
    </div>
  );
};
