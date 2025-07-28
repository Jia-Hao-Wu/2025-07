import { Snackbar } from '@mui/material';
import React, { createContext, useContext, useState } from 'react';

interface SnackbarContext {
  setSnackbar: (message: string) => void;
}

const SnackbarContext = createContext<SnackbarContext | null>(null);

export default function SnackbarContextProvider({ children }: { children: React.ReactNode }) {

  const [message, setMessage] = useState<string>('');
  const [open, setOpen] = useState(false);

  const setSnackbar = (message: string) => {
    setMessage(message);
    setOpen(true);
  };

  return (
    <SnackbarContext.Provider value={{
      setSnackbar
    }}>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={open}
        onClose={() => setOpen(false)}
        message={message}
      />
      {children}
    </SnackbarContext.Provider>
  );
}

const useSnackbarContext = () => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error("useSnackbarContext must be used within a SnackbarContextProvider");
  }
  return context;
}

export { useSnackbarContext };