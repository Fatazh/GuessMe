'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { techItems, shuffleArray, TechItem } from '@/data/techItems';
import Image from 'next/image';

interface GroupData {
    name: string;
    color: string;
    gradient: string;
    members: string[];
}

interface GameConfig {
    groups: GroupData[];
    timerSeconds: number;
}

interface GroupScore {
    name: string;
    color: string;
    gradient: string;
    members: string[];
    correct: number;
}

type Phase = 'ready' | 'playing' | 'summary' | 'gameOver';

export default function GamePage() {
    const router = useRouter();
    const [config, setConfig] = useState<GameConfig | null>(null);
    const [phase, setPhase] = useState<Phase>('ready');
    const [groupIdx, setGroupIdx] = useState(0);
    const [itemIdx, setItemIdx] = useState(0);
    const [items, setItems] = useState<TechItem[]>([]);
    const [scores, setScores] = useState<GroupScore[]>([]);
    const [timeLeft, setTimeLeft] = useState(0);
    const [totalTime, setTotalTime] = useState(0);
    const [correctInTurn, setCorrectInTurn] = useState(0);
    const [flashType, setFlashType] = useState<'correct' | 'skip' | null>(null);
    const [imgError, setImgError] = useState(false);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const scoresRef = useRef<GroupScore[]>([]);

    useEffect(() => {
        scoresRef.current = scores;
    }, [scores]);

    // Load config
    useEffect(() => {
        const saved = localStorage.getItem('gameConfig');
        if (!saved) {
            router.push('/');
            return;
        }
        const parsed = JSON.parse(saved);
        // Validate config has the new groups format
        if (!parsed.groups || !Array.isArray(parsed.groups)) {
            localStorage.removeItem('gameConfig');
            router.push('/');
            return;
        }
        const config: GameConfig = parsed;
        setConfig(config);
        setItems(shuffleArray(techItems));
        setTotalTime(config.timerSeconds);
        setTimeLeft(config.timerSeconds);
        setScores(
            config.groups.map((g) => ({
                name: g.name,
                color: g.color,
                gradient: g.gradient,
                members: g.members,
                correct: 0,
            }))
        );
    }, [router]);

    // Timer
    useEffect(() => {
        if (phase !== 'playing') return;
        timerRef.current = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timerRef.current!);
                    setPhase('summary');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [phase]);

    // Out of items
    useEffect(() => {
        if (phase === 'playing' && itemIdx >= items.length) {
            if (timerRef.current) clearInterval(timerRef.current);
            setPhase('summary');
        }
    }, [phase, itemIdx, items.length]);

    const startTurn = useCallback(() => {
        setTimeLeft(totalTime);
        setCorrectInTurn(0);
        setFlashType(null);
        setImgError(false);
        setPhase('playing');
    }, [totalTime]);

    const handleCorrect = useCallback(() => {
        if (itemIdx >= items.length) return;
        setScores((prev) =>
            prev.map((s, i) => (i === groupIdx ? { ...s, correct: s.correct + 1 } : s))
        );
        setCorrectInTurn((p) => p + 1);
        setFlashType('correct');
        setTimeout(() => {
            setItemIdx((p) => p + 1);
            setFlashType(null);
            setImgError(false);
        }, 300);
    }, [itemIdx, items.length, groupIdx]);

    const handleSkip = useCallback(() => {
        if (itemIdx >= items.length) return;
        setFlashType('skip');
        setTimeout(() => {
            setItemIdx((p) => p + 1);
            setFlashType(null);
            setImgError(false);
        }, 300);
    }, [itemIdx, items.length]);

    const nextGroup = useCallback(() => {
        const next = groupIdx + 1;
        if (next >= (config?.groups.length || 0)) {
            localStorage.setItem('gameResults', JSON.stringify(scoresRef.current));
            setPhase('gameOver');
            setTimeout(() => router.push('/result'), 1200);
        } else {
            setGroupIdx(next);
            setPhase('ready');
        }
    }, [groupIdx, config, router]);

    if (!config) {
        return (
            <div className="loading-page">
                <div className="loader" />
            </div>
        );
    }

    const currentGroup = scores[groupIdx];
    const currentItem: TechItem | null = itemIdx < items.length ? items[itemIdx] : null;

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const isLow = timeLeft <= 10;

    const radius = 50;
    const circumference = 2 * Math.PI * radius;
    const progress = totalTime > 0 ? timeLeft / totalTime : 0;
    const dashOffset = circumference * (1 - progress);

    const categoryClass = (cat: string) => {
        if (cat === 'Hardware') return 'hardware';
        if (cat === 'Software & Aplikasi') return 'software';
        return 'konsep';
    };

    // Top scores for topbar
    const topScores = [...scores].sort((a, b) => b.correct - a.correct);

    return (
        <main className="game-page">
            {/* Top Bar */}
            <div className="game-topbar">
                <div className="round-badge" style={{ borderColor: currentGroup?.color }}>
                    Kelompok {groupIdx + 1} / {config.groups.length}
                </div>
                <div className="top-scores">
                    {topScores
                        .filter((s) => s.correct > 0)
                        .map((s, i) => (
                            <span
                                key={i}
                                className="top-score-chip"
                                style={{ background: `${s.color}22`, color: s.color }}
                            >
                                {s.name}: {s.correct}
                            </span>
                        ))}
                </div>
            </div>

            {/* ===== READY PHASE ===== */}
            {phase === 'ready' && currentGroup && (
                <div className="ready-card glass-card">
                    <div className="ready-icon">🎯</div>
                    <div className="ready-order">
                        Kelompok ke-{groupIdx + 1} dari {config.groups.length}
                    </div>
                    <h2 style={{ background: currentGroup.gradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                        {currentGroup.name}
                    </h2>

                    <p className="ready-instructions">
                        Kelompok <strong>{currentGroup.name}</strong> punya{' '}
                        <strong>{totalTime} detik</strong> untuk menebak sebanyak mungkin!
                        <br />
                        <br />
                        Satu orang dari kelompok menebak, anggota lain memberikan <em>clue</em>!
                    </p>
                    <div className="warning-box">
                        🚫 Penebak jangan lihat layar dulu!
                    </div>
                    <button id="start-turn" className="start-turn-btn" onClick={startTurn}>
                        ▶ Mulai Giliran
                    </button>
                </div>
            )}

            {/* ===== PLAYING PHASE ===== */}
            {phase === 'playing' && (
                <>
                    {/* Stats bar */}
                    <div className="game-stats-bar">
                        <div className="current-player" style={{ color: currentGroup?.color }}>
                            🎯 <strong>{currentGroup?.name}</strong>
                        </div>
                        <div className="correct-count">✅ {correctInTurn} benar</div>
                    </div>

                    {/* Timer */}
                    <div className="timer-area">
                        <div className="circular-timer">
                            <svg width="120" height="120" viewBox="0 0 120 120">
                                <circle className="timer-circle-bg" cx="60" cy="60" r={radius} />
                                <circle
                                    className="timer-circle-progress"
                                    cx="60"
                                    cy="60"
                                    r={radius}
                                    stroke={isLow ? 'var(--red)' : currentGroup?.color || 'var(--cyan)'}
                                    strokeDasharray={circumference}
                                    strokeDashoffset={dashOffset}
                                />
                            </svg>
                            <div className={`timer-text ${isLow ? 'low' : ''}`}>
                                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                            </div>
                        </div>
                    </div>

                    {/* Tech Item Card */}
                    {currentItem ? (
                        <div
                            className={`tech-card ${flashType === 'correct' ? 'flash-correct' : ''} ${flashType === 'skip' ? 'flash-skip' : ''}`}
                            key={currentItem.id}
                        >
                            <div className={`tech-category ${categoryClass(currentItem.category)}`}>
                                {currentItem.category}
                            </div>

                            <div className="tech-image-container">
                                {!imgError ? (
                                    <Image
                                        src={currentItem.image}
                                        alt={currentItem.name}
                                        width={200}
                                        height={200}
                                        className="tech-image"
                                        onError={() => setImgError(true)}
                                        unoptimized
                                    />
                                ) : (
                                    <div className="tech-image-placeholder">
                                        <span>📷</span>
                                        <small>Gambar belum tersedia</small>
                                    </div>
                                )}
                            </div>

                            <div className="tech-name">{currentItem.name}</div>

                            <div className="taboo-section">
                                <div className="taboo-title">🚫 Kata Terlarang</div>
                                <div className="taboo-words">
                                    {currentItem.tabooWords.map((word, i) => (
                                        <span key={i} className="taboo-word">
                                            {word}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="tech-card">
                            <div className="tech-image-placeholder">
                                <span>🎉</span>
                            </div>
                            <div className="tech-name" style={{ fontSize: '1.2rem' }}>
                                Semua soal habis!
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="game-actions">
                        <button
                            id="btn-correct"
                            className="action-btn btn-correct"
                            onClick={handleCorrect}
                            disabled={!currentItem}
                        >
                            ✅ Benar
                        </button>
                        <button
                            id="btn-skip"
                            className="action-btn btn-skip"
                            onClick={handleSkip}
                            disabled={!currentItem}
                        >
                            ⏭️ Lewati
                        </button>
                    </div>
                </>
            )}

            {/* ===== SUMMARY PHASE ===== */}
            {phase === 'summary' && (
                <div className="turn-summary">
                    <div className="summary-icon">⏰</div>
                    <h2>Waktu Habis!</h2>
                    <div className="summary-sub">
                        Giliran <span style={{ color: currentGroup?.color, fontWeight: 700 }}>{currentGroup?.name}</span> selesai
                    </div>

                    <div className="summary-stats">
                        <div className="stat-item">
                            <div className="stat-value correct">{correctInTurn}</div>
                            <div className="stat-label">Benar</div>
                        </div>
                    </div>

                    <button id="next-player" className="next-btn" onClick={nextGroup}>
                        {groupIdx + 1 >= config.groups.length
                            ? '🏆 Lihat Hasil Akhir'
                            : `➡️ Kelompok Berikutnya (${config.groups[groupIdx + 1].name})`}
                    </button>
                </div>
            )}

            {/* ===== GAME OVER ===== */}
            {phase === 'gameOver' && (
                <div className="gameover-overlay">
                    <div className="gameover-text">🏆 Game Selesai!</div>
                </div>
            )}
        </main>
    );
}
