// nazotoki_payment/hooks/usePuzzleGame.ts
'use client';
import { useState, useEffect, useCallback } from 'react';
import { sendUsdc } from '@/services/agentKitService';
import { useAccount } from 'wagmi';

interface Puzzle { puzzleId: string; image: string; correctAnswer: string; hints: string[]; }
const CORRECT_KEYWORD = "ひらめき";
const DUMMY_PUZZLE_FOR_STATE: Puzzle = { puzzleId: "mvp_puzzle", image: "puzzle.png", correctAnswer: CORRECT_KEYWORD, hints: ["ヒントはなし！"], };
const INITIAL_TIME = 5 * 60;
const CONTINUE_TIME_BONUS = 3 * 60;

export function usePuzzleGame() {
  const { address } = useAccount();
  const [currentPuzzle, setCurrentPuzzle] = useState<Puzzle | null>(null);
  const [timeLeft, setTimeLeft] = useState(INITIAL_TIME);
  const [gameStarted, setGameStarted] = useState(false);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [isCleared, setIsCleared] = useState(false);
  const [answer, setAnswer] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [continueCount, setContinueCount] = useState(0);

  useEffect(() => { setCurrentPuzzle(DUMMY_PUZZLE_FOR_STATE); }, []);
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameStarted && !isCleared && !isTimeUp) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) { clearInterval(timer); setIsTimeUp(true); return 0; }
          return prevTime - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameStarted, isCleared, isTimeUp]);

  const startGame = useCallback(() => {
    setTimeLeft(INITIAL_TIME); setGameStarted(true); setIsTimeUp(false); setIsCleared(false);
    setAnswer(''); setErrorMessage(''); setSuccessMessage(''); setContinueCount(0);
  }, []);

  const checkAnswer = useCallback(() => {
    if (answer.trim().toLowerCase() === CORRECT_KEYWORD.toLowerCase()) {
      setIsCleared(true); setSuccessMessage('正解です！謎をクリアしました！'); setErrorMessage(''); setGameStarted(false);
    } else { setErrorMessage('残念、不正解です。'); }
  }, [answer]);

  const handleContinue = useCallback(async () => {
    if (!address || !currentPuzzle) return;
    setErrorMessage(''); setSuccessMessage('');
    try {
      const txHash = await sendUsdc(address, '0.05');
      setSuccessMessage(`コンティニュー成功！トランザクション: ${txHash}`);
      setTimeLeft((prevTime) => prevTime + CONTINUE_TIME_BONUS);
      setContinueCount((prevCount) => prevCount + 1); setIsTimeUp(false);
    } catch (error: any) {
      console.error('USDC 送金エラー:', error);
      setErrorMessage(`コンティニューに失敗しました: ${error.message || '不明なエラー'}`);
    }
  }, [address, currentPuzzle]);

  const resetGame = useCallback(() => {
    setGameStarted(false); setTimeLeft(INITIAL_TIME); setIsTimeUp(false); setIsCleared(false);
    setAnswer(''); setErrorMessage(''); setSuccessMessage(''); setContinueCount(0);
  }, []);

  return {
    currentPuzzle: DUMMY_PUZZLE_FOR_STATE, timeLeft, gameStarted, isTimeUp, isCleared, answer, setAnswer, startGame, checkAnswer, handleContinue, errorMessage, successMessage, resetGame, continueCount,
  };
}