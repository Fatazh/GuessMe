'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const PARTICIPANTS = Array.from({ length: 27 }, (_, i) => `Peserta ${i + 1}`);

const GROUP_COLORS = [
  { name: 'Tim 1', color: '#ef4444', gradient: 'linear-gradient(135deg, #ef4444, #dc2626)' },
  { name: 'Tim 2', color: '#3b82f6', gradient: 'linear-gradient(135deg, #3b82f6, #2563eb)' },
  { name: 'Tim 3', color: '#10b981', gradient: 'linear-gradient(135deg, #10b981, #059669)' },
  { name: 'Tim 4', color: '#8b5cf6', gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' },
];

function divideIntoGroups(participants: string[]) {
  const shuffled = [...participants].sort(() => Math.random() - 0.5);
  const groups = GROUP_COLORS.map((g) => ({
    ...g,
    members: [] as string[],
  }));
  shuffled.forEach((name, i) => {
    groups[i % 4].members.push(name);
  });
  return groups;
}

export default function Home() {
  const router = useRouter();
  const [timerSeconds, setTimerSeconds] = useState(60);
  const [isStarting, setIsStarting] = useState(false);

  const handleStart = () => {
    setIsStarting(true);
    const groups = divideIntoGroups(PARTICIPANTS);
    const config = {
      groups,
      timerSeconds,
    };
    localStorage.setItem('gameConfig', JSON.stringify(config));
    setTimeout(() => router.push('/game'), 500);
  };

  const formatTimer = (sec: number) => {
    if (sec < 60) return `${sec} detik`;
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return s > 0 ? `${m} menit ${s} detik` : `${m} menit`;
  };

  return (
    <main className="setup-page">
      <div className="game-header">
        <h1 className="game-title">
          <span className="title-line">TEBAK</span>
          <span className="title-line accent">GAMBAR</span>
        </h1>
        <div className="title-sub">
          <span className="badge">TEKNOLOGI</span>
          <span>Game Seru untuk Semua!</span>
        </div>
      </div>

      <div className="setup-card glass-card">
        {/* Timer */}
        <div className="setup-section">
          <h2>⏱️ Waktu per Giliran Kelompok</h2>
          <div className="timer-selector">
            <div className="timer-display">
              {timerSeconds}
              <span className="unit">detik</span>
            </div>
            <input
              id="timer-slider"
              type="range"
              className="timer-slider"
              min={60}
              max={300}
              step={30}
              value={timerSeconds}
              onChange={(e) => setTimerSeconds(Number(e.target.value))}
            />
            <div className="timer-labels">
              <span>1 menit</span>
              <span>{formatTimer(timerSeconds)}</span>
              <span>5 menit</span>
            </div>
          </div>
        </div>

        {/* Start */}
        <button
          id="start-game"
          className="start-btn"
          onClick={handleStart}
          disabled={isStarting}
        >
          {isStarting ? '⏳ Memulai...' : '🚀 Mulai Bermain'}
        </button>
      </div>
    </main>
  );
}
