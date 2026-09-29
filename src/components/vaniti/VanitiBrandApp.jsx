import React, { useState, useEffect, useRef } from 'react';
import { useVaniti } from './VanitiContext';
import { 
  ChevronLeft, 
  ChevronDown, 
  X, 
  QrCode, 
  Radio, 
  Users, 
  Download, 
  Share2, 
  Home, 
  Clock, 
  PieChart, 
  User, 
  Check, 
  Sparkles, 
  Flame, 
  Volume2, 
  VolumeX, 
  Trophy, 
  RotateCcw,
  CheckCircle2,
  FileText
} from 'lucide-react';
import naira200Img from '../../assets/vaniti/naira_200.png';
import naira100Img from '../../assets/vaniti/naira_100.png';
import naira500Img from '../../assets/vaniti/naira_500.png';
import naira1000Img from '../../assets/vaniti/naira_1000.png';
import bundleImg from '../../assets/vaniti/bundle_stack_200.png';
import { 
  QrScannerModal, 
  NfcTapModal, 
  ContactsModal, 
  AnimationPickerSheet 
} from './VanitiModals';
import VanitiHistoryTab from './VanitiHistoryTab';
import VanitiInsightTab from './VanitiInsightTab';
import VanitiAccountTab from './VanitiAccountTab';

// Flag & Coin Icons for Currencies
const NigeriaFlag = () => (
  <div style={{ width: '28px', height: '28px', borderRadius: '50%', overflow: 'hidden', display: 'flex', border: '1px solid rgba(255,255,255,0.15)', flexShrink: 0 }}>
    <div style={{ flex: 1, background: '#008751' }} />
    <div style={{ flex: 1, background: '#ffffff' }} />
    <div style={{ flex: 1, background: '#008751' }} />
  </div>
);

const USFlag = () => (
  <div style={{ width: '28px', height: '28px', borderRadius: '50%', overflow: 'hidden', position: 'relative', background: '#b22234', border: '1px solid rgba(255,255,255,0.15)', flexShrink: 0 }}>
    <div style={{ position: 'absolute', top: 0, left: 0, width: '45%', height: '50%', background: '#3c3b6e' }} />
    <div style={{ position: 'absolute', top: '15%', left: '45%', right: 0, height: '14%', background: '#fff' }} />
    <div style={{ position: 'absolute', top: '45%', left: '45%', right: 0, height: '14%', background: '#fff' }} />
    <div style={{ position: 'absolute', top: '75%', left: 0, right: 0, height: '14%', background: '#fff' }} />
  </div>
);

const ZenglyCoinIcon = () => (
  <div style={{ 
    width: '28px', 
    height: '28px', 
    borderRadius: '50%', 
    background: 'radial-gradient(circle at 35% 35%, #ffd700, #b8860b)', 
    border: '2px solid #ffe066', 
    boxShadow: '0 0 8px rgba(255, 215, 0, 0.4)', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center',
    color: '#5c4300',
    fontWeight: 900,
    fontSize: '12px',
    flexShrink: 0
  }}>
    Z
  </div>
);

const UAEFlag = () => (
  <div style={{ width: '28px', height: '28px', borderRadius: '50%', overflow: 'hidden', position: 'relative', display: 'flex', border: '1px solid rgba(255,255,255,0.15)', flexShrink: 0 }}>
    <div style={{ width: '30%', background: '#ff0000', height: '100%' }} />
    <div style={{ width: '70%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, background: '#00732f' }} />
      <div style={{ flex: 1, background: '#ffffff' }} />
      <div style={{ flex: 1, background: '#000000' }} />
    </div>
  </div>
);

const BitcoinIcon = () => (
  <div style={{ 
    width: '28px', 
    height: '28px', 
    borderRadius: '50%', 
    background: '#f7931a', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center',
    color: '#fff',
    fontWeight: 900,
    fontSize: '15px',
    boxShadow: '0 0 8px rgba(247, 147, 26, 0.4)',
    flexShrink: 0
  }}>
    ₿
  </div>
);

// Benny Avatar matching Screenshot 1
const BennyAvatar = ({ size = 32 }) => (
  <div style={{ 
    width: `${size}px`, 
    height: `${size}px`, 
    borderRadius: '50%', 
    overflow: 'hidden', 
    border: '1.5px solid rgba(255, 255, 255, 0.3)',
    background: '#2a221f',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  }}>
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      {/* Afro hair background */}
      <circle cx="32" cy="28" r="24" fill="#1c1410" />
      <circle cx="16" cy="24" r="10" fill="#1c1410" />
      <circle cx="48" cy="24" r="10" fill="#1c1410" />
      <circle cx="20" cy="14" r="11" fill="#1c1410" />
      <circle cx="44" cy="14" r="11" fill="#1c1410" />
      <circle cx="32" cy="11" r="12" fill="#1c1410" />
      {/* Face */}
      <ellipse cx="32" cy="34" rx="14" ry="16" fill="#8d5536" />
      {/* Eyes */}
      <ellipse cx="26" cy="32" rx="2.5" ry="2" fill="#1f140e" />
      <ellipse cx="38" cy="32" rx="2.5" ry="2" fill="#1f140e" />
      <circle cx="27" cy="31.5" r="0.8" fill="#ffffff" />
      <circle cx="39" cy="31.5" r="0.8" fill="#ffffff" />
      {/* Lips */}
      <ellipse cx="32" cy="42" rx="4" ry="2" fill="#a84343" />
      {/* Gold earring */}
      <circle cx="17" cy="37" r="2.5" stroke="#f59e0b" strokeWidth="1.5" fill="none" />
      <circle cx="47" cy="37" r="2.5" stroke="#f59e0b" strokeWidth="1.5" fill="none" />
      {/* Neck & top */}
      <path d="M26 48 L26 56 L38 56 L38 48 Z" fill="#7a462b" />
      <path d="M18 56 Q32 62 46 56 L54 64 L10 64 Z" fill="#d97706" />
    </svg>
  </div>
);

export default function VanitiBrandApp({ onBackToMap }) {
  const { 
    walletBalance, 
    setWalletBalance,
    playVanitiSound,
    soundEnabled,
    setSoundEnabled
  } = useVaniti();

  // Screen State: 'baller' (Screenshot 4) | 'spraying' (Screenshot 1) | 'complete' (Screenshot 3)
  const [screen, setScreen] = useState('baller');
  const [ballerTab, setBallerTab] = useState('baller'); // 'baller' | 'leaderboard'
  const [activeNav, setActiveNav] = useState('home'); // 'home' | 'history' | 'insight' | 'account'

  // Form selections
  const [selectedCurrency, setSelectedCurrency] = useState('NGN');
  const [selectedDenom, setSelectedDenom] = useState('200');
  const [sprayAmount, setSprayAmount] = useState('20000.00');
  const [sprayAnimation, setSprayAnimation] = useState('Flying Cash');
  const [selectedRecipient, setSelectedRecipient] = useState('benny');
  const [recipientMethod, setRecipientMethod] = useState('qr'); // 'qr' | 'nfc' | 'contacts'
  const [autoSprayMode, setAutoSprayMode] = useState(false);

  // Bottom Sheets & Modals
  const [showCurrencySheet, setShowCurrencySheet] = useState(false);
  const [showDenomSheet, setShowDenomSheet] = useState(false);
  const [showAnimationSheet, setShowAnimationSheet] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [showNfcModal, setShowNfcModal] = useState(false);
  const [showContactsModal, setShowContactsModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [showVipModal, setShowVipModal] = useState(false);
  const [selectedReceiptItem, setSelectedReceiptItem] = useState(null);

  // Spraying State
  const [sprayedAmount, setSprayedAmount] = useState(0);
  const [sprayPotTarget, setSprayPotTarget] = useState(20000);
  const [flyingNotes, setFlyingNotes] = useState([]);
  const [sessionStartTime, setSessionStartTime] = useState(null);
  const [sprayTimeSeconds, setSprayTimeSeconds] = useState(12);
  const [sprayCount, setSprayCount] = useState(0);

  // Auto spray timer ref
  const autoSprayTimerRef = useRef(null);

  // Currency Definitions (Screenshot 2)
  const CURRENCIES = [
    { id: 'NGN', name: 'Nigerian Naira (NGN)', code: 'NGN', symbol: '₦', icon: <NigeriaFlag /> },
    { id: 'USD', name: 'US Dollar (USD)', code: 'USD', symbol: '$', icon: <USFlag /> },
    { id: 'ZGC', name: 'Zengly Coins', code: 'ZGC', symbol: 'ZC', icon: <ZenglyCoinIcon /> },
    { id: 'AED', name: 'UAE Dirham (AED)', code: 'AED', symbol: 'AED', icon: <UAEFlag /> },
    { id: 'BTC', name: 'Bitcoin (BTC)', code: 'BTC', symbol: '₿', icon: <BitcoinIcon /> },
  ];

  // Denominations (Screenshot 5)
  const DENOMINATIONS = [
    { id: '100', label: '₦100', value: 100, tint: 'normal' },
    { id: '200', label: '₦200', value: 200, tint: 'wine' }, // wine/burgundy tint matching Screenshot 5
    { id: '500', label: '₦500', value: 500, tint: 'normal' },
    { id: '1000', label: '₦1000', value: 1000, tint: 'normal' },
  ];

  const currentCurrency = CURRENCIES.find(c => c.id === selectedCurrency) || CURRENCIES[0];
  const currentDenom = DENOMINATIONS.find(d => d.id === selectedDenom) || DENOMINATIONS[1];

  const noteImageMap = {
    '100': naira100Img,
    '200': naira200Img,
    '500': naira500Img,
    '1000': naira1000Img
  };
  const activeNoteImg = noteImageMap[selectedDenom] || naira200Img;

  // Start Spray Trigger
  const handleStartSpray = () => {
    playVanitiSound('auth');
    const target = parseFloat(sprayAmount.replace(/,/g, '')) || 20000;
    setSprayPotTarget(target);
    setSprayedAmount(0);
    setSprayCount(0);
    setSessionStartTime(Date.now());
    setScreen('spraying');
  };

  // Spray note action (Gesture or Auto)
  const triggerSprayNote = () => {
    const noteVal = currentDenom.value;
    const newSprayed = sprayedAmount + noteVal;
    
    // Add flying note particle
    const noteId = Math.random();
    const angle = (Math.random() - 0.5) * 40;
    const xOffset = (Math.random() - 0.5) * 120;
    const noteObj = { id: noteId, angle, xOffset, value: noteVal };
    
    setFlyingNotes(prev => [...prev.slice(-15), noteObj]);
    setSprayedAmount(newSprayed);
    setSprayCount(prev => prev + 1);
    playVanitiSound('flick');

    // Remove note after flight animation
    setTimeout(() => {
      setFlyingNotes(prev => prev.filter(n => n.id !== noteId));
    }, 1200);

    // Check if target reached
    if (newSprayed >= sprayPotTarget) {
      if (autoSprayTimerRef.current) clearInterval(autoSprayTimerRef.current);
      playVanitiSound('fanfare');
      const duration = Math.max(8, Math.round((Date.now() - (sessionStartTime || Date.now() - 12000)) / 1000));
      setSprayTimeSeconds(duration);
      setTimeout(() => {
        setScreen('complete');
      }, 700);
    }
  };

  useEffect(() => {
    window.__vanitiSetScreen = setScreen;
    return () => {
      delete window.__vanitiSetScreen;
    };
  }, []);

  // Continuous Auto Spray Mode Effect
  useEffect(() => {
    if (screen === 'spraying' && autoSprayMode) {
      autoSprayTimerRef.current = setInterval(() => {
        triggerSprayNote();
      }, 250);
    }
    return () => {
      if (autoSprayTimerRef.current) clearInterval(autoSprayTimerRef.current);
    };
  }, [screen, autoSprayMode, sprayedAmount, sprayPotTarget]);

  return (
    <div style={{
      width: '100%',
      maxWidth: '440px',
      margin: '0 auto',
      height: '100%',
      maxHeight: '100dvh',
      background: '#161616',
      color: '#ffffff',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      overflow: 'hidden',
      userSelect: 'none',
    }}>

      {/* ============================================================== */}
      {/* SCREEN 1: BALLER MODE SETUP (Matches Screenshot 4)             */}
      {/* ============================================================== */}
      {screen === 'baller' && (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
          
          {/* Top Status Bar (9:41 - hidden on native mobile) */}
          <div className="simulated-status-bar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 20px 2px 20px', fontSize: '13px', fontWeight: 600 }}>
            <span>9:41</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <svg width="16" height="11" viewBox="0 0 18 12" fill="white">
                <rect x="0" y="8" width="3" height="4" rx="0.5" />
                <rect x="4.5" y="5.5" width="3" height="6.5" rx="0.5" />
                <rect x="9" y="3" width="3" height="9" rx="0.5" />
                <rect x="13.5" y="0" width="3" height="12" rx="0.5" />
              </svg>
              <svg width="15" height="11" viewBox="0 0 16 12" fill="none" stroke="white" strokeWidth="1.8">
                <path d="M1 3C5 0 11 0 15 3" strokeLinecap="round" />
                <path d="M3.5 6.5C6.5 4.5 9.5 4.5 12.5 6.5" strokeLinecap="round" />
                <circle cx="8" cy="10" r="1.2" fill="white" />
              </svg>
              <div style={{ width: '20px', height: '10px', border: '1px solid #ffffff', borderRadius: '3px', padding: '1px', display: 'flex' }}>
                <div style={{ width: '75%', height: '100%', background: '#ffffff', borderRadius: '1px' }} />
              </div>
            </div>
          </div>

          {/* Navigation Bar: Dynamic based on activeNav */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px 10px 12px' }}>
            <div 
              onClick={() => {
                if (activeNav !== 'home') {
                  setActiveNav('home');
                  playVanitiSound('flick');
                } else if (onBackToMap) {
                  onBackToMap();
                }
              }}
              style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}
            >
              <ChevronLeft size={24} color="#ffffff" strokeWidth={2.5} />
              <span style={{ fontSize: '19px', fontWeight: 700, letterSpacing: '-0.3px', color: '#ffffff' }}>
                {activeNav === 'home' ? 'Vaniti' : activeNav === 'history' ? 'Spray History' : activeNav === 'insight' ? 'Analytics' : 'VIP Profile'}
              </span>
            </div>

            {/* Right Header Action: Balance Pill on Home, VIP Club pill on other tabs */}
            {activeNav === 'home' ? (
              <div 
                onClick={() => {
                  setWalletBalance(prev => prev + 50000);
                  playVanitiSound('cash_drop');
                }}
                title="Tap for quick +₦50,000 top up"
                style={{
                  background: '#232325',
                  borderRadius: '24px',
                  padding: '6px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  transition: 'background 0.2s',
                }}
              >
                <span style={{ color: '#8e8e93', fontSize: '12px', fontWeight: 500 }}>Balance</span>
                <span style={{ color: '#ffffff', fontSize: '13px', fontWeight: 700 }}>
                  ₦{walletBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            ) : (
              <div 
                onClick={() => {
                  setShowVipModal(true);
                  playVanitiSound('auth');
                }}
                style={{
                  background: 'rgba(194, 120, 3, 0.15)',
                  border: '1px solid rgba(194, 120, 3, 0.4)',
                  borderRadius: '20px',
                  padding: '5px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer'
                }}
              >
                <span style={{ fontSize: '12px' }}>👑</span>
                <span style={{ color: '#f59e0b', fontSize: '12px', fontWeight: 700 }}>VIP Club</span>
              </div>
            )}
          </div>

          {/* Main Body Content based on activeNav */}
          {activeNav === 'history' ? (
            <VanitiHistoryTab 
              onOpenReceipt={(item) => {
                setSelectedReceiptItem(item);
                setShowReceiptModal(true);
              }}
              playVanitiSound={playVanitiSound}
            />
          ) : activeNav === 'insight' ? (
            <VanitiInsightTab 
              playVanitiSound={playVanitiSound}
              onOpenVip={() => setShowVipModal(true)}
            />
          ) : activeNav === 'account' ? (
            <VanitiAccountTab 
              walletBalance={walletBalance}
              setWalletBalance={setWalletBalance}
              playVanitiSound={playVanitiSound}
              soundEnabled={soundEnabled}
              setSoundEnabled={setSoundEnabled}
              onBackToMap={onBackToMap}
              onOpenVip={() => setShowVipModal(true)}
            />
          ) : (
            /* Home Tab: Baller Mode & Leaderboard (Screenshots 4 & 5) */
            <div style={{ flex: 1, overflowY: 'auto', padding: '0 16px 12px 16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              
              {/* Segmented Control Tabs: Baller mode | Leaderboard */}
              <div style={{
                background: '#252528',
                borderRadius: '10px',
                padding: '3px',
                display: 'flex',
                alignItems: 'center',
              }}>
                <div 
                  onClick={() => {
                    setBallerTab('baller');
                    playVanitiSound('flick');
                  }}
                  style={{
                    flex: 1,
                    textAlign: 'center',
                    padding: '7px 0',
                    borderRadius: '8px',
                    background: ballerTab === 'baller' ? '#444448' : 'transparent',
                    color: ballerTab === 'baller' ? '#ffffff' : '#8e8e93',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.2s ease',
                    boxShadow: ballerTab === 'baller' ? '0 2px 6px rgba(0,0,0,0.3)' : 'none'
                  }}
                >
                  Baller mode
                </div>
                <div 
                  onClick={() => {
                    setBallerTab('leaderboard');
                    playVanitiSound('flick');
                  }}
                  style={{
                    flex: 1,
                    textAlign: 'center',
                    padding: '7px 0',
                    borderRadius: '8px',
                    background: ballerTab === 'leaderboard' ? '#444448' : 'transparent',
                    color: ballerTab === 'leaderboard' ? '#ffffff' : '#8e8e93',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.2s ease',
                    boxShadow: ballerTab === 'leaderboard' ? '0 2px 6px rgba(0,0,0,0.3)' : 'none'
                  }}
                >
                  Leaderboard
                </div>
              </div>

              {ballerTab === 'leaderboard' ? (
                /* Enhanced VIP Leaderboard View */
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingTop: '4px' }}>
                  
                  {/* Live Activity Feed Ticker */}
                  <div style={{
                    background: 'rgba(194, 120, 3, 0.1)',
                    border: '1px solid rgba(194, 120, 3, 0.25)',
                    borderRadius: '14px',
                    padding: '8px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '12px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '13px' }}>🔥</span>
                      <span style={{ color: '#ffffff', fontWeight: 600 }}>Chief Obi sprayed <strong>₦50,000</strong> on Benny!</span>
                    </div>
                    <span style={{ color: '#f59e0b', fontSize: '10px', fontWeight: 700 }}>12s ago</span>
                  </div>

                  {/* Top 3 Podium Cards */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', alignItems: 'flex-end', paddingTop: '8px' }}>
                    {/* #2 Rank: Alhaji Bello */}
                    <div style={{
                      background: '#1e1e22',
                      border: '1px solid rgba(148, 163, 184, 0.2)',
                      borderRadius: '16px',
                      padding: '12px 6px 14px 6px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center'
                    }}>
                      <div style={{ fontSize: '16px', marginBottom: '2px' }}>🥈</div>
                      <img src="https://api.dicebear.com/7.x/bottts/svg?seed=Bello" alt="Alhaji" style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#27272a', border: '1.5px solid #94a3b8' }} />
                      <div style={{ color: '#ffffff', fontSize: '12px', fontWeight: 700, marginTop: '6px' }}>Alhaji Bello</div>
                      <div style={{ color: '#94a3b8', fontSize: '12px', fontWeight: 800, marginTop: '2px' }}>₦320k</div>
                    </div>

                    {/* #1 Rank: Chief Obi (Taller Podium) */}
                    <div style={{
                      background: 'linear-gradient(180deg, #2d2212 0%, #1e1e22 100%)',
                      border: '1.5px solid #c27803',
                      borderRadius: '18px',
                      padding: '16px 6px 16px 6px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                      boxShadow: '0 4px 20px rgba(194, 120, 3, 0.25)',
                      transform: 'translateY(-6px)'
                    }}>
                      <div style={{ fontSize: '20px', marginBottom: '2px' }}>👑</div>
                      <img src="https://api.dicebear.com/7.x/bottts/svg?seed=ChiefObi" alt="Chief Obi" style={{ width: '46px', height: '46px', borderRadius: '50%', background: '#27272a', border: '2px solid #ffd700' }} />
                      <div style={{ color: '#ffd700', fontSize: '13px', fontWeight: 800, marginTop: '6px' }}>Chief Obi</div>
                      <div style={{ color: '#ffffff', fontSize: '13px', fontWeight: 900, marginTop: '2px' }}>₦450k</div>
                    </div>

                    {/* #3 Rank: Kelvin Ekuhoho (You) */}
                    <div style={{
                      background: '#1e1e22',
                      border: '1px solid rgba(194, 120, 3, 0.4)',
                      borderRadius: '16px',
                      padding: '12px 6px 14px 6px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center'
                    }}>
                      <div style={{ fontSize: '16px', marginBottom: '2px' }}>🥉</div>
                      <img src="https://api.dicebear.com/7.x/bottts/svg?seed=antigravity" alt="You" style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#27272a', border: '1.5px solid #c27803' }} />
                      <div style={{ color: '#ffffff', fontSize: '12px', fontWeight: 700, marginTop: '6px' }}>You (Kelvin)</div>
                      <div style={{ color: '#f59e0b', fontSize: '12px', fontWeight: 800, marginTop: '2px' }}>₦200k</div>
                    </div>
                  </div>

                  {/* Leaderboard List (#4 and below) */}
                  <div style={{ color: '#8e8e93', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: '4px' }}>
                    Event Sprayers Ranking
                  </div>
                  {[
                    { rank: 4, name: 'Benny (Party Host)', amount: '₦150,000', badge: '🎉 Celebrant', avatar: 'Benny' },
                    { rank: 5, name: 'Femi Badmus', amount: '₦95,000', badge: '💫 Sprayer', avatar: 'Femi' },
                    { rank: 6, name: 'Sarah Connor', amount: '₦70,000', badge: '✨ VIP Guest', avatar: 'Sarah' },
                  ].map((item) => (
                    <div key={item.rank} style={{
                      background: '#232325',
                      border: '1px solid rgba(255,255,255,0.05)',
                      borderRadius: '14px',
                      padding: '12px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ 
                          width: '24px', 
                          height: '24px', 
                          borderRadius: '50%', 
                          background: '#333336', 
                          color: '#ffffff', 
                          fontWeight: 800, 
                          fontSize: '11px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          #{item.rank}
                        </span>
                        <img src={`https://api.dicebear.com/7.x/bottts/svg?seed=${item.avatar}`} alt={item.name} style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#18181b' }} />
                        <div>
                          <div style={{ color: '#fff', fontSize: '13px', fontWeight: 700 }}>{item.name}</div>
                          <div style={{ color: '#8e8e93', fontSize: '11px' }}>{item.badge}</div>
                        </div>
                      </div>
                      <span style={{ color: '#fff', fontWeight: 700, fontSize: '14px' }}>
                        {item.amount}
                      </span>
                    </div>
                  ))}

                  {/* Quick Spray CTA on Leaderboard */}
                  <button
                    onClick={() => {
                      setBallerTab('baller');
                      playVanitiSound('flick');
                    }}
                    style={{
                      marginTop: '6px',
                      width: '100%',
                      background: '#c27803',
                      border: 'none',
                      borderRadius: '14px',
                      padding: '14px 0',
                      color: '#ffffff',
                      fontSize: '14px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    <Flame size={16} />
                    <span>Spray Cash to Climb Rank</span>
                  </button>
                </div>
              ) : (
                /* Baller Mode Form Elements (Matches Screenshot 4) */
                <>
                  {/* 1. Choose Currency Dropdown */}
                  <div 
                    onClick={() => setShowCurrencySheet(true)}
                    style={{
                      background: '#232325',
                      borderRadius: '14px',
                      padding: '17px 18px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      border: '1px solid rgba(255, 255, 255, 0.04)',
                    }}
                  >
                    <span style={{ color: '#ffffff', fontSize: '15px', fontWeight: 500 }}>
                      {selectedCurrency ? currentCurrency.name : 'Choose Currency'}
                    </span>
                    <ChevronDown size={20} color="#8e8e93" />
                  </div>

                {/* 2. Select Denomination Dropdown */}
                <div 
                  onClick={() => setShowDenomSheet(true)}
                  style={{
                    background: '#232325',
                    borderRadius: '14px',
                    padding: '17px 18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    border: '1px solid rgba(255, 255, 255, 0.04)',
                  }}
                >
                  <span style={{ color: '#ffffff', fontSize: '15px', fontWeight: 500 }}>
                    {selectedDenom ? `Select Denomination (${currentDenom.label})` : 'Select Denomination'}
                  </span>
                  <ChevronDown size={20} color="#8e8e93" />
                </div>

                {/* 3. Amount Input (NGN 20,000.00) */}
                <div 
                  style={{
                    background: '#232325',
                    borderRadius: '14px',
                    padding: '14px 18px',
                    display: 'flex',
                    alignItems: 'center',
                    border: '1px solid rgba(255, 255, 255, 0.04)',
                  }}
                >
                  <span style={{ color: '#ffffff', fontSize: '15px', fontWeight: 700, width: '60px' }}>
                    {currentCurrency.code}
                  </span>
                  <input
                    type="text"
                    value={sprayAmount}
                    onChange={(e) => setSprayAmount(e.target.value)}
                    style={{
                      flex: 1,
                      background: 'transparent',
                      border: 'none',
                      outline: 'none',
                      color: '#ffffff',
                      fontSize: '15px',
                      fontWeight: 500,
                      caretColor: '#ffffff',
                    }}
                  />
                </div>

                {/* 4. Spray Animation Dropdown */}
                <div 
                  onClick={() => setShowAnimationSheet(true)}
                  style={{
                    background: '#232325',
                    borderRadius: '14px',
                    padding: '17px 18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    border: '1px solid rgba(255, 255, 255, 0.04)',
                  }}
                >
                  <span style={{ color: '#ffffff', fontSize: '15px', fontWeight: 500 }}>
                    {sprayAnimation ? `Spray Animation (${sprayAnimation})` : 'Spray Animation'}
                  </span>
                  <ChevronDown size={20} color="#8e8e93" />
                </div>

                {/* 5. Select Recipient Section */}
                <div style={{ marginTop: '4px' }}>
                  <div style={{ color: '#8e8e93', fontSize: '13px', fontWeight: 500, marginBottom: '10px' }}>
                    Select Recipient
                  </div>
                  
                  {/* 3 Cards: Scan QR | NFC Tap | Contacts */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                    
                    {/* Scan QR */}
                    <div 
                      onClick={() => {
                        setRecipientMethod('qr');
                        setShowQrModal(true);
                        playVanitiSound('flick');
                      }}
                      style={{
                        background: '#232325',
                        border: recipientMethod === 'qr' ? '1px solid #c27803' : '1px solid rgba(255,255,255,0.05)',
                        borderRadius: '16px',
                        padding: '18px 8px 14px 8px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '10px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <div style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '50%',
                        background: 'rgba(194, 120, 3, 0.12)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <QrCode size={22} color="#c27803" />
                      </div>
                      <span style={{ color: '#ffffff', fontSize: '13px', fontWeight: 500 }}>
                        Scan QR
                      </span>
                    </div>

                    {/* NFC Tap */}
                    <div 
                      onClick={() => {
                        setRecipientMethod('nfc');
                        setShowNfcModal(true);
                        playVanitiSound('flick');
                      }}
                      style={{
                        background: '#232325',
                        border: recipientMethod === 'nfc' ? '1px solid #c27803' : '1px solid rgba(255,255,255,0.05)',
                        borderRadius: '16px',
                        padding: '18px 8px 14px 8px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '10px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <div style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '50%',
                        background: 'rgba(194, 120, 3, 0.12)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <Radio size={22} color="#c27803" />
                      </div>
                      <span style={{ color: '#ffffff', fontSize: '13px', fontWeight: 500 }}>
                        NFC Tap
                      </span>
                    </div>

                    {/* Contacts */}
                    <div 
                      onClick={() => {
                        setRecipientMethod('contacts');
                        setShowContactsModal(true);
                        playVanitiSound('flick');
                      }}
                      style={{
                        background: '#232325',
                        border: recipientMethod === 'contacts' ? '1px solid #c27803' : '1px solid rgba(255,255,255,0.05)',
                        borderRadius: '16px',
                        padding: '18px 8px 14px 8px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '10px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <div style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '50%',
                        background: 'rgba(194, 120, 3, 0.12)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <Users size={22} color="#c27803" />
                      </div>
                      <span style={{ color: '#ffffff', fontSize: '13px', fontWeight: 500 }}>
                        Contacts
                      </span>
                    </div>

                  </div>
                </div>

                {/* 6. Auto Spray Mode Row (with Toggle) */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 0',
                  marginTop: '2px',
                }}>
                  <div>
                    <div style={{ color: '#ffffff', fontSize: '14px', fontWeight: 600 }}>
                      Auto Spray Mode
                    </div>
                    <div style={{ color: '#8e8e93', fontSize: '12px', marginTop: '2px' }}>
                      Continuous animation until amount is spent
                    </div>
                  </div>

                  {/* iOS Style Switch */}
                  <div 
                    onClick={() => {
                      setAutoSprayMode(!autoSprayMode);
                      playVanitiSound('flick');
                    }}
                    style={{
                      width: '50px',
                      height: '30px',
                      borderRadius: '15px',
                      background: autoSprayMode ? '#c27803' : '#3a3a3c',
                      padding: '2px',
                      cursor: 'pointer',
                      transition: 'background 0.25s ease',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <div style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '50%',
                      background: '#ffffff',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                      transform: autoSprayMode ? 'translateX(20px)' : 'translateX(0px)',
                      transition: 'transform 0.25s ease',
                    }} />
                  </div>
                </div>

                {/* 7. Start Spray Button (Golden Amber CTA) */}
                <button
                  onClick={handleStartSpray}
                  style={{
                    marginTop: '8px',
                    width: '100%',
                    background: '#c27803',
                    border: 'none',
                    borderRadius: '16px',
                    padding: '18px 0',
                    color: '#ffffff',
                    fontSize: '16px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 4px 18px rgba(194, 120, 3, 0.45)',
                    transition: 'all 0.2s ease',
                    letterSpacing: '0.2px',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.filter = 'brightness(1.08)'}
                  onMouseLeave={(e) => e.currentTarget.style.filter = 'brightness(1)'}
                >
                  Start Spray
                </button>
              </>
            )}

          </div>
        )}

          {/* Bottom Tab Bar: Home | History | Insight | Account (Screenshot 4) */}
          <div style={{
            background: '#161616',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '10px 24px 20px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            {/* Home */}
            <div 
              onClick={() => setActiveNav('home')}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', cursor: 'pointer' }}
            >
              <Home size={22} color={activeNav === 'home' ? '#ffffff' : '#8e8e93'} />
              <span style={{ fontSize: '11px', color: activeNav === 'home' ? '#ffffff' : '#8e8e93', fontWeight: 500 }}>
                Home
              </span>
            </div>

            {/* History */}
            <div 
              onClick={() => setActiveNav('history')}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', cursor: 'pointer' }}
            >
              <Clock size={22} color={activeNav === 'history' ? '#ffffff' : '#8e8e93'} />
              <span style={{ fontSize: '11px', color: activeNav === 'history' ? '#ffffff' : '#8e8e93', fontWeight: 500 }}>
                History
              </span>
            </div>

            {/* Insight */}
            <div 
              onClick={() => setActiveNav('insight')}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', cursor: 'pointer' }}
            >
              <PieChart size={22} color={activeNav === 'insight' ? '#ffffff' : '#8e8e93'} />
              <span style={{ fontSize: '11px', color: activeNav === 'insight' ? '#ffffff' : '#8e8e93', fontWeight: 500 }}>
                Insight
              </span>
            </div>

            {/* Account */}
            <div 
              onClick={() => setActiveNav('account')}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', cursor: 'pointer' }}
            >
              <User size={22} color={activeNav === 'account' ? '#ffffff' : '#8e8e93'} />
              <span style={{ fontSize: '11px', color: activeNav === 'account' ? '#ffffff' : '#8e8e93', fontWeight: 500 }}>
                Account
              </span>
            </div>
          </div>

          {/* Home indicator bar (iOS) */}
          <div style={{ position: 'absolute', bottom: '6px', left: '50%', transform: 'translateX(-50%)', width: '134px', height: '4px', borderRadius: '2px', background: 'rgba(255, 255, 255, 0.4)' }} />
        </div>
      )}

      {/* ============================================================== */}
      {/* SCREEN 2: LIVE SPRAYING (Matches Screenshot 1)                 */}
      {/* ============================================================== */}
      {screen === 'spraying' && (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative', background: '#0e0e0e' }}>
          
          {/* Top Status Bar (9:41) */}
          <div className="simulated-status-bar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 20px 2px 20px', fontSize: '13px', fontWeight: 600 }}>
            <span>9:41</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <svg width="18" height="12" viewBox="0 0 18 12" fill="white">
                <rect x="0" y="8" width="3" height="4" rx="0.5" />
                <rect x="4.5" y="5.5" width="3" height="6.5" rx="0.5" />
                <rect x="9" y="3" width="3" height="9" rx="0.5" />
                <rect x="13.5" y="0" width="3" height="12" rx="0.5" />
              </svg>
              <div style={{ width: '22px', height: '11px', border: '1px solid #ffffff', borderRadius: '3px', padding: '1px', display: 'flex' }}>
                <div style={{ width: '75%', height: '100%', background: '#ffffff', borderRadius: '1.5px' }} />
              </div>
            </div>
          </div>

          {/* Header Row: Close Button (left) | Benny Avatar + "Spraying on Benny" (right) */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 20px' }}>
            <button
              onClick={() => {
                if (autoSprayTimerRef.current) clearInterval(autoSprayTimerRef.current);
                setScreen('baller');
              }}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: '#232325',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                cursor: 'pointer',
              }}
            >
              <X size={20} />
            </button>

            {/* Recipient Capsule: Benny */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}>
              <BennyAvatar size={38} />
              <div style={{
                background: '#232325',
                borderRadius: '24px',
                padding: '10px 18px',
                display: 'flex',
                alignItems: 'center',
                border: '1px solid rgba(255, 255, 255, 0.08)',
              }}>
                <span style={{ color: '#ffffff', fontSize: '14px', fontWeight: 400 }}>
                  Spraying on <strong style={{ fontWeight: 700 }}>Benny</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Rank & Prompt Banner (Screenshot 1) */}
          <div style={{ textAlign: 'center', marginTop: '48px', padding: '0 20px' }}>
            <div style={{ fontSize: '13px', fontStyle: 'italic', color: '#e5e5ea', marginBottom: '4px' }}>
              🔥 You're on the top 5 sprayers
            </div>
            <div style={{ fontSize: '14px', fontWeight: 600, color: '#ffffff' }}>
              Keep Spraying! <span style={{ color: '#f59e0b', fontWeight: 700 }}>Ranked #4</span>
            </div>
          </div>

          {/* Progress Pill: Sprayed ₦5,000 of ₦20,000 (Screenshot 1) */}
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', padding: '0 20px' }}>
            <div style={{
              background: '#242426',
              borderRadius: '24px',
              padding: '12px 24px',
              width: '100%',
              maxWidth: '280px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              border: '1px solid rgba(255, 255, 255, 0.06)',
            }}>
              <div style={{ textAlign: 'center', fontSize: '13px', fontStyle: 'italic', color: '#e5e5ea' }}>
                Sprayed <strong>₦{sprayedAmount.toLocaleString()}</strong> of <strong>₦{sprayPotTarget.toLocaleString()}</strong>
              </div>
              
              {/* Mint Green Progress Bar */}
              <div style={{ width: '100%', height: '5px', background: '#3a3a3c', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{
                  width: `${Math.min(100, (sprayedAmount / (sprayPotTarget || 20000)) * 100)}%`,
                  height: '100%',
                  background: '#00e676',
                  borderRadius: '3px',
                  transition: 'width 0.2s ease-out',
                }} />
              </div>
            </div>
          </div>

          {/* Flying Notes Particle Container */}
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
            {flyingNotes.map(n => (
              <div 
                key={n.id}
                style={{
                  position: 'absolute',
                  bottom: '240px',
                  left: `calc(50% + ${n.xOffset}px)`,
                  width: '150px',
                  height: '80px',
                  transform: `translate(-50%, -150px) rotate(${n.angle}deg)`,
                  opacity: 0,
                  transition: 'all 1.1s cubic-bezier(0.1, 0.8, 0.3, 1)',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.6)',
                  borderRadius: '6px',
                  overflow: 'hidden',
                }}
              >
                <img src={activeNoteImg} alt="Flying Note" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            ))}
          </div>

          {/* Banknote Stack in Perspective (Screenshot 1) */}
          <div 
            onClick={triggerSprayNote}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'flex-end',
              paddingBottom: '20px',
              cursor: 'pointer',
              position: 'relative',
            }}
          >
            <div style={{
              width: '240px',
              height: '340px',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              filter: 'drop-shadow(0 25px 35px rgba(0,0,0,0.8))',
              transition: 'transform 0.1s ease',
            }}
            onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.97)'}
            onMouseUp={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              triggerSprayNote();
            }}
            onTouchStart={(e) => {
              e.currentTarget.style.transform = 'scale(0.97)';
            }}
            onTouchEnd={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              triggerSprayNote();
            }}
            >
              {/* Stack 3D depth background layers */}
              <div style={{
                position: 'absolute',
                width: '210px',
                height: '310px',
                background: '#3d262e',
                borderRadius: '8px',
                transform: 'translate(-8px, -8px) rotate(-1.5deg)',
                opacity: 0.7,
              }} />
              <div style={{
                position: 'absolute',
                width: '210px',
                height: '310px',
                background: '#4a2d36',
                borderRadius: '8px',
                transform: 'translate(-4px, -4px) rotate(-0.8deg)',
                opacity: 0.85,
              }} />
              
              {/* Foreground crisp Nigerian Naira Note */}
              <div style={{
                position: 'relative',
                width: '214px',
                height: '314px',
                borderRadius: '8px',
                overflow: 'hidden',
                boxShadow: '0 12px 40px rgba(0,0,0,0.9), inset 0 0 10px rgba(0,0,0,0.5)',
              }}>
                <img 
                  src={activeNoteImg} 
                  alt={`${currentDenom.label} Note Stack`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transform: 'scale(1.02)',
                  }}
                />
              </div>

              {/* Swipe Up Hint */}
              <div style={{
                position: 'absolute',
                bottom: '-28px',
                color: 'rgba(255, 255, 255, 0.5)',
                fontSize: '11px',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '1px',
              }}>
                {autoSprayMode ? '⚡ Auto Spraying...' : 'Swipe up or tap to spray'}
              </div>
            </div>
          </div>

          {/* Bottom Home Indicator */}
          <div style={{ height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '134px', height: '4px', borderRadius: '2px', background: 'rgba(255, 255, 255, 0.4)' }} />
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SCREEN 3: SPRAY COMPLETE (Matches Screenshot 3)                */}
      {/* ============================================================== */}
      {screen === 'complete' && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          position: 'relative',
          background: 'linear-gradient(180deg, #1c1a16 0%, #171512 40%, #121212 100%)',
          padding: '0 20px',
        }}>
          
          {/* Top Status Bar (9:41) */}
          <div className="simulated-status-bar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 4px 2px 4px', fontSize: '13px', fontWeight: 600 }}>
            <span>9:41</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <svg width="18" height="12" viewBox="0 0 18 12" fill="white">
                <rect x="0" y="8" width="3" height="4" rx="0.5" />
                <rect x="4.5" y="5.5" width="3" height="6.5" rx="0.5" />
                <rect x="9" y="3" width="3" height="9" rx="0.5" />
                <rect x="13.5" y="0" width="3" height="12" rx="0.5" />
              </svg>
              <div style={{ width: '22px', height: '11px', border: '1px solid #ffffff', borderRadius: '3px', padding: '1px', display: 'flex' }}>
                <div style={{ width: '75%', height: '100%', background: '#ffffff', borderRadius: '1.5px' }} />
              </div>
            </div>
          </div>

          {/* Top Bar: Download ↓ (left)   |   Share 🔗 (right) */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px' }}>
            <button
              onClick={() => {
                playVanitiSound('cash_drop');
                alert('Receipt downloaded to device storage!');
              }}
              style={{
                background: '#232325',
                border: 'none',
                borderRadius: '24px',
                padding: '9px 18px',
                color: '#ffffff',
                fontSize: '14px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
              }}
            >
              <span>Download</span>
              <Download size={16} />
            </button>

            <button
              onClick={() => {
                playVanitiSound('flick');
                if (navigator.share) {
                  navigator.share({
                    title: 'Vaniti Spray Complete',
                    text: `Just sprayed ₦${(sprayedAmount || 150000).toLocaleString()} on Benny!`,
                    url: window.location.href,
                  }).catch(() => {});
                } else {
                  alert('Share link copied to clipboard!');
                }
              }}
              style={{
                background: '#232325',
                border: 'none',
                borderRadius: '24px',
                padding: '9px 18px',
                color: '#ffffff',
                fontSize: '14px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
              }}
            >
              <Share2 size={16} />
              <span>Share</span>
            </button>
          </div>

          {/* 3D Angled Green Cash Graphic Floating Down (Screenshot 3) */}
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '38px', marginBottom: '16px' }}>
            <div style={{
              width: '46px',
              height: '92px',
              background: 'linear-gradient(135deg, #00e676 0%, #00b050 100%)',
              borderRadius: '4px',
              transform: 'rotate(-25deg) skew(-5deg)',
              boxShadow: '0 12px 30px rgba(0, 230, 118, 0.4), inset 0 0 10px rgba(255,255,255,0.4)',
              border: '1px solid rgba(255,255,255,0.6)',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <div style={{ width: '80%', height: '80%', border: '1px dashed rgba(255,255,255,0.4)', borderRadius: '2px' }} />
            </div>
          </div>

          {/* Headings: Spray Complete | You sprayed ₦150,000 | 200 Notes - Flying Cash - 2:08am */}
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.5px', marginBottom: '14px' }}>
              Spray Complete
            </h1>
            
            <div style={{ fontSize: '15px', color: '#c7c7cc', marginBottom: '10px' }}>
              You sprayed <strong style={{ color: '#ffffff', fontWeight: 800, fontSize: '18px' }}>₦{(sprayedAmount || 150000).toLocaleString()}</strong>
            </div>

            <div style={{ fontSize: '13px', color: '#8e8e93', fontWeight: 500 }}>
              {Math.max(1, Math.round((sprayedAmount || 150000) / currentDenom.value))} Notes · {sprayAnimation} · 2:08am
            </div>
          </div>

          {/* Stats Card: +2 RANK UP | #3 LEADERBOARD | 12s SPRAY TIME */}
          <div style={{
            background: '#232325',
            borderRadius: '20px',
            overflow: 'hidden',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            marginBottom: 'auto',
          }}>
            {/* 3 Columns */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', padding: '20px 10px', textAlign: 'center' }}>
              
              {/* +2 RANK UP */}
              <div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#c27803', marginBottom: '4px' }}>
                  +2
                </div>
                <div style={{ fontSize: '11px', fontWeight: 600, color: '#8e8e93', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                  RANK UP
                </div>
              </div>

              {/* #3 LEADERBOARD */}
              <div style={{ borderLeft: '1px solid rgba(255, 255, 255, 0.08)', borderRight: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#c27803', marginBottom: '4px' }}>
                  #3
                </div>
                <div style={{ fontSize: '11px', fontWeight: 600, color: '#8e8e93', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                  LEADERBOARD
                </div>
              </div>

              {/* 12s SPRAY TIME */}
              <div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#c27803', marginBottom: '4px' }}>
                  {sprayTimeSeconds}s
                </div>
                <div style={{ fontSize: '11px', fontWeight: 600, color: '#8e8e93', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                  SPRAY TIME
                </div>
              </div>

            </div>

            {/* View Receipt Button (Inside bottom of card) */}
            <div 
              onClick={() => setShowReceiptModal(true)}
              style={{
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                padding: '16px 0',
                textAlign: 'center',
                color: '#ffffff',
                fontSize: '15px',
                fontWeight: 600,
                cursor: 'pointer',
                background: 'rgba(255, 255, 255, 0.02)',
              }}
            >
              View Receipt
            </div>
          </div>

          {/* Footer: Done link   |   Join the VIP Club (Golden Button) */}
          <div style={{ paddingBottom: '24px', display: 'flex', flexDirection: 'column', gap: '14px', alignItems: 'center' }}>
            <div 
              onClick={() => {
                playVanitiSound('flick');
                setScreen('baller');
              }}
              style={{
                color: '#ffffff',
                fontSize: '15px',
                fontWeight: 500,
                cursor: 'pointer',
                padding: '4px 12px',
              }}
            >
              Done
            </div>

            <button
              onClick={() => {
                playVanitiSound('auth');
                setShowVipModal(true);
              }}
              style={{
                width: '100%',
                background: '#c27803',
                border: 'none',
                borderRadius: '16px',
                padding: '18px 0',
                color: '#ffffff',
                fontSize: '16px',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(194, 120, 3, 0.45)',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.filter = 'brightness(1.08)'}
              onMouseLeave={(e) => e.currentTarget.style.filter = 'brightness(1)'}
            >
              Join the VIP Club
            </button>

            {/* Home indicator */}
            <div style={{ width: '134px', height: '4px', borderRadius: '2px', background: 'rgba(255, 255, 255, 0.4)', marginTop: '4px' }} />
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* BOTTOM SHEET 1: SELECT CURRENCY (Matches Screenshot 2)         */}
      {/* ============================================================== */}
      {showCurrencySheet && (
        <div 
          onClick={() => setShowCurrencySheet(false)}
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(8px)',
            zIndex: 100,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            animation: 'fadeIn 0.2s ease-out',
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#1c1c1e',
              borderTopLeftRadius: '24px',
              borderTopRightRadius: '24px',
              padding: '24px 20px 32px 20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              boxShadow: '0 -10px 40px rgba(0, 0, 0, 0.8)',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            {/* Sheet Header: Select currency | X */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '18px', fontWeight: 700, color: '#ffffff' }}>
                Select currency
              </span>
              <button
                onClick={() => setShowCurrencySheet(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#ffffff',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Currency Options (Screenshot 2) */}
            {CURRENCIES.map(curr => {
              const isSelected = selectedCurrency === curr.id;
              return (
                <div
                  key={curr.id}
                  onClick={() => {
                    setSelectedCurrency(curr.id);
                    playVanitiSound('flick');
                    setTimeout(() => setShowCurrencySheet(false), 150);
                  }}
                  style={{
                    background: '#2c2c2e',
                    border: isSelected ? '1px solid #c27803' : '1px solid transparent',
                    borderRadius: '16px',
                    padding: '16px 18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    {curr.icon}
                    <span style={{ fontSize: '15px', fontWeight: 600, color: '#ffffff' }}>
                      {curr.name}
                    </span>
                  </div>

                  {/* Gold Checked Circle */}
                  {isSelected && (
                    <div style={{
                      width: '22px',
                      height: '22px',
                      borderRadius: '50%',
                      background: '#c27803',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <Check size={14} color="#000000" strokeWidth={3} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* BOTTOM SHEET 2: SELECT DENOMINATION (Matches Screenshot 5)     */}
      {/* ============================================================== */}
      {showDenomSheet && (
        <div 
          onClick={() => setShowDenomSheet(false)}
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(8px)',
            zIndex: 100,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            animation: 'fadeIn 0.2s ease-out',
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#1c1c1e',
              borderTopLeftRadius: '24px',
              borderTopRightRadius: '24px',
              padding: '24px 20px 32px 20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              boxShadow: '0 -10px 40px rgba(0, 0, 0, 0.8)',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            {/* Sheet Header: Select Denomination (Banknotes) | X */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '18px', fontWeight: 700, color: '#ffffff' }}>
                Select Denomination (Banknotes)
              </span>
              <button
                onClick={() => setShowDenomSheet(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#ffffff',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Denomination Options (Screenshot 5) */}
            {DENOMINATIONS.map(denom => {
              const isSelected = selectedDenom === denom.id;
              // Denom 200 has a subtle wine/burgundy tint as seen in Screenshot 5
              const isWineTint = denom.tint === 'wine';
              return (
                <div
                  key={denom.id}
                  onClick={() => {
                    setSelectedDenom(denom.id);
                    playVanitiSound('flick');
                    setTimeout(() => setShowDenomSheet(false), 150);
                  }}
                  style={{
                    background: isWineTint ? '#3d262e' : '#2c2c2e',
                    border: isSelected ? '1px solid #c27803' : '1px solid transparent',
                    borderRadius: '16px',
                    padding: '18px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <span style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff' }}>
                    {denom.label}
                  </span>

                  {/* Gold Checked Circle */}
                  {isSelected && (
                    <div style={{
                      width: '22px',
                      height: '22px',
                      borderRadius: '50%',
                      background: '#c27803',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <Check size={14} color="#000000" strokeWidth={3} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* BOTTOM SHEET 3: SELECT ANIMATION (Pro Animated Sheet)          */}
      {/* ============================================================== */}
      <AnimationPickerSheet 
        isOpen={showAnimationSheet}
        onClose={() => setShowAnimationSheet(false)}
        selectedAnimation={sprayAnimation}
        onSelectAnimation={(animId) => {
          setSprayAnimation(animId);
        }}
        playVanitiSound={playVanitiSound}
      />

      {/* ============================================================== */}
      {/* MODAL: QR CODE SCANNER (Scanner + My QR Code)                  */}
      {/* ============================================================== */}
      <QrScannerModal 
        isOpen={showQrModal}
        onClose={() => setShowQrModal(false)}
        onSelectRecipient={(host) => {
          setSelectedRecipient(typeof host === 'object' ? (host.id || 'benny') : (host || 'benny'));
          setRecipientMethod('qr');
          setShowQrModal(false);
        }}
        playVanitiSound={playVanitiSound}
      />

      {/* ============================================================== */}
      {/* MODAL: NFC TAP SENSOR (Wave Radar & Smart Tag Connect)          */}
      {/* ============================================================== */}
      <NfcTapModal 
        isOpen={showNfcModal}
        onClose={() => setShowNfcModal(false)}
        onSelectRecipient={(hostId) => {
          setSelectedRecipient(typeof hostId === 'object' ? (hostId.id || 'benny') : (hostId || 'benny'));
          setRecipientMethod('nfc');
          setShowNfcModal(false);
        }}
        playVanitiSound={playVanitiSound}
      />

      {/* ============================================================== */}
      {/* MODAL: CONTACTS & NEARBY HOSTS DISCOVERY                       */}
      {/* ============================================================== */}
      <ContactsModal 
        isOpen={showContactsModal}
        onClose={() => setShowContactsModal(false)}
        currentSelected={selectedRecipient}
        onSelectRecipient={(host) => {
          setSelectedRecipient(typeof host === 'object' ? (host.id || 'benny') : (host || 'benny'));
          setRecipientMethod('contacts');
          setShowContactsModal(false);
        }}
        playVanitiSound={playVanitiSound}
      />

      {/* ============================================================== */}
      {/* MODAL: VIEW ITEM RECEIPT (Dynamic Receipt Preview)             */}
      {/* ============================================================== */}
      {showReceiptModal && (
        <div 
          onClick={() => setShowReceiptModal(false)}
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(10px)',
            zIndex: 150,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            animation: 'fadeIn 0.2s ease-out',
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#232325',
              borderRadius: '24px',
              padding: '24px',
              width: '100%',
              maxWidth: '360px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 25px 60px rgba(0,0,0,0.9)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(194, 120, 3, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FileText size={18} color="#c27803" />
                </div>
                <span style={{ fontSize: '18px', fontWeight: 800, color: '#fff' }}>Digital Spray Receipt</span>
              </div>
              <button 
                onClick={() => setShowReceiptModal(false)} 
                style={{ 
                  background: 'rgba(255, 255, 255, 0.08)', 
                  border: 'none', 
                  color: '#fff', 
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer' 
                }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ background: '#1c1c1e', borderRadius: '16px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#8e8e93' }}>
                <span>Recipient:</span>
                <span style={{ color: '#fff', fontWeight: 600 }}>{selectedReceiptItem ? selectedReceiptItem.recipient : 'Benny (VIP Celebrant)'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#8e8e93' }}>
                <span>Amount Sprayed:</span>
                <span style={{ color: '#00e676', fontWeight: 700 }}>{selectedReceiptItem ? selectedReceiptItem.amount : `₦${(sprayedAmount || 150000).toLocaleString()}`}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#8e8e93' }}>
                <span>Denomination:</span>
                <span style={{ color: '#fff', fontWeight: 600 }}>{selectedReceiptItem?.notes ? `${selectedReceiptItem.notes} Notes` : `${currentDenom.label} Crisp Banknotes`}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#8e8e93' }}>
                <span>Venue & Time:</span>
                <span style={{ color: '#fff', fontWeight: 600 }}>{selectedReceiptItem ? `${selectedReceiptItem.venue} · ${selectedReceiptItem.date}` : 'Benny Birthday Bash · Live'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#8e8e93' }}>
                <span>Transaction ID:</span>
                <span style={{ color: '#c27803', fontWeight: 600 }}>{selectedReceiptItem ? selectedReceiptItem.id : 'VAN-779024X'}</span>
              </div>
            </div>

            <button
              onClick={() => setShowReceiptModal(false)}
              style={{
                marginTop: '18px',
                width: '100%',
                background: '#c27803',
                border: 'none',
                borderRadius: '14px',
                padding: '14px 0',
                color: '#fff',
                fontSize: '15px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: JOIN VIP CLUB                                           */}
      {/* ============================================================== */}
      {showVipModal && (
        <div 
          onClick={() => setShowVipModal(false)}
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(10px)',
            zIndex: 150,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#232325',
              borderRadius: '24px',
              padding: '28px 24px',
              width: '100%',
              maxWidth: '360px',
              textAlign: 'center',
              border: '1px solid #c27803',
            }}
          >
            <div style={{ fontSize: '36px', marginBottom: '8px' }}>👑</div>
            <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>
              Welcome to Vaniti VIP Club
            </h2>
            <p style={{ color: '#8e8e93', fontSize: '13px', lineHeight: '1.5', marginBottom: '20px' }}>
              You unlocked Baller Tier status! Enjoy zero processing fees, custom banknote gold foil styling, and priority DJ shoutouts.
            </p>
            <button
              onClick={() => {
                setShowVipModal(false);
                setScreen('baller');
              }}
              style={{
                width: '100%',
                background: '#c27803',
                border: 'none',
                borderRadius: '14px',
                padding: '14px 0',
                color: '#fff',
                fontSize: '15px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Activate VIP Status
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
