import { useEffect, useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  Grid,
  makeStyles,
  Typography
} from '@material-ui/core';
import { useRouter } from 'next/router';
import { supabase } from '@/utils/supabase-client';
import { ApprovalData } from '../types';
import axios from 'axios';
import Link from 'next/link';

export default function ApprovedFinish() {
  const useStyles = makeStyles({
    root: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    },
    text: {
      fontSize: '1.2rem',
      marginBottom: '1rem'
    },
    content: {
      width: '100%',
      margin: '0.5rem auto'
    },
    buttonContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: '1rem'
    }
  });

  const classes = useStyles();

  return (
    <section className="mb-32">
      <div className="max-w-6xl mx-auto pt-8 sm:pt-24 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:flex-col sm:align-center">
          <h1 className="text-4xl font-extrabold text-base-content text-center sm:text-6xl">
            Approval finished
          </h1>
        </div>
      </div>
      <div className="p-4">
        <div className="max-w-3xl rounded-md m-auto my-8">
          <div className="px-5 py-4 flex flex-col gap-2 justify-center items-center">
            <div className={classes.root}>
              <h3 className="text-2xl font-extrabold text-base-content sm:text-center">
                Thanks for your decision
              </h3>
            </div>
            <button className="btn btn-sm btn-primary w-32">
              <Link href="/loops">Go to Loop</Link>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
