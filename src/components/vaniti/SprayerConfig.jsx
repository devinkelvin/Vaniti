import React, { useState } from 'react';
import { useVaniti, DENOMINATIONS } from './VanitiContext';
import { 
  ArrowLeft, 
  Wallet, 
  Plus, 
  Fingerprint, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles, 
  Zap,
  Lock
} from 'lucide-react';
import naira100Img from '../../assets/vaniti/naira_100.png';
import naira200Img from '../../assets/vaniti/naira_200.png';
import naira500Img from '../../assets/vaniti/naira_500.png';
import naira1000Img from '../../assets/vaniti/naira_1000.png';
import usd100Img from '../../assets/vaniti/usd_100.png';
import bundleImg from '../../assets/vaniti/bundle_stack_200.png';

export default function SprayerConfig() {
  const { 
    walletBalance, 
    setWalletBalance,
    selectedDenomId, 
    setSelectedDenomId, 
    sprayPotTarget, 
    setSprayPotTarget, 
    setSprayedAmount,
    setSprayerStep, 
    setSessionStartTime,
    playVanitiSound,
    activeEvent,
    setIsTopUpOpen
  } = useVaniti();

  const [isAuthorizing, setIsAuthorizing] = useState(false);
  const [authSuccess, setAuthSuccess] = useState(false);
  const [customPotInput, setCustomPotInput] = useState('');
  const [isCustomPot, setIsCustomPot] = useState(false);

  const selectedDenom = DENOMINATIONS.find(d => d.id === selectedDenomId) || DENOMINATIONS[0];
  const isInsufficient = sprayPotTarget > walletBalance;

  const potPresets = [10000, 20000, 50000, 100000];

  const handleSelectPreset = (amount) => {
    playVanitiSound('flick');
    setIsCustomPot(false);
    setSprayPotTarget(amount);
  };

  const handleCustomPotSubmit = (val) => {
    const num = parseInt(val.replace(/\D/g, ''), 10) || 0;
    setCustomPotInput(num ? num.toLocaleString() : '');
    setSprayPotTarget(num);
  };

  const handleAuthorizeAndEnterStage = () => {
    if (isInsufficient) {
      playVanitiSound('flick');
      return;
    }

    setIsAuthorizing(true);
    playVanitiSound('flick');

    // Simulate Face ID / Biometric verification
    setTimeout(() => {
      setIsAuthorizing(false);
      setAuthSuccess(true);
      playVanitiSound('auth');

      setTimeout(() => {
        setSprayedAmount(0);
        setSessionStartTime(Date.now());
        setSprayerStep('stage');
      }, 700);
    }, 1100);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto', padding: '0 4px 20px 4px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <button
          onClick={() => setSprayerStep('confirm')}
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
          Configure Spray Pot
        </span>

        <div style={{ width: '38px' }} />
      </div>

      {/* Wallet Balance Bar */}
      <div
        className="glass"
        style={{
          borderRadius: '18px',
          padding: '14px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          marginBottom: '20px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'rgba(57, 255, 20, 0.1)',
              border: '1px solid rgba(57, 255, 20, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--neon-green)'
            }}
          >
            <Wallet size={20} />
          </div>
          <div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
              Zengly Vault Balance
            </span>
            <h4 style={{ fontSize: '18px', color: '#fff', fontWeight: 800 }}>
              ₦{walletBalance.toLocaleString()}
            </h4>
          </div>
        </div>

        <button
          onClick={() => {
            // Quick top up ₦50,000 for effortless testing & recovery
            setWalletBalance(prev => prev + 50000);
            playVanitiSound('cash_drop');
          }}
          style={{
            background: 'rgba(57, 255, 20, 0.12)',
            color: 'var(--neon-green)',
            border: '1px solid rgba(57, 255, 20, 0.3)',
            borderRadius: '12px',
            padding: '8px 12px',
            fontSize: '12px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            transition: 'all 0.2s',
          }}
        >
          <Plus size={14} /> +₦50k
        </button>
      </div>

      {/* 1. Pick Note Style / Denomination */}
      <div style={{ marginBottom: '22px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
          <label style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            1. Select Note Style
          </label>
          <span style={{ fontSize: '11px', color: 'var(--neon-green)', fontWeight: 600 }}>
            Central Bank Authentic
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
          {DENOMINATIONS.map((d) => {
            const isSelected = selectedDenomId === d.id;
            return (
              <div
                key={d.id}
                onClick={() => {
                  playVanitiSound('flick');
                  setSelectedDenomId(d.id);
                }}
                className="glass-hover"
                style={{
                  borderRadius: '16px',
                  padding: '12px',
                  cursor: 'pointer',
                  border: isSelected ? `2px solid ${d.accent}` : '1px solid var(--border-glass)',
                  background: isSelected 
                    ? `linear-gradient(145deg, rgba(255,255,255,0.08) 0%, ${d.color}22 100%)`
                    : 'rgba(18, 22, 30, 0.6)',
                  boxShadow: isSelected ? `0 4px 20px ${d.color}40` : 'none',
                  transition: 'all 0.2s ease',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {/* Visual Note Preview Strip */}
                <div 
                  style={{
                    height: '56px',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    marginBottom: '8px',
                    position: 'relative',
                    background: d.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: 'inset 0 0 12px rgba(0,0,0,0.3)'
                  }}
                >
                  {d.id === '100' && (
                    <img 
                      src={naira100Img} 
                      alt="₦100 Note" 
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'rotate(-2deg) scale(1.1)' }} 
                    />
                  )}
                  {d.id === '200' && (
                    <img 
                      src={naira200Img} 
                      alt="₦200 Note" 
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'rotate(-2deg) scale(1.1)' }} 
                    />
                  )}
                  {d.id === '500' && (
                    <img 
                      src={naira500Img} 
                      alt="₦500 Note" 
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'rotate(-2deg) scale(1.1)' }} 
                    />
                  )}
                  {d.id === '1000' && (
                    <img 
                      src={naira1000Img} 
                      alt="₦1,000 Note" 
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'rotate(-2deg) scale(1.1)' }} 
                    />
                  )}
                  {d.id === 'usd100' && (
                    <img 
                      src={usd100Img} 
                      alt="$100 Note" 
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'rotate(-2deg) scale(1.1)' }} 
                    />
                  )}
                  {d.id === 'bundle' && (
                    <img 
                      src={bundleImg} 
                      alt="Mint Bundle" 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                  )}

                  {isSelected && (
                    <div style={{ position: 'absolute', top: '4px', right: '4px', background: '#fff', borderRadius: '50%', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 6px rgba(0,0,0,0.4)' }}>
                      <CheckCircle2 size={14} color={d.color} />
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <h4 style={{ fontSize: '15px', color: '#fff', fontWeight: 700 }}>{d.label}</h4>
                    <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{d.description.split('•')[0]}</p>
                  </div>
                  {d.isBundle && (
                    <span style={{ fontSize: '9px', background: 'rgba(234, 179, 8, 0.2)', color: '#facc15', padding: '2px 6px', borderRadius: '6px', fontWeight: 700 }}>
                      100-PACK
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Pick Spray Pot Allocation */}
      <div style={{ marginBottom: '22px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
          <label style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            2. Spray Pot Size
          </label>
          <span style={{ fontSize: '12px', color: '#fbbf24', fontWeight: 700 }}>
            {Math.floor(sprayPotTarget / selectedDenom.value)} {selectedDenom.isBundle ? 'Bundles' : 'Notes'}
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '10px' }}>
          {potPresets.map((amount) => {
            const isSelected = !isCustomPot && sprayPotTarget === amount;
            return (
              <button
                key={amount}
                onClick={() => handleSelectPreset(amount)}
                style={{
                  background: isSelected ? 'var(--neon-green)' : 'rgba(255, 255, 255, 0.05)',
                  color: isSelected ? '#000' : '#fff',
                  border: isSelected ? 'none' : '1px solid var(--border-glass)',
                  borderRadius: '12px',
                  padding: '10px 4px',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                ₦{(amount / 1000)}k
              </button>
            );
          })}
        </div>

        {/* Custom Pot Amount Input */}
        <div style={{ position: 'relative' }}>
          <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: '14px', fontWeight: 600 }}>
            ₦ Custom:
          </span>
          <input
            type="text"
            placeholder="e.g. 150,000"
            value={customPotInput}
            onChange={(e) => {
              setIsCustomPot(true);
              handleCustomPotSubmit(e.target.value);
            }}
            onFocus={() => setIsCustomPot(true)}
            style={{
              width: '100%',
              background: isCustomPot ? 'rgba(0, 0, 0, 0.4)' : 'rgba(0, 0, 0, 0.2)',
              border: isCustomPot ? '1px solid var(--neon-green)' : '1px solid var(--border-glass)',
              borderRadius: '12px',
              padding: '10px 14px 10px 84px',
              color: '#fff',
              fontSize: '14px',
              outline: 'none',
              fontFamily: 'var(--font-sans)',
            }}
          />
        </div>

        {/* Insufficient balance edge case */}
        {isInsufficient && (
          <div
            style={{
              marginTop: '10px',
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '12px',
              padding: '10px 14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '10px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#f87171' }}>
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span>Insufficient balance for ₦{sprayPotTarget.toLocaleString()} pot</span>
            </div>

            <button
              onClick={() => {
                setWalletBalance(prev => prev + (sprayPotTarget - walletBalance + 20000));
                playVanitiSound('cash_drop');
              }}
              style={{
                background: '#ef4444',
                color: '#fff',
                fontSize: '11px',
                fontWeight: 700,
                border: 'none',
                borderRadius: '8px',
                padding: '5px 10px',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              Deposit Difference
            </button>
          </div>
        )}
      </div>

      {/* 3. Single Authorization & Launch CTA */}
      <div style={{ marginTop: 'auto', paddingTop: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '12px', marginBottom: '12px' }}>
          <Lock size={12} />
          <span>Authorize once. Swipe notes freely on the live stage without PINs</span>
        </div>

        <button
          onClick={handleAuthorizeAndEnterStage}
          disabled={isAuthorizing || authSuccess || isInsufficient}
          style={{
            width: '100%',
            background: isInsufficient 
              ? 'rgba(255, 255, 255, 0.1)' 
              : authSuccess 
                ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            color: isInsufficient ? 'var(--text-muted)' : '#000',
            fontWeight: 800,
            fontSize: '16px',
            padding: '16px',
            borderRadius: '18px',
            border: 'none',
            cursor: isInsufficient ? 'not-allowed' : 'pointer',
            boxShadow: isInsufficient ? 'none' : '0 8px 30px rgba(245, 158, 11, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {isAuthorizing ? (
            <>
              <Fingerprint size={22} className="spin-anim" />
              <span>Verifying Face ID / Biometrics...</span>
            </>
          ) : authSuccess ? (
            <>
              <CheckCircle2 size={22} color="#000" />
              <span>Authorized! Entering Stage...</span>
            </>
          ) : (
            <>
              <Fingerprint size={22} />
              <span>Authorize & Enter Spray Stage</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
