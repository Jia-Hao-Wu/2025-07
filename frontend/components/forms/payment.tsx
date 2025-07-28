import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  TextField,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText
} from '@mui/material';
import { useState, useEffect } from 'react';
import { useSnackbarContext } from 'store/snackbar';
import { api } from '~/api';

import type { Account } from './account';

export type Payment = {
  id: number;
  Account: Account;
} & PaymentData;

type PaymentData = {
  amount: number;
  accountId?: number | string;
  recipientName: string;
  recipientBankName: string;
  recipientAccountNumber: string;
  notes?: string;
}

type FormErrors = {
  amount?: string;
  accountId?: string;
  recipientName?: string;
  recipientBankName?: string;
  recipientAccountNumber?: string;
  notes?: string;
}

const defaultData = {
  amount: 0,
  accountId: undefined,
  recipientName: '',
  recipientBankName: '',
  recipientAccountNumber: '',
  notes: ''
};

export default function PaymentForm({ accountId, handleClose }: { accountId?: string, handleClose: () => void, payment?: Payment }) {
  const { setSnackbar } = useSnackbarContext();

  const [formData, setFormData] = useState<PaymentData>(() => {
    return accountId ? {
      ...defaultData,
      accountId: parseInt(accountId, 10)
    } : defaultData;
  });

  const [loadingAccounts, setLoadingAccounts] = useState(true);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  // Load accounts on component mount
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await api('/accounts?take=1000');
        const data = await response.json();

        if (response.ok) {
          setAccounts(data.data);
        } else {
          setSnackbar('Failed to load accounts');
        }
      } catch (error) {
        setSnackbar('Failed to load accounts');
      } finally {
        setLoadingAccounts(false);
      }
    };

    fetchAccounts();
  }, [setSnackbar]);

  const handleInputChange = (field: keyof typeof defaultData) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const handleSelectChange = (field: keyof typeof defaultData) => (
    event: any
  ) => {
    const value = event.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user changes selection
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.accountId) {
      newErrors.accountId = 'Please select an account';
    }

    if (!formData.recipientName.trim()) {
      newErrors.recipientName = 'Recipient name is required';
    }

    if (!formData.recipientBankName.trim()) {
      newErrors.recipientBankName = 'Recipient bank name is required';
    }

    if (!formData.recipientAccountNumber.trim()) {
      newErrors.recipientAccountNumber = 'Recipient account number is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Prepare data for submission
      const submitData: PaymentData = {
        amount: formData.amount,
        accountId: formData.accountId,
        recipientName: formData.recipientName.trim(),
        recipientBankName: formData.recipientBankName.trim(),
        recipientAccountNumber: formData.recipientAccountNumber.trim(),
        notes: formData.notes?.trim() || undefined
      };

      // Remove notes if empty
      if (!submitData.notes) {
        delete submitData.notes;
      }

      const response = await api(`/payments/${submitData.accountId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      if (response.ok) {
        setFormData(defaultData);
        handleClose();
        setSnackbar('Payment created successfully!');
      } else {
        const errorData = await response.json();
        setSnackbar(`Failed to create payment: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      setSnackbar(`Failed to create payment: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Card>
        <CardHeader title="Create New Payment" />
        <CardContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <FormControl fullWidth required error={!!errors.accountId} disabled={loading || loadingAccounts}>
              <InputLabel>Account</InputLabel>
              <Select
                readOnly={!!accountId}
                value={formData.accountId}
                label="Account"
                onChange={handleSelectChange('accountId')}
              >
                {accounts.map((account) => (
                  <MenuItem key={account.id} value={account.id.toString()}>
                    <strong>{account.name}</strong>&nbsp;-&nbsp;{account.bankAccountNumber}
                  </MenuItem>
                ))}
              </Select>
              {errors.accountId && <FormHelperText>{errors.accountId}</FormHelperText>}
            </FormControl>

            <TextField
              label="Payment Amount"
              type="number"
              value={formData.amount}
              onChange={handleInputChange('amount')}
              error={!!errors.amount}
              helperText={errors.amount}
              disabled={loading}
              required
              fullWidth
            />

            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>

              <TextField
                label="Recipient Name"
                value={formData.recipientName}
                onChange={handleInputChange('recipientName')}
                error={!!errors.recipientName}
                helperText={errors.recipientName}
                disabled={loading}
                required
                fullWidth
              />

              <TextField
                label="Recipient Bank Name"
                value={formData.recipientBankName}
                onChange={handleInputChange('recipientBankName')}
                error={!!errors.recipientBankName}
                helperText={errors.recipientBankName}
                disabled={loading}
                required
                fullWidth
              />

              <TextField
                label="Recipient Account Number"
                value={formData.recipientAccountNumber}
                onChange={handleInputChange('recipientAccountNumber')}
                error={!!errors.recipientAccountNumber}
                helperText={errors.recipientAccountNumber}
                disabled={loading}
                required
                fullWidth
              />

            </ Box>

            <TextField
              label="Notes"
              value={formData.notes}
              onChange={handleInputChange('notes')}
              error={!!errors.notes}
              helperText={errors.notes || 'Optional'}
              disabled={loading}
              fullWidth
              multiline
              rows={3}
            />

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                type="button"
                variant="outlined"
                onClick={handleClose}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={loading || loadingAccounts}
                startIcon={loading ? <CircularProgress size={20} /> : null}
              >
                {loading ? 'Creating...' : 'Create Payment'}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
