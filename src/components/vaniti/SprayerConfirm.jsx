import React from 'react';
import { useVaniti } from './VanitiContext';
import { 
  ShieldCheck, 
  MapPin, 
  Users, 
  ArrowLeft, 
  ChevronRight, 
  CheckCircle2, 
  Radio, 
  Lock,
  Sparkles
} from 'lucide-react';

export default function SprayerConfirm() {
  const { 
    activeEvent, 
    setSprayerStep, 
    playVanitiSound 
  } = useVaniti();

  const handleConfirm = () => {
    playVanitiSound('flick');
    setSprayerStep('config');
  };

  const handleBack = () => {
    playVanitiSound('flick');
    setSprayerStep('discovery');
  };

  if (!activeEvent) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto', padding: '0 4px 20px 4px' }}>
      {/* Top navigation */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <button
          onClick={handleBack}
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid var(--border-glass)',
            borderRadius: '50%',
            width: '38px',
            height: '38px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            cursor: 'pointer',
          }}
        >
          <ArrowLeft size={18} />
        </button>

        <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 600 }}>
          Proximity Verification
        </span>

        <div style={{ width: '38px' }} />
      </div>

      {/* Confirmation Hero Banner */}
      <div 
        className="glass"
        style={{
          borderRadius: '24px',
          padding: '24px 20px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          background: 'linear-gradient(180deg, rgba(16, 185, 129, 0.08) 0%, rgba(18, 22, 30, 0.8) 100%)'
        }}
      >
        {/* Verification Check Badge */}
        <div 
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            color: '#34d399',
            fontSize: '12px',
            fontWeight: 700,
            padding: '4px 12px',
            borderRadius: '20px',
            marginBottom: '16px'
          }}
        >
          <Radio size={13} className="spin-anim" />
          STAGE BEACON LOCKED IN RANGE
        </div>

        {/* Big Host Avatar */}
        <div style={{ position: 'relative', width: '92px', height: '92px', margin: '0 auto 16px auto' }}>
          <img
            src={activeEvent.hostAvatar}
            alt={activeEvent.hostName}
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '28px',
              objectFit: 'cover',
              border: '3px solid #10b981',
              boxShadow: '0 8px 24px rgba(16, 185, 129, 0.4)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '-6px',
              right: '-6px',
              background: '#10b981',
              borderRadius: '50%',
              width: '26px',
              height: '26px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '3px solid #090b0e',
              boxShadow: '0 2px 8px rgba(0,0,0,0.5)'
            }}
          >
            <CheckCircle2 size={16} color="#fff" />
          </div>
        </div>

        <h2 style={{ fontSize: '22px', color: '#fff', fontWeight: 800, marginBottom: '6px', letterSpacing: '-0.4px' }}>
          Is this {activeEvent.title}?
        </h2>

        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', maxWidth: '300px', margin: '0 auto 18px auto' }}>
          Hosted by <strong style={{ color: '#fff' }}>{activeEvent.hostName}</strong>
        </p>

        {/* Verification Summary Card */}
        <div
          style={{
            background: 'rgba(0, 0, 0, 0.3)',
            borderRadius: '16px',
            padding: '14px',
            textAlign: 'left',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            marginBottom: '20px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <MapPin size={16} color="var(--neon-green)" style={{ flexShrink: 0 }} />
            <div style={{ fontSize: '13px' }}>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '11px' }}>VENUE LOCATION</span>
              <span style={{ color: '#fff', fontWeight: 600 }}>{activeEvent.venue}</span>
            </div>
          </div>

          <div style={{ height: '1px', background: 'rgba(255, 255, 255, 0.05)' }} />

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Users size={16} color="var(--neon-blue)" />
              <span style={{ fontSize: '13px', color: '#fff' }}>
                <strong>{activeEvent.activeSprayers}</strong> guests currently spraying
              </span>
            </div>

            <span style={{ fontSize: '12px', color: 'var(--neon-green)', fontWeight: 700, background: 'rgba(57, 255, 20, 0.1)', padding: '2px 8px', borderRadius: '8px' }}>
              {activeEvent.distanceMeters}m Proximity
            </span>
          </div>
        </div>

        {/* Security / Settlement Guarantee */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '12px', marginBottom: '22px' }}>
          <Lock size={12} />
          <span>Recipient verified • Sprays settle instantly to celebrant</span>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button
            onClick={handleConfirm}
            style={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: '#fff',
              fontWeight: 800,
              fontSize: '15px',
              padding: '14px 20px',
              borderRadius: '16px',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 8px 25px rgba(16, 185, 129, 0.45)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'transform 0.2s',
            }}
            onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
            onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <Sparkles size={18} /> Yes, Confirm & Configure Notes
          </button>

          <button
            onClick={handleBack}
            style={{
              background: 'transparent',
              color: 'var(--text-secondary)',
              fontSize: '13px',
              fontWeight: 600,
              padding: '10px',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Not this event (Return to scan)
          </button>
        </div>
      </div>
    </div>
  );
}
