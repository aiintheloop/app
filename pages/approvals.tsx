import Link from 'next/link';
import { useState, ReactNode, useEffect } from 'react';

import LoadingDots from 'components/ui/LoadingDots';
import { useUser } from 'utils/useUser';
import { postData } from 'utils/helpers';

import { User } from '@supabase/supabase-js';
import { withPageAuth } from '@supabase/auth-helpers-nextjs';
import { Grid, makeStyles } from '@material-ui/core';
import { Button, Card, CardContent, Typography } from '@material-ui/core';
import { useRouter } from 'next/router';
import { supabase } from '@/utils/supabase-client';
import { Approval } from '../types';
import axios from 'axios';

export default function ApproveDeclineWithContentView() {
  const router = useRouter()
  const {id} = router.query

  const [approval, setApproval] = useState<Approval | null>(null);

  const getApproval = (id : string) => supabase.from('approvals').select().eq('ID',id).single();
  const getProcces = (id : string) => supabase.from('processes').select().eq('ID',id).single();

  useEffect(() => {
      if(id && typeof id == 'string') {
        Promise.allSettled([getApproval(id)]).then(
          (results) => {
            const approval = results[0];
            console.log(approval.value.data)
            if (approval.status === 'fulfilled') {
              setApproval(approval.value.data);
            }
          }
        );
      }
  }, [id]);


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
    },
  });

    const classes = useStyles();

    const handleApprove = () => {
      console.log(id)
      supabase.from('approvals').update({approved : true}).eq('ID', id).then(() => {
          supabase.from('processes').select().eq('ID' ,approval?.process_id).single().then((res) => {
              axios.post(res.data.webhook, approval?.content)
                .then(response => {
                  console.log(response)
                })
                .catch(error => {
                  console.log(error)
                })
          })
      }
      )
    };

    const handleDecline = () => {
      supabase.from('approvals').update({approved : false}).eq('ID', id).then()
    };

    if(approval && approval.approved != null) {
      return (
        <section className="bg-black mb-32">
          <div className="max-w-6xl mx-auto pt-8 sm:pt-24 pb-8 px-4 sm:px-6 lg:px-8">
            <div className="sm:flex sm:flex-col sm:align-center">
              <h1 className="text-4xl font-extrabold text-white sm:text-center sm:text-6xl">
                Allready approved
              </h1>
            </div>
          </div>
        </section>
      )
    }

  return (
    <section className="bg-black mb-32">
      <div className="max-w-6xl mx-auto pt-8 sm:pt-24 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:flex-col sm:align-center">
          <h1 className="text-4xl font-extrabold text-white sm:text-center sm:text-6xl">
            New Approval
          </h1>
        </div>
      </div>
      <div className="p-4">
        <div className="border border-zinc-700	max-w-3xl w-full p rounded-md m-auto my-8">
          <div className="px-5 py-4">
            <div className={classes.root}>
              <h3 className="text-2xl font-extrabold text-white sm:text-center pb-5">
                Approval for the proccess x
              </h3>
              <Card className={classes.content}>
                <CardContent className={classes.content}>
                  <Typography variant="body1">{approval?.content}</Typography>
                </CardContent>
              </Card>
              <p className={classes.text}>Are you sure you want to approve this?</p>
              <Grid container spacing={4} className={classes.buttonContainer}>
                <Grid item xs={6} style={{width: '30%'}}>
                  <Button fullWidth variant="contained" color="primary" onClick={handleApprove} size="small">
                    Approve
                  </Button>
                </Grid>
                <Grid item xs={6} style={{width: '30%'}}>
                  <Button fullWidth variant="contained" color="secondary" onClick={handleDecline} size="small">
                    Decline
                  </Button>
                </Grid>
              </Grid>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
