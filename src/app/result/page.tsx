'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';

interface GroupScore {
    name: string;
    color: string;
    gradient: string;
    members: string[];
    correct: number;
}

const CONFETTI_COLORS = ['#8b5cf6', '#3b82f6', '#ec4899', '#10b981', '#f59e0b', '#ef4444', '#06b6d4'];

export default function ResultPage() {
    const router = useRouter();
    const [results, setResults] = useState<GroupScore[] | null>(null);
    const [showConfetti, setShowConfetti] = useState(true);

    useEffect(() => {
        const saved = localStorage.getItem('gameResults');
        if (!saved) {
            router.push('/');
            return;
        }
        setResults(JSON.parse(saved));
        const timer = setTimeout(() => setShowConfetti(false), 5000);
        return () => clearTimeout(timer);
    }, [router]);

    const sorted = useMemo(() => {
        if (!results) return [];
        return [...results].sort((a, b) => b.correct - a.correct);
    }, [results]);

    const confettiPieces = useMemo(() => {
        return Array.from({ length: 50 }, (_, i) => ({
            id: i,
            left: `${Math.random() * 100}%`,
            delay: `${Math.random() * 3}s`,
            duration: `${2 + Math.random() * 3}s`,
            color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
            size: 6 + Math.random() * 8,
            shape: Math.random() > 0.5 ? '50%' : '0%',
        }));
    }, []);

    const handlePlayAgain = () => {
        localStorage.removeItem('gameResults');
        localStorage.removeItem('gameConfig');
        router.push('/');
    };

    if (!results) {
        return (
            <div className="loading-page">
                <div className="loader" />
            </div>
        );
    }

    const winner = sorted[0];
    const totalCorrect = sorted.reduce((sum, g) => sum + g.correct, 0);

    return (
        <main className="result-page">
            {/* Confetti */}
            {showConfetti && (
                <div className="confetti-container">
                    {confettiPieces.map((p) => (
                        <div
                            key={p.id}
                            className="confetti-piece"
                            style={{
                                left: p.left,
                                animationDelay: p.delay,
                                animationDuration: p.duration,
                                backgroundColor: p.color,
                                width: p.size,
                                height: p.size,
                                borderRadius: p.shape,
                            }}
                        />
                    ))}
                </div>
            )}

            <h1 className="result-title">🏆 Hasil Pertandingan</h1>
            <p className="result-subtitle">
                Selamat kepada <strong style={{ color: winner.color, WebkitTextFillColor: winner.color }}>{winner.name}</strong> sebagai pemenang dengan{' '}
                <strong>{winner.correct} jawaban benar</strong>!
                <br />
                Total {totalCorrect} jawaban benar dari {sorted.length} kelompok.
            </p>

            {/* Podium (top groups) */}
            {sorted.length >= 2 && (
                <div className="podium-container">
                    {/* 2nd */}
                    {sorted[1] && (
                        <div className="podium-item">
                            <div className="podium-avatar" style={{ background: sorted[1].color }}>
                                {sorted[1].name.charAt(0).toUpperCase()}
                            </div>
                            <div className="podium-name">{sorted[1].name}</div>
                            <div className="podium-score" style={{ color: '#94a3b8' }}>
                                {sorted[1].correct}
                            </div>
                            <div className="podium-bar second">2</div>
                        </div>
                    )}

                    {/* 1st */}
                    <div className="podium-item">
                        <div className="podium-crown">👑</div>
                        <div className="podium-avatar" style={{ background: winner.color, borderColor: winner.color }}>
                            {winner.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="podium-name">{winner.name}</div>
                        <div className="podium-score" style={{ color: 'var(--amber)' }}>
                            {winner.correct}
                        </div>
                        <div className="podium-bar first">1</div>
                    </div>

                    {/* 3rd */}
                    {sorted[2] && (
                        <div className="podium-item">
                            <div className="podium-avatar" style={{ background: sorted[2].color }}>
                                {sorted[2].name.charAt(0).toUpperCase()}
                            </div>
                            <div className="podium-name">{sorted[2].name}</div>
                            <div className="podium-score" style={{ color: '#a16207' }}>
                                {sorted[2].correct}
                            </div>
                            <div className="podium-bar third">3</div>
                        </div>
                    )}
                </div>
            )}

            {/* Leaderboard / Scoreboard */}
            <div className="leaderboard">
                <div className="leaderboard-title">📊 Papan Skor Kelompok ({sorted.length} Kelompok)</div>
                <div className="leaderboard-scroll">
                    {sorted.map((g, i) => (
                        <div key={i} className="leaderboard-item" style={{ borderLeft: `3px solid ${g.color}` }}>
                            <div
                                className={`leaderboard-rank ${i === 0 ? 'gold' : i === 1 ? 'silver' : i === 2 ? 'bronze' : ''}`}
                            >
                                #{i + 1}
                            </div>
                            <div className="leaderboard-name-group">
                                <div className="leaderboard-name" style={{ color: g.color }}>{g.name}</div>
                                <div className="leaderboard-members">
                                    {g.members.join(', ')}
                                </div>
                            </div>
                            <div className="leaderboard-info">
                                <div className="leaderboard-points">{g.correct} benar</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <button id="play-again" className="play-again-btn" onClick={handlePlayAgain}>
                🔄 Main Lagi
            </button>
        </main>
    );
}
