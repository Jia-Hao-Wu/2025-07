import Table, { type TablePaginationModel } from 'components/table';
import { Add as AddIcon } from '@mui/icons-material';
import { api } from '~/api';
import type { Account } from './accounts';
import type { GridRowId } from '@mui/x-data-grid';
import { useState } from 'react';
import { useSnackbarContext } from 'store/snackbar';
import { Select, MenuItem, FormControl, Box, Button, Modal } from '@mui/material';
import PaymentForm, { type Payment } from 'components/forms/payment';
import { useParams } from 'react-router';

export default function Index() {

  const { setSnackbar } = useSnackbarContext();
  const { accountId } = useParams();

  const [refresh, setRefresh] = useState(0);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const fetchAPI = async ({ skip = 0, take }: TablePaginationModel) => {
    setLoading(true);

    const response = await api(`/payments?skip=${skip}` + 
      (take ? `&take=${take}` : '') +
      (accountId ? `&accountId=${accountId}` : '')
    );

    const data = await response.json();

    if (response.ok) {
      setLoading(false);
      return data;
    }

    setLoading(false);
    throw new Error("Failed to fetch payments");
  };

  const updateStatus = async (id: GridRowId, status: string) => {
    setLoading(true);

    const response = await api(`/payments/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });

    if (response.ok) {
      setRefresh(prev => prev + 1);
      setSnackbar("Payment status updated successfully");
    }

    setLoading(false);
    throw new Error("Failed to update payment status");
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <h2>Payments</h2>
        <Button
          sx={{ fontSize: 'small', fontWeight: 'bold' }}
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpen(true)}
        >
          Create Payment
        </Button>
      </Box>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
      >
        <PaymentForm
          accountId={accountId}
          handleClose={() => setOpen(false)}
        />
      </Modal>

      <Table<Payment>
        columns={[
          { field: 'id', headerName: 'ID', width: 20 },
          { field: 'amount', headerName: 'Amount', flex: 1 },
          { field: 'notes', headerName: 'Notes', flex: 1 },
          {
            field: 'status', headerName: 'Status', width: 180, renderCell: ({ id, value, ...e }) => (
              <Select value={value} onChange={(e) => updateStatus(id, e.target.value)} sx={{ py: '0', width: '100%' }} size='small'>
                <MenuItem value="PENDING">Pending</MenuItem>
                <MenuItem value="APPROVED">Approved</MenuItem>
              </Select>
            )
            ,
          },
          { field: 'Account', headerName: 'Account Name', flex: 1, valueGetter: ({ name }: Account) => name },
          { field: 'recipientName', headerName: 'Recipient\'s Name', flex: 1 },
          { field: 'recipientBankName', headerName: 'Recipient\'s Bank Name', flex: 1 },
          { field: 'recipientAccountNumber', headerName: 'Recipient\'s Account Number', flex: 1 },
        ]}

        fetchAPI={fetchAPI}
        refresh={refresh}
        loading={loading}
      />
    </Box>
  );
}