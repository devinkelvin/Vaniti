import React, { useState } from 'react';
import { useVaniti } from './VanitiContext';
import SprayerDiscovery from './SprayerDiscovery';
import SprayerConfirm from './SprayerConfirm';
import SprayerConfig from './SprayerConfig';
import SprayerStage from './SprayerStage';
import SprayerReceipt from './SprayerReceipt';
import HostSetup from './HostSetup';
import HostBroadcast from './HostBroadcast';
import HostAnalytics from './HostAnalytics';
import { 
  X, 
  Sparkles, 
  Tv, 
  Zap, 
  HelpCircle, 
  SplitSquareVertical, 
  Smartphone, 
  Wallet, 
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Sun,
  Moon
} from 'lucide-react';

export default function VanitiModal() {
  const { 
    isOpen, 
    setIsOpen, 
    role, 
    setRole, 
    sprayerStep, 
    setSprayerStep,
    hostStep, 
    setHostStep,
    isDualDemo, 
    setIsDualDemo,
    walletBalance,
    topUpWallet,
    playVanitiSound,
    theme,
    toggleTheme
  } = useVaniti();

  const [showOnboardingModal, setShowOnboardingModal] = useState(false);

  if (!isOpen) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 2000,
        background: 'rgba(5, 7, 10, 0.85)',
        backdropFilter: 'blur(20px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        animation: 'fade-in 0.25s ease-out',
      }}
    >
      {/* Outer App Shell / Frame */}
      <div 
        className="glass"
        style={{
          width: isDualDemo ? '96vw' : role === 'sprayer' && sprayerStep === 'stage' ? '430px' : '480px',
          height: isDualDemo ? '92vh' : '90vh',
          maxHeight: '880px',
          borderRadius: '28px',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          position: 'relative',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.7), 0 0 40px rgba(57, 255, 20, 0.15)',
          transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {/* Global Modal Top Navigation Bar */}
        <div 
          style={{
            padding: '12px 18px',
            background: 'rgba(10, 13, 18, 0.8)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            zIndex: 30,
          }}
        >
          {/* Logo & Brand Tag */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div 
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: '14px',
                fontWeight: 900,
                boxShadow: '0 2px 10px rgba(16, 185, 129, 0.4)'
              }}
            >
              V
            </div>
            <div>
              <span style={{ fontSize: '15px', fontWeight: 800, color: '#fff', letterSpacing: '-0.2px' }}>
                Vaniti
              </span>
              <span style={{ fontSize: '10px', color: 'var(--neon-green)', marginLeft: '6px', fontWeight: 700 }}>
                BY ZENGLY
              </span>
            </div>
          </div>

          {/* Center Navigation Shortcuts */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {/* Dual Screen Test Mode Button */}
            <button
              onClick={() => {
                playVanitiSound('flick');
                setIsDualDemo(!isDualDemo);
                if (!role) setRole('sprayer');
              }}
              title="Toggle Dual Demo Mode: Sprayer on left, Projector on right side-by-side!"
              style={{
                background: isDualDemo ? 'rgba(57, 255, 20, 0.15)' : 'rgba(255, 255, 255, 0.06)',
                border: isDualDemo ? '1px solid var(--neon-green)' : '1px solid var(--border-glass)',
                color: isDualDemo ? 'var(--neon-green)' : 'var(--text-secondary)',
                borderRadius: '16px',
                padding: '5px 10px',
                fontSize: '11px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                transition: 'all 0.2s',
              }}
            >
              <SplitSquareVertical size={13} />
              {isDualDemo ? 'Dual Demo ON' : 'Dual Screen Demo'}
            </button>

            {/* Theme Toggle Button */}
            <button
              onClick={() => {
                playVanitiSound('click');
                toggleTheme();
              }}
              title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
              id="vaniti-theme-toggle"
              style={{
                background: theme === 'light' ? 'rgba(217, 119, 6, 0.12)' : 'rgba(168, 85, 247, 0.12)',
                border: theme === 'light' ? '1px solid rgba(217, 119, 6, 0.3)' : '1px solid rgba(168, 85, 247, 0.3)',
                color: theme === 'light' ? '#d97706' : '#c084fc',
                borderRadius: '16px',
                padding: '5px 10px',
                fontSize: '11px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                transition: 'all 0.2s',
              }}
            >
              {theme === 'light' ? <Moon size={13} /> : <Sun size={13} />}
              <span>{theme === 'light' ? 'Dark' : 'Light'}</span>
            </button>

            {/* Guide / How it Works */}
            <button
              onClick={() => setShowOnboardingModal(true)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                padding: '4px',
              }}
            >
              <HelpCircle size={16} />
            </button>
          </div>

          {/* Close button */}
          <button
            onClick={() => {
              playVanitiSound('flick');
              setIsOpen(false);
            }}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid var(--border-glass)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              cursor: 'pointer',
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Body Container */}
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
          {isDualDemo ? (
            /* Dual Screen Synchronized Layout */
            <div style={{ display: 'grid', gridTemplateColumns: '400px 1fr', height: '100%', overflow: 'hidden' }}>
              {/* Left Phone: Sprayer Flow */}
              <div style={{ borderRight: '1px solid rgba(255, 255, 255, 0.1)', height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column', background: '#090b0e' }}>
                <div style={{ padding: '8px 16px', background: 'rgba(57, 255, 20, 0.08)', borderBottom: '1px solid rgba(57, 255, 20, 0.2)', fontSize: '11px', color: 'var(--neon-green)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Smartphone size={14} /> GUEST PHONE: SPRAYER STAGE
                </div>
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <SprayerStage />
                </div>
              </div>

              {/* Right Big Screen: Host Projector Broadcast */}
              <div style={{ height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '8px 20px', background: 'rgba(245, 158, 11, 0.08)', borderBottom: '1px solid rgba(245, 158, 11, 0.2)', fontSize: '11px', color: '#f59e0b', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Tv size={14} /> VENUE PROJECTOR: LIVE STAGE BROADCAST (UPDATES INSTANTLY ON NOTES FLICKED)
                </div>
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <HostBroadcast />
                </div>
              </div>
            </div>
          ) : (
            /* Single Role Flow Routing */
            <div style={{ height: '100%', overflow: 'hidden', padding: role === 'sprayer' && sprayerStep === 'stage' ? '0' : '16px 20px 20px 20px' }}>
              {/* ROLE GATEWAY (No role selected yet) */}
              {!role && (
                <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between', padding: '10px 0' }}>
                  <div>
                    {/* Header title */}
                    <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                      <div 
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          background: 'rgba(16, 185, 129, 0.1)',
                          border: '1px solid rgba(16, 185, 129, 0.25)',
                          borderRadius: '20px',
                          padding: '4px 12px',
                          fontSize: '11px',
                          fontWeight: 700,
                          color: 'var(--neon-green)',
                          marginBottom: '10px'
                        }}
                      >
                        <Sparkles size={13} />
                        DIGITAL SOCIAL CURRENCY SPRAYING
                      </div>

                      <h2 style={{ fontSize: '26px', fontWeight: 900, color: '#fff', letterSpacing: '-0.5px' }}>
                        Welcome to Vaniti
                      </h2>
                      <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                        Choose your role to enter the synchronized live stage
                      </p>
                    </div>

                    {/* TWO CLEAR CARDS: Spray Money vs Host an Event */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {/* CARD 1: SPRAY MONEY */}
                      <div
                        onClick={() => {
                          playVanitiSound('flick');
                          setRole('sprayer');
                          setSprayerStep('discovery');
                        }}
                        className="glass glass-hover"
                        style={{
                          borderRadius: '24px',
                          padding: '22px 20px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '16px',
                          border: '1px solid rgba(57, 255, 20, 0.25)',
                          background: 'linear-gradient(135deg, rgba(57, 255, 20, 0.08) 0%, rgba(18, 22, 30, 0.85) 100%)',
                          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.3)',
                          transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                        }}
                      >
                        <div
                          style={{
                            width: '58px',
                            height: '58px',
                            borderRadius: '18px',
                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '28px',
                            boxShadow: '0 8px 20px rgba(16, 185, 129, 0.4)',
                            flexShrink: 0,
                          }}
                        >
                          💸
                        </div>

                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#fff' }}>
                              Spray Money
                            </h3>
                            <span style={{ fontSize: '10px', fontWeight: 800, background: 'rgba(57, 255, 20, 0.15)', color: 'var(--neon-green)', padding: '2px 6px', borderRadius: '6px' }}>
                              GUEST
                            </span>
                          </div>
                          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                            Scan proximity radar for live celebrants, configure crisp Naira notes, and flick cash on stage.
                          </p>
                        </div>

                        <ChevronRight size={22} color="var(--neon-green)" />
                      </div>

                      {/* CARD 2: HOST AN EVENT */}
                      <div
                        onClick={() => {
                          playVanitiSound('flick');
                          setRole('host');
                          setHostStep('setup');
                        }}
                        className="glass glass-hover"
                        style={{
                          borderRadius: '24px',
                          padding: '22px 20px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '16px',
                          border: '1px solid rgba(245, 158, 11, 0.25)',
                          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(18, 22, 30, 0.85) 100%)',
                          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.3)',
                          transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                        }}
                      >
                        <div
                          style={{
                            width: '58px',
                            height: '58px',
                            borderRadius: '18px',
                            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '28px',
                            boxShadow: '0 8px 20px rgba(245, 158, 11, 0.4)',
                            flexShrink: 0,
                          }}
                        >
                          👑
                        </div>

                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#fff' }}>
                              Host an Event
                            </h3>
                            <span style={{ fontSize: '10px', fontWeight: 800, background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', padding: '2px 6px', borderRadius: '6px' }}>
                              STAGE
                            </span>
                          </div>
                          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                            Launch a live projector broadcast, show real-time 3D podium rankings, control stages & settle to bank.
                          </p>
                        </div>

                        <ChevronRight size={22} color="#f59e0b" />
                      </div>
                    </div>
                  </div>

                  {/* Dual Demo Teaser Pill at bottom */}
                  <div
                    onClick={() => {
                      playVanitiSound('flick');
                      setIsDualDemo(true);
                      setRole('sprayer');
                    }}
                    className="glass-hover"
                    style={{
                      background: 'rgba(255, 255, 255, 0.04)',
                      borderRadius: '16px',
                      padding: '12px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      border: '1px solid var(--border-glass)',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <SplitSquareVertical size={18} color="var(--neon-blue)" />
                      <div>
                        <span style={{ fontSize: '13px', fontWeight: 700, color: '#fff', display: 'block' }}>
                          Try Dual Screen Demo Mode
                        </span>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                          See phone sprayer and projector big screen side-by-side
                        </span>
                      </div>
                    </div>
                    <ArrowRight size={16} color="var(--neon-blue)" />
                  </div>
                </div>
              )}

              {/* SPRAYER FLOW */}
              {role === 'sprayer' && (
                <>
                  {sprayerStep === 'discovery' && <SprayerDiscovery />}
                  {sprayerStep === 'confirm' && <SprayerConfirm />}
                  {sprayerStep === 'config' && <SprayerConfig />}
                  {sprayerStep === 'stage' && <SprayerStage />}
                  {sprayerStep === 'receipt' && <SprayerReceipt />}
                </>
              )}

              {/* HOST FLOW */}
              {role === 'host' && (
                <>
                  {hostStep === 'setup' && <HostSetup />}
                  {hostStep === 'broadcast' && <HostBroadcast />}
                  {hostStep === 'analytics' && <HostAnalytics />}
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* First-Time Onboarding Modal ("What is Vaniti?") */}
      {showOnboardingModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(20px)',
            zIndex: 2500,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
        >
          <div
            className="glass"
            style={{
              borderRadius: '24px',
              padding: '28px',
              maxWidth: '420px',
              width: '100%',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              textAlign: 'center'
            }}
          >
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', margin: '0 auto 16px auto', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px' }}>
              💸
            </div>

            <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>
              How Vaniti Works
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '20px' }}>
              Vaniti re-imagines African social currency spraying for the digital age:
            </p>

            <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', gap: '10px' }}>
                <span style={{ color: 'var(--neon-green)', fontWeight: 800 }}>1.</span>
                <span style={{ color: '#fff' }}><strong>Proximity Beacon:</strong> Find wedding or party stages nearby automatically without typing account numbers.</span>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <span style={{ color: 'var(--neon-green)', fontWeight: 800 }}>2.</span>
                <span style={{ color: '#fff' }}><strong>Authentic Banknotes:</strong> Spray ₦200, ₦500, ₦1,000, or 100-note strapped bundles with real swipe physics.</span>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <span style={{ color: 'var(--neon-green)', fontWeight: 800 }}>3.</span>
                <span style={{ color: '#fff' }}><strong>Projector Broadcast:</strong> Venues project live sprays, flying cash particles, and podium leaderboards in real time.</span>
              </div>
            </div>

            <button
              onClick={() => setShowOnboardingModal(false)}
              style={{
                width: '100%',
                background: 'var(--neon-green)',
                color: '#000',
                fontWeight: 800,
                padding: '14px',
                borderRadius: '14px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '15px'
              }}
            >
              Got it, let's go!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
