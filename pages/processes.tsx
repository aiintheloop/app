import Link from 'next/link';
import { useState, ReactNode } from 'react';

import LoadingDots from 'components/ui/LoadingDots';
import Button from 'components/ui/Button';
import { useUser } from 'utils/useUser';
import { postData } from 'utils/helpers';

import { User } from '@supabase/supabase-js';
import { withPageAuth } from '@supabase/auth-helpers-nextjs';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

interface Props {
  title: string;
  description?: string;
  footer?: ReactNode;
  children: ReactNode;
}

export default function Processes({ user }: { user: User }) {
  const [loading, setLoading] = useState(false);
  const { isLoading, subscription, userDetails } = useUser();

  function createData(
    id: string,
    name: string,
    webhook: string
  ) {
    return {id, name, webhook};
  }

  const rows = [
    createData('37162ab2-f8d0-402b-b3d3-12062450d3c6', 'SocialMediaPost', "https://hook.eu1.make.com/i1qazj139ikkfjkptslmtu02vk9txnr5"),
    createData('37162ab2-f8d0-402b-b3d3-12062450d3c6', 'SocialMediaPost', "https://hook.eu1.make.com/i1qazj139ikkfjkptslmtu02vk9txnr5"),
    createData('37162ab2-f8d0-402b-b3d3-12062450d3c6', 'SocialMediaPost', "https://hook.eu1.make.com/i1qazj139ikkfjkptslmtu02vk9txnr5"),
    createData('37162ab2-f8d0-402b-b3d3-12062450d3c6', 'SocialMediaPost', "https://hook.eu1.make.com/i1qazj139ikkfjkptslmtu02vk9txnr5")
  ];


  return (
    <section className="bg-black mb-32">
      <div className="max-w-6xl mx-auto pt-8 sm:pt-24 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:flex-col sm:align-center">
          <h1 className="text-4xl font-extrabold text-white sm:text-center sm:text-6xl">
            Process
          </h1>
          <p className="mt-5 text-xl text-zinc-200 sm:text-center sm:text-2xl max-w-2xl m-auto">
            All your possible Approvals
          </p>
        </div>
      </div>
      <div className="p-4">
        <div className="border border-zinc-700	max-w-3xl w-full p rounded-md m-auto my-8">
        <div className="px-5 py-4">
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell align="right">Name</TableCell>
                <TableCell align="right">Webhook</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow
                  key={row.name}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.id}
                  </TableCell>
                  <TableCell align="left">{row.name}</TableCell>
                  <TableCell align="left">{row.webhook}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        </div>
        </div>
      </div>
    </section>
  );
}
