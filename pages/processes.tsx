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
import AddIcon from '@mui/icons-material/Add';
import PendingOutlinedIcon from '@mui/icons-material/PendingOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import { Process } from 'types';

interface Props {
  title?: string;
  description?: string;
  footer?: ReactNode;
  children: ReactNode;
  process?: Process;
}

function Card({ title, description, footer, children }: Props) {
  return (
    <div className="border border-zinc-700 max-w-xl rounded-md m-auto">
      <div className="px-5 py-5">
        {title && (
          <div className="flex align-middle content-center justify-between">
            <h3 className="text-2xl mb-1 font-medium">{title}</h3>
            <SettingsOutlinedIcon
              fontSize="medium"
              className="hover:cursor-pointer"
            />
          </div>
        )}
        {description && (
          <p className="text-zinc-90s0 my-2">
            <div
              className={`${
                description.toLowerCase() == 'video' && 'bg-blue-400'
              } ${description.toLowerCase() == 'picture' && 'bg-green-400'}
              ${description.toLowerCase() == 'text' && 'bg-purple-400'}
              } rounded-2xl px-3 py-1 inline-block`}
            >
              {description}
            </div>
          </p>
        )}
        <p className="overflow-scroll h-16">{children}</p>
      </div>
      {footer && (
        <div className="border-t border-zinc-700 bg-zinc-900 p-4 text-zinc-500 rounded-b-md">
          {footer}
        </div>
      )}
    </div>
  );
}

export default function Processes({ user }: { user: User }) {
  const [loading, setLoading] = useState(false);
  const { isLoading, subscription, userDetails, processes } = useUser();

  const handleAddProcess = async () => {};

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
        <section className="max-w-6xl mx-auto">
          <div className="grid grid-cols-3 gap-6">
            <div onClick={handleAddProcess}>
              <div className="border border-zinc-700 max-w-xl h-full rounded-md m-auto hover:cursor-pointer hover:border-zinc-500">
                <div className="px-5 py-5">
                  <div className="flex justify-center items-center text-center py-20">
                    <div className="bg-zinc-800 rounded-full w-9 h-9">
                      <AddIcon className="text-zinc-300" fontSize="large" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {processes?.map((process: Process) => {
              return (
                <div key={process.ident}>
                  <Card
                    process={process}
                    title={process.name}
                    description={process.type}
                    footer={
                      <div className="flex items-start justify-between flex-col sm:flex-row sm:items-center">
                        <p className="pb-4 sm:pb-0">
                          {process.hook === null && (
                            <PendingOutlinedIcon
                              fontSize="medium"
                              color="warning"
                            />
                          )}
                          {process.hook == true && (
                            <CheckCircleOutlinedIcon
                              fontSize="medium"
                              color="success"
                            />
                          )}
                          {process.hook == false && (
                            <ErrorOutlineOutlinedIcon
                              fontSize="medium"
                              color="error"
                            />
                          )}
                        </p>
                        <p className="pb-4 sm:pb-0">{process.tool}</p>
                      </div>
                    }
                  >
                    {process.description}
                  </Card>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </section>
  );
}

{
  /* <div className="border border-zinc-700	max-w-7xl w-full p rounded-md m-auto my-8">
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
        </div> */
}

// function createData(id: string, name: string, webhook: string) {
//   return { id, name, webhook };
// }

// const rows = [
//   createData(
//     '37162ab2-f8d0-402b-b3d3-12062450d3c6',
//     'SocialMediaPost',
//     'https://hook.eu1.make.com/i1qazj139ikkfjkptslmtu02vk9txnr5'
//   ),
//   createData(
//     '37162ab2-f8d0-402b-b3d3-12062450d3c6',
//     'SocialMediaPost',
//     'https://hook.eu1.make.com/i1qazj139ikkfjkptslmtu02vk9txnr5'
//   ),
//   createData(
//     '37162ab2-f8d0-402b-b3d3-12062450d3c6',
//     'SocialMediaPost',
//     'https://hook.eu1.make.com/i1qazj139ikkfjkptslmtu02vk9txnr5'
//   ),
//   createData(
//     '37162ab2-f8d0-402b-b3d3-12062450d3c6',
//     'SocialMediaPost',
//     'https://hook.eu1.make.com/i1qazj139ikkfjkptslmtu02vk9txnr5'
//   )
// ];
