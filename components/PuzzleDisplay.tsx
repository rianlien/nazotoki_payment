// nazotoki_payment/components/PuzzleDisplay.tsx
import React from 'react';
import { Box, Typography, Card, CardMedia, CardContent } from '@mui/material';

const PUZZLE_IMAGE_PATH = '/images/puzzle.png';
function PuzzleDisplay() {
  return (
    <Card sx={{ mt: 4 }}>
      <CardMedia component="img" height="300" image={PUZZLE_IMAGE_PATH} alt="謎の画像" sx={{ objectFit: 'contain' }} />
      <CardContent>
        <Typography variant="body1" sx={{ mt: 2, fontStyle: 'italic', color: 'text.secondary' }}>
          （これは謎の画像です。正しいキーワードを入力してください。）
        </Typography>
      </CardContent>
    </Card>
  );
}
export default PuzzleDisplay;