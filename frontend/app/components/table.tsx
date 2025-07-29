import { useEffect, useState } from 'react';
import {
  DataGrid,
  type GridColDef,
  type DataGridProps
} from 'node_modules/@mui/x-data-grid';
import Paper from '@mui/material/Paper';

import { useSnackbarContext } from '~/store/snackbar';

type TableProps<T> = {
  columns: GridColDef[];
  fetchAPI: (params: TablePaginationModel) => Promise<{ data: T[]; total: number }>;
  refresh?: number;
  loading?: boolean;
} & DataGridProps;

type TablePaginationModel = {
  skip: number;
  page: number;
  take?: number;
}

export default function Table<T>({ columns = [], fetchAPI, refresh, loading = true, ...props }: TableProps<T>) {

  const { setSnackbar } = useSnackbarContext();

  const [rows, setRows] = useState<T[]>([]);
  const [totalRows, setTotalRows] = useState<number>(0);
  const [paginationModel, setPaginationModel] = useState<TablePaginationModel>({ page: 0, skip: 0, take: 10 });

  // Here we will fetch data when pagination model changes or on refresh trigger
  useEffect(() => {
    if (fetchAPI) {
      fetchAPI(paginationModel)
        .then(({ data, total }) => {
          setRows(data);
          setTotalRows(total);
        })
        .catch(error => {
          setSnackbar("Failed to fetch: " + error);
        })
    }
  }, [paginationModel, refresh]);

  return (
    <Paper sx={{ height: '80vh', width: '100%' }}>
      <DataGrid
        disableColumnFilter
        disableColumnSorting
        disableRowSelectionOnClick
        rows={rows}
        paginationMode='server'
        columns={columns}
        rowCount={totalRows}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: paginationModel?.take,
              page: paginationModel?.page || 0,
            }
          },
        }}
        onPaginationModelChange={({ page, pageSize }) =>
          setPaginationModel(p => ({ ...p, skip: page * pageSize, take: pageSize }))
        }
        pageSizeOptions={[5, 10, 25]}
        sx={{ border: 0 }}
        loading={loading}
        slotProps={{
          loadingOverlay: {
            variant: 'linear-progress',
            noRowsVariant: 'skeleton',
          },
        }}
        {...props}
      />
    </Paper>
  );
}

export type { TablePaginationModel }
