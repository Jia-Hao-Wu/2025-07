import { useState } from 'react';
import { Link } from 'react-router';
import { Box, Button, Modal, IconButton } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon } from '@mui/icons-material';

import { api } from '~/api';
import Table, { type TablePaginationModel } from '~/components/table';
import AccountForm, { type Account } from '~/components/forms/account';

export default function Index() {
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const fetchAPI = async ({ skip = 0, take }: TablePaginationModel) => {
    setLoading(true);

    const response = await api(`/accounts?skip=${skip}` + (take ? `&take=${take}` : ''));
    const data = await response.json();

    if (response.ok) {
      setLoading(false);
      return data;
    }

    setLoading(false);
    throw new Error("Failed to fetch accounts");
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'end', alignItems: 'center', mb: 2 }}>
        <Button
          sx={{ fontSize: 'small', fontWeight: 'bold' }}
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpen(true)}
        >
          Create Account
        </Button>
      </Box>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
      >
        <AccountForm
          handleClose={() => setOpen(false)}
        />
      </Modal>

      <Table<Account>
        columns={[
          { field: 'id', headerName: 'ID', width: 20 },
          { field: 'name', headerName: 'Name', flex: 1 },
          { field: 'address', headerName: 'Address', flex: 1 },
          { field: 'phoneNumber', headerName: 'Phone Number', flex: 1 },
          { field: 'bankAccountNumber', headerName: 'Bank Account Number', flex: 1 },
          {
            field: 'actions',
            headerName: 'Actions',
            width: 100,
            sortable: false,
            renderCell: ({ id }) => (
              <IconButton
                component={Link}
                to={`/accounts/${id}`}
                size="small"
                sx={{ color: 'primary.main'}}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            ),
          },
        ]}
        fetchAPI={fetchAPI}
        loading={loading}
      />
    </Box>
  );
}

export type { Account };