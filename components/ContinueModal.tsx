// nazotoki_payment/components/ContinueModal.tsx
import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

interface ContinueModalProps { onContinue: () => void; }
function ContinueModal({ onContinue }: ContinueModalProps) {
  return (
    <Dialog open={true} disableEscapeKeyDown>
      <DialogTitle>時間切れ！</DialogTitle>
      <DialogContent>
        <DialogContentText>
          残念！時間切れです。コンティニューするには 0.05 USDC を支払って、さらに 3 分の猶予とヒントを得られます。
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onContinue} color="primary" variant="contained">
          コンティニュー (0.05 USDC)
        </Button>
      </DialogActions>
    </Dialog>
  );
}
export default ContinueModal;