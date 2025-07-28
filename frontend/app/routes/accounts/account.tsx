import { Box, CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import { api } from '~/api';
import AccountForm, { type Account } from 'components/forms/account';
import { useParams } from 'react-router';
import PaymentsTable from '../payments';

export default function Index() {
  const { accountId } = useParams();

  const [account, setAccount] = useState<Account>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAccounts = async () => {
      const response = await api(`/accounts/${accountId}`);
      if (response.ok) {
        const data = await response.json();
        setAccount(data);
      } else {
        console.error('Failed to fetch accounts');
      }

      setLoading(false);
    };

    fetchAccounts();
  }, []);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {loading ?
        <CircularProgress /> :
        <>
          <Box sx={{ display: 'block', justifyContent: 'center', mb: 2 }}>
            <AccountForm account={account} isLoading={loading} />
          </Box>
          <PaymentsTable />
        </>
      }
    </Box>
  );
}

export type { Account };