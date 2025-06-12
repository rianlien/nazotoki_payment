// nazotoki_payment/components/Timer.tsx
import React from 'react';
import { Box, Typography } from '@mui/material';

interface TimerProps { timeLeft: number; }
function Timer({ timeLeft }: TimerProps) {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  return (
    <Box sx={{ my: 2 }}>
      <Typography variant="h5">残り時間: {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}</Typography>
    </Box>
  );
}
export default Timer;