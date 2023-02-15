import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  makeStyles,
  Typography
} from '@material-ui/core';
import { useRouter } from 'next/router';
import { ApprovalData } from '../types';
import axios from 'axios';

export default function ApproveDeclineWithContentView() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [id, setId] = useState<string | null>(null);

  const [approvalData, setApprovalData] = useState<ApprovalData | null>(null);

  useEffect(() => {
    setIsLoading(true);
    if (router.isReady) {
      const { id } = router.query;
      if (id && typeof id == 'string') {
        setId(id);
        fetch(`/api/approvalData?id=${id}`)
          .then((res) => {
            if (res.ok) {
              return res.json();
            }
            throw Error('Request failed');
          })
          .then((approval) => {
            setApprovalData(approval.data);
            setIsLoading(false);
          })
          .catch((error) => {
            setIsError(true);
            setIsLoading(false);
          });
      } else {
        setIsError(true);
      }
    }
  }, [router]);

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

  const handleApprove = () => {
    axios
      .get(`api/approve?id=${id}`)
      .then((response) => {
        router.push('approved');
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleDecline = () => {
    axios
      .get(`api/decline?id=${id}`)
      .then((response) => {
        router.push('approved');
      })
      .catch((error) => {
        console.log(error);
      });
  };

  if (isLoading) {
    return (
      <Grid item xs={12}>
        <Box
          sx={{
            p: 5,
            pt: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <CircularProgress />
        </Box>
      </Grid>
    );
  }

  if (isError) {
    return <p>Could not load Approval</p>;
  }

  if (approvalData && approvalData.approved != null) {
    return (
      <section className="bg-neutral-100 mb-32">
        <div className="max-w-6xl mx-auto pt-8 sm:pt-24 pb-8 px-4 sm:px-6 lg:px-8">
          <div className="sm:flex sm:flex-col sm:align-center">
            <h1 className="text-4xl font-extrabold text-black sm:text-center sm:text-6xl">
              Already approved
            </h1>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-neutral-100 mb-32">
      <div className="max-w-6xl mx-auto pt-8 sm:pt-24 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:flex-col sm:align-center">
          <h1 className="text-4xl font-extrabold text-black sm:text-center sm:text-6xl">
            New Approval
          </h1>
        </div>
      </div>
      <div className="p-4">
        <div className="border border-zinc-700	max-w-3xl w-full p rounded-md m-auto my-8">
          <div className="px-5 py-4">
            <div className={classes.root}>
              <h3 className="text-2xl font-extrabold text-black sm:text-center pb-5">
                Approval for the process x
              </h3>
              <Card className={classes.content}>
                <CardContent className={classes.content}>
                  <Typography variant="body1">
                    {approvalData?.content}
                  </Typography>
                </CardContent>
              </Card>
              <p className={classes.text}>
                Are you sure you want to approve this?
              </p>
              <Grid container spacing={4} className={classes.buttonContainer}>
                <Grid item xs={6} style={{ width: '30%' }}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    onClick={handleApprove}
                    size="small"
                  >
                    Approve
                  </Button>
                </Grid>
                <Grid item xs={6} style={{ width: '30%' }}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="secondary"
                    onClick={handleDecline}
                    size="small"
                  >
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
