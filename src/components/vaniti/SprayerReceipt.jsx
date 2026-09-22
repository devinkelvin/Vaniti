import React, { useState } from 'react';
import { useVaniti } from './VanitiContext';
import { 
  Download, 
  Share2, 
  CheckCircle2, 
  Trophy, 
  Clock, 
  ArrowUpRight, 
  FileText, 
  X,
  Sparkles,
  QrCode,
  ShieldCheck
} from 'lucide-react';
import podiumImg from '../../assets/vaniti/podium.png';

export default function SprayerReceipt() {
  const { 
    activeEvent, 
    sprayedAmount, 
    sprayPotTarget, 
    selectedDenomId, 
    setIsOpen, 
    setRole, 
    setSprayerStep,
    sessionStartTime,
    playVanitiSound 
  } = useVaniti();

  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [showVipModal, setShowVipModal] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [joinedVip, setJoinedVip] = useState(false);

  // Stats calculation
  const totalNotesSprayed = Math.max(1, Math.round(sprayedAmount / (selectedDenomId === 'bundle' ? 20000 : parseInt(selectedDenomId, 10) || 200)));
  const durationSeconds = Math.max(8, Math.round((Date.now() - (sessionStartTime || Date.now() - 15000)) / 1000));
  const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const refCode = 'ZNG-VAN-' + Math.floor(100000 + Math.random() * 900000);

  const handleDownload = () => {
    playVanitiSound('cash_drop');
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2500);
  };

  const handleShare = () => {
    playVanitiSound('flick');
    if (navigator.share) {
      navigator.share({
        title: 'I just sprayed cash with Zengly Vaniti!',
        text: `Sprayed ₦${sprayedAmount.toLocaleString()} on ${activeEvent?.hostName} at ${activeEvent?.title}!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      alert(`Copied link to clipboard: Sprayed ₦${sprayedAmount.toLocaleString()} with Zengly Vaniti!`);
    }
  };

  const handleDone = () => {
    playVanitiSound('flick');
    setRole(null);
    setSprayerStep('discovery');
    setIsOpen(false);
  };

  return (
    <div 
      style={{
        display: 'flex', 
        flexDirection: 'column', 
        height: '100%', 
        overflowY: 'auto', 
        padding: '16px 20px 24px 20px',
        position: 'relative',
        background: 'linear-gradient(180deg, #12100e 0%, #0d0f12 50%, #090b0e 100%)',
        color: '#fff',
        textAlign: 'center',
      }}
    >
      {/* Top Action Bar (Reference Screenshot Match) */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <button
          onClick={handleDownload}
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid var(--border-glass)',
            borderRadius: '20px',
            padding: '8px 16px',
            fontSize: '13px',
            fontWeight: 600,
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer',
          }}
        >
          <Download size={15} />
          {downloadSuccess ? 'Downloaded! ✓' : 'Download ↓'}
        </button>

        <button
          onClick={handleShare}
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid var(--border-glass)',
            borderRadius: '20px',
            padding: '8px 16px',
            fontSize: '13px',
            fontWeight: 600,
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer',
          }}
        >
          <Share2 size={15} />
          Share
        </button>
      </div>

      {/* 3D Flying Cash Hero Graphic (Reference Screenshot Match) */}
      <div 
        style={{
          width: '72px',
          height: '72px',
          margin: '0 auto 16px auto',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div 
          style={{
            width: '46px',
            height: '24px',
            borderRadius: '4px',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            transform: 'rotate(-42deg) skew(-12deg)',
            boxShadow: '0 8px 24px rgba(16, 185, 129, 0.6), inset 0 0 4px rgba(255,255,255,0.4)',
            border: '1px solid rgba(255,255,255,0.3)',
            animation: 'float-bill 3s infinite ease-in-out',
          }}
        />
        <div 
          style={{
            position: 'absolute',
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(16, 185, 129, 0.25) 0%, transparent 70%)',
            pointerEvents: 'none'
          }}
        />
      </div>

      {/* Main Titles */}
      <h2 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: '8px', color: '#fff' }}>
        Spray Complete
      </h2>

      <p style={{ fontSize: '15px', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '4px' }}>
        You sprayed <strong style={{ color: '#fff', fontSize: '18px' }}>₦{sprayedAmount.toLocaleString()}</strong>
      </p>

      <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '28px' }}>
        {totalNotesSprayed} Notes • Flying Cash • {timeStr}
      </p>

      {/* Performance Stats Pill Card (Reference Screenshot Match) */}
      <div
        style={{
          background: 'rgba(26, 26, 26, 0.75)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '20px',
          overflow: 'hidden',
          marginBottom: '28px',
          boxShadow: '0 12px 30px rgba(0, 0, 0, 0.4)'
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', padding: '16px 8px' }}>
          <div>
            <span style={{ fontSize: '16px', fontWeight: 800, color: '#f59e0b', display: 'block' }}>+2</span>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.4px', fontWeight: 600 }}>
              RANK UP
            </span>
          </div>

          <div style={{ borderLeft: '1px solid rgba(255, 255, 255, 0.08)', borderRight: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <span style={{ fontSize: '16px', fontWeight: 800, color: '#f59e0b', display: 'block' }}>#3</span>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.4px', fontWeight: 600 }}>
              LEADERBOARD
            </span>
          </div>

          <div>
            <span style={{ fontSize: '16px', fontWeight: 800, color: '#f59e0b', display: 'block' }}>{durationSeconds}s</span>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.4px', fontWeight: 600 }}>
              SPRAY TIME
            </span>
          </div>
        </div>

        {/* View Receipt Button Inside Card */}
        <button
          onClick={() => setShowReceiptModal(true)}
          style={{
            width: '100%',
            background: 'rgba(255, 255, 255, 0.03)',
            border: 'none',
            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
            padding: '14px',
            color: '#fff',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            transition: 'background 0.2s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.07)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)'}
        >
          <FileText size={15} color="var(--neon-green)" />
          View Itemized Receipt
        </button>
      </div>

      {/* 3D Podium Graphic preview */}
      <div style={{ margin: '0 auto 20px auto', width: '130px', opacity: 0.85 }}>
        <img 
          src={podiumImg} 
          alt="Podium Rank 3" 
          style={{ width: '100%', objectFit: 'contain', filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.5))' }} 
        />
      </div>

      {/* Bottom CTA Buttons (Reference Screenshot Match) */}
      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <button
          onClick={handleDone}
          style={{
            background: 'none',
            border: 'none',
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: '15px',
            fontWeight: 600,
            cursor: 'pointer',
            padding: '6px',
          }}
        >
          Done
        </button>

        <button
          onClick={() => {
            playVanitiSound('auth');
            setJoinedVip(true);
            setShowVipModal(true);
          }}
          style={{
            background: joinedVip 
              ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' 
              : 'linear-gradient(135deg, #b45309 0%, #d97706 50%, #f59e0b 100%)',
            color: '#000',
            fontWeight: 800,
            fontSize: '16px',
            padding: '16px',
            borderRadius: '16px',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 8px 30px rgba(217, 119, 6, 0.4)',
            transition: 'all 0.2s',
          }}
        >
          {joinedVip ? 'VIP Club Pass Activated (View) 👑' : 'Join the VIP Club'}
        </button>
      </div>

      {/* Itemized Receipt Modal */}
      {showReceiptModal && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(9, 11, 14, 0.96)',
            backdropFilter: 'blur(20px)',
            zIndex: 50,
            padding: '24px 20px',
            display: 'flex',
            flexDirection: 'column',
            animation: 'pop-up 0.25s ease-out',
            textAlign: 'left'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'var(--neon-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: 900 }}>
                Z
              </div>
              <h3 style={{ fontSize: '17px', color: '#fff', fontWeight: 700 }}>Official Vaniti Receipt</h3>
            </div>

            <button
              onClick={() => setShowReceiptModal(false)}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                color: '#fff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <X size={18} />
            </button>
          </div>

          <div
            style={{
              background: '#121620',
              borderRadius: '18px',
              padding: '18px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              fontSize: '13px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
              <span>Transaction Reference</span>
              <strong style={{ color: '#fff', fontFamily: 'monospace' }}>{refCode}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
              <span>Celebrant Recipient</span>
              <strong style={{ color: '#fff' }}>{activeEvent?.hostName}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
              <span>Event / Stage</span>
              <strong style={{ color: '#fff' }}>{activeEvent?.title}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
              <span>Settlement Account</span>
              <strong style={{ color: '#fff' }}>{activeEvent?.settlementWallet}</strong>
            </div>

            <div style={{ height: '1px', background: 'rgba(255, 255, 255, 0.08)' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
              <span>Denomination Selected</span>
              <strong style={{ color: '#fff' }}>₦{selectedDenomId} Notes</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
              <span>Total Notes F自定义ed</span>
              <strong style={{ color: '#fff' }}>{totalNotesSprayed}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
              <span>Zengly Processing Fee</span>
              <span style={{ color: 'var(--neon-green)', fontWeight: 600 }}>₦0.00 (Zero Fee Waiver)</span>
            </div>

            <div style={{ height: '1px', background: 'rgba(255, 255, 255, 0.08)' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '15px', fontWeight: 700, color: '#fff' }}>Total Settled</span>
              <span style={{ fontSize: '20px', fontWeight: 900, color: 'var(--neon-green)' }}>
                ₦{sprayedAmount.toLocaleString()}
              </span>
            </div>
          </div>

          <div style={{ marginTop: 'auto', display: 'flex', gap: '10px' }}>
            <button
              onClick={() => {
                handleDownload();
                setShowReceiptModal(false);
              }}
              style={{
                flex: 1,
                background: 'rgba(57, 255, 20, 0.15)',
                color: 'var(--neon-green)',
                border: '1px solid var(--neon-green)',
                borderRadius: '14px',
                padding: '12px',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <Download size={15} /> Save PDF Copy
            </button>

            <button
              onClick={() => setShowReceiptModal(false)}
              style={{
                flex: 1,
                background: 'rgba(255, 255, 255, 0.08)',
                color: '#fff',
                border: '1px solid var(--border-glass)',
                borderRadius: '14px',
                padding: '12px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Holographic VIP Club Pass Modal */}
      {showVipModal && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(9, 11, 14, 0.96)',
            backdropFilter: 'blur(20px)',
            zIndex: 60,
            padding: '24px 20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'pop-up 0.25s ease-out',
            textAlign: 'center'
          }}
        >
          {/* VIP Pass Card */}
          <div
            style={{
              width: '100%',
              maxWidth: '340px',
              borderRadius: '24px',
              padding: '24px 20px',
              background: 'linear-gradient(145deg, #1c1917 0%, #292524 50%, #0c0a09 100%)',
              border: '2px solid rgba(245, 158, 11, 0.5)',
              boxShadow: '0 20px 50px rgba(217, 119, 6, 0.35), 0 0 30px rgba(245, 158, 11, 0.2)',
              position: 'relative',
              overflow: 'hidden',
              marginBottom: '20px'
            }}
          >
            {/* Holographic shimmer strip */}
            <div 
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '120px',
                height: '100%',
                background: 'linear-gradient(90deg, transparent 0%, rgba(245, 158, 11, 0.15) 50%, transparent 100%)',
                transform: 'skewX(-25deg)',
              }}
            />

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '22px' }}>👑</span>
                <span style={{ fontSize: '14px', fontWeight: 800, color: '#fbbf24', letterSpacing: '1px' }}>
                  ZENGLY VANITI VIP
                </span>
              </div>
              <span style={{ fontSize: '11px', background: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b', padding: '2px 8px', borderRadius: '10px', fontWeight: 700 }}>
                GOLD TIER
              </span>
            </div>

            <div style={{ textAlign: 'left', marginBottom: '20px' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                MEMBER NAME & ID
              </span>
              <h4 style={{ fontSize: '17px', color: '#fff', fontWeight: 800 }}>Kelvin Ekuhoho</h4>
              <p style={{ fontSize: '12px', color: '#fbbf24', fontFamily: 'monospace' }}>#VIP-0042 • LAGOS CIRCLE</p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '12px', textAlign: 'left' }}>
              <div>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>MEMBER PERK</span>
                <span style={{ fontSize: '12px', color: '#fff', fontWeight: 600, display: 'block' }}>Zero Surcharges</span>
              </div>
              <div>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>PROXIMITY</span>
                <span style={{ fontSize: '12px', color: 'var(--neon-green)', fontWeight: 600, display: 'block' }}>Priority Radar Lock</span>
              </div>
              <div>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>EXPIRY</span>
                <span style={{ fontSize: '12px', color: '#fff', fontWeight: 600, display: 'block' }}>Lifetime VIP</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', maxWidth: '340px' }}>
            <button
              onClick={() => {
                alert('VIP Pass saved to device wallet!');
                setShowVipModal(false);
              }}
              style={{
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                color: '#000',
                fontWeight: 800,
                padding: '14px',
                borderRadius: '14px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Add to Mobile Wallet 📱
            </button>
            <button
              onClick={() => setShowVipModal(false)}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                color: '#fff',
                fontWeight: 600,
                padding: '12px',
                borderRadius: '14px',
                border: '1px solid var(--border-glass)',
                cursor: 'pointer',
                fontSize: '13px'
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
