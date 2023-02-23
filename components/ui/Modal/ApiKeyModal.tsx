import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { uuid4 } from '@sentry/utils';
import { supabase } from '@/utils/supabase-client';
import { User } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import { stat } from 'fs';

interface ModalProps {
  generateApiKey: ()=>Promise<void>,
  modalOpen: boolean
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export default function ApiKeyModal({ generateApiKey, modalOpen, setModalOpen } : ModalProps) {

  const onAgree = async () => {
    setModalOpen(false);
    await generateApiKey();
  };

  const onDecline = async () => {
    setModalOpen(false);
  };

  return (
    <Dialog
      open={modalOpen}
      onClose={() => {setModalOpen(false);}}
      aria-labelledby='alert-dialog-title'
      aria-describedby='alert-dialog-description'
    >
      <DialogTitle id='alert-dialog-title'>{'Generate API-Key'}</DialogTitle>
      <DialogContent>
        <DialogContentText id='alert-dialog-description'>
          After generating a new API key, you will need to check all your
          services that used the old API key and replace it with the new one.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button variant='text' color='error' onClick={() => onDecline()}>
          Decline
        </Button>
        <Button variant='outlined' onClick={() => onAgree()} autoFocus>
          Accept
        </Button>
      </DialogActions>
    </Dialog>
  );
}