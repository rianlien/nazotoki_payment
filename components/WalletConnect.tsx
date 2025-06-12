// nazotoki_payment/components/WalletConnect.tsx
'use client';
import React from 'react';
import { Button, Box, Typography } from '@mui/material';
import { useConnect, useAccount } from 'wagmi';
import { injected } from '@wagmi/connectors'; // <-- ここが変更点: injected 関数をインポート

function WalletConnect() {
  const { connect } = useConnect();
  const { isConnected, address } = useAccount();
  if (isConnected) {
    return (
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6">ウォレット接続済み</Typography>
        <Typography variant="body1">アドレス: {address}</Typography>
      </Box>
    );
  }
  return (
    <Box sx={{ mt: 4 }}>
      <Button variant="contained" color="primary" onClick={() => connect({ connector: injected() })}> {/* <-- ここが変更点: new を外し、関数として呼び出す */}
        ウォレットを接続
      </Button>
    </Box>
  );
}
export default WalletConnect;
