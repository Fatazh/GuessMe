'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
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

type Phase = 'ready' | 'playing' | 'summary' | 'tiebreaker' | 'tiebreakerReady' | 'tiebreakerPlaying' | 'tiebreakerSummary' | 'gameOver';

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
    const [paused, setPaused] = useState(false);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const scoresRef = useRef<GroupScore[]>([]);
    const [answeredIds, setAnsweredIds] = useState<Set<number>>(new Set()); // IDs yang sudah dijawab benar

    // Tiebreaker state
    const [tiedGroups, setTiedGroups] = useState<number[]>([]); // indices of tied groups
    const [tiebreakerIdx, setTiebreakerIdx] = useState(0); // current tiebreaker group index
    const [tiebreakerScores, setTiebreakerScores] = useState<Record<number, number>>({}); // extra scores
    const [tiebreakerRound, setTiebreakerRound] = useState(1);

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

    // Timer - works for both normal and tiebreaker playing phases, pauses when paused
    useEffect(() => {
        if (phase !== 'playing' && phase !== 'tiebreakerPlaying') return;
        if (paused) {
            if (timerRef.current) clearInterval(timerRef.current);
            return;
        }
        timerRef.current = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timerRef.current!);
                    if (phase === 'playing') {
                        setPhase('summary');
                    } else {
                        setPhase('tiebreakerSummary');
                    }
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [phase, paused]);

    // Out of items
    useEffect(() => {
        if ((phase === 'playing' || phase === 'tiebreakerPlaying') && itemIdx >= items.length) {
            if (timerRef.current) clearInterval(timerRef.current);
            if (phase === 'playing') {
                setPhase('summary');
            } else {
                setPhase('tiebreakerSummary');
            }
        }
    }, [phase, itemIdx, items.length]);

    // Check for ties
    const findTiedGroups = useCallback((currentScores: GroupScore[]): number[] => {
        const maxScore = Math.max(...currentScores.map((s) => s.correct));
        const tiedIndices = currentScores
            .map((s, i) => (s.correct === maxScore ? i : -1))
            .filter((i) => i !== -1);
        return tiedIndices.length > 1 ? tiedIndices : [];
    }, []);

    const startTurn = useCallback(() => {
        // Shuffle items and remove already-answered ones
        const available = shuffleArray(techItems.filter((item) => !answeredIds.has(item.id)));
        setItems(available);
        setItemIdx(0);
        setTimeLeft(totalTime);
        setCorrectInTurn(0);
        setFlashType(null);
        setImgError(false);
        setPaused(false);
        setPhase('playing');
    }, [totalTime, answeredIds]);

    // Pause / Resume
    const togglePause = useCallback(() => {
        setPaused((prev) => !prev);
    }, []);

    // Stop - end current turn immediately
    const handleStop = useCallback(() => {
        if (timerRef.current) clearInterval(timerRef.current);
        setPaused(false);
        if (phase === 'tiebreakerPlaying') {
            setPhase('tiebreakerSummary');
        } else {
            setPhase('summary');
        }
    }, [phase]);

    const handleCorrect = useCallback(() => {
        if (itemIdx >= items.length) return;

        // Track answered item
        const answeredItem = items[itemIdx];
        setAnsweredIds((prev) => new Set(prev).add(answeredItem.id));

        if (phase === 'tiebreakerPlaying') {
            // Tiebreaker scoring
            const currentGroupOrigIdx = tiedGroups[tiebreakerIdx];
            setTiebreakerScores((prev) => ({
                ...prev,
                [currentGroupOrigIdx]: (prev[currentGroupOrigIdx] || 0) + 1,
            }));
        } else {
            // Normal scoring
            setScores((prev) =>
                prev.map((s, i) => (i === groupIdx ? { ...s, correct: s.correct + 1 } : s))
            );
        }

        setCorrectInTurn((p) => p + 1);
        setFlashType('correct');
        setTimeout(() => {
            setItemIdx((p) => p + 1);
            setFlashType(null);
            setImgError(false);
        }, 300);
    }, [itemIdx, items, groupIdx, phase, tiedGroups, tiebreakerIdx]);

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
            // All groups done, check for tie
            const tied = findTiedGroups(scoresRef.current);
            if (tied.length > 1) {
                // TIEBREAKER!
                setTiedGroups(tied);
                setTiebreakerIdx(0);
                setTiebreakerScores({});
                setTiebreakerRound(1);
                // Reshuffle items for tiebreaker, exclude answered
                setItems(shuffleArray(techItems.filter((item) => !answeredIds.has(item.id))));
                setItemIdx(0);
                setPhase('tiebreaker');
            } else {
                localStorage.setItem('gameResults', JSON.stringify(scoresRef.current));
                setPhase('gameOver');
                setTimeout(() => router.push('/result'), 1200);
            }
        } else {
            setGroupIdx(next);
            setPhase('ready');
        }
    }, [groupIdx, config, router, findTiedGroups]);

    // Start tiebreaker turn
    const startTiebreakerTurn = useCallback(() => {
        const available = shuffleArray(techItems.filter((item) => !answeredIds.has(item.id)));
        setItems(available);
        setItemIdx(0);
        const tiebreakerTime = 30; // 30 seconds for tiebreaker
        setTimeLeft(tiebreakerTime);
        setTotalTime(tiebreakerTime);
        setCorrectInTurn(0);
        setFlashType(null);
        setImgError(false);
        setPaused(false);
        setPhase('tiebreakerPlaying');
    }, [answeredIds]);

    // Next tiebreaker group
    const nextTiebreakerGroup = useCallback(() => {
        const next = tiebreakerIdx + 1;
        if (next >= tiedGroups.length) {
            // All tied groups played, check if still tied
            const tbScores = { ...tiebreakerScores };
            // Fill missing scores with 0
            tiedGroups.forEach((gi) => {
                if (tbScores[gi] === undefined) tbScores[gi] = 0;
            });

            const maxTbScore = Math.max(...Object.values(tbScores));
            const stillTied = tiedGroups.filter((gi) => (tbScores[gi] || 0) === maxTbScore);

            if (stillTied.length > 1 && tiebreakerRound < 3) {
                // Still tied - another round!
                setTiedGroups(stillTied);
                setTiebreakerIdx(0);
                setTiebreakerScores({});
                setTiebreakerRound((r) => r + 1);
                setItems(shuffleArray(techItems.filter((item) => !answeredIds.has(item.id))));
                setItemIdx(0);
                setPhase('tiebreaker');
            } else {
                // Resolve: add tiebreaker scores to main scores, or just declare winner
                const finalScores = scoresRef.current.map((s, i) => ({
                    ...s,
                    correct: s.correct + (tbScores[i] || 0),
                }));
                localStorage.setItem('gameResults', JSON.stringify(finalScores));
                setPhase('gameOver');
                setTimeout(() => router.push('/result'), 1200);
            }
        } else {
            setTiebreakerIdx(next);
            setPhase('tiebreakerReady');
        }
    }, [tiebreakerIdx, tiedGroups, tiebreakerScores, tiebreakerRound, router]);

    // Determine current active group based on phase
    const activeGroupIdx = useMemo(() => {
        if (phase === 'tiebreakerReady' || phase === 'tiebreakerPlaying' || phase === 'tiebreakerSummary') {
            return tiedGroups[tiebreakerIdx] ?? 0;
        }
        return groupIdx;
    }, [phase, groupIdx, tiedGroups, tiebreakerIdx]);

    if (!config) {
        return (
            <div className="loading-page">
                <div className="loader" />
            </div>
        );
    }

    const currentGroup = scores[activeGroupIdx];
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

    // Is currently in tiebreaker modes?
    const isTiebreaker = phase === 'tiebreaker' || phase === 'tiebreakerReady' || phase === 'tiebreakerPlaying' || phase === 'tiebreakerSummary';

    return (
        <main className="game-page">
            {/* Top Bar */}
            <div className="game-topbar">
                <div className="round-badge" style={{ borderColor: currentGroup?.color }}>
                    {isTiebreaker
                        ? `⚡ Extra Ronde ${tiebreakerRound}`
                        : `Kelompok ${groupIdx + 1} / ${config.groups.length}`}
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

            {/* ===== TIEBREAKER ANNOUNCEMENT ===== */}
            {phase === 'tiebreaker' && (
                <div className="ready-card glass-card tiebreaker-announce">
                    <div className="ready-icon">⚡</div>
                    <h2 className="tiebreaker-title">Game Extra!</h2>
                    <p className="tiebreaker-desc">
                        Skor seri! Kelompok berikut punya nilai yang sama:
                    </p>
                    <div className="tied-groups-list">
                        {tiedGroups.map((gi) => (
                            <div
                                key={gi}
                                className="tied-group-chip"
                                style={{ background: `${scores[gi].color}22`, color: scores[gi].color, borderColor: scores[gi].color }}
                            >
                                {scores[gi].name} — {scores[gi].correct} benar
                            </div>
                        ))}
                    </div>
                    <p className="tiebreaker-rules">
                        Setiap kelompok punya <strong>30 detik</strong> untuk menebak sebanyak mungkin.
                        <br />
                        Kelompok dengan jawaban terbanyak menang! 🏆
                    </p>
                    <button
                        className="start-turn-btn tiebreaker-start"
                        onClick={() => {
                            setPhase('tiebreakerReady');
                        }}
                    >
                        ⚡ Mulai Game Extra
                    </button>
                </div>
            )}

            {/* ===== TIEBREAKER READY ===== */}
            {phase === 'tiebreakerReady' && currentGroup && (
                <div className="ready-card glass-card">
                    <div className="ready-icon">⚡</div>
                    <div className="ready-order">
                        Extra Ronde {tiebreakerRound} — Kelompok {tiebreakerIdx + 1} dari {tiedGroups.length}
                    </div>
                    <h2 style={{ background: currentGroup.gradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                        {currentGroup.name}
                    </h2>

                    <p className="ready-instructions">
                        <strong>30 detik</strong> untuk menebak sebanyak mungkin!
                        <br /><br />
                        Ini babak penentuan — berikan yang terbaik! 💪
                    </p>
                    <div className="warning-box">
                        🚫 Penebak jangan lihat layar dulu!
                    </div>
                    <button id="start-turn" className="start-turn-btn tiebreaker-start" onClick={startTiebreakerTurn}>
                        ⚡ Mulai Giliran
                    </button>
                </div>
            )}

            {/* ===== READY PHASE (Normal) ===== */}
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

            {/* ===== PLAYING PHASE (Normal + Tiebreaker) ===== */}
            {(phase === 'playing' || phase === 'tiebreakerPlaying') && (
                <>
                    {/* Stats bar */}
                    <div className="game-stats-bar">
                        <div className="current-player" style={{ color: currentGroup?.color }}>
                            {isTiebreaker ? '⚡' : '🎯'} <strong>{currentGroup?.name}</strong>
                            {isTiebreaker && <span className="tiebreaker-badge-small">EXTRA</span>}
                        </div>
                        <div className="correct-count">✅ {correctInTurn} benar</div>
                    </div>

                    {/* Timer */}
                    <div className="timer-area">
                        <div className="circular-timer">
                            <svg width="120" height="120" viewBox="0 0 120 120">
                                <circle className="timer-circle-bg" cx="60" cy="60" r={radius} />
                                <circle
                                    className={`timer-circle-progress ${paused ? 'paused' : ''}`}
                                    cx="60"
                                    cy="60"
                                    r={radius}
                                    stroke={paused ? 'var(--amber)' : isLow ? 'var(--red)' : currentGroup?.color || 'var(--cyan)'}
                                    strokeDasharray={circumference}
                                    strokeDashoffset={dashOffset}
                                />
                            </svg>
                            <div className={`timer-text ${isLow && !paused ? 'low' : ''} ${paused ? 'paused-text' : ''}`}>
                                {paused ? '⏸️' : `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`}
                            </div>
                        </div>
                    </div>

                    {/* Pause Overlay */}
                    {paused && (
                        <div className="pause-overlay">
                            <div className="pause-content">
                                <div className="pause-icon">⏸️</div>
                                <h2 className="pause-title">Game Di-Pause</h2>
                                <p className="pause-desc">Waktu dihentikan sementara. Tekan Lanjutkan untuk melanjutkan permainan.</p>
                                <div className="pause-actions">
                                    <button className="action-btn btn-resume" onClick={togglePause}>
                                        ▶️ Lanjutkan
                                    </button>
                                    <button className="action-btn btn-stop" onClick={handleStop}>
                                        ⏹️ Akhiri Giliran
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Tech Item Card */}
                    {!paused && (
                        <>
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
                                                width={380}
                                                height={380}
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
                        </>
                    )}

                    {/* Actions */}
                    {!paused && (
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
                    )}

                    {/* Pause/Stop Controls */}
                    <div className="game-controls">
                        <button
                            className={`control-btn ${paused ? 'btn-resume-small' : 'btn-pause'}`}
                            onClick={togglePause}
                        >
                            {paused ? '▶️ Lanjut' : '⏸️ Pause'}
                        </button>
                        <button
                            className="control-btn btn-stop-small"
                            onClick={handleStop}
                        >
                            ⏹️ Stop
                        </button>
                    </div>
                </>
            )}

            {/* ===== SUMMARY PHASE (Normal) ===== */}
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
                            ? '🏁 Lihat Hasil'
                            : `➡️ Kelompok Berikutnya (${config.groups[groupIdx + 1].name})`}
                    </button>
                </div>
            )}

            {/* ===== TIEBREAKER SUMMARY ===== */}
            {phase === 'tiebreakerSummary' && (
                <div className="turn-summary">
                    <div className="summary-icon">⚡</div>
                    <h2>Waktu Habis!</h2>
                    <div className="summary-sub">
                        Extra ronde <span style={{ color: currentGroup?.color, fontWeight: 700 }}>{currentGroup?.name}</span> selesai
                    </div>

                    <div className="summary-stats">
                        <div className="stat-item">
                            <div className="stat-value correct">{correctInTurn}</div>
                            <div className="stat-label">Benar (Extra)</div>
                        </div>
                    </div>

                    <button id="next-tiebreaker" className="next-btn tiebreaker-start" onClick={nextTiebreakerGroup}>
                        {tiebreakerIdx + 1 >= tiedGroups.length
                            ? '🏆 Lihat Hasil Akhir'
                            : `⚡ Kelompok Berikutnya (${scores[tiedGroups[tiebreakerIdx + 1]].name})`}
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
