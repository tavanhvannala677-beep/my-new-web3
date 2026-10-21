import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { MapPin, PlusCircle, History, LogIn, PhoneCall, CheckCircle2, Shield } from 'lucide-react';
import { useSeniorMode } from '../context/SeniorModeContext';

export const FarmerLayout: React.FC = () => {
  const { isSeniorMode } = useSeniorMode();

  const tabs = [
    { to: '/farmer/login', label: 'ເຂົ້າສູ່ລະບົບ', sub: 'Login', icon: LogIn },
    { to: '/farmer/map', label: 'ປັກໝຸດໄຮ່ນາ', sub: 'Map', icon: MapPin },
    { to: '/farmer/register', label: 'ລົງທະບຽນສິນຄ້າ', sub: 'Register', icon: PlusCircle },
    { to: '/farmer/history', label: 'ປະຫວັດ / QR', sub: 'History', icon: History },
  ];

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: isSeniorMode ? '16px 12px 32px 12px' : '24px 16px',
      background: '#edf2e7',
      minHeight: '100vh',
      boxSizing: 'border-box'
    }}>
      {/* Mobile Device Mockup Frame: Official National Farmer Passport */}
      <div style={{
        width: '100%',
        maxWidth: isSeniorMode ? '500px' : '440px',
        minHeight: '760px',
        background: '#ffffff',
        borderRadius: '10px',
        border: isSeniorMode ? '2px solid #153826' : '1.5px solid #c8d5c0',
        boxShadow: '0 16px 40px rgba(21, 56, 38, 0.12), 0 3px 10px rgba(0,0,0,0.04)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative'
      }}>
        {/* Mobile Header: Ministry & National Identity Status Bar */}
        <div style={{
          background: isSeniorMode ? '#153826' : '#0f291c',
          padding: isSeniorMode ? '12px 18px' : '10px 16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid #d5dfce',
          color: '#ffffff',
          fontSize: isSeniorMode ? '13px' : '11px',
          fontWeight: 700
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '16px' }}>🇱🇦</span>
            <div>
              <div style={{ fontWeight: 900, color: '#f4f7f0', lineHeight: 1.2 }}>
                ໜັງສືເດີນທາງສິນຄ້າກະສິກຳດິຈິຕອນແຫ່ງຊາດ
              </div>
              <div style={{ fontSize: '10px', color: '#a3c2aa' }}>
                ສປປ ລາວ · ກະຊວງກະສິກຳ ແລະ ປ່າໄມ້ (MAF)
              </div>
            </div>
          </div>
          <span style={{
            background: 'rgba(255,255,255,0.18)',
            border: '1px solid rgba(255,255,255,0.25)',
            borderRadius: '4px',
            padding: '2px 8px',
            color: '#86efac',
            fontSize: '10px',
            fontWeight: 800,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <Shield size={10} />
            MAF OFFICIAL
          </span>
        </div>

        {/* Official Farmer Identity & Field Passport Strip */}
        <div style={{
          background: '#e8f2e2',
          borderBottom: '1.5px solid #c8d7c2',
          padding: '8px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: isSeniorMode ? '13px' : '11.5px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '26px',
              height: '26px',
              borderRadius: '50%',
              background: '#153826',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 900,
              fontSize: '11px'
            }}>
              ສ
            </div>
            <div>
              <div style={{ fontWeight: 800, color: '#153826', lineHeight: 1.2 }}>
                ທ່ານ ສົມສັກ ພອນສະຫວັນ
              </div>
              <div style={{ fontSize: '10.5px', color: '#4f6354' }}>
                ID: <span style={{ fontWeight: 800, color: '#153826', letterSpacing: '0.3px' }}>LA-FARM-88412</span> · ແຂວງ ຫຼວງພະບາງ
              </div>
            </div>
          </div>

          <span style={{
            background: '#dcfce7',
            color: '#15803d',
            border: '1px solid #86efac',
            borderRadius: '4px',
            padding: '2px 8px',
            fontSize: '10px',
            fontWeight: 800,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '3px'
          }}>
            <CheckCircle2 size={11} />
            <span>KYC ຢັ້ງຢືນແລ້ວ</span>
          </span>
        </div>

        {/* Content Area */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: isSeniorMode ? '20px 18px' : '18px 16px',
          display: 'flex',
          flexDirection: 'column',
          background: '#fafcfa'
        }}>
          <Outlet />
        </div>

        {/* Senior Emergency & Support Help Bar */}
        <div style={{
          background: '#edf4e8',
          borderTop: '1px solid #d5dfce',
          padding: isSeniorMode ? '10px 16px' : '8px 14px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: isSeniorMode ? '13px' : '11px',
          color: '#153826',
          fontWeight: 700
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <PhoneCall size={isSeniorMode ? 16 : 14} color="#153826" />
            <span>ສາຍດ່ວນກະສິກຳ:</span>
            <a href="tel:1515" style={{ color: '#153826', textDecoration: 'underline', fontWeight: 900 }}>1515 (ໂທຟຣີ)</a>
          </div>
          <span style={{ fontSize: '11px', color: '#607264' }}>🇱🇦 ເຈົ້າໜ້າທີ່ບ້ານພ້ອມຊ່ວຍ</span>
        </div>

        {/* Mobile Bottom Navigation Bar (Super Sized for Senior Thumb Touch) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          background: '#ffffff',
          borderTop: '2px solid #e1ebd9',
          padding: isSeniorMode ? '10px 0 14px 0' : '8px 0 10px 0'
        }}>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <NavLink
                key={tab.to}
                to={tab.to}
                style={({ isActive }) => ({
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                  textDecoration: 'none',
                  color: isActive ? '#153826' : '#708375',
                  fontSize: isSeniorMode ? '13px' : '11px',
                  fontWeight: isActive ? 900 : 600,
                  transition: 'all 0.15s',
                  padding: '4px 2px'
                })}
              >
                <div style={{
                  padding: isSeniorMode ? '6px 16px' : '4px 10px',
                  borderRadius: '6px',
                  background: 'transparent'
                }}>
                  <Icon size={isSeniorMode ? 24 : 18} />
                </div>
                <span>{tab.label}</span>
              </NavLink>
            );
          })}
        </div>
      </div>
    </div>
  );
};
