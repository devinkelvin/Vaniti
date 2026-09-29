import React, { useState } from 'react';
import { 
  User, 
  Wallet, 
  Plus, 
  ArrowDownLeft, 
  Smartphone, 
  Radio, 
  Volume2, 
  VolumeX, 
  Vibrate, 
  ShieldCheck, 
  ExternalLink, 
  ChevronRight, 
  LogOut,
  MapPin,
  Sparkles,
  Zap,
  CreditCard
} from 'lucide-react';

export default function VanitiAccountTab({ 
  walletBalance, 
  setWalletBalance, 
  playVanitiSound, 
  soundEnabled, 
  setSoundEnabled,
  onBackToMap,
  onOpenVip 
}) {
  const [hapticsEnabled, setHapticsEnabled] = useState(true);
  const [radarBroadcast, setRadarBroadcast] = useState(true);
  const [topUpSuccess, setTopUpSuccess] = useState(null);

  const handleQuickTopUp = (amount) => {
    setWalletBalance(prev => prev + amount);
    if (playVanitiSound) playVanitiSound('cash_drop');
    setTopUpSuccess(`+₦${amount.toLocaleString()} Added!`);
    setTimeout(() => setTopUpSuccess(null), 2000);
  };

  return (
    <div style={{
      flex: 1,
      overflowY: 'auto',
      padding: '12px 18px 24px 18px',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px'
    }}>
      {/* 1. User Profile Header */}
      <div style={{
        background: '#232325',
        borderRadius: '24px',
        padding: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        border: '1px solid rgba(255, 255, 255, 0.05)'
      }}>
        <div style={{ position: 'relative' }}>
          <img 
            src="https://api.dicebear.com/7.x/bottts/svg?seed=antigravity"
            alt="Kelvin"
            style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#1c1c1e', border: '2px solid #c27803' }}
          />
          <div style={{
            position: 'absolute',
            bottom: '-2px',
            right: '-2px',
            background: '#c27803',
            borderRadius: '50%',
            width: '20px',
            height: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '11px',
            color: '#000',
            fontWeight: 800
          }}>
            👑
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff' }}>Kelvin Ekuhoho</span>
            <span style={{ background: 'rgba(194, 120, 3, 0.2)', color: '#f59e0b', fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '10px' }}>
              VIP
            </span>
          </div>
          <div style={{ fontSize: '13px', color: '#8e8e93', marginTop: '2px' }}>
            @kelvinballer · ID: VAN-08291
          </div>
        </div>
      </div>

      {/* 2. Pro Wallet Balance & 1-Tap Top-Up */}
      <div style={{
        background: 'linear-gradient(135deg, #271f15 0%, #1e1e22 100%)',
        border: '1px solid rgba(194, 120, 3, 0.3)',
        borderRadius: '24px',
        padding: '22px 20px',
        boxShadow: '0 10px 35px rgba(0,0,0,0.5)',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: '12px', color: '#f59e0b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Vaniti Spray Balance
            </span>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.5px', marginTop: '2px' }}>
              ₦{walletBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>

          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            background: 'rgba(194, 120, 3, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#c27803'
          }}>
            <Wallet size={22} />
          </div>
        </div>

        {/* Quick Top-Up notification pill */}
        {topUpSuccess && (
          <div style={{
            background: 'rgba(0, 230, 118, 0.15)',
            border: '1px solid #00e676',
            borderRadius: '12px',
            padding: '6px 12px',
            fontSize: '12px',
            fontWeight: 700,
            color: '#00e676',
            textAlign: 'center'
          }}>
            {topUpSuccess}
          </div>
        )}

        {/* 1-Tap Quick Reload Buttons */}
        <div>
          <div style={{ fontSize: '12px', color: '#8e8e93', fontWeight: 600, marginBottom: '8px' }}>
            Instant Top Up (Baller Speed)
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
            {[50000, 100000, 500000].map(amt => (
              <button
                key={amt}
                onClick={() => handleQuickTopUp(amt)}
                style={{
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '14px',
                  padding: '10px 0',
                  color: '#ffffff',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(194, 120, 3, 0.25)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)'}
              >
                +₦{(amt / 1000)}k
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Hardware & Proximity Devices */}
      <div style={{
        background: '#232325',
        borderRadius: '20px',
        padding: '16px 18px',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        <div style={{ fontSize: '13px', fontWeight: 700, color: '#8e8e93', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Connected Devices
        </div>

        {/* NFC Ring */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(0, 230, 118, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Radio size={18} color="#00e676" />
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: '#ffffff' }}>Vaniti NFC Smart Ring</div>
              <div style={{ fontSize: '11px', color: '#00e676' }}>Connected · 92% Battery</div>
            </div>
          </div>
          <span style={{ fontSize: '12px', color: '#8e8e93' }}>Active</span>
        </div>

        {/* Proximity Broadcast Radar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(194, 120, 3, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap size={18} color="#c27803" />
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: '#ffffff' }}>Radar Discovery Broadcast</div>
              <div style={{ fontSize: '11px', color: '#8e8e93' }}>Allows nearby hosts to find you</div>
            </div>
          </div>

          <div 
            onClick={() => setRadarBroadcast(!radarBroadcast)}
            style={{
              width: '46px',
              height: '26px',
              borderRadius: '13px',
              background: radarBroadcast ? '#c27803' : '#3e3e42',
              position: 'relative',
              cursor: 'pointer',
              transition: 'background 0.2s'
            }}
          >
            <div style={{
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              background: '#ffffff',
              position: 'absolute',
              top: '3px',
              left: radarBroadcast ? '23px' : '3px',
              transition: 'left 0.2s',
              boxShadow: '0 2px 5px rgba(0,0,0,0.3)'
            }} />
          </div>
        </div>
      </div>

      {/* 4. App Preferences */}
      <div style={{
        background: '#232325',
        borderRadius: '20px',
        padding: '16px 18px',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        <div style={{ fontSize: '13px', fontWeight: 700, color: '#8e8e93', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Preferences
        </div>

        {/* Audio Sound Effects */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255, 255, 255, 0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {soundEnabled ? <Volume2 size={18} color="#ffffff" /> : <VolumeX size={18} color="#8e8e93" />}
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: '#ffffff' }}>Banknote Audio Effects</div>
              <div style={{ fontSize: '11px', color: '#8e8e93' }}>Crisp paper flick & fanfare tones</div>
            </div>
          </div>

          <div 
            onClick={() => setSoundEnabled(!soundEnabled)}
            style={{
              width: '46px',
              height: '26px',
              borderRadius: '13px',
              background: soundEnabled ? '#c27803' : '#3e3e42',
              position: 'relative',
              cursor: 'pointer',
              transition: 'background 0.2s'
            }}
          >
            <div style={{
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              background: '#ffffff',
              position: 'absolute',
              top: '3px',
              left: soundEnabled ? '23px' : '3px',
              transition: 'left 0.2s'
            }} />
          </div>
        </div>

        {/* VIP Club Membership Link */}
        <div 
          onClick={() => {
            if (onOpenVip) onOpenVip();
            if (playVanitiSound) playVanitiSound('auth');
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid rgba(255,255,255,0.04)',
            paddingTop: '10px',
            cursor: 'pointer'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(194, 120, 3, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles size={18} color="#c27803" />
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: '#ffffff' }}>VIP Club Membership</div>
              <div style={{ fontSize: '11px', color: '#f59e0b' }}>View exclusive high roller benefits</div>
            </div>
          </div>
          <ChevronRight size={18} color="#8e8e93" />
        </div>
      </div>

      {/* 5. Switch to Zengly Map Button */}
      {onBackToMap && (
        <button
          onClick={onBackToMap}
          style={{
            background: 'rgba(35, 35, 37, 0.9)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '16px 0',
            color: '#ffffff',
            fontSize: '14px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            marginTop: '4px'
          }}
        >
          <MapPin size={16} color="#c27803" />
          <span>Switch to Zengly Proximity Radar Map</span>
        </button>
      )}
    </div>
  );
}
