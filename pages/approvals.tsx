import { useEffect, useState } from 'react';
import {
  Box,
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
import moment from 'moment';
import { TextField } from '@mui/material';
import { capitalizeFirstLetter } from '@/utils/helpers';
import { toast } from 'react-toastify';
import { getApprovals, updateApprovals } from '@/utils/supabase-client';
import Button from '@/components/ui/Button/Button';
import Image from 'next/image';
import EditableTypography from '@/components/ui/Typography/EditableTypography';
import EditablePopup from '@/components/ui/Modal/EditablePopup';
import { Prompt } from '../models/prompt';

export default function ApproveDeclineWithContentView() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [id, setId] = useState<string | null>(null);
  const [content, setContent] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [prompts, setPrompts] = useState<Prompt[] | []>([]);

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
            if (approval.data?.prompt) {
              setPrompts(approval.data?.prompt);
            }
            if(approval.data?.content) {
              setContent(approval.data?.content)
            }
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
      marginTop: '2rem',
      gap: '1rem'
    }
  });

  const classes = useStyles();

  const handleApprove = async () => {
    await axios
      .post(`api/approve?id=${id}`,{"content" : content})
      .then((response) => {
        router.push('approved');
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleTextChange = (content: string) => {
    setContent(content);
  };

  const handleDecline = async () => {
    await axios
      .get(`api/decline?id=${id}`)
      .then((response) => {
        router.push('approved');
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleSave = async (newData: Prompt[]) => {
    setPrompts(newData);
    axios
      .post(`api/reloop?id=${id}`,{"content" : content})
      .then((response) => {
        router.push('approved');
      })
      .catch((error) => {
        console.log(error);
      });


  };

  const handleUpdate = async () => {

    if (!prompts) toast.error('Please enter a prompt');
    /*
    const approval = await getApprovals(approvalData?.ID as string);

    if (!approval) return toast.error('Error updating approvals');

    approval.prompt = prompts;

    await toast.promise(updateApprovals(approval.ID, approval), {
      pending: 'Updating approvals...',
      success: 'Approvals updated',
      error: 'Error updating approvals'
    });*/
    /*
    await fetch(`/api/approvalData?id=${id}`)
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw Error('Request failed');
      })
      .then((approval) => {
        setApprovalData(approval.data);
        if (approval.data?.prompt) setPrompt(approval.data?.prompt);
        setIsLoading(false);
      })
      .catch((error) => {
        setIsError(true);
        setIsLoading(false);
      });*/
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
      <section className="bg-zinc-50 mb-32">
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
    <section className="bg-zinc-50 mb-32">
      <EditablePopup data={prompts} open={open} onClose={() => setOpen(false)} onSave={handleSave} />
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
            <div className="flex flex-col justify-start p-4">
              <h3 className="text-2xl font-extrabold text-black sm:text-left pb-1">
                {approvalData?.name}
              </h3>
              {approvalData?.type && (
                <p className="text-zinc-900 pb-1">
                  <div
                    className={`${
                      approvalData?.type.toLowerCase() == 'video' &&
                      'bg-blue-400'
                    } ${
                      approvalData?.type.toLowerCase() == 'picture' &&
                      'bg-green-400'
                    }
            ${approvalData?.type.toLowerCase() == 'text' && 'bg-purple-400'}
            } rounded-2xl px-3 py-1 inline-block`}
                  >
                    {capitalizeFirstLetter(approvalData?.type)}
                  </div>
                </p>
              )}

              <span className="pb-5 text-zinc-700">
                {approvalData?.created_at &&
                  moment(`${approvalData.created_at}`).format('MMMM Do YYYY')}
              </span>
              <div className="flex flex-col gap-2 pb-10">
                <span className="font-bold">Output</span>

                <Card
                  style={{
                    backgroundColor: 'transparent',
                    boxShadow: 'none'
                  }}
                >
                  <CardContent
                    className="whitespace-pre-wrap text-zinc-700"
                    style={{
                      padding: '0'
                    }}
                  >

                    {approvalData?.type?.toLowerCase() == 'text' && (
                      <EditableTypography initialText={content} onChange={handleTextChange}/>
                      )}
                    {approvalData?.type?.toLowerCase() == 'video' && (
                      <video
                        controls
                        className="w-full"
                        src={approvalData?.content as string}
                      />
                    )}
                    {approvalData?.type?.toLowerCase() == 'picture' && (
                      <Image
                        src={approvalData?.content as string}
                        width={500}
                        height={500}
                        alt={`${approvalData?.name}`}
                      />
                    )}
                  </CardContent>
                </Card>
              </div>

              <Grid container spacing={4} className={classes.buttonContainer}>
                <Button onClick={handleApprove} className="bg-green-600">
                  Approve
                </Button>
                <Button  onClick={() => setOpen(true)} className="bg-yellow-600">
                  Update
                </Button>
                <Button onClick={handleDecline} className="bg-red-600">
                  Decline
                </Button>
              </Grid>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
