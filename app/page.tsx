// nazotoki_payment/app/page.tsx
'use client'; // Client Component であることを宣言

import React from 'react';
import dynamic from 'next/dynamic'; // <-- dynamic をインポート
import { Box, Button, Typography, Container, TextField, Alert } from '@mui/material';
// import WalletConnect from '@/components/WalletConnect'; // <-- 直接インポートを削除

import Timer from '@/components/Timer';
import PuzzleDisplay from '@/components/PuzzleDisplay';
import ContinueModal from '@/components/ContinueModal';
import { usePuzzleGame } from '@/hooks/usePuzzleGame';
// useAccount はWalletConnect.tsx で使うので、app/page.tsx から削除
// import { useAccount } from 'wagmi'; <-- この行も削除！

// WalletConnect コンポーネントをクライアントサイドでのみレンダリングする
const WalletConnect = dynamic(() => import('@/components/WalletConnect'), { ssr: false });

// useAccount はWalletConnectコンポーネントの内部で使うので、page.tsxではuseAccountではなく
// usePuzzleGameフックから isConnected と address を受け取るように変更
// (usePuzzleGameフック内でuseAccountを使用する)
export default function HomePage() {
  // useAccount の代わりに usePuzzleGame から接続状態を受け取る
  const {
    address,
    isConnected, // usePuzzleGame から渡される
    currentPuzzle,
    timeLeft,
    gameStarted,
    isTimeUp,
    isCleared,
    answer,
    setAnswer,
    startGame,
    checkAnswer,
    handleContinue,
    errorMessage,
    successMessage,
    resetGame,
    continueCount,
  } = usePuzzleGame(); // usePuzzleGame を修正する必要がある

  const handleStartButtonClick = () => {
    if (isConnected) {
      startGame();
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, textAlign: 'center' }}>
      <Typography variant="h3" gutterBottom>
        謎解き DApp (MVP)
      </Typography>

      {!isConnected ? (
        <WalletConnect />
      ) : (
        <Box>
          <Typography variant="h6" sx={{ mb: 2 }}>
            接続中のウォレット: {address}
          </Typography>
          {!gameStarted ? (
            <Button
              variant="contained"
              color="primary"
              onClick={handleStartButtonClick}
              disabled={!isConnected}
              sx={{ mt: 2 }}
            >
              謎解き開始
            </Button>
          ) : (
            <>
              {isCleared ? (
                <Box>
                  <Typography variant="h4" color="success" sx={{ mt: 4 }}>
                    謎クリア！おめでとうございます！
                  </Typography>
                  <Button variant="contained" onClick={resetGame} sx={{ mt: 2 }}>
                    もう一度プレイ
                  </Button>
                </Box>
              ) : (
                <>
                  <Timer timeLeft={timeLeft} />
                  {continueCount > 0 && (
                    <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                      コンティニュー回数: {continueCount}
                    </Typography>
                  )}
                  {errorMessage && <Alert severity="error" sx={{ mt: 2 }}>{errorMessage}</Alert>}
                  {successMessage && <Alert severity="success" sx={{ mt: 2 }}>{successMessage}</Alert>}

                  <PuzzleDisplay />

                  <TextField
                    label="回答"
                    variant="outlined"
                    fullWidth
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        checkAnswer();
                      }
                    }}
                    sx={{ mt: 3 }}
                  />
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={checkAnswer}
                    sx={{ mt: 2 }}
                  >
                    回答を送信
                  </Button>
                  {isTimeUp && !isCleared && (
                    <ContinueModal onContinue={handleContinue} />
                  )}
                </>
              )}
            </>
          )}
        </Box>
      )}
    </Container>
  );
}