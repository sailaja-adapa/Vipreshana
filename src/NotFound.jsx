import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useTheme } from './context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import PageMeta from './components/Pagemeta';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  Zap, 
  Star, 
  Trophy, 
  Target, 
  Clock, 
  ArrowUp, 
  ArrowDown, 
  ArrowLeft, 
  ArrowRight,
  RotateCcw,
  Home,
  Play
} from 'lucide-react';

const LEVELS = [
  {
    id: 1,
    grid: [
      ['T', '.', 'C', '.', 'G'],
      ['.', '.', '#', 'C', '.'],
      ['.', 'P', '.', '.', '.']
    ],
    title: 'Welcome Route',
    timeLimit: 30,
    par: 6
  },
  {
    id: 2,
    grid: [
      ['T', '.', '#', 'C', '.', '.'],
      ['.', '#', '.', '.', 'P', '.'],
      ['C', '.', '.', '#', '.', 'G']
    ],
    title: 'Freight Junction',
    timeLimit: 45,
    par: 8
  },
  {
    id: 3,
    grid: [
      ['T', '.', '#', '.', 'C', '.'],
      ['.', '.', '#', 'M', '#', '.'],
      ['.', '#', '.', '.', '.', '.'],
      ['P', '.', '.', '#', 'C', 'G']
    ],
    title: 'Highway Challenge',
    timeLimit: 60,
    par: 12
  },
  {
    id: 4,
    grid: [
      ['T', 'C', '#', '.', '.', 'P', '.'],
      ['.', '.', '#', 'M', '.', '#', '.'],
      ['.', '#', '.', '.', '.', '.', 'C'],
      ['P', '.', 'M', '#', '.', '.', '.'],
      ['.', '.', '.', '#', 'C', '.', 'G']
    ],
    title: 'Logistics Maze',
    timeLimit: 90,
    par: 18
  }
];

// Particle system for visual effects
const Particle = ({ x, y, color, onComplete }) => {
  return (
    <motion.div
      className="absolute w-2 h-2 rounded-full pointer-events-none"
      style={{
        backgroundColor: color,
        left: x,
        top: y,
        zIndex: 1000
      }}
      initial={{ scale: 1, opacity: 1 }}
      animate={{ 
        scale: [1, 1.5, 0],
        opacity: [1, 0.8, 0],
        x: [0, Math.random() * 40 - 20],
        y: [0, Math.random() * 40 - 20]
      }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      onAnimationComplete={onComplete}
    />
  );
};

// Sound effects using Web Audio API
const useSoundEffects = () => {
  const audioContext = useRef(null);

  useEffect(() => {
    audioContext.current = new (window.AudioContext || window.webkitAudioContext)();
    return () => {
      if (audioContext.current) {
        audioContext.current.close();
      }
    };
  }, []);

  const playSound = useCallback((frequency, duration, type = 'sine') => {
    if (!audioContext.current) return;
    
    const oscillator = audioContext.current.createOscillator();
    const gainNode = audioContext.current.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.current.destination);
    
    oscillator.frequency.setValueAtTime(frequency, audioContext.current.currentTime);
    oscillator.type = type;
    
    gainNode.gain.setValueAtTime(0.1, audioContext.current.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.current.currentTime + duration);
    
    oscillator.start(audioContext.current.currentTime);
    oscillator.stop(audioContext.current.currentTime + duration);
  }, []);

  return {
    moveSound: () => playSound(200, 0.1, 'square'),
    collectSound: () => playSound(440, 0.2, 'sine'),
    powerUpSound: () => playSound(660, 0.3, 'triangle'),
    winSound: () => {
      setTimeout(() => playSound(523, 0.2), 0);
      setTimeout(() => playSound(659, 0.2), 200);
      setTimeout(() => playSound(784, 0.4), 400);
    },
    blockSound: () => playSound(150, 0.2, 'sawtooth')
  };
};

const EnhancedLostFreightGame = ({ level, onWin, onReset, isDark, onBack }) => {
  const [grid, setGrid] = useState([]);
  const [truckPos, setTruckPos] = useState({ x: 0, y: 0 });
  const [moves, setMoves] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [collected, setCollected] = useState(new Set());
  const [powerUps, setPowerUps] = useState(new Set());
  const [particles, setParticles] = useState([]);
  const [streak, setStreak] = useState(0);
  const [movingObstacles, setMovingObstacles] = useState([]);
  const [showControls, setShowControls] = useState(true);
  const gameRef = useRef(null);
  const sounds = useSoundEffects();

  const currentLevel = LEVELS[level - 1];

  // Initialize game
  useEffect(() => {
    const newGrid = currentLevel.grid.map(row => [...row]);
    setGrid(newGrid);
    setTimeLeft(currentLevel.timeLimit);
    setGameStarted(false);
    setCollected(new Set());
    setPowerUps(new Set());
    setParticles([]);
    setMovingObstacles([]);
    
    // Find truck starting position
    for (let y = 0; y < newGrid.length; y++) {
      for (let x = 0; x < newGrid[y].length; x++) {
        if (newGrid[y][x] === 'T') {
          setTruckPos({ x, y });
          newGrid[y][x] = '.';
          break;
        }
      }
    }
    
    // Find moving obstacles
    const movingObs = [];
    for (let y = 0; y < newGrid.length; y++) {
      for (let x = 0; x < newGrid[y].length; x++) {
        if (newGrid[y][x] === 'M') {
          movingObs.push({ x, y, direction: Math.random() > 0.5 ? 1 : -1 });
        }
      }
    }
    setMovingObstacles(movingObs);
    
    setMoves(0);
    setScore(0);
    setGameWon(false);
    setGameOver(false);
    setStreak(0);
    
    setTimeout(() => setShowControls(false), 5000);
  }, [level, currentLevel]);

  // Timer - only starts when game is started
  useEffect(() => {
    if (gameStarted && timeLeft > 0 && !gameWon && !gameOver) {
      const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (gameStarted && timeLeft === 0 && !gameWon) {
      setGameOver(true);
      toast.error("Time's up! Try again!");
    }
  }, [timeLeft, gameWon, gameOver, gameStarted]);

  // Moving obstacles - only start when game has started
  useEffect(() => {
    if (!gameStarted || gameWon || gameOver) return;
    
    const interval = setInterval(() => {
      setMovingObstacles(prev => prev.map(obs => {
        let newX = obs.x + obs.direction;
        if (newX < 0 || newX >= grid[0]?.length || grid[obs.y]?.[newX] === '#') {
          return { ...obs, direction: -obs.direction };
        }
        return { ...obs, x: newX };
      }));
    }, 2000);
    
    return () => clearInterval(interval);
  }, [grid, gameWon, gameOver, gameStarted]);

  // Add particle effect
  const addParticle = useCallback((x, y, color = '#ffd700') => {
    const id = Date.now() + Math.random();
    const rect = gameRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    setParticles(prev => [...prev, {
      id,
      x: rect.left + x * 64 + 32,
      y: rect.top + y * 64 + 32,
      color
    }]);
  }, []);

  // Remove particle
  const removeParticle = useCallback((id) => {
    setParticles(prev => prev.filter(p => p.id !== id));
  }, []);

  // Touch controls
  const touchStart = useRef({ x: 0, y: 0 });
  
  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    touchStart.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (e) => {
    if (!touchStart.current) return;
    
    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStart.current.x;
    const deltaY = touch.clientY - touchStart.current.y;
    const minDistance = 30;
    
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (Math.abs(deltaX) > minDistance) {
        handleMove(deltaX > 0 ? 'ArrowRight' : 'ArrowLeft');
      }
    } else {
      if (Math.abs(deltaY) > minDistance) {
        handleMove(deltaY > 0 ? 'ArrowDown' : 'ArrowUp');
      }
    }
  };

  // Enhanced move handling
  const handleMove = useCallback((direction) => {
    if (gameWon || gameOver) return;
    
    // Start the game timer on first move
    if (!gameStarted) {
      setGameStarted(true);
    }
    
    let newX = truckPos.x;
    let newY = truckPos.y;
    
    switch (direction) {
      case 'ArrowUp':
        newY = Math.max(0, truckPos.y - 1);
        break;
      case 'ArrowDown':
        newY = Math.min(grid.length - 1, truckPos.y + 1);
        break;
      case 'ArrowLeft':
        newX = Math.max(0, truckPos.x - 1);
        break;
      case 'ArrowRight':
        newX = Math.min(grid[0]?.length - 1 || 0, truckPos.x + 1);
        break;
      default:
        return;
    }
    
    // Check for moving obstacles
    const movingObstacle = movingObstacles.find(obs => obs.x === newX && obs.y === newY);
    if (movingObstacle) {
      sounds.blockSound();
      addParticle(newX, newY, '#ff4444');
      toast.warning('🚧 Moving obstacle blocked your path!');
      return;
    }
    
    // Check if move is valid
    if (grid[newY] && grid[newY][newX] !== '#') {
      setTruckPos({ x: newX, y: newY });
      setMoves(prev => prev + 1);
      sounds.moveSound();
      
      const cell = grid[newY][newX];
      
      // Handle collectibles
      if (cell === 'C' && !collected.has(`${newX}-${newY}`)) {
        setCollected(prev => new Set([...prev, `${newX}-${newY}`]));
        setScore(prev => prev + 10);
        setStreak(prev => prev + 1);
        sounds.collectSound();
        addParticle(newX, newY, '#ffd700');
        toast.success(`💰 +10 points! Streak: ${streak + 1}`);
      }
      
      // Handle power-ups
      if (cell === 'P' && !powerUps.has(`${newX}-${newY}`)) {
        setPowerUps(prev => new Set([...prev, `${newX}-${newY}`]));
        setScore(prev => prev + 25);
        setTimeLeft(prev => prev + 10);
        sounds.powerUpSound();
        addParticle(newX, newY, '#00ff88');
        toast.success('⚡ Power-up! +25 points, +10 seconds!');
      }
      
      // Check if reached goal
      if (cell === 'G') {
        const timeBonus = Math.max(0, timeLeft * 2);
        const moveBonus = Math.max(0, (currentLevel.par - moves) * 5);
        const streakBonus = streak * 3;
        const totalBonus = timeBonus + moveBonus + streakBonus;
        
        setScore(prev => prev + 100 + totalBonus);
        setGameWon(true);
        sounds.winSound();
        addParticle(newX, newY, '#00ff00');
        
        toast.success(`🎉 Level Complete! +${100 + totalBonus} points!`);
        setTimeout(() => onWin(), 1500);
      }
    } else {
      sounds.blockSound();
      addParticle(newX, newY, '#ff4444');
    }
  }, [truckPos, grid, gameWon, gameOver, gameStarted, collected, powerUps, sounds, addParticle, timeLeft, moves, currentLevel.par, streak, movingObstacles, onWin]);

  // Keyboard controls
  const handleKeyPress = useCallback((event) => {
    handleMove(event.key);
  }, [handleMove]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  const getCellStyle = (cell, x, y) => {
    const isCurrentPos = truckPos.x === x && truckPos.y === y;
    const isCollected = collected.has(`${x}-${y}`);
    const isPowerUpUsed = powerUps.has(`${x}-${y}`);
    const isMovingObstacle = movingObstacles.some(obs => obs.x === x && obs.y === y);
    
    if (isCurrentPos) {
      return `bg-gradient-to-br from-yellow-400 to-orange-500 text-white border-2 shadow-lg transform scale-110 ${isDark ? 'border-yellow-300' : 'border-yellow-600'}`;
    }
    
    if (isMovingObstacle) {
      return `bg-gradient-to-br from-red-500 to-red-700 text-white animate-pulse border-2 border-red-400`;
    }
    
    switch (cell) {
      case '#':
        return `bg-gradient-to-br ${isDark ? 'from-red-800 to-red-900 text-red-200' : 'from-red-600 to-red-700 text-white'} shadow-inner`;
      case 'G':
        return `bg-gradient-to-br ${isDark ? 'from-green-700 to-green-800 text-green-200' : 'from-green-500 to-green-600 text-white'} animate-pulse shadow-lg`;
      case 'C':
        return isCollected 
          ? `${isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300'} border opacity-50`
          : `bg-gradient-to-br from-yellow-400 to-yellow-500 text-white animate-bounce shadow-md`;
      case 'P':
        return isPowerUpUsed
          ? `${isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300'} border opacity-50`
          : `bg-gradient-to-br from-purple-500 to-purple-600 text-white animate-pulse shadow-lg`;
      default:
        return `${isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300'} border hover:bg-opacity-80 transition-all`;
    }
  };

  const getCellIcon = (cell, x, y) => {
    const isCurrentPos = truckPos.x === x && truckPos.y === y;
    const isCollected = collected.has(`${x}-${y}`);
    const isPowerUpUsed = powerUps.has(`${x}-${y}`);
    const isMovingObstacle = movingObstacles.some(obs => obs.x === x && obs.y === y);
    
    if (isCurrentPos) return '🚛';
    if (isMovingObstacle) return '🚧';
    if (cell === 'G') return '🏭';
    if (cell === '#') return '�';
    if (cell === 'C') return isCollected ? '💨' : '💰';
    if (cell === 'P') return isPowerUpUsed ? '💨' : '⚡';
    return '';
  };

  const getScoreColor = () => {
    if (streak >= 3) return 'text-purple-500';
    if (streak >= 2) return 'text-blue-500';
    return isDark ? 'text-green-400' : 'text-green-600';
  };

  return (
    <div 
      className="flex flex-col items-center space-y-6 w-full max-w-4xl mx-auto"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Game Header */}
      <motion.div 
        className="text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
          Level {level}: {currentLevel.title}
        </h3>
        
        {/* Stats Bar */}
        <div className="flex flex-wrap justify-center gap-4 mb-4">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
            <Target className="w-5 h-5 text-blue-500" />
            <span className="font-semibold">Moves: {moves}</span>
          </div>
          
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
            <Star className={`w-5 h-5 ${getScoreColor()}`} />
            <span className={`font-semibold ${getScoreColor()}`}>Score: {score}</span>
          </div>
          
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
            <Clock className={`w-5 h-5 ${
              !gameStarted 
                ? 'text-blue-500' 
                : timeLeft <= 10 
                ? 'text-red-500 animate-pulse' 
                : 'text-orange-500'
            }`} />
            <span className={`font-semibold ${
              !gameStarted 
                ? 'text-blue-500' 
                : timeLeft <= 10 
                ? 'text-red-500' 
                : ''
            }`}>
              {!gameStarted ? 'Ready!' : `${Math.floor(timeLeft / 60)}:${(timeLeft % 60).toString().padStart(2, '0')}`}
            </span>
          </div>
          
          {streak > 1 && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg">
              <Zap className="w-5 h-5" />
              <span className="font-semibold">Streak: {streak}🔥</span>
            </div>
          )}
        </div>
      </motion.div>

      {/* Game Grid */}
      <motion.div 
        ref={gameRef}
        className="grid gap-2 p-6 rounded-xl border-2 relative"
        style={{
          gridTemplateColumns: `repeat(${grid[0]?.length || 5}, 1fr)`,
          backgroundColor: isDark ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.9)',
          borderColor: isDark ? '#374151' : '#e5e7eb'
        }}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {grid.map((row, y) =>
          row.map((cell, x) => (
            <motion.div
              key={`${x}-${y}`}
              className={`w-12 h-12 md:w-16 md:h-16 flex items-center justify-center text-2xl font-bold rounded-lg ${getCellStyle(cell, x, y)} cursor-pointer`}
              animate={
                truckPos.x === x && truckPos.y === y 
                  ? { scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] } 
                  : cell === 'C' && !collected.has(`${x}-${y}`)
                  ? { y: [0, -4, 0] }
                  : cell === 'P' && !powerUps.has(`${x}-${y}`)
                  ? { scale: [1, 1.1, 1] }
                  : {}
              }
              transition={{ 
                duration: cell === 'C' ? 1.5 : 0.3, 
                repeat: (cell === 'C' && !collected.has(`${x}-${y}`)) || (cell === 'P' && !powerUps.has(`${x}-${y}`)) ? Infinity : 0 
              }}
              whileHover={{ scale: 1.05 }}
              onClick={() => {
                // Allow clicking adjacent cells to move
                const deltaX = Math.abs(x - truckPos.x);
                const deltaY = Math.abs(y - truckPos.y);
                if ((deltaX === 1 && deltaY === 0) || (deltaX === 0 && deltaY === 1)) {
                  if (x > truckPos.x) handleMove('ArrowRight');
                  else if (x < truckPos.x) handleMove('ArrowLeft');
                  else if (y > truckPos.y) handleMove('ArrowDown');
                  else if (y < truckPos.y) handleMove('ArrowUp');
                }
              }}
            >
              {getCellIcon(cell, x, y)}
            </motion.div>
          ))
        )}
      </motion.div>

      {/* Controls Hint */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`text-center p-4 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-blue-50'} border`}
          >
            <p className="mb-2 font-semibold">🎮 How to Play:</p>
            <div className="flex flex-wrap justify-center gap-2 text-sm">
              <span className="flex items-center gap-1">
                <ArrowUp className="w-4 h-4" />
                <ArrowDown className="w-4 h-4" />
                <ArrowLeft className="w-4 h-4" />
                <ArrowRight className="w-4 h-4" />
                Arrow Keys
              </span>
              <span>📱 Swipe on mobile</span>
              <span>💰 Collect coins</span>
              <span>⚡ Grab power-ups</span>
              <span>🏭 Reach warehouse</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Game Over/Win Screen */}
      <AnimatePresence>
        {(gameWon || gameOver) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="text-center p-6 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-2xl"
          >
            {gameWon ? (
              <>
                <Trophy className="w-16 h-16 mx-auto mb-4 text-yellow-300" />
                <h4 className="text-3xl font-bold mb-2">🎉 Excellent Delivery!</h4>
                <p className="text-xl mb-4">Level {level} Complete!</p>
                <div className="space-y-2 text-lg">
                  <p>📊 Final Score: <span className="font-bold text-yellow-300">{score}</span></p>
                  <p>🎯 Moves: {moves} (Par: {currentLevel.par})</p>
                  <p>⏱️ Time Remaining: {timeLeft}s</p>
                  {streak > 1 && <p>🔥 Best Streak: {streak}</p>}
                </div>
              </>
            ) : (
              <>
                <Clock className="w-16 h-16 mx-auto mb-4 text-red-300" />
                <h4 className="text-3xl font-bold mb-2">⏰ Time's Up!</h4>
                <p className="text-xl mb-4">Don't worry, try again!</p>
                <p className="text-lg">Score: <span className="font-bold text-yellow-300">{score}</span></p>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Control Buttons */}
      <div className="flex flex-wrap justify-center gap-4">
        <motion.button
          onClick={onReset}
          className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
            isDark
              ? 'bg-gray-700 hover:bg-gray-600 text-white'
              : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
          } shadow-lg hover:shadow-xl transform hover:scale-105`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <RotateCcw className="w-5 h-5" />
          Reset Level
        </motion.button>
        
        <motion.button
          onClick={onBack}
          className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
            isDark
              ? 'bg-blue-700 hover:bg-blue-600 text-white'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          } shadow-lg hover:shadow-xl transform hover:scale-105`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Home className="w-5 h-5" />
          Back to Menu
        </motion.button>
      </div>

      {/* Particles */}
      <AnimatePresence>
        {particles.map(particle => (
          <Particle
            key={particle.id}
            x={particle.x}
            y={particle.y}
            color={particle.color}
            onComplete={() => removeParticle(particle.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

const NotFound = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const navigate = useNavigate();
  const [showGame, setShowGame] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [allLevelsComplete, setAllLevelsComplete] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const [bestTimes, setBestTimes] = useState({});

  const handleStartGame = () => {
    setShowGame(true);
    setCurrentLevel(1);
    setAllLevelsComplete(false);
    setTotalScore(0);
  };

  const handleLevelWin = () => {
    if (currentLevel < LEVELS.length) {
      toast.success(`🎉 Level ${currentLevel} completed! Moving to next level...`);
      setTimeout(() => setCurrentLevel(prev => prev + 1), 2000);
    } else {
      toast.success('🏆 Congratulations! All levels completed!');
      setTimeout(() => setAllLevelsComplete(true), 2000);
    }
  };

  const handleResetLevel = () => {
    setCurrentLevel(current => current); // Force re-render
  };

  const handlePlayAgain = () => {
    setCurrentLevel(1);
    setAllLevelsComplete(false);
    setTotalScore(0);
  };

  const handleBackToMenu = () => {
    setShowGame(false);
  };

  return (
    <>
      <PageMeta title="404 - Lost Freight Challenge" />
      <Navbar />
      <div
        className={`min-h-screen flex flex-col items-center justify-center px-4 py-16 text-center transition-all duration-300 ${
          isDark ? 'bg-gray-900 text-white' : 'bg-gradient-to-b from-blue-50 via-purple-50 to-pink-50 text-gray-900'
        }`}
      >
        {!showGame ? (
          // Enhanced initial 404 screen
          <>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <motion.h1
                className={`text-7xl md:text-9xl font-bold mb-6 ${
                  isDark ? 'text-blue-400' : 'text-gradient bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent'
                }`}
                animate={{ 
                  textShadow: [
                    '0 0 20px rgba(59, 130, 246, 0.5)',
                    '0 0 40px rgba(139, 92, 246, 0.5)',
                    '0 0 20px rgba(59, 130, 246, 0.5)'
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                404
              </motion.h1>
              
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="text-6xl mb-4"
              >
                🚛💨
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-8 max-w-2xl"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                🚛 Lost Freight Challenge!
              </h2>
              <p className="text-lg md:text-xl mb-6">
                Our delivery truck took a wrong turn and got lost in the logistics network!
              </p>
              <div className={`p-6 rounded-xl ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border shadow-lg mb-6`}>
                <h3 className="text-xl font-bold mb-4 text-purple-600">🎮 Game Features:</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex flex-col items-center">
                    <div className="text-2xl mb-2">💰</div>
                    <span>Collect Coins</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="text-2xl mb-2">⚡</div>
                    <span>Power-ups</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="text-2xl mb-2">⏱️</div>
                    <span>Time Challenge</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="text-2xl mb-2">🏆</div>
                    <span>Score System</span>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <motion.button
                onClick={handleStartGame}
                className={`flex items-center gap-3 px-8 py-4 rounded-full font-bold text-white shadow-lg transition-all duration-300 text-lg ${
                  isDark
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                    : 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-pink-500 hover:to-blue-500'
                } transform hover:scale-105 hover:shadow-xl`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={{ 
                  boxShadow: [
                    '0 4px 20px rgba(59, 130, 246, 0.4)',
                    '0 4px 20px rgba(139, 92, 246, 0.4)',
                    '0 4px 20px rgba(59, 130, 246, 0.4)'
                  ]
                }}
                transition={{ boxShadow: { duration: 2, repeat: Infinity } }}
              >
                <Play className="w-6 h-6" />
                Start Challenge
              </motion.button>
              
              <motion.button
                onClick={() => navigate('/')}
                className={`flex items-center gap-3 px-8 py-4 rounded-full font-bold transition-all duration-300 text-lg ${
                  isDark
                    ? 'bg-gray-700 hover:bg-gray-600 text-white border border-gray-600'
                    : 'bg-white hover:bg-gray-100 text-gray-800 border-2 border-gray-300'
                } transform hover:scale-105 hover:shadow-lg`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Home className="w-6 h-6" />
                Go Home
              </motion.button>
            </motion.div>

            {/* Floating elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <motion.div
                className="absolute top-20 left-10 text-4xl"
                animate={{ 
                  y: [0, -20, 0],
                  rotate: [0, 10, 0]
                }}
                transition={{ duration: 3, repeat: Infinity, delay: 0 }}
              >
                📦
              </motion.div>
              <motion.div
                className="absolute top-40 right-20 text-3xl"
                animate={{ 
                  y: [0, -15, 0],
                  rotate: [0, -10, 0]
                }}
                transition={{ duration: 4, repeat: Infinity, delay: 1 }}
              >
                🏭
              </motion.div>
              <motion.div
                className="absolute bottom-40 left-20 text-3xl"
                animate={{ 
                  y: [0, -10, 0],
                  rotate: [0, 15, 0]
                }}
                transition={{ duration: 3.5, repeat: Infinity, delay: 2 }}
              >
                💰
              </motion.div>
            </div>
          </>
        ) : allLevelsComplete ? (
          // Enhanced game complete screen
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl"
          >
            <motion.div
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-8xl mb-6"
            >
              🏆
            </motion.div>
            
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              Master Logistics Driver!
            </h2>
            <p className="text-xl mb-6">
              🎉 Congratulations! You've successfully navigated through all freight routes!
            </p>
            <div className={`p-6 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg mb-8`}>
              <h3 className="text-2xl font-bold mb-4 text-green-500">🎯 Final Statistics</h3>
              <div className="grid grid-cols-2 gap-4 text-lg">
                <div>
                  <span className="text-yellow-500">🏅</span> Levels Completed: <span className="font-bold">{LEVELS.length}</span>
                </div>
                <div>
                  <span className="text-blue-500">⚡</span> Challenges Mastered: <span className="font-bold">All</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                onClick={handlePlayAgain}
                className={`flex items-center gap-3 px-8 py-4 rounded-full font-bold text-white shadow-lg transition-all duration-300 text-lg ${
                  isDark
                    ? 'bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700'
                    : 'bg-gradient-to-r from-green-500 to-blue-500 hover:from-blue-500 hover:to-green-500'
                } transform hover:scale-105`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <RotateCcw className="w-6 h-6" />
                Play Again
              </motion.button>
              
              <motion.button
                onClick={() => navigate('/')}
                className={`flex items-center gap-3 px-8 py-4 rounded-full font-bold text-white shadow-lg transition-all duration-300 text-lg ${
                  isDark
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
                    : 'bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 hover:from-red-500 hover:to-purple-500'
                } transform hover:scale-105`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Home className="w-6 h-6" />
                Continue to Vipreshana
              </motion.button>
            </div>
          </motion.div>
        ) : (
          // Enhanced game screen
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full"
          >
            <EnhancedLostFreightGame
              level={currentLevel}
              onWin={handleLevelWin}
              onReset={handleResetLevel}
              isDark={isDark}
              onBack={handleBackToMenu}
            />
          </motion.div>
        )}
      </div>
    </>
  );
};

export default NotFound;
