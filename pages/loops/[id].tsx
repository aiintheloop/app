import { getLoopsApprovals } from '@/utils/supabase-client';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Approval } from 'types';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import moment from 'moment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import PendingIcon from '@mui/icons-material/Pending';

const columns: GridColDef[] = [
  {
    field: 'id',
    headerName: 'ID',
    minWidth: 300,
    flex: 1,
    renderCell: (params) => {
      const router = useRouter();
      return (
        <button
          className="w-full flex justify-start items-center"
          onClick={() => router.push(`/approvals?id=${params.id}`)}
        >
          {params.value}
        </button>
      );
    }
  },
  {
    field: 'approved',
    headerName: 'Approved',
    minWidth: 150,
    flex: 1,
    sortable: true,
    renderCell: (params) => {
      const router = useRouter();
      // use icon instead of text
      return (
        <button
          className="w-full flex justify-start items-center"
          onClick={() => router.push(`/approvals?id=${params.id}`)}
        >
          {params.value === true ? (
            <CheckCircleIcon
              titleAccess="Approved"
              className="text-success"
              fontSize="medium"
            />
          ) : params.value === false ? (
            <CancelIcon
              titleAccess="Disapproved"
              className="text-error"
              fontSize="medium"
            />
          ) : (
            <PendingIcon
              titleAccess="Pending"
              className="text-warning"
              fontSize="medium"
            />
          )}
        </button>
      );
    }
  },
  {
    field: 'created_at',
    headerName: 'Created At',
    minWidth: 150,
    flex: 1,
    sortable: true,
    renderCell: (params) => {
      return <span>{params.value}</span>;
    }
  }
];

export default function LoopApprovalsPage() {
  const router = useRouter();
  const { id } = router.query;

  const [approvals, setApprovals] = useState<Approval[] | null>(null);
  const [rows, setRows] = useState<
    {
      id: string;
      approved: boolean | null;
    }[]
  >([]);

  useEffect(() => {
    async function fetchApprovals() {
      const dataApprovals = await getLoopsApprovals(id as string);
      setApprovals(dataApprovals);
    }
    if (id) fetchApprovals();
  }, [id]);

  useEffect(() => {
    if (approvals) {
      const rows = approvals
        .map((approval, index) => {
          return {
            id: approval.ID,
            approved: approval.approved,
            created_at: moment(approval.created_at).format('HH:mm, DD/MM/YYYY')
          };
        })
        // sort by created_at from the newest to the oldest
        .sort((a, b) => {
          return (
            moment(b.created_at, 'HH:mm, DD/MM/YYYY').unix() -
            moment(a.created_at, 'HH:mm, DD/MM/YYYY').unix()
          );
        });
      setRows(rows);
    }
  }, [approvals]);

  return (
    <section className="mb-32">
      <div className="max-w-6xl mx-auto pt-4 sm:pt-12 pb-4 px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:flex-col sm:align-center">
          <h1 className="text-4xl font-extrabold sm:text-center sm:text-6xl">
            Approvals
          </h1>
        </div>
      </div>

      <div className="p-4 pt-8 sm:pt-20 max-w-6xl mx-auto grid">
        <span className="mb-2">
          <button
            className="btn btn-sm btn-accent"
            onClick={() => router.back()}
          >
            Go back
          </button>
        </span>
        <Box
          sx={{ height: 475, width: '100%' }}
          className="text-base-content bg-base-200"
        >
          <DataGrid
            sx={{
              boxShadow: 2,
              border: 2,
              backgroundColor:
                'hsl(var(--b2, var(--b1)) / var(--tw-bg-opacity))',
              color: 'hsl(var(--bc) / var(--tw-text-opacity))'
            }}
            rows={rows}
            columns={columns}
            pageSize={25}
            checkboxSelection={false}
            disableSelectionOnClick
          />
        </Box>
      </div>
    </section>
  );
}
