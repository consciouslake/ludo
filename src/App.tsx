import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, Trophy, Users, Briefcase, Award, Dices, Info, RotateCcw, User, TrendingUp, Building, Building2, Crown, X, HelpCircle, Map } from 'lucide-react';

const perimeter_coords = [
  [6, 0], [6, 1], [6, 2], [6, 3], [6, 4], [6, 5],
  [5, 6], [4, 6], [3, 6], [2, 6], [1, 6], [0, 6],
  [0, 7],
  [0, 8], [1, 8], [2, 8], [3, 8], [4, 8], [5, 8],
  [6, 9], [6, 10], [6, 11], [6, 12], [6, 13], [6, 14],
  [7, 14],
  [8, 14], [8, 13], [8, 12], [8, 11], [8, 10], [8, 9],
  [9, 8], [10, 8], [11, 8], [12, 8], [13, 8], [14, 8],
  [14, 7],
  [14, 6], [13, 6], [12, 6], [11, 6], [10, 6], [9, 6],
  [8, 5], [8, 4], [8, 3], [8, 2], [8, 1], [8, 0],
  [7, 0]
];

const playersConfig = [
  {
    id: 0, color: 'bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.8)] border border-rose-300', border: 'border-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.3)]', text: 'text-rose-400', name: 'Player 1',
    startIndex: 1,
    homeStretch: [[7, 1], [7, 2], [7, 3], [7, 4], [7, 5]],
    home: [7, 6],
    yard: [3, 3]
  },
  {
    id: 1, color: 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.8)] border border-emerald-300', border: 'border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)]', text: 'text-emerald-400', name: 'Player 2',
    startIndex: 14,
    homeStretch: [[1, 7], [2, 7], [3, 7], [4, 7], [5, 7]],
    home: [6, 7],
    yard: [3, 11]
  },
  {
    id: 2, color: 'bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.8)] border border-amber-200', border: 'border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.3)]', text: 'text-amber-400', name: 'Player 3',
    startIndex: 27,
    homeStretch: [[7, 13], [7, 12], [7, 11], [7, 10], [7, 9]],
    home: [7, 8],
    yard: [11, 11]
  },
  {
    id: 3, color: 'bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.8)] border border-blue-300', border: 'border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.3)]', text: 'text-blue-400', name: 'Player 4',
    startIndex: 40,
    homeStretch: [[13, 7], [12, 7], [11, 7], [10, 7], [9, 7]],
    home: [8, 7],
    yard: [11, 3]
  }
];

const safeZones = [1, 9, 14, 22, 27, 35, 40, 48];

const benefitDescriptions: Record<string, string> = {
  'Basic Commission': 'Base (22.5% net), Booster (+10% on base for 2-Time STRIDE, 25% net), Bonus (+20% on booster for Samrats, 30% net). Maximize to 30% with 2 lives & 1 Lakh business!',
  'Fixed Monthly Incentive (FMI)': 'Mandatory: ₹20,000/- WRP each quarter and YTD 13th month persistency of 75%. Payouts scale heavily (e.g. 2 lives/1L WRP = ₹500, 6 lives/6L WRP = ₹3000).',
  'ALC Samrat': 'Minimum 2 Lives with 1 Lakh Collected Premium in FY\'26 (Min WRP: 20k or 5k for SPP). Unlocks Notebook, Lapel Pin, 2 Days Workshop, Cards & PAL Eligibility!',
  'BA Club Membership': 'Qualify for State, National, Asian, or Olympic clubs to earn monthly payouts (₹1000-₹5000) and loyalty bonuses.',
  'Incentives/Contests': 'Participate in quarterly and annual contests for international travel and extra rewards.',
  'Team Building Allowance (TBA)': 'Earn ₹3000/month for the first 3 months by recruiting BAs. Get double payout (₹9000) for hitting all targets!',
  'Activation Fee': 'Earn monthly payouts (up to ₹2000 per activation) based on the number of active BAs in your team.',
  'Team Development Incentive (TDI)': 'Earn up to 70% on Team FYC with 200% extra credit for new BAs in their first 3 months.',
  'Fixed Salary': 'Earn a fixed salary of ₹3000/month by meeting minimum team WRP and activation criteria.',
  'Fixed Monthly Payout (FMP)': 'Earn up to ₹40,000/month based on rolling 12 months team performance.',
  'Club Qualifiers': 'Earn up to ₹10,000 per direct team member you develop into a Club Member.',
  'Minimum Performance Standard (MPS)': 'Double Bonanza! Earn an extra ₹3000-₹16000 if eligible for both salary and MPS in a month.',
  'ALC Samrat Payout': 'Earn ₹1500-₹2000 for each direct team member who qualifies as an ALC Samrat.',
  'Elite Club': 'Qualify for National Conferences and earn cars/bikes (Royal Enfield, Tata Punch EV) for consecutive qualifications.',
  'Annual Bonus': 'Earn up to 6% annual bonus on Team WRP, paid in two tranches (September and March).',
  'AL Office': 'Get BM support, branding, and rent allowance (up to ₹30,000) to set up your own Leader Office.'
};

const getLevel = (step: number) => {
  if (step === 0) return { name: 'New Recruit', role: 'Start', benefits: [] };
  if (step >= 1 && step <= 14) return {
    name: 'Business Associate (BA)',
    role: 'BA',
    benefits: ['Basic Commission', 'Fixed Monthly Incentive (FMI)', 'ALC Samrat', 'BA Club Membership', 'Incentives/Contests']
  };
  if (step >= 15 && step <= 28) return {
    name: 'Provisional Agency Leader (PAL)',
    role: 'PAL',
    benefits: ['Basic Commission', 'Fixed Monthly Incentive (FMI)', 'Team Building Allowance (TBA)', 'Activation Fee', 'Team Development Incentive (TDI)', 'Incentives/Contests']
  };
  if (step >= 29 && step <= 42) return {
    name: 'Agency Leader (AL)',
    role: 'AL',
    benefits: ['Fixed Salary', 'Activation Fee', 'Fixed Monthly Payout (FMP)', 'Team Development Incentive (TDI)', 'Club Qualifiers', 'Minimum Performance Standard (MPS)', 'ALC Samrat', 'Elite Club', 'Incentives/Contests', 'AL Office']
  };
  if (step >= 43 && step <= 56) return {
    name: 'Senior Agency Leader (SAL)',
    role: 'SAL',
    benefits: ['Fixed Salary', 'Activation Fee', 'Fixed Monthly Payout (FMP)', 'Team Development Incentive (TDI)', 'Club Qualifiers', 'Minimum Performance Standard (MPS)', 'ALC Samrat', 'Annual Bonus', 'Elite Club', 'Incentives/Contests', 'AL Office']
  };
  if (step === 57) return {
    name: 'Master Agency Leader (MAL)',
    role: 'MAL',
    benefits: ['Fixed Salary', 'Activation Fee', 'Fixed Monthly Payout (FMP)', 'Team Development Incentive (TDI)', 'ALC Samrat Payout', 'Minimum Performance Standard (MPS)', 'Club Qualifiers', 'Annual Bonus', 'Elite Club', 'Incentives/Contests', 'AL Office']
  };
  return { name: 'Unknown', role: 'Unknown', benefits: [] };
}

const getRoleIcon = (role: string, className: string = "w-4 h-4") => {
  switch (role) {
    case 'Start': return <User className={className} />;
    case 'BA': return <Briefcase className={className} />;
    case 'PAL': return <TrendingUp className={className} />;
    case 'AL': return <Building className={className} />;
    case 'SAL': return <Building2 className={className} />;
    case 'MAL': return <Crown className={`${className} text-yellow-500`} />;
    default: return <User className={className} />;
  }
}

const getPromotionCriteria = (currentRole: string) => {
  switch (currentRole) {
    case 'BA': 
      return { next: 'PAL', criteria: ['Min. 2 lives with 1 lakh APE', '12 Rolling Months'] };
    case 'PAL': 
      return { next: 'AL', criteria: ['3 Unique Active BAs', '6 Rolling months', '1.5 Lakhs (APE) Team business'] };
    case 'AL': 
      return { next: 'SAL', criteria: ['15 Active BAs (Man Month)', '12 Months Rolling', '2 ALs (1 internal)', '10 Lakhs (APE) Team business'] };
    case 'SAL': 
      return { next: 'MAL', criteria: ['2 SALs (1 Internal)', '12 Months Rolling', '20 Lakhs (APE) Team business'] };
    default: return null;
  }
}

const getPlayerCoords = (playerId: number, step: number) => {
  const config = playersConfig[playerId];
  if (step === 0) return config.yard;
  if (step >= 1 && step <= 51) {
    const globalIndex = (config.startIndex + step - 1) % 52;
    return perimeter_coords[globalIndex];
  }
  if (step >= 52 && step <= 56) {
    return config.homeStretch[step - 52];
  }
  if (step === 57) {
    return config.home;
  }
  return [0, 0];
}

const isStar = (r: number, c: number) => {
  return (r === 2 && c === 6) || (r === 6 && c === 12) || (r === 12 && c === 8) || (r === 8 && c === 2) ||
    (r === 6 && c === 1) || (r === 1 && c === 8) || (r === 8 && c === 13) || (r === 13 && c === 6);
}

const getCellClass = (r: number, c: number) => {
  let classes = 'flex items-center justify-center transition-all duration-300 rounded-[6px] relative ';

  // Yards (Hide the underlying grid cells inside the 6x6 player yards to let the big overlay shine)
  if ((r < 6 && c < 6) || (r < 6 && c > 8) || (r > 8 && c > 8) || (r > 8 && c < 6)) {
    return classes + 'opacity-0'; // We'll put beautiful big overlays over these areas
  }

  // Center (Hide grid cells because we have the giant center logo over it)
  if (r >= 6 && r <= 8 && c >= 6 && c <= 8) {
    return classes + 'opacity-0';
  }

  // Home stretches (Neon glowing paths)
  if (r === 7 && c >= 1 && c <= 5) return classes + 'bg-gradient-to-b from-rose-400 to-rose-600 shadow-[0_0_15px_rgba(225,29,72,0.8),inset_0_2px_4px_rgba(255,255,255,0.4)] border border-rose-300 z-0';
  if (c === 7 && r >= 1 && r <= 5) return classes + 'bg-gradient-to-r from-emerald-400 to-emerald-600 shadow-[0_0_15px_rgba(16,185,129,0.8),inset_0_2px_4px_rgba(255,255,255,0.4)] border border-emerald-300 z-0';
  if (r === 7 && c >= 9 && c <= 13) return classes + 'bg-gradient-to-b from-amber-400 to-amber-600 shadow-[0_0_15px_rgba(245,158,11,0.8),inset_0_2px_4px_rgba(255,255,255,0.4)] border border-amber-300 z-0';
  if (c === 7 && r >= 9 && r <= 13) return classes + 'bg-gradient-to-r from-blue-400 to-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.8),inset_0_2px_4px_rgba(255,255,255,0.4)] border border-blue-300 z-0';

  // Start squares (Super highlighted entry points)
  if (r === 6 && c === 1) return classes + 'bg-rose-500 shadow-[0_0_20px_rgba(244,63,94,1),inset_0_2px_5px_rgba(255,255,255,0.5)] border border-rose-300 transform scale-[1.05] z-0 animate-pulse';
  if (r === 1 && c === 8) return classes + 'bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,1),inset_0_2px_5px_rgba(255,255,255,0.5)] border border-emerald-300 transform scale-[1.05] z-0 animate-pulse';
  if (r === 8 && c === 13) return classes + 'bg-amber-500 shadow-[0_0_20px_rgba(245,158,11,1),inset_0_2px_5px_rgba(255,255,255,0.5)] border border-amber-300 transform scale-[1.05] z-0 animate-pulse';
  if (r === 13 && c === 6) return classes + 'bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,1),inset_0_2px_5px_rgba(255,255,255,0.5)] border border-blue-300 transform scale-[1.05] z-0 animate-pulse';

  // Star safe zones
  if (isStar(r, c)) return classes + 'bg-indigo-900/80 border border-indigo-400/50 shadow-[0_0_15px_rgba(99,102,241,0.4),inset_0_1px_3px_rgba(255,255,255,0.2)] z-0';
  
  // Normal playable tiles (raised glass keys)
  return classes + 'bg-[#1e293b]/90 border-t border-l border-white/10 border-b border-r border-black/50 shadow-[4px_4px_10px_rgba(0,0,0,0.5),inset_1px_1px_1px_rgba(255,255,255,0.1)] z-0';
}

export default function App() {
  const [players, setPlayers] = useState([
    { id: 0, step: 0 },
    { id: 1, step: 0 },
    { id: 2, step: 0 },
    { id: 3, step: 0 }
  ]);
  const [turn, setTurn] = useState(0);
  const [diceValue, setDiceValue] = useState(1);
  const [diceStatus, setDiceStatus] = useState<'idle' | 'rolling' | 'rolled'>('idle');
  const [logs, setLogs] = useState<string[]>(['Game started! Roll the dice to begin your journey.']);
  const [hoveredBenefit, setHoveredBenefit] = useState<string | null>(null);
  const [showInfo, setShowInfo] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [hoveredPlayerOnBoard, setHoveredPlayerOnBoard] = useState<number | null>(null);
  const [selectedMalPlayer, setSelectedMalPlayer] = useState<number | null>(null);
  
  const [capturedPlayerId, setCapturedPlayerId] = useState<number | null>(null);
  const [promotedPlayerInfo, setPromotedPlayerInfo] = useState<{ id: number, role: string, step: number, fromRole: string } | null>(null);
  const [clubMilestone, setClubMilestone] = useState<{ id: number, club: string } | null>(null);

  const [scale, setScale] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 1024;
      if (isMobile) {
        const availableWidth = window.innerWidth - 32;
        setScale(Math.min(1, availableWidth / 616));
      } else {
        const availableHeight = window.innerHeight - 64;
        const availableWidth = window.innerWidth - 450 - 64;
        setScale(Math.min(1, availableHeight / 616, availableWidth / 616));
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleRestart = useCallback(() => {
    if (window.confirm('Are you sure you want to restart the game? All progress will be lost.')) {
      setPlayers([
        { id: 0, step: 0 },
        { id: 1, step: 0 },
        { id: 2, step: 0 },
        { id: 3, step: 0 }
      ]);
      setTurn(0);
      setDiceValue(1);
      setDiceStatus('idle');
      setLogs(['Game restarted! Roll the dice to begin your journey.']);
    }
  }, []);

  const addLog = useCallback((msg: string) => {
    setLogs(prev => [msg, ...prev].slice(0, 8));
  }, []);

  const handleRoll = () => {
    if (diceStatus !== 'idle') return;
    setDiceStatus('rolling');

    let rolls = 0;
    const interval = setInterval(() => {
      setDiceValue(Math.floor(Math.random() * 6) + 1);
      rolls++;
      if (rolls > 10) {
        clearInterval(interval);
        const finalValue = Math.floor(Math.random() * 6) + 1;
        setDiceValue(finalValue);
        setDiceStatus('rolled');
      }
    }, 50);
  };

  const executeMove = useCallback(() => {
    const player = players[turn];
    let newStep = player.step === 0 ? diceValue : player.step + diceValue;

    if (newStep > 57) {
      addLog(`${playersConfig[turn].name} needs an exact roll to finish.`);
      setDiceStatus('idle');
      return;
    }

    let capturedIdx = -1;
    if (newStep <= 51) {
      const globalIndex = (playersConfig[turn].startIndex + newStep - 1) % 52;
      if (!safeZones.includes(globalIndex)) {
        players.forEach((p, idx) => {
          if (idx !== turn && p.step > 0 && p.step <= 51) {
            const pGlobalIndex = (playersConfig[idx].startIndex + p.step - 1) % 52;
            if (pGlobalIndex === globalIndex) {
              capturedIdx = idx;
            }
          }
        });
      }
    }

    const newPlayers = players.map((p, i) => {
      if (i === turn) return { ...p, step: newStep };
      if (i === capturedIdx) return { ...p, step: 0 };
      return p;
    });

    // Compute progression
    const oldLevel = getLevel(player.step).role;
    const newLevel = getLevel(newStep).role;
    if (oldLevel !== newLevel && newStep > 0) {
      setPromotedPlayerInfo({ id: turn, role: newLevel, step: newStep, fromRole: oldLevel });
      addLog(`🎉 ${playersConfig[turn].name} promoted to ${getLevel(newStep).name}!`);
      
      // Since Clubs are 1:1 mapped to Ranks, tie them directly to promotions so they can't be skipped by dice rolls
      const rankToClub: Record<string, string> = {
        'BA': 'ALC SAMRAT',
        'PAL': 'STATE CLUB',
        'AL': 'NATIONAL CLUB',
        'SAL': 'ASIAN CLUB',
        'MAL': 'OLYMPIC CLUB'
      };
      if (rankToClub[newLevel]) {
        setClubMilestone({ id: turn, club: rankToClub[newLevel] });
      }
    }

    if (capturedIdx !== -1) {
      setCapturedPlayerId(capturedIdx);
      addLog(`⚔️ Market Competition! ${playersConfig[turn].name} overtook ${playersConfig[capturedIdx].name}.`);
    }

    if (newStep === 57) {
      addLog(`🏆 ${playersConfig[turn].name} has achieved Master Agency Leader!`);
    }

    const getsAnotherTurn = diceValue === 6 || capturedIdx !== -1;
    if (getsAnotherTurn && newStep !== 57) {
      addLog(`${playersConfig[turn].name} gets another turn!`);
    }

    setDiceStatus('idle');
    setPlayers(newPlayers);

    if (newPlayers.every(p => p.step === 57)) {
      addLog("All players have achieved Master Agency Leader! Game Over.");
    } else if (!getsAnotherTurn || newStep === 57) {
      let next = (turn + 1) % 4;
      while (newPlayers[next].step === 57) {
        next = (next + 1) % 4;
      }
      setTurn(next);
    }

  }, [turn, diceValue, players, addLog]);

  useEffect(() => {
    if (diceStatus === 'rolled') {
      const timer = setTimeout(() => {
        executeMove();
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [diceStatus, executeMove]);

  const getOffset = (playerId: number, step: number) => {
    if (step === 0) return [0, 0];
    const sharingPlayers = players.filter(p => {
      if (p.step === 0 || p.step === 57) return false;
      const coords1 = getPlayerCoords(p.id, p.step);
      const coords2 = getPlayerCoords(playerId, step);
      return coords1[0] === coords2[0] && coords1[1] === coords2[1];
    });
    if (sharingPlayers.length <= 1) return [0, 0];
    const index = sharingPlayers.findIndex(p => p.id === playerId);
    const offsets = [[-4, -4], [4, 4], [-4, 4], [4, -4]];
    return offsets[index] || [0, 0];
  }

  return (
    <div className="min-h-screen lg:h-screen lg:overflow-hidden bg-black flex flex-col lg:flex-row font-sans overflow-x-hidden overflow-y-auto w-full text-slate-200 relative">
      
      {/* Background Orbs for Premium Glassmorphic Aesthetic (Much stronger opacity and blurs) */}
      <div className="fixed top-[-20%] left-[-10%] w-[60%] h-[60%] bg-indigo-600/40 rounded-full blur-[150px] pointer-events-none z-0 mix-blend-screen"></div>
      <div className="fixed bottom-[-10%] right-[10%] w-[50%] h-[50%] bg-rose-600/30 rounded-full blur-[140px] pointer-events-none z-0 mix-blend-screen"></div>
      <div className="fixed top-[20%] right-[-10%] w-[40%] h-[40%] bg-amber-500/20 rounded-full blur-[120px] pointer-events-none z-0 mix-blend-screen"></div>
      
      {/* Welcome Screen Modal */}
      <AnimatePresence>
        {showWelcome && (
          <motion.div key="welcome-modal" className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-2xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className="bg-slate-900/90 rounded-3xl shadow-[0_0_80px_rgba(245,158,11,0.2)] max-w-2xl w-full border border-white/10 flex flex-col overflow-hidden backdrop-blur-xl"
            >
              <div className="bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 p-4 sm:p-6 text-center relative shrink-0 shadow-[inset_0_1px_3px_rgba(255,255,255,0.5)]">
                <Trophy className="w-10 h-10 sm:w-12 sm:h-12 text-white mx-auto mb-1 sm:mb-2 drop-shadow-[0_0_15px_rgba(255,255,255,0.9)]" />
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 uppercase tracking-widest mb-1 drop-shadow-sm">Agency Leader Program</h1>
                <p className="text-amber-900 font-bold text-sm sm:text-base tracking-[0.2em] uppercase">Build... Lead... Win.</p>
              </div>
              
              <div className="p-4 sm:p-6 w-full flex flex-col justify-between" style={{ minHeight: '400px' }}>
                <h2 className="text-lg sm:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-yellow-500 text-center mb-4 uppercase tracking-wider relative">
                  Program Benefits for Business Associates
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-24 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent"></div>
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-6 mt-4">
                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_4px_10px_rgba(0,0,0,0.3)] transition-all hover:bg-white/10 hover:border-amber-500/50 hover:shadow-[0_0_20px_rgba(245,158,11,0.2)] hover:scale-[1.03]">
                    <div className="bg-gradient-to-br from-amber-400 to-amber-600 p-2.5 rounded-xl shrink-0 shadow-[inset_0_1px_2px_rgba(255,255,255,0.5),0_0_10px_rgba(245,158,11,0.5)]"><Briefcase className="w-5 h-5 sm:w-6 sm:h-6 text-slate-900" /></div>
                    <div>
                      <h3 className="font-bold text-white text-sm sm:text-base leading-tight mb-0.5 drop-shadow-md">Zero Investment</h3>
                      <p className="text-[11px] sm:text-xs text-slate-400 leading-snug">Start your journey with absolutely zero capital required.</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_4px_10px_rgba(0,0,0,0.3)] transition-all hover:bg-white/10 hover:border-amber-500/50 hover:shadow-[0_0_20px_rgba(245,158,11,0.2)] hover:scale-[1.03]">
                    <div className="bg-gradient-to-br from-amber-400 to-amber-600 p-2.5 rounded-xl shrink-0 shadow-[inset_0_1px_2px_rgba(255,255,255,0.5),0_0_10px_rgba(245,158,11,0.5)]"><TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-slate-900" /></div>
                    <div>
                      <h3 className="font-bold text-white text-sm sm:text-base leading-tight mb-0.5 drop-shadow-md">Career Goals & Team Building</h3>
                      <p className="text-[11px] sm:text-xs text-slate-400 leading-snug">Build a robust team and achieve progressive career milestones.</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_4px_10px_rgba(0,0,0,0.3)] transition-all hover:bg-white/10 hover:border-amber-500/50 hover:shadow-[0_0_20px_rgba(245,158,11,0.2)] hover:scale-[1.03]">
                    <div className="bg-gradient-to-br from-amber-400 to-amber-600 p-2.5 rounded-xl shrink-0 shadow-[inset_0_1px_2px_rgba(255,255,255,0.5),0_0_10px_rgba(245,158,11,0.5)]"><User className="w-5 h-5 sm:w-6 sm:h-6 text-slate-900" /></div>
                    <div>
                      <h3 className="font-bold text-white text-sm sm:text-base leading-tight mb-0.5 drop-shadow-md">Social Recognition</h3>
                      <p className="text-[11px] sm:text-xs text-slate-400 leading-snug">Gain prestige and profound respect within the community.</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_4px_10px_rgba(0,0,0,0.3)] transition-all hover:bg-white/10 hover:border-amber-500/50 hover:shadow-[0_0_20px_rgba(245,158,11,0.2)] hover:scale-[1.03]">
                    <div className="bg-gradient-to-br from-amber-400 to-amber-600 p-2.5 rounded-xl shrink-0 shadow-[inset_0_1px_2px_rgba(255,255,255,0.5),0_0_10px_rgba(245,158,11,0.5)]"><Building className="w-5 h-5 sm:w-6 sm:h-6 text-slate-900" /></div>
                    <div>
                      <h3 className="font-bold text-white text-sm sm:text-base leading-tight mb-0.5 drop-shadow-md">Consistent Unlimited Income</h3>
                      <p className="text-[11px] sm:text-xs text-slate-400 leading-snug">Scale your earnings infinitely matched with your effort.</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_4px_10px_rgba(0,0,0,0.3)] transition-all hover:bg-white/10 hover:border-amber-500/50 hover:shadow-[0_0_20px_rgba(245,158,11,0.2)] hover:scale-[1.03] md:col-span-2 md:w-3/4 md:mx-auto">
                    <div className="bg-gradient-to-br from-amber-400 to-amber-600 p-2.5 rounded-xl shrink-0 shadow-[inset_0_1px_2px_rgba(255,255,255,0.5),0_0_10px_rgba(245,158,11,0.5)]"><Star className="w-5 h-5 sm:w-6 sm:h-6 text-slate-900" /></div>
                    <div>
                      <h3 className="font-bold text-white text-sm sm:text-base leading-tight mb-0.5 drop-shadow-md">International Travel & Rewards</h3>
                      <p className="text-[11px] sm:text-xs text-slate-400 leading-snug">Unlock Exotic Trips, Royal Enfields, and Cars for top performers.</p>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => setShowWelcome(false)} 
                  className="w-full py-3.5 sm:py-4 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 hover:from-yellow-300 hover:to-yellow-200 text-slate-900 rounded-2xl font-black uppercase tracking-[0.15em] transition-all shadow-[0_0_30px_rgba(245,158,11,0.5),inset_0_1px_2px_rgba(255,255,255,0.8)] hover:shadow-[0_0_50px_rgba(245,158,11,0.8)] hover:scale-[1.02] shrink-0 mt-4 border border-amber-200"
                >
                  Start Your Journey
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Left Side - Board */}
      <div className="w-full lg:flex-1 relative flex items-center justify-center p-4 sm:p-8 lg:h-screen lg:overflow-hidden min-h-[400px] shrink-0 border-b border-white/10 lg:border-none">
        <div style={{ width: 620 * scale, height: 620 * scale }} className="relative transition-all duration-300 shrink-0">
          <div className="absolute top-0 left-0 origin-top-left transition-transform duration-300" style={{ transform: `scale(${scale})` }}>
            <div className="relative shadow-[0_20px_80px_rgba(0,0,0,0.8)] rounded-[2rem] bg-slate-900/60 backdrop-blur-3xl border border-white/10 box-content overflow-hidden" style={{ width: '600px', height: '600px', padding: '10px' }}>
              
              {/* Massive Yard Overlays for Seamless Gradient Look */}
              <div className="absolute rounded-[1.5rem] bg-gradient-to-br from-rose-500/30 to-rose-900/30 border border-rose-400/30 shadow-[inset_0_0_60px_rgba(244,63,94,0.3)] backdrop-blur-md z-10 flex flex-col items-center justify-center p-4" style={{ top: '10px', left: '10px', width: '232px', height: '232px' }}>
                <div className="w-full h-full rounded-[1rem] bg-black/40 shadow-inner flex flex-col items-center justify-center border border-white/5 relative overflow-hidden">
                   <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.05)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.05)_50%,rgba(255,255,255,0.05)_75%,transparent_75%,transparent)] bg-[length:20px_20px] opacity-20 pointer-events-none"></div>
                   <div className="text-3xl font-black text-white/10 tracking-[0.2em] relative z-10">PLAYER 1</div>
                </div>
              </div>
              <div className="absolute rounded-[1.5rem] bg-gradient-to-bl from-emerald-500/30 to-emerald-900/30 border border-emerald-400/30 shadow-[inset_0_0_60px_rgba(16,185,129,0.3)] backdrop-blur-md z-10 flex flex-col items-center justify-center p-4" style={{ top: '10px', left: '378px', width: '232px', height: '232px' }}>
                <div className="w-full h-full rounded-[1rem] bg-black/40 shadow-inner flex flex-col items-center justify-center border border-white/5 relative overflow-hidden">
                   <div className="absolute inset-0 bg-[linear-gradient(-45deg,rgba(255,255,255,0.05)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.05)_50%,rgba(255,255,255,0.05)_75%,transparent_75%,transparent)] bg-[length:20px_20px] opacity-20 pointer-events-none"></div>
                   <div className="text-3xl font-black text-white/10 tracking-[0.2em] relative z-10">PLAYER 2</div>
                </div>
              </div>
              <div className="absolute rounded-[1.5rem] bg-gradient-to-tl from-amber-500/30 to-amber-900/30 border border-amber-400/30 shadow-[inset_0_0_60px_rgba(245,158,11,0.3)] backdrop-blur-md z-10 flex flex-col items-center justify-center p-4" style={{ top: '378px', left: '378px', width: '232px', height: '232px' }}>
                <div className="w-full h-full rounded-[1rem] bg-black/40 shadow-inner flex flex-col items-center justify-center border border-white/5 relative overflow-hidden">
                   <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.05)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.05)_50%,rgba(255,255,255,0.05)_75%,transparent_75%,transparent)] bg-[length:20px_20px] opacity-20 pointer-events-none"></div>
                   <div className="text-3xl font-black text-white/10 tracking-[0.2em] relative z-10">PLAYER 3</div>
                </div>
              </div>
              <div className="absolute rounded-[1.5rem] bg-gradient-to-tr from-blue-500/30 to-blue-900/30 border border-blue-400/30 shadow-[inset_0_0_60px_rgba(59,130,246,0.3)] backdrop-blur-md z-10 flex flex-col items-center justify-center p-4" style={{ top: '378px', left: '10px', width: '232px', height: '232px' }}>
                <div className="w-full h-full rounded-[1rem] bg-black/40 shadow-inner flex flex-col items-center justify-center border border-white/5 relative overflow-hidden">
                   <div className="absolute inset-0 bg-[linear-gradient(-45deg,rgba(255,255,255,0.05)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.05)_50%,rgba(255,255,255,0.05)_75%,transparent_75%,transparent)] bg-[length:20px_20px] opacity-20 pointer-events-none"></div>
                   <div className="text-3xl font-black text-white/10 tracking-[0.2em] relative z-10">PLAYER 4</div>
                </div>
              </div>

              {/* 3D Glass Tiles Grid (Gaps added for WOW factor!) */}
              <div className="w-full h-full rounded-xl" style={{ display: 'grid', gridTemplateColumns: 'repeat(15, 1fr)', gridTemplateRows: 'repeat(15, 1fr)', gap: '4px' }}>
                {Array.from({ length: 225 }).map((_, i) => {
                  const r = Math.floor(i / 15);
                  const c = i % 15;
                  return (
                    <div key={i} className={getCellClass(r, c)}>
                      {isStar(r, c) && <Star className="w-6 h-6 text-yellow-300 drop-shadow-[0_0_15px_rgba(253,224,71,1)]" fill="currentColor" />}
                    </div>
                  )
                })}
              </div>

              {/* Center Giant Neon Logo */}
              <div className="absolute inset-0 m-auto w-[116px] h-[116px] bg-black/80 backdrop-blur-3xl border border-amber-500/40 flex flex-col items-center justify-center p-1 shadow-[0_0_40px_rgba(245,158,11,0.6),inset_0_0_20px_rgba(245,158,11,0.2)] z-30 rounded-[1.2rem]">
                <Trophy className="w-8 h-8 text-amber-400 mb-1 drop-shadow-[0_0_15px_rgba(251,191,36,1)]" />
                <div className="text-[8px] font-black text-center leading-[1.1] tracking-[0.1em] text-transparent bg-clip-text bg-gradient-to-b from-yellow-100 via-amber-300 to-amber-600 drop-shadow-lg uppercase">
                  MASTER<br />AGENCY<br />LEADER
                </div>
              </div>

              {/* Tokens */}
              {players.map(p => {
                const [r, c] = getPlayerCoords(p.id, p.step);
                const offset = getOffset(p.id, p.step);
                const isNearTop = r < 3;
                
                // Adjustment for the gaps in the grid!
                // Container is 600px with 10px padding = 580px inner. 
                // 15 columns with 4px gap means 14*4=56px consumed by gaps.
                // 580 - 56 = 524px for tiles. 524 / 15 = 34.93px per tile.
                // Tile size + gap = ~38.93px stride.
                // Let's calculate exactly based on 4px gap and flex layout to ensure token perfectly centers on tile:
                const tileSize = (600 - (14 * 4)) / 15; // 36.26px
                const stride = tileSize + 4; // 40.26px
                
                return (
                  <motion.div
                    key={p.id}
                    onMouseEnter={() => setHoveredPlayerOnBoard(p.id)}
                    onMouseLeave={() => setHoveredPlayerOnBoard(null)}
                    className={`absolute w-8 h-8 rounded-full shadow-[0_10px_20px_rgba(0,0,0,0.5),inset_0_2px_4px_rgba(255,255,255,0.6)] border-[3px] border-white/90 z-40 flex items-center justify-center cursor-help ${playersConfig[p.id].color} ${p.step > 0 && p.step < 57 ? 'glow-token' : ''}`}
                    animate={{
                      top: 10 + r * stride + (tileSize / 2) - 16 + offset[0], // 16 is half token w/h
                      left: 10 + c * stride + (tileSize / 2) - 16 + offset[1],
                      scale: p.id === turn ? [1, 1.15, 1] : 1
                    }}
                    transition={{
                      top: { type: 'spring', stiffness: 300, damping: 20 },
                      left: { type: 'spring', stiffness: 300, damping: 20 },
                      scale: { repeat: Infinity, duration: 1.5 }
                    }}
                  >
                    {/* Progression Tooltip */}
                    <AnimatePresence>
                      {hoveredPlayerOnBoard === p.id && (
                        <motion.div
                          initial={{ opacity: 0, y: isNearTop ? -10 : 10, scale: 0.9 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          className={`absolute ${isNearTop ? 'top-full mt-3' : 'bottom-full mb-3'} left-1/2 -translate-x-1/2 bg-slate-900 text-white rounded-xl shadow-xl p-3.5 border border-slate-700 w-52 z-50 pointer-events-none`}
                        >
                          <div className="font-bold text-sm mb-1">{playersConfig[p.id].name}</div>
                          <div className="text-[11px] text-slate-300 font-medium leading-tight mb-1">
                            {getLevel(p.step).name}
                          </div>
                          <div className={`absolute ${isNearTop ? '-top-1.5 border-t border-l' : '-bottom-1.5 border-b border-r'} left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-900 border-slate-700 transform rotate-45`}></div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )
              })}

              <AnimatePresence>
                {capturedPlayerId !== null && (
                  <motion.div key="captured-modal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm z-50 rounded-[4px] flex items-center justify-center p-6">
                    <motion.div initial={{ scale: 0.9, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 10 }} className="bg-red-50 border-2 border-red-500 rounded-2xl p-6 text-slate-800 w-full max-w-sm shadow-2xl relative text-center">
                      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-200">
                        <TrendingUp className="w-8 h-8 text-red-500 transform rotate-180" />
                      </div>
                      <h2 className="text-2xl font-extrabold text-red-600 mb-2">Back to Start!</h2>
                      <p className="text-sm font-medium text-slate-600 mb-6">Your token was overtaken by a competitor.</p>
                      <div className="bg-white rounded-xl p-4 border border-red-100 mb-6 text-left shadow-sm">
                        <h3 className="font-bold text-slate-800 text-sm mb-2 uppercase tracking-wider">BA Reinstatement Norms</h3>
                        <ul className="text-sm text-slate-600 space-y-2">
                          <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0"></div><span>Log <strong>2 policies</strong> with total collected premium of <strong>₹50,000/-</strong></span></li>
                          <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0"></div><span>All new business & accrued renewal commissions will be processed.</span></li>
                        </ul>
                      </div>
                      <button onClick={() => setCapturedPlayerId(null)} className="w-full py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold transition-colors">Start Over</button>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {promotedPlayerInfo !== null && (
                  <motion.div key="promo-modal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm z-50 rounded-[4px] flex items-center justify-center p-6">
                    <motion.div initial={{ scale: 0.8, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.8, y: 20 }} className="bg-gradient-to-br from-indigo-900 to-slate-900 border-2 border-indigo-500/50 rounded-2xl p-4 sm:p-5 text-white w-full max-w-sm shadow-[0_0_40px_rgba(99,102,241,0.3)] relative max-h-[85vh] overflow-y-auto thin-scrollbar flex flex-col">
                      
                      <div className="shrink-0 mb-3 text-center">
                        <div className="bg-indigo-500/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 border border-indigo-400/50">
                          {getRoleIcon(promotedPlayerInfo.role, 'w-6 h-6 text-indigo-300')}
                        </div>
                        <h2 className="text-xl sm:text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 to-white leading-tight">Level Up!</h2>
                        <p className="text-xs text-indigo-200/80 font-medium">You've reached {getLevel(promotedPlayerInfo.step).name}</p>
                      </div>
                      
                      <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-3 mb-3 shrink-0">
                         <h3 className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest mb-2 border-b border-slate-700 pb-1.5">New Benefits Unlocked</h3>
                         <ul className="text-[11px] sm:text-xs text-slate-300 space-y-2">
                           {getLevel(promotedPlayerInfo.step).benefits.slice(0, 4).map((b, i) => (
                             <li key={i} className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1 shrink-0 shadow-[0_0_8px_rgba(52,211,153,0.8)]"></div><span className="leading-snug">{b}</span></li>
                           ))}
                           {getLevel(promotedPlayerInfo.step).benefits.length > 4 && (
                             <li className="text-slate-400 italic pl-3.5">+ {getLevel(promotedPlayerInfo.step).benefits.length - 4} more benefits!</li>
                           )}
                         </ul>
                      </div>

                      {getPromotionCriteria(promotedPlayerInfo.role) && promotedPlayerInfo.role !== 'Start' && (
                        <div className="bg-slate-900/60 border border-indigo-500/30 rounded-xl p-3 mb-3 shrink-0">
                           <h3 className="text-[10px] font-bold text-indigo-200 uppercase tracking-widest mb-1.5 flex items-center gap-1.5"><TrendingUp className="w-3 h-3 text-indigo-400"/> Next Goal: {getPromotionCriteria(promotedPlayerInfo.role)?.next}</h3>
                           <ul className="text-[10px] text-slate-400 space-y-1">
                             {getPromotionCriteria(promotedPlayerInfo.role)?.criteria.map((c, i) => (
                               <li key={i} className="flex items-start gap-1.5"><div className="w-1 h-1 rounded-full bg-indigo-500 mt-1.5 shrink-0"></div><span className="leading-snug">{c}</span></li>
                             ))}
                           </ul>
                        </div>
                      )}

                      {/* Explicitly highlighting Progressive Commissions and FMI for returning/new BAs */}
                      {promotedPlayerInfo.role === 'BA' && (
                        <div className="bg-gradient-to-r from-emerald-900/40 to-slate-900/40 border border-emerald-500/30 rounded-xl p-3 mb-3 shrink-0 text-left">
                           <h3 className="text-[10px] font-bold text-emerald-300 uppercase tracking-widest mb-2 border-b border-emerald-500/30 pb-1.5 flex items-center gap-1"><Star className="w-3 h-3 text-emerald-400" /> Commision & FMI Targets</h3>
                           <div className="text-[9.5px] text-slate-300 space-y-2 leading-relaxed">
                              <div><strong className="text-emerald-200">Progressive Commission:</strong> Base (22.5%) ➔ Booster (25% for 2-Time STRIDE) ➔ Bonus (30% for SAMRAT achieving 1L business & 2 lives in a single month).</div>
                              <div><strong className="text-emerald-200">FMI Mandates:</strong> ₹20,000 WRP per quarter is mandatory to be eligible. YTD 13th month persistency MUST be 75% for payouts.</div>
                           </div>
                        </div>
                      )}

                      {(promotedPlayerInfo.role === 'AL' || promotedPlayerInfo.role === 'SAL') && (
                         <div className="bg-gradient-to-r from-amber-500/10 to-transparent border border-amber-500/30 rounded-xl p-3 mb-3 shrink-0">
                           <div className="flex items-center gap-1.5 mb-1"><Crown className="w-3.5 h-3.5 text-amber-400" /><span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Elite Club & Office Unlocked</span></div>
                           <p className="text-[9px] sm:text-[10px] text-amber-200/70 leading-snug">Access to AL Office infrastructure. Qualify for 5 consecutive years to earn Royal Enfield or Tata Punch EVs!</p>
                         </div>
                      )}

                      <button onClick={() => setPromotedPlayerInfo(null)} className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold uppercase tracking-wider text-sm transition-colors shadow-[0_0_15px_rgba(79,70,229,0.5)] shrink-0 mt-auto">Claim Title</button>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {clubMilestone !== null && promotedPlayerInfo === null && (
                  <motion.div key="club-modal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm z-50 rounded-[4px] flex items-center justify-center p-6">
                    <motion.div initial={{ scale: 0.9, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 10 }} className="bg-slate-800 border-2 border-amber-500/50 rounded-2xl p-6 text-white w-full max-w-sm shadow-2xl relative text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-[0_0_20px_rgba(251,191,36,0.6)] border-2 border-white/20">
                        <Trophy className="w-8 h-8 text-white drop-shadow-md" />
                      </div>
                      <h2 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-yellow-500 mb-1">{clubMilestone.club}</h2>
                      <p className="text-xs font-medium text-amber-200/80 mb-6 uppercase tracking-widest">Achieved Requirement!</p>
                      <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/50 mb-6 text-left">
                        <h3 className="font-bold text-slate-300 text-[11px] mb-2 uppercase tracking-wider border-b border-slate-700/50 pb-2">Target & Rewards Overview</h3>
                        <ul className="text-[11px] text-slate-400 space-y-2 mb-3">
                          {clubMilestone.club === 'ALC SAMRAT' ? (
                            <>
                              <li className="flex items-start gap-2 mb-3 text-amber-200/90 font-medium">
                                <div className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 mt-1 shadow-[0_0_8px_rgba(251,191,36,0.8)]"></div>
                                <span>Minimum 2 Lives with 1 Lakh Collected Premium in FY'26 (Min WRP: 20k or 5k for SPP).</span>
                              </li>
                              <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 mt-1.5"></div>Sales Kit (Bag, Sales Note Book)</li>
                              <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 mt-1.5"></div>ALC Samrat Lapel Pin</li>
                              <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 mt-1.5"></div>2 Days Leadership Recruitment Workshop</li>
                              <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 mt-1.5"></div>Visiting Cards</li>
                              <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 mt-1.5"></div>Eligible to become Provisional Agency Leader</li>
                            </>
                          ) : (
                            <>
                              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"></div>Monthly Payout Achieved</li>
                              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"></div>Customized Visiting Cards & Name Lapel Pin</li>
                            </>
                          )}
                          {['ASIAN CLUB', 'OLYMPIC CLUB'].includes(clubMilestone.club) && (
                             <li className="flex items-center gap-2 pt-2"><div className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 shadow-[0_0_8px_rgba(251,191,36,0.8)]"></div><strong className="text-amber-300">National Convention Trip Unlocked!</strong></li>
                          )}
                        </ul>
                      </div>
                      <button onClick={() => setClubMilestone(null)} className="w-full py-3 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-slate-900 rounded-xl font-extrabold tracking-wider transition-all shadow-[0_0_15px_rgba(251,191,36,0.4)]">Continue Journey</button>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {selectedMalPlayer !== null && (
                <AnimatePresence>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm z-50 rounded-[4px] flex items-center justify-center p-6"
                    onClick={() => setSelectedMalPlayer(null)}
                  >
                    <motion.div
                      initial={{ scale: 0.95, y: 10 }}
                      animate={{ scale: 1, y: 0 }}
                      onClick={e => e.stopPropagation()}
                      className="bg-slate-800 border-2 border-slate-700 rounded-2xl p-6 text-white w-full max-w-sm shadow-2xl relative"
                    >
                      <button
                        onClick={() => setSelectedMalPlayer(null)}
                        className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                      <div className="flex items-center gap-4 mb-5 border-b border-slate-700 pb-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-inner ${playersConfig[selectedMalPlayer].color}`}>
                          <Crown className="w-6 h-6 text-yellow-300" />
                        </div>
                        <div>
                          <h2 className="text-xl font-bold text-white leading-tight">{playersConfig[selectedMalPlayer].name}</h2>
                          <p className="text-[11px] font-bold text-yellow-400 uppercase tracking-wider mt-0.5">Master Agency Leader</p>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2.5 overflow-y-auto max-h-[340px] pr-2 custom-scrollbar">
                        {getLevel(57).benefits.map((b, i) => (
                          <div key={i} className="bg-slate-700/40 p-3 rounded-xl border border-slate-600/50 hover:bg-slate-700/60 transition-colors">
                            <div className="flex items-start gap-2 mb-1">
                              <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 shadow-[0_0_8px_rgba(52,211,153,0.5)]"></div>
                              <span className="text-[13px] font-bold text-emerald-100">{b}</span>
                            </div>
                            <p className="text-[11px] text-slate-400 pl-3.5 leading-snug">{benefitDescriptions[b]}</p>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  </motion.div>
                </AnimatePresence>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Dashboard */}
      <div className="w-full lg:w-[450px] xl:w-[500px] flex flex-col gap-3 p-4 sm:p-6 glass-panel border-l border-white/10 lg:shadow-[-20px_0_50px_rgba(0,0,0,0.5)] lg:h-screen lg:overflow-y-auto shrink-0 z-20">
        <div className="flex justify-between items-start shrink-0">
          <div className="flex flex-col gap-1">
            <h1 className="text-xl lg:text-2xl font-bold text-white flex items-center gap-2 drop-shadow-md">
              <Briefcase className="text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
              Agency Leader Game
            </h1>
            <p className="text-xs text-indigo-200/80 uppercase tracking-widest font-medium">Race to become the Master Agency Leader!</p>
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => setShowInfo(true)}
              className="p-2 text-slate-400 hover:text-amber-400 hover:bg-slate-800/50 rounded-lg transition-colors border border-transparent hover:border-slate-700"
              title="Career Path Info"
            >
              <Map className="w-5 h-5" />
            </button>
            <button
              onClick={handleRestart}
              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800/50 rounded-lg transition-colors border border-transparent hover:border-slate-700"
              title="Restart Game"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex gap-3 items-stretch shrink-0">
          <div className="flex flex-col items-center gap-2 glass-card p-3 rounded-xl border border-white/5 shadow-inner">
            <div className="text-[10px] font-black text-amber-500/80 uppercase tracking-widest drop-shadow-sm">Roll Dice</div>
            <motion.button
              onClick={handleRoll}
              disabled={players.every(p => p.step === 57) || diceStatus !== 'idle'}
              animate={diceStatus === 'rolling' ? {
                rotate: [0, -15, 15, -15, 15, 0],
                scale: [1, 1.1, 1.1, 1.1, 1.1, 1]
              } : { rotate: 0, scale: 1 }}
              transition={{ duration: 0.4, repeat: diceStatus === 'rolling' ? Infinity : 0 }}
              className={`w-16 h-16 rounded-xl flex items-center justify-center text-3xl font-bold transition-all
                ${diceStatus !== 'idle' ? 'opacity-80 cursor-not-allowed bg-slate-800 border-2 border-slate-700 text-slate-500' : 'cursor-pointer bg-gradient-to-br from-indigo-500 to-purple-600 border border-white/20 text-white shadow-[0_0_20px_rgba(99,102,241,0.6)] hover:shadow-[0_0_30px_rgba(99,102,241,0.8)] hover:scale-105'}`}
            >
              {diceStatus === 'rolling' ? <Dices className="w-8 h-8 text-white/50" /> : <span className="drop-shadow-md">{diceValue}</span>}
            </motion.button>
          </div>

          <div className="flex-1 glass-card p-3 rounded-xl border border-white/5 flex flex-col shadow-inner">
            <div className="text-[10px] font-black text-amber-500/80 uppercase tracking-widest mb-1.5 drop-shadow-sm flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span> Live Event Log
            </div>
            <div className="flex-1 flex flex-col gap-1.5 max-h-[60px] overflow-hidden">
              {logs.slice(0, 3).map((log, i) => (
                <div key={i} className={`text-[11px] leading-tight truncate ${i === 0 ? 'text-indigo-200 font-bold' : 'text-slate-500'}`}>
                  {log}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 shrink-0">
          {players.map(p => {
            const level = getLevel(p.step);
            const isTurn = p.id === turn;
            return (
              <div key={p.id}
                onMouseEnter={() => setHoveredPlayerOnBoard(p.id)}
                onMouseLeave={() => setHoveredPlayerOnBoard(null)}
                onClick={() => {
                  if (p.step === 57) setSelectedMalPlayer(p.id);
                }}
                className={`p-3 rounded-xl border transition-all ${p.step === 57 ? 'cursor-pointer' : 'cursor-default'} ${isTurn ? `${playersConfig[p.id].border} bg-slate-800/80 backdrop-blur-md relative z-10 scale-[1.02]` : 'border-slate-700/50 bg-slate-800/40 hover:border-slate-600/50 relative z-10'}`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <div className={`w-3 h-3 rounded-full ${playersConfig[p.id].color}`}></div>
                  <h3 className={`font-bold text-xs ${isTurn ? 'text-white drop-shadow-md' : 'text-slate-400'}`}>{playersConfig[p.id].name}</h3>
                  <div className={`ml-auto ${isTurn ? playersConfig[p.id].text : 'text-slate-600'}`}>
                    {getRoleIcon(level.role, "w-3.5 h-3.5")}
                  </div>
                </div>
                <div className="mb-2">
                  <div className="text-[9px] text-slate-500 uppercase font-bold tracking-wider">Level</div>
                  <div className={`font-bold text-[11px] truncate ${isTurn ? 'text-indigo-200' : 'text-slate-500'}`} title={level.name}>{level.name}</div>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-1.5 mb-1.5 shadow-inner">
                  <div className={`h-1.5 rounded-full ${playersConfig[p.id].color}`} style={{ width: `${(p.step / 57) * 100}%` }}></div>
                </div>
                <div className={`text-[10px] text-right font-black ${isTurn ? 'text-slate-300' : 'text-slate-600'}`}>{p.step} / 57</div>
              </div>
            )
          })}
        </div>

        {/* Current Player Benefits */}
        <div className="bg-gradient-to-b from-slate-800 to-slate-900 border border-slate-700/50 text-white p-4 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] mt-auto flex-1 flex flex-col min-h-0">
          <div className="flex items-center gap-3 mb-4 shrink-0 border-b border-slate-700/50 pb-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${playersConfig[turn].color} border border-white/20`}>
              {getRoleIcon(getLevel(players[turn].step).role, "w-5 h-5 text-white drop-shadow-md")}
            </div>
            <div>
              <h2 className="text-[10px] font-black text-amber-500/80 uppercase tracking-widest leading-none mb-1 shadow-sm">{playersConfig[turn].name}'s Turn</h2>
              <div className="text-sm font-bold flex items-center gap-2 text-indigo-100">
                {getLevel(players[turn].step).role} Active Benefits
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 relative overflow-y-auto pr-1 flex-1 thin-scrollbar">
            {getLevel(players[turn].step).benefits.map((b, i) => (
              <div
                key={`${players[turn].step}-${i}`}
                className="relative flex"
                onMouseEnter={() => setHoveredBenefit(b)}
                onMouseLeave={() => setHoveredBenefit(null)}
              >
                <div className="flex-1 flex items-center gap-2 bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/50 cursor-help hover:bg-slate-700 hover:border-indigo-500/30 transition-all shadow-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse"></div>
                  <span className="text-[11px] font-semibold text-slate-200 leading-tight flex-1 drop-shadow-sm">{b}</span>
                  <Info className="w-3.5 h-3.5 text-indigo-400/50 shrink-0" />
                </div>
                {hoveredBenefit === b && (
                  <div className="fixed z-50 transform -translate-y-full mt-[-8px] w-64 bg-slate-900 text-indigo-100 text-[11px] p-3 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.8)] border border-indigo-500/50 pointer-events-none">
                    <p className="font-semibold leading-relaxed">{benefitDescriptions[b]}</p>
                    <div className="absolute -bottom-1.5 left-6 w-3 h-3 bg-slate-900 border-b border-r border-indigo-500/50 transform rotate-45"></div>
                  </div>
                )}
              </div>
            ))}
            {getLevel(players[turn].step).benefits.length === 0 && (
              <div className="text-amber-500/80 italic text-sm text-center py-6 font-medium w-full col-span-2">
                Roll the dice to start your journey!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Career Path Info Modal */}
      <AnimatePresence>
        {showInfo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowInfo(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600">
                    <Map className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-800">Career Progression Path</h2>
                    <p className="text-sm text-slate-500">The journey to Master Agency Leader</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowInfo(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 sm:p-6 overflow-y-auto flex flex-col gap-4 bg-slate-50/50">
                {[
                  {
                    role: 'Business Associate (BA)', steps: '1 - 14', icon: <Briefcase className="w-5 h-5 sm:w-6 sm:h-6" />, color: 'text-blue-600', bg: 'bg-blue-100', border: 'border-blue-200',
                    desc: 'The starting point. Focus on learning the products, making initial sales, and earning basic commissions and Fixed Monthly Incentives (FMI).'
                  },
                  {
                    role: 'Provisional Agency Leader (PAL)', steps: '15 - 28', icon: <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6" />, color: 'text-emerald-600', bg: 'bg-emerald-100', border: 'border-emerald-200',
                    desc: 'Transitioning into leadership. Start building your team to unlock the Team Building Allowance (TBA) and Team Development Incentives (TDI).'
                  },
                  {
                    role: 'Agency Leader (AL)', steps: '29 - 42', icon: <Building className="w-5 h-5 sm:w-6 sm:h-6" />, color: 'text-amber-600', bg: 'bg-amber-100', border: 'border-amber-200',
                    desc: 'Established leader. Unlock Fixed Salary, Fixed Monthly Payouts (FMP), and get support to set up your own AL Office.'
                  },
                  {
                    role: 'Senior Agency Leader (SAL)', steps: '43 - 56', icon: <Building2 className="w-5 h-5 sm:w-6 sm:h-6" />, color: 'text-orange-600', bg: 'bg-orange-100', border: 'border-orange-200',
                    desc: 'Advanced leadership. Qualify for the Elite Club, earn Annual Bonuses, and maximize your team development payouts.'
                  },
                  {
                    role: 'Master Agency Leader (MAL)', steps: '57', icon: <Crown className="w-5 h-5 sm:w-6 sm:h-6" />, color: 'text-purple-600', bg: 'bg-purple-100', border: 'border-purple-200',
                    desc: 'The pinnacle of the career path. Enjoy maximum benefits, ALC Samrat Payouts, and top-tier rewards like cars and international conferences.'
                  }
                ].map((tier, idx) => (
                  <div key={idx} className={`flex gap-3 sm:gap-4 p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-white border ${tier.border} shadow-sm relative overflow-hidden shrink-0`}>
                    <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 ${tier.bg} ${tier.color}`}>
                      {tier.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center justify-between gap-1 mb-1 sm:mb-2">
                        <h3 className="text-base sm:text-lg font-bold text-slate-800 truncate pr-2">{tier.role}</h3>
                        <span className="text-[10px] sm:text-xs font-bold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-slate-100 text-slate-500 whitespace-nowrap">Steps {tier.steps}</span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{tier.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
