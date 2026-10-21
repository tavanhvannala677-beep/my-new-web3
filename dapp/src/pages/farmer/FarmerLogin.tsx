import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, Shield, CheckCircle, Sparkles, Lock, CheckCircle2 } from 'lucide-react';
import { useSeniorMode } from '../../context/SeniorModeContext';

export const FarmerLogin: React.FC = () => {
  const navigate = useNavigate();
  const { isSeniorMode } = useSeniorMode();

  const [phone, setPhone] = useState('+856 20 5543 2190');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'PHONE' | 'OTP' | 'SUCCESS'>('PHONE');

  const handleQuickLogin = () => {
    setStep('SUCCESS');
    setTimeout(() => {
      navigate('/farmer/register');
    }, 800);
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return;
    setStep('OTP');
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('SUCCESS');
    setTimeout(() => {
      navigate('/farmer/register');
    }, 800);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      justifyContent: 'center',
      gap: isSeniorMode ? '20px' : '14px'
    }}>
      {/* Official Ministry Header & Shield Icon */}
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: isSeniorMode ? '64px' : '52px',
          height: isSeniorMode ? '64px' : '52px',
          borderRadius: '10px',
          background: '#153826',
          border: '2px solid #b45309',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 12px auto',
          color: '#e2ead8',
          boxShadow: '0 6px 18px rgba(21, 56, 38, 0.25)'
        }}>
          <Shield size={isSeniorMode ? 32 : 26} color="#86efac" />
        </div>
        <div style={{ fontSize: '11px', fontWeight: 800, color: '#153826', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '2px' }}>
          ສປປ ລາວ · ກະຊວງກະສິກຳ ແລະ ປ່າໄມ້ (MAF)
        </div>
        <h2 style={{
          fontSize: isSeniorMode ? '21px' : '18px',
          fontWeight: 900,
          color: '#142a1d',
          margin: '0 0 6px 0'
        }}>
          ລະບົບຢັ້ງຢືນຕົວຕົນຊາວກະສິກອນແຫ່ງຊາດ
        </h2>
        <p style={{
          fontSize: isSeniorMode ? '13.5px' : '12px',
          color: '#4d6052',
          margin: 0,
          lineHeight: 1.5
        }}>
          ເຂົ້າເຖິງດ້ວຍລະບົບ Web 2.5 Relayer ບໍ່ຕ້ອງມີກະເປົາ Crypto • ປອດໄພຕາມດຳລັດເລກທີ 328/ລບ
        </p>
      </div>

      {/* QUICK LOGIN BUTTON FOR SENIORS (OFFICIAL DIGITAL FARMER ID CARD) */}
      <div style={{
        background: '#ffffff',
        border: '2px solid #153826',
        borderRadius: '8px',
        padding: isSeniorMode ? '18px 16px' : '14px',
        boxShadow: '0 6px 20px rgba(21, 56, 38, 0.08)',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: isSeniorMode ? '14px' : '12px', fontWeight: 900, color: '#153826', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={16} />
            <span>ບັດປະຈຳຕົວຊາວກະສິກອນດິຈິຕອນ (KYC)</span>
          </div>
          <span style={{
            background: '#dcfce7',
            color: '#15803d',
            padding: '2px 8px',
            borderRadius: '4px',
            fontSize: '10.5px',
            fontWeight: 800,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '3px'
          }}>
            <CheckCircle2 size={11} />
            <span>ຢັ້ງຢືນແລ້ວ</span>
          </span>
        </div>

        {/* Farmer Info Box */}
        <div style={{
          background: '#edf4e8',
          border: '1px solid #c2cfba',
          borderRadius: '6px',
          padding: '12px',
          textAlign: 'left',
          fontSize: isSeniorMode ? '14px' : '12px'
        }}>
          <div style={{ fontWeight: 900, color: '#153826', fontSize: isSeniorMode ? '16px' : '14px' }}>
            ທ່ານ ສົມສັກ ພອນສະຫວັນ
          </div>
          <div style={{ color: '#4d6052', marginTop: '2px' }}>
            ລະຫັດຊາວກະສິກອນ: <strong style={{ color: '#153826', letterSpacing: '0.3px' }}>LA-FARM-88412</strong>
          </div>
          <div style={{ color: '#55685a', fontSize: '11.5px', marginTop: '2px' }}>
            📍 ບ້ານລ້ອງລາວໃໝ່, ເມືອງຫຼວງພະບາງ, ແຂວງຫຼວງພະບາງ
          </div>
        </div>

        <button
          type="button"
          onClick={handleQuickLogin}
          style={{
            padding: isSeniorMode ? '16px 20px' : '12px 16px',
            background: '#153826',
            color: '#f4f7f0',
            border: 'none',
            borderRadius: '8px',
            fontSize: isSeniorMode ? '16px' : '14px',
            fontWeight: 900,
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(21, 56, 38, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          <span>ເຂົ້າສູ່ລະບົບທັນທີ (Quick Login)</span>
        </button>
      </div>

      <div style={{ textAlign: 'center', color: '#708375', fontSize: '12px', fontWeight: 700 }}>
        — ຫຼື ເຂົ້າດ້ວຍເບີໂທລະສັບອື່ນ —
      </div>

      {step === 'PHONE' && (
        <form onSubmit={handleSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: isSeniorMode ? '15px' : '12px', fontWeight: 800, color: '#142a1d', marginBottom: '6px' }}>
              ເບີໂທລະສັບທີ່ລົງທະບຽນ:
            </label>
            <div style={{ position: 'relative' }}>
              <Phone size={18} color="#708375" style={{ position: 'absolute', left: '14px', top: '16px' }} />
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+856 20 ..."
                style={{
                  width: '100%',
                  padding: isSeniorMode ? '14px 16px 14px 44px' : '11px 14px 11px 38px',
                  background: '#ffffff',
                  border: '1.5px solid #cdd8c4',
                  borderRadius: '6px',
                  color: '#142a1d',
                  fontSize: isSeniorMode ? '17px' : '14px',
                  fontWeight: 800,
                  boxSizing: 'border-box',
                  outline: 'none'
                }}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            style={{
              padding: isSeniorMode ? '16px' : '12px',
              background: '#ffffff',
              color: '#153826',
              border: '2px solid #153826',
              borderRadius: '8px',
              fontSize: isSeniorMode ? '16px' : '13.5px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <span>ສົ່ງລະຫັດ OTP ຢືນຢັນຕົວຕົນ</span>
          </button>
        </form>
      )}

      {step === 'OTP' && (
        <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: isSeniorMode ? '15px' : '12px', fontWeight: 800, color: '#142a1d', marginBottom: '6px' }}>
              ປ້ອນລະຫັດ 4 ຕົວເລກ ທີ່ໄດ້ຮັບ:
            </label>
            <input
              type="text"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="1234"
              style={{
                width: '100%',
                padding: '14px',
                textAlign: 'center',
                letterSpacing: '8px',
                background: '#ffffff',
                border: '2px solid #153826',
                borderRadius: '6px',
                color: '#153826',
                fontSize: '24px',
                fontWeight: 900,
                outline: 'none'
              }}
              required
            />
          </div>

          <button
            type="submit"
            style={{
              padding: isSeniorMode ? '16px' : '12px',
              background: '#153826',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontSize: isSeniorMode ? '16px' : '13.5px',
              fontWeight: 800,
              cursor: 'pointer'
            }}
          >
            ຢືນຢັນລະຫັດ & ເຂົ້າສູ່ລະບົບ
          </button>
        </form>
      )}

      {step === 'SUCCESS' && (
        <div style={{
          background: '#e8f2e1',
          border: '2px solid #153826',
          borderRadius: '8px',
          padding: '24px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px'
        }}>
          <CheckCircle size={48} color="#153826" />
          <div style={{ fontSize: '18px', fontWeight: 900, color: '#153826' }}>
            ຢັ້ງຢືນຕົວຕົນສຳເລັດແລ້ວ!
          </div>
          <div style={{ fontSize: '13.5px', color: '#445649' }}>
            ກຳລັງເປີດໜ້າລົງທະບຽນສິນຄ້າກະສິກຳ...
          </div>
        </div>
      )}

      {/* Security Guarantee Note */}
      <div style={{
        textAlign: 'center',
        fontSize: '11px',
        color: '#607264',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '4px',
        marginTop: '6px'
      }}>
        <Lock size={11} />
        <span>ລະບົບເຂົ້າລະຫັດຄວາມປອດໄພລະດັບສູງສຸດ ພາຍໃຕ້ດຳລັດເລກທີ 328/ລບ</span>
      </div>
    </div>
  );
};
