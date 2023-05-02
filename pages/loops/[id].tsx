import { getLoopsApprovals } from '@/utils/supabase-client';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Approval } from 'types';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import moment from 'moment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import PendingIcon from '@mui/icons-material/Pending';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', minWidth: 300, flex: 1 },
  {
    field: 'approved',
    headerName: 'Approved',
    minWidth: 150,
    flex: 1,
    sortable: true,
    renderCell: (params) => {
      // use icon instead of text
      if (params.value === true) {
        return (
          <CheckCircleIcon
            titleAccess="Approved"
            className="text-green-500"
            fontSize="medium"
          />
        );
      } else if (params.value === false) {
        return (
          <CancelIcon
            titleAccess="Disapproved"
            className="text-red-500"
            fontSize="medium"
          />
        );
      } else {
        return (
          <PendingIcon
            titleAccess="Pending"
            className="text-yellow-500"
            fontSize="medium"
          />
        );
      }
    }
  },
  {
    field: 'created_at',
    headerName: 'Created',
    minWidth: 150,
    flex: 1,
    sortable: true
  },
  {
    field: 'action',
    headerName: 'Action',
    sortable: false,
    maxWidth: 100,
    flex: 1,
    renderCell: (params) => {
      const router = useRouter();
      const [anchorActionEl, setAnchorActionEl] = useState<null | HTMLElement>(
        null
      );
      const open = Boolean(anchorActionEl);
      const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorActionEl(event.currentTarget);
      };
      const handleClose = () => {
        setAnchorActionEl(null);
      };

      const onClick = (e: { stopPropagation: () => void }) => {
        e.stopPropagation(); // don't select this row after clicking
      };

      return (
        <div>
          <Button
            id="demo-positioned-button"
            className="bg-transparent hover:bg-transparent"
            aria-controls={open ? 'demo-positioned-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
          >
            <MoreVertIcon className="text-zinc-900" />
          </Button>
          <Menu
            id="demo-positioned-menu"
            aria-labelledby="demo-positioned-button"
            anchorEl={anchorActionEl}
            open={open}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'left'
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left'
            }}
          >
            <MenuItem
              onClick={(e) => {
                onClick(e);
                router.push(`/approvals?id=${params.id}`);
              }}
            >
              Approval
            </MenuItem>
          </Menu>
        </div>
      );
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
      const rows = approvals.map((approval, index) => {
        return {
          id: approval.ID,
          approved: approval.approved,
          created_at: moment(approval.created_at).format('HH:mm, DD/MM/YYYY')
        };
      });
      setRows(rows);
    }
  }, [approvals]);

  return (
    <section className="bg-zinc-50 mb-32">
      <div className="max-w-6xl mx-auto pt-4 sm:pt-12 pb-4 px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:flex-col sm:align-center">
          <h1 className="text-4xl font-extrabold text-black sm:text-center sm:text-6xl">
            Approvals
          </h1>
        </div>
      </div>

      <div className="p-4 pt-8 sm:pt-20 max-w-6xl mx-auto">
        <Box sx={{ height: 475, width: '100%' }}>
          <DataGrid
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
