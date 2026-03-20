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
    id: 0, color: 'bg-red-500', border: 'border-red-500', text: 'text-red-500', name: 'Player 1',
    startIndex: 1,
    homeStretch: [[7, 1], [7, 2], [7, 3], [7, 4], [7, 5]],
    home: [7, 6],
    yard: [3, 3]
  },
  {
    id: 1, color: 'bg-green-500', border: 'border-green-500', text: 'text-green-500', name: 'Player 2',
    startIndex: 14,
    homeStretch: [[1, 7], [2, 7], [3, 7], [4, 7], [5, 7]],
    home: [6, 7],
    yard: [3, 11]
  },
  {
    id: 2, color: 'bg-yellow-400', border: 'border-yellow-400', text: 'text-yellow-500', name: 'Player 3',
    startIndex: 27,
    homeStretch: [[7, 13], [7, 12], [7, 11], [7, 10], [7, 9]],
    home: [7, 8],
    yard: [11, 11]
  },
  {
    id: 3, color: 'bg-blue-500', border: 'border-blue-500', text: 'text-blue-500', name: 'Player 4',
    startIndex: 40,
    homeStretch: [[13, 7], [12, 7], [11, 7], [10, 7], [9, 7]],
    home: [8, 7],
    yard: [11, 3]
  }
];

const safeZones = [1, 9, 14, 22, 27, 35, 40, 48];

const benefitDescriptions: Record<string, string> = {
  'Basic Commission': 'Earn commission based on product structure (e.g., 22.5% net payout on a 30% commission product).',
  'Fixed Monthly Incentive (FMI)': 'Earn up to ₹1,25,000 based on rolling 24 months performance on self-sourced business.',
  'ALC Samrat': 'Achieve 2 Lives with 1 Lakh Collected Premium to earn Sales Kit, Lapel Pin, and Leadership Workshop.',
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
  let classes = 'border border-slate-200 flex items-center justify-center ';

  // Yards
  if (r < 6 && c < 6) return classes + 'bg-red-50 border-red-200';
  if (r < 6 && c > 8) return classes + 'bg-green-50 border-green-200';
  if (r > 8 && c > 8) return classes + 'bg-yellow-50 border-yellow-200';
  if (r > 8 && c < 6) return classes + 'bg-blue-50 border-blue-200';

  // Center
  if (r >= 6 && r <= 8 && c >= 6 && c <= 8) {
    return classes + 'bg-slate-800 border-slate-700';
  }

  // Home stretches
  if (r === 7 && c >= 1 && c <= 5) return classes + 'bg-red-100';
  if (c === 7 && r >= 1 && r <= 5) return classes + 'bg-green-100';
  if (r === 7 && c >= 9 && c <= 13) return classes + 'bg-yellow-100';
  if (c === 7 && r >= 9 && r <= 13) return classes + 'bg-blue-100';

  // Start squares
  if (r === 6 && c === 1) return classes + 'bg-red-200';
  if (r === 1 && c === 8) return classes + 'bg-green-200';
  if (r === 8 && c === 13) return classes + 'bg-yellow-200';
  if (r === 13 && c === 6) return classes + 'bg-blue-200';

  // Normal path
  return classes + 'bg-white';
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
  const [hoveredPlayerOnBoard, setHoveredPlayerOnBoard] = useState<number | null>(null);
  const [selectedMalPlayer, setSelectedMalPlayer] = useState<number | null>(null);

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
    setPlayers(prevPlayers => {
      const player = prevPlayers[turn];
      let newStep = player.step === 0 ? diceValue : player.step + diceValue;

      const nextTurn = (keepTurn: boolean, currentPlayers: typeof players) => {
        setDiceStatus('idle');
        if (currentPlayers.every(p => p.step === 57)) {
          addLog("All players have achieved Master Agency Leader! Game Over.");
          return;
        }
        if (!keepTurn) {
          let next = (turn + 1) % 4;
          while (currentPlayers[next].step === 57) {
            next = (next + 1) % 4;
          }
          setTurn(next);
        }
      };

      if (newStep > 57) {
        addLog(`${playersConfig[turn].name} needs an exact roll to finish.`);
        nextTurn(false, prevPlayers);
        return prevPlayers;
      }

      let capturedIdx = -1;
      if (newStep <= 51) {
        const globalIndex = (playersConfig[turn].startIndex + newStep - 1) % 52;
        if (!safeZones.includes(globalIndex)) {
          prevPlayers.forEach((p, idx) => {
            if (idx !== turn && p.step > 0 && p.step <= 51) {
              const pGlobalIndex = (playersConfig[idx].startIndex + p.step - 1) % 52;
              if (pGlobalIndex === globalIndex) {
                capturedIdx = idx;
              }
            }
          });
        }
      }

      const newPlayers = prevPlayers.map((p, i) => {
        if (i === turn) return { ...p, step: newStep };
        if (i === capturedIdx) return { ...p, step: 0 };
        return p;
      });

      // Logging
      const oldLevel = getLevel(player.step).role;
      const newLevel = getLevel(newStep).role;
      if (oldLevel !== newLevel && newStep > 0) {
        addLog(`🎉 ${playersConfig[turn].name} promoted to ${getLevel(newStep).name}!`);
      }
      if (capturedIdx !== -1) {
        addLog(`⚔️ Market Competition! ${playersConfig[turn].name} overtook ${playersConfig[capturedIdx].name}.`);
      }
      if (newStep === 57) {
        addLog(`🏆 ${playersConfig[turn].name} has achieved Master Agency Leader!`);
      }

      const getsAnotherTurn = diceValue === 6 || capturedIdx !== -1;
      if (getsAnotherTurn && newStep !== 57) {
        addLog(`${playersConfig[turn].name} gets another turn!`);
      }

      nextTurn(getsAnotherTurn && newStep !== 57, newPlayers);

      return newPlayers;
    });
  }, [turn, diceValue, addLog]);

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
    <div className="h-screen overflow-hidden bg-slate-100 flex font-sans">
      {/* Left Side - Board */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8 bg-slate-200">
        <div className="relative shadow-2xl rounded-xl border-8 border-slate-800 bg-white box-content" style={{ width: '600px', height: '600px' }}>
          <div className="w-full h-full rounded-[4px] overflow-hidden" style={{ display: 'grid', gridTemplateColumns: 'repeat(15, 1fr)', gridTemplateRows: 'repeat(15, 1fr)' }}>
            {Array.from({ length: 225 }).map((_, i) => {
              const r = Math.floor(i / 15);
              const c = i % 15;
              return (
                <div key={i} className={getCellClass(r, c)}>
                  {isStar(r, c) && <Star className="w-5 h-5 text-slate-400 opacity-50" />}
                </div>
              )
            })}
          </div>

          {/* Center Logo */}
          <div className="absolute w-[120px] h-[120px] bg-slate-800 flex flex-col items-center justify-center text-white p-2 shadow-inner" style={{ top: 240, left: 240 }}>
            <Trophy className="w-8 h-8 text-yellow-400 mb-1" />
            <div className="text-[10px] font-bold text-center leading-tight">MASTER<br />AGENCY<br />LEADER</div>
          </div>

          {/* Yard Inner Boxes */}
          <div className="absolute w-[160px] h-[160px] bg-white rounded-2xl shadow-inner border-4 border-red-100 flex items-center justify-center" style={{ top: 40, left: 40 }}>
            <div className="text-red-300 font-bold text-xl opacity-50">PLAYER 1</div>
          </div>
          <div className="absolute w-[160px] h-[160px] bg-white rounded-2xl shadow-inner border-4 border-green-100 flex items-center justify-center" style={{ top: 40, left: 400 }}>
            <div className="text-green-300 font-bold text-xl opacity-50">PLAYER 2</div>
          </div>
          <div className="absolute w-[160px] h-[160px] bg-white rounded-2xl shadow-inner border-4 border-yellow-100 flex items-center justify-center" style={{ top: 400, left: 400 }}>
            <div className="text-yellow-300 font-bold text-xl opacity-50">PLAYER 3</div>
          </div>
          <div className="absolute w-[160px] h-[160px] bg-white rounded-2xl shadow-inner border-4 border-blue-100 flex items-center justify-center" style={{ top: 400, left: 40 }}>
            <div className="text-blue-300 font-bold text-xl opacity-50">PLAYER 4</div>
          </div>

          {/* Tokens */}
          {players.map(p => {
            const [r, c] = getPlayerCoords(p.id, p.step);
            const offset = getOffset(p.id, p.step);
            const isNearTop = r < 3;
            return (
              <motion.div
                key={p.id}
                onMouseEnter={() => setHoveredPlayerOnBoard(p.id)}
                onMouseLeave={() => setHoveredPlayerOnBoard(null)}
                className={`absolute w-7 h-7 rounded-full shadow-md border-2 border-white z-10 flex items-center justify-center cursor-help ${playersConfig[p.id].color}`}
                animate={{
                  top: r * 40 + 6 + offset[0],
                  left: c * 40 + 6 + offset[1],
                  scale: p.id === turn ? [1, 1.1, 1] : 1
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

      {/* Right Side - Dashboard */}
      <div className="w-[450px] lg:w-[500px] flex flex-col gap-3 p-4 bg-white shadow-[-10px_0_30px_rgba(0,0,0,0.05)] h-screen z-20">
        <div className="flex justify-between items-start shrink-0">
          <div className="flex flex-col gap-1">
            <h1 className="text-xl lg:text-2xl font-bold text-slate-800 flex items-center gap-2">
              <Briefcase className="text-indigo-600" />
              Agency Leader Game
            </h1>
            <p className="text-xs text-slate-500">Race to become the Master Agency Leader!</p>
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => setShowInfo(true)}
              className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
              title="Career Path Info"
            >
              <Map className="w-5 h-5" />
            </button>
            <button
              onClick={handleRestart}
              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Restart Game"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex gap-3 items-stretch shrink-0">
          <div className="flex flex-col items-center gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Roll Dice</div>
            <motion.button
              onClick={handleRoll}
              disabled={players.every(p => p.step === 57) || diceStatus !== 'idle'}
              animate={diceStatus === 'rolling' ? {
                rotate: [0, -15, 15, -15, 15, 0],
                scale: [1, 1.1, 1.1, 1.1, 1.1, 1]
              } : { rotate: 0, scale: 1 }}
              transition={{ duration: 0.4, repeat: diceStatus === 'rolling' ? Infinity : 0 }}
              className={`w-16 h-16 bg-white rounded-xl shadow-sm border-2 border-slate-200 flex items-center justify-center text-3xl font-bold transition-colors
                ${diceStatus !== 'idle' ? 'opacity-80 cursor-not-allowed' : 'cursor-pointer text-indigo-600 hover:border-indigo-300 hover:shadow-md'}`}
            >
              {diceStatus === 'rolling' ? <Dices className="w-8 h-8 text-indigo-400" /> : diceValue}
            </motion.button>
          </div>

          <div className="flex-1 bg-slate-50 p-3 rounded-xl border border-slate-200 flex flex-col">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Event Log</div>
            <div className="flex-1 flex flex-col gap-1 max-h-[60px] overflow-hidden">
              {logs.slice(0, 3).map((log, i) => (
                <div key={i} className={`text-[11px] leading-tight truncate ${i === 0 ? 'text-slate-800 font-medium' : 'text-slate-400'}`}>
                  {log}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 shrink-0">
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
                className={`p-2 rounded-xl border-2 transition-all ${p.step === 57 ? 'cursor-pointer' : 'cursor-default'} ${isTurn ? `${playersConfig[p.id].border} shadow-sm bg-slate-50 relative z-10` : 'border-slate-100 bg-white hover:border-slate-300 hover:shadow-sm relative z-10'}`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <div className={`w-3 h-3 rounded-full ${playersConfig[p.id].color}`}></div>
                  <h3 className={`font-bold text-xs ${isTurn ? 'text-slate-800' : 'text-slate-600'}`}>{playersConfig[p.id].name}</h3>
                  <div className="ml-auto text-slate-400">
                    {getRoleIcon(level.role, "w-3 h-3")}
                  </div>
                </div>
                <div className="mb-1">
                  <div className="text-[9px] text-slate-400 uppercase font-bold">Level</div>
                  <div className="font-semibold text-[11px] text-slate-700 truncate" title={level.name}>{level.name}</div>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5 mb-1">
                  <div className={`h-1.5 rounded-full ${playersConfig[p.id].color}`} style={{ width: `${(p.step / 57) * 100}%` }}></div>
                </div>
                <div className="text-[10px] text-right text-slate-500 font-medium">{p.step} / 57</div>
              </div>
            )
          })}
        </div>

        {/* Current Player Benefits */}
        <div className="bg-slate-800 text-white p-4 rounded-xl shadow-lg mt-auto flex-1 flex flex-col min-h-0">
          <div className="flex items-center gap-2 mb-2 shrink-0">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${playersConfig[turn].color} shadow-inner`}>
              {getRoleIcon(getLevel(players[turn].step).role, "w-4 h-4 text-white")}
            </div>
            <div>
              <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider">{playersConfig[turn].name}'s Turn</h2>
              <div className="text-sm font-bold flex items-center gap-2">
                {getLevel(players[turn].step).role} Benefits
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 relative overflow-y-auto pr-1 flex-1">
            {getLevel(players[turn].step).benefits.map((b, i) => (
              <div
                key={`${players[turn].step}-${i}`}
                className="relative flex"
                onMouseEnter={() => setHoveredBenefit(b)}
                onMouseLeave={() => setHoveredBenefit(null)}
              >
                <div className="flex-1 flex items-center gap-2 bg-slate-700/50 p-2 rounded-lg border border-slate-600 cursor-help hover:bg-slate-700 transition-colors">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"></div>
                  <span className="text-[11px] font-medium text-slate-200 leading-tight flex-1">{b}</span>
                  <Info className="w-3 h-3 text-slate-400 shrink-0" />
                </div>
                {hoveredBenefit === b && (
                  <div className="fixed z-50 transform -translate-y-full mt-[-8px] w-64 bg-slate-900 text-white text-[11px] p-2.5 rounded-lg shadow-xl border border-slate-700 pointer-events-none">
                    {benefitDescriptions[b]}
                    <div className="absolute -bottom-1.5 left-6 w-3 h-3 bg-slate-900 border-b border-r border-slate-700 transform rotate-45"></div>
                  </div>
                )}
              </div>
            ))}
            {getLevel(players[turn].step).benefits.length === 0 && (
              <div className="text-slate-400 italic text-sm text-center py-4">
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
