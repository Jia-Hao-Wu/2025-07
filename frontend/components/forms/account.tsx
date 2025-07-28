import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  TextField,
  CircularProgress
} from '@mui/material';
import { useState } from 'react';
import { useSnackbarContext } from 'store/snackbar';
import { api } from '~/api';

type Account = {
  id: number;
} & AccountData;

type AccountData = {
  name: string;
  address: string;
  phoneNumber: string;
  bankAccountNumber?: number | null;
}

type FormErrors = {
  name?: string;
  address?: string;
  phoneNumber?: string;
  bankAccountNumber?: string;
}

const defaultData = {
  name: '',
  address: '',
  phoneNumber: '',
  bankAccountNumber: undefined
};

export default function AccountForm({ account, isLoading, handleClose }: { handleClose?: () => void, isLoading?: boolean, account?: Account }) {
  const { setSnackbar } = useSnackbarContext();

  const [formData, setFormData] = useState<AccountData>(() => {
    return account ? {
      name: account.name,
      address: account.address,
      phoneNumber: account.phoneNumber,
      bankAccountNumber: account.bankAccountNumber
    } : defaultData;
  });

  const [loading, setLoading] = useState(isLoading);
  const [errors, setErrors] = useState<FormErrors>({});

  const handleInputChange = (field: keyof AccountData) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: field === 'bankAccountNumber' ? (value ? Number(value) : undefined) : value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    }

    if (formData.bankAccountNumber && formData.bankAccountNumber <= 0) {
      newErrors.bankAccountNumber = 'Bank account number must be positive';
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
      // Prepare data for submission (remove undefined bankAccountNumber)
      const submitData: AccountData = {
        name: formData.name.trim(),
        address: formData.address.trim(),
        phoneNumber: formData.phoneNumber.trim()
      };

      if (formData.bankAccountNumber !== undefined) {
        submitData.bankAccountNumber = formData.bankAccountNumber;
      }

      // If account exists, update it. Otherwise, create a new one
      const response = account ?
        await api(`/accounts/${account.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(submitData),
        }) :
        await api('/accounts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(submitData),
        });

      if (response.ok) {
        setFormData(defaultData);
        handleClose?.();
        setSnackbar('Account created successfully!');
      } else {
        const errorData = await response.json();
        setSnackbar(`Failed to create account: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      setSnackbar(`Failed to create account: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ mx: 'auto', mt: 4, width: '100%' }}>
      <Card>
        <CardHeader title={account ? account.name : "Create New Account"} />
        <CardContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              label="Name"
              value={formData.name}
              onChange={handleInputChange('name')}
              error={!!errors.name}
              helperText={errors.name}
              disabled={loading}
              required
              fullWidth
            />

            <TextField
              label="Address"
              value={formData.address}
              onChange={handleInputChange('address')}
              error={!!errors.address}
              helperText={errors.address}
              disabled={loading}
              required
              fullWidth
              multiline
              rows={2}
            />

            <TextField
              label="Phone Number"
              value={formData.phoneNumber}
              onChange={handleInputChange('phoneNumber')}
              error={!!errors.phoneNumber}
              helperText={errors.phoneNumber}
              disabled={loading}
              required
              fullWidth
            />

            <TextField
              label="Bank Account Number"
              type="number"
              value={formData.bankAccountNumber || ''}
              onChange={handleInputChange('bankAccountNumber')}
              error={!!errors.bankAccountNumber}
              helperText={errors.bankAccountNumber || 'Optional'}
              disabled={loading}
              fullWidth
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
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : null}
              >
                {loading ? 'Creating...' : 'Create Account'}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export type { Account };