import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const VanitiContext = createContext(null);

export const MOCK_EVENTS = [
  {
    id: 'event-wedding-1',
    title: "Chioma & David's Wedding Reception",
    hostName: "Chioma & David Adeleke",
    hostAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    coverImage: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&auto=format&fit=crop&q=80",
    category: "Wedding",
    venue: "The Monarch Event Centre, Lekki, Lagos",
    distanceMeters: 15,
    signalStrength: "Strong • 98%",
    activeSprayers: 48,
    totalSprayed: 1845000,
    totalNotes: 3420,
    isLive: true,
    isPaused: false,
    hideTotals: false,
    geofenceRadius: 100,
    settlementWallet: "ZenPay • Chioma Adeleke (0123***891)",
    privacyToggles: {
      proximityDiscovery: true,
      showLeaderboard: true,
      hideTotalRaised: false,
      requireApproval: false,
    },
    topSprayers: [
      { id: 's1', name: 'Chief Obi Okoye', amount: 450000, avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=ChiefObi', rank: 1, noteCount: 450 },
      { id: 's2', name: 'Alhaji Bello & Friends', amount: 320000, avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Bello', rank: 2, noteCount: 320 },
      { id: 's3', name: 'Kelvin Ekuhoho', amount: 200000, avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=antigravity', rank: 3, noteCount: 200 },
      { id: 's4', name: 'Amaka VIP Circle', amount: 150000, avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Amaka', rank: 4, noteCount: 150 },
      { id: 's5', name: 'Femi Badmus', amount: 95000, avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Femi', rank: 5, noteCount: 95 },
    ]
  },
  {
    id: 'event-club-2',
    title: "Burna Boy VIP Afterparty",
    hostName: "Quilox Nightlife Group",
    hostAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    coverImage: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&auto=format&fit=crop&q=80",
    category: "Nightlife / Club",
    venue: "Club Quilox, Victoria Island, Lagos",
    distanceMeters: 45,
    signalStrength: "Good • 84%",
    activeSprayers: 86,
    totalSprayed: 4620000,
    totalNotes: 5800,
    isLive: true,
    isPaused: false,
    hideTotals: false,
    geofenceRadius: 150,
    settlementWallet: "ZenPay • Quilox Vault (9981***112)",
    privacyToggles: {
      proximityDiscovery: true,
      showLeaderboard: true,
      hideTotalRaised: false,
      requireApproval: false,
    },
    topSprayers: [
      { id: 'q1', name: 'Tony Billionaire', amount: 1200000, avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Tony', rank: 1, noteCount: 1200 },
      { id: 'q2', name: 'Tunde Ednut Crew', amount: 850000, avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Tunde', rank: 2, noteCount: 850 },
      { id: 'q3', name: 'Lady Stephanie', amount: 500000, avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Steph', rank: 3, noteCount: 500 },
    ]
  },
  {
    id: 'event-bday-3',
    title: "Tunde's 30th Birthday Bash",
    hostName: "Tunde Bakare",
    hostAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    coverImage: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&auto=format&fit=crop&q=80",
    category: "Birthday",
    venue: "Landmark Beach Front, VI, Lagos",
    distanceMeters: 120,
    signalStrength: "Moderate • 68%",
    activeSprayers: 32,
    totalSprayed: 920000,
    totalNotes: 1400,
    isLive: true,
    isPaused: false,
    hideTotals: false,
    geofenceRadius: 200,
    settlementWallet: "ZenPay • Tunde B. (5541***890)",
    privacyToggles: {
      proximityDiscovery: true,
      showLeaderboard: true,
      hideTotalRaised: false,
      requireApproval: false,
    },
    topSprayers: [
      { id: 't1', name: 'Segun Wire', amount: 250000, avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Segun', rank: 1, noteCount: 250 },
      { id: 't2', name: 'Bisola Gold', amount: 180000, avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Bisola', rank: 2, noteCount: 180 },
      { id: 't3', name: 'Kelvin Ekuhoho', amount: 90000, avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=antigravity', rank: 3, noteCount: 90 },
    ]
  }
];

export const DENOMINATIONS = [
  {
    id: '100',
    value: 100,
    label: '₦100',
    name: 'One Hundred Naira',
    color: '#8b5cf6',
    accent: '#a78bfa',
    imageKey: 'naira_100',
    description: 'Chief Obafemi Awolowo • Centenary Note',
    isBundle: false,
    currencySymbol: '₦'
  },
  {
    id: '200',
    value: 200,
    label: '₦200',
    name: 'Two Hundred Naira',
    color: '#e86a82',
    accent: '#ff859c',
    imageKey: 'naira_200',
    description: 'Sir Ahmadu Bello • Crisp Pink Note',
    isBundle: false,
    currencySymbol: '₦'
  },
  {
    id: '500',
    value: 500,
    label: '₦500',
    name: 'Five Hundred Naira',
    color: '#059669',
    accent: '#34d399',
    imageKey: 'naira_500',
    description: 'Dr. Nnamdi Azikiwe • Emerald Green Note',
    isBundle: false,
    currencySymbol: '₦'
  },
  {
    id: '1000',
    value: 1000,
    label: '₦1,000',
    name: 'One Thousand Naira',
    color: '#2563eb',
    accent: '#60a5fa',
    imageKey: 'naira_1000',
    description: 'Alhaji Aliyu Mai-Bornu & Clement Isong • Royal Blue',
    isBundle: false,
    currencySymbol: '₦'
  },
  {
    id: 'usd100',
    value: 150000,
    label: '$100',
    name: 'One Hundred US Dollars',
    color: '#15803d',
    accent: '#4ade80',
    imageKey: 'usd_100',
    description: 'Benjamin Franklin • VIP Baller Foreign Currency',
    isBundle: false,
    currencySymbol: '$'
  },
  {
    id: 'bundle',
    value: 20000,
    label: '₦Bundle',
    name: 'Mint ₦20,000 Brick',
    color: '#eab308',
    accent: '#facc15',
    imageKey: 'bundle_brick',
    description: '100 Crisp Notes Strapped • Mega Spray',
    isBundle: true,
    currencySymbol: '₦'
  },
];

export function VanitiProvider({ children }) {
  // Navigation & Role State
  const [isOpen, setIsOpen] = useState(false);
  const [role, setRole] = useState(null); // 'sprayer' | 'host' | null (gateway)
  const [sprayerStep, setSprayerStep] = useState('discovery'); // 'discovery' | 'confirm' | 'config' | 'stage' | 'receipt'
  const [hostStep, setHostStep] = useState('setup'); // 'setup' | 'broadcast' | 'analytics'
  const [isDualDemo, setIsDualDemo] = useState(false); // Split screen preview
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);

  // User Wallet & Balance
  const [walletBalance, setWalletBalance] = useState(125000); // in Naira
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);

  // Events State
  const [events, setEvents] = useState(MOCK_EVENTS);
  const [selectedEventId, setSelectedEventId] = useState('event-wedding-1');
  const [isSearchingProximity, setIsSearchingProximity] = useState(false);

  // Active Sprayer Config
  const [selectedDenomId, setSelectedDenomId] = useState('200');
  const [sprayPotTarget, setSprayPotTarget] = useState(20000); // ₦20,000 initial pot
  const [sprayedAmount, setSprayedAmount] = useState(0);
  const [sprayHistory, setSprayHistory] = useState([]);
  const [sessionStartTime, setSessionStartTime] = useState(null);
  const [recentSprayToast, setRecentSprayToast] = useState(null);

  // Theme Mode State ('dark' | 'light')
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('zengly_theme') || 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('zengly_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
    playVanitiSound('flick');
  };

  // Edge Cases & Diagnostics Simulation States
  const [isHostOffline, setIsHostOffline] = useState(false);
  const [isPendingTransaction, setIsPendingTransaction] = useState(false);
  const [hasSeenStageCoachmark, setHasSeenStageCoachmark] = useState(false);
  const [vipMembership, setVipMembership] = useState({
    isMember: false,
    memberId: 'VIP-7704',
    tier: 'Gold Celebrant Circle',
    points: 1450,
  });

  // Audio / Sound FX
  const [soundEnabled, setSoundEnabled] = useState(true);
  const audioCtxRef = useRef(null);

  const initAudio = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
  };

  const playVanitiSound = (type) => {
    if (!soundEnabled) return;
    try {
      initAudio();
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      if (type === 'flick') {
        // High speed whoosh + light paper snap
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(400, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1400, ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.1);
      } else if (type === 'cash_drop') {
        // Crisp coin/cash register ping
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1318.51, ctx.currentTime); // E6
        gain.gain.setValueAtTime(0.18, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.35);
      } else if (type === 'auth') {
        // Futuristic success chime
        const now = ctx.currentTime;
        [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + i * 0.06);
          gain.gain.setValueAtTime(0.12, now + i * 0.06);
          gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.25);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + i * 0.06);
          osc.stop(now + i * 0.06 + 0.26);
        });
      } else if (type === 'fanfare') {
        // Celebration victory fanfare
        const now = ctx.currentTime;
        const notes = [440, 554.37, 659.25, 880];
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + idx * 0.09);
          gain.gain.setValueAtTime(0.2, now + idx * 0.09);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.09 + 0.4);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.09);
          osc.stop(now + idx * 0.09 + 0.4);
        });
      }
    } catch (e) {
      console.warn('Audio playback error:', e);
    }
  };

  // Get active event object
  const activeEvent = events.find(e => e.id === selectedEventId) || events[0];

  // Helper to spray notes (called by SprayerStage on gesture flick)
  const sprayNote = (customAmount = null) => {
    if (!activeEvent || activeEvent.isPaused) return false;

    const denom = DENOMINATIONS.find(d => d.id === selectedDenomId) || DENOMINATIONS[0];
    const amount = customAmount !== null ? customAmount : denom.value;

    if (walletBalance < amount) {
      // Insufficient balance
      return 'insufficient_balance';
    }

    // Deduct from wallet and add to sprayed pot
    setWalletBalance(prev => Math.max(0, prev - amount));
    setSprayedAmount(prev => prev + amount);

    // Audio & Haptics
    playVanitiSound('flick');
    if (navigator.vibrate) {
      navigator.vibrate(30);
    }

    const sprayAction = {
      id: 'spray-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      sprayerName: 'Kelvin Ekuhoho',
      sprayerAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=antigravity',
      amount,
      denomId: denom.id,
      denomLabel: denom.label,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    };

    setSprayHistory(prev => [sprayAction, ...prev.slice(0, 49)]);

    // Broadcast toast to Host
    setRecentSprayToast(sprayAction);

    // Update the Event totals and leaderboard in real-time
    setEvents(prevEvents =>
      prevEvents.map(evt => {
        if (evt.id === activeEvent.id) {
          const newTotal = evt.totalSprayed + amount;
          const newNotes = evt.totalNotes + (denom.isBundle ? 100 : 1);

          // Update user's position in leaderboard
          let updatedSprayers = [...evt.topSprayers];
          const userIdx = updatedSprayers.findIndex(s => s.name === 'Kelvin Ekuhoho');
          if (userIdx >= 0) {
            updatedSprayers[userIdx] = {
              ...updatedSprayers[userIdx],
              amount: updatedSprayers[userIdx].amount + amount,
              noteCount: updatedSprayers[userIdx].noteCount + (denom.isBundle ? 100 : 1),
            };
          } else {
            updatedSprayers.push({
              id: 's-user',
              name: 'Kelvin Ekuhoho',
              amount,
              avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=antigravity',
              noteCount: denom.isBundle ? 100 : 1,
            });
          }

          // Sort by amount descending & reassign ranks
          updatedSprayers.sort((a, b) => b.amount - a.amount);
          updatedSprayers = updatedSprayers.map((s, idx) => ({ ...s, rank: idx + 1 }));

          return {
            ...evt,
            totalSprayed: newTotal,
            totalNotes: newNotes,
            topSprayers: updatedSprayers,
          };
        }
        return evt;
      })
    );

    return 'success';
  };

  // Host Controls
  const toggleEventPause = (eventId) => {
    setEvents(prev =>
      prev.map(e => (e.id === eventId ? { ...e, isPaused: !e.isPaused } : e))
    );
  };

  const toggleHideTotals = (eventId) => {
    setEvents(prev =>
      prev.map(e => (e.id === eventId ? { ...e, hideTotals: !e.hideTotals } : e))
    );
  };

  const endEvent = (eventId) => {
    setEvents(prev =>
      prev.map(e => (e.id === eventId ? { ...e, isLive: false } : e))
    );
    setHostStep('analytics');
  };

  const createEvent = (newEventData) => {
    const created = {
      id: 'event-user-' + Date.now(),
      title: newEventData.title || "Lagos VIP Celebration",
      hostName: newEventData.hostName || "Host VIP",
      hostAvatar: "https://api.dicebear.com/7.x/bottts/svg?seed=HostCelebrant",
      coverImage: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&auto=format&fit=crop&q=80",
      category: newEventData.category || "Party",
      venue: newEventData.venue || "The Grand Ballroom, Lagos",
      distanceMeters: 5,
      signalStrength: "Perfect • 100%",
      activeSprayers: 1,
      totalSprayed: 0,
      totalNotes: 0,
      isLive: true,
      isPaused: false,
      hideTotals: newEventData.hideTotals || false,
      geofenceRadius: newEventData.geofenceRadius || 100,
      settlementWallet: newEventData.settlementWallet || "ZenPay • Instant (0982***321)",
      privacyToggles: newEventData.privacyToggles || {
        proximityDiscovery: true,
        showLeaderboard: true,
        hideTotalRaised: false,
        requireApproval: false,
      },
      topSprayers: [],
    };
    setEvents(prev => [created, ...prev]);
    setSelectedEventId(created.id);
    setHostStep('broadcast');
  };

  // Quick Top Up
  const topUpWallet = (amount) => {
    setWalletBalance(prev => prev + amount);
    playVanitiSound('cash_drop');
    setIsTopUpOpen(false);
  };

  // Rescan proximity
  const rescanProximity = () => {
    setIsSearchingProximity(true);
    setTimeout(() => {
      setIsSearchingProximity(false);
    }, 1200);
  };

  return (
    <VanitiContext.Provider
      value={{
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
        hasSeenOnboarding,
        setHasSeenOnboarding,
        walletBalance,
        setWalletBalance,
        isTopUpOpen,
        setIsTopUpOpen,
        topUpWallet,
        events,
        setEvents,
        selectedEventId,
        setSelectedEventId,
        activeEvent,
        isSearchingProximity,
        rescanProximity,
        selectedDenomId,
        setSelectedDenomId,
        sprayPotTarget,
        setSprayPotTarget,
        sprayedAmount,
        setSprayedAmount,
        sprayHistory,
        sessionStartTime,
        setSessionStartTime,
        recentSprayToast,
        setRecentSprayToast,
        sprayNote,
        toggleEventPause,
        toggleHideTotals,
        endEvent,
        createEvent,
        isHostOffline,
        setIsHostOffline,
        isPendingTransaction,
        setIsPendingTransaction,
        hasSeenStageCoachmark,
        setHasSeenStageCoachmark,
        vipMembership,
        setVipMembership,
        theme,
        setTheme,
        toggleTheme,
        soundEnabled,
        setSoundEnabled,
        playVanitiSound,
      }}
    >
      {children}
    </VanitiContext.Provider>
  );
}

export function useVaniti() {
  const context = useContext(VanitiContext);
  if (!context) {
    throw new Error('useVaniti must be used within a VanitiProvider');
  }
  return context;
}
