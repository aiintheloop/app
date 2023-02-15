import { useState, ReactNode, useEffect } from 'react';
import { useUser } from 'utils/useUser';

import AddIcon from '@mui/icons-material/Add';
import PendingOutlinedIcon from '@mui/icons-material/PendingOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import { Listbox, Menu } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { TextField } from '@mui/material';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import Image from 'next/image';
import { toast } from 'react-toastify';
import FormatAlignLeftOutlinedIcon from '@mui/icons-material/FormatAlignLeftOutlined';
import VideoCameraBackOutlinedIcon from '@mui/icons-material/VideoCameraBackOutlined';
import InsertPhotoOutlinedIcon from '@mui/icons-material/InsertPhotoOutlined';
import { Loop } from '../models/loop';
import {
  deleteUserLoops,
  getUserLoops,
  insertUserLoops
} from '@/utils/supabase-client';
import {
  capitalizeFirstLetter,
  generateUUID,
  getCurrentDate
} from '@/utils/helpers';

interface Props {
  title?: string | null;
  description?: string | null;
  footer?: ReactNode;
  children: ReactNode;
  process?: Loop;
  loop: Loop;
}

function Card({ title, description, footer, children, loop }: Props) {
  const { setLoops, user } = useUser();
  const handleDeleteLoop = async () => {
    if (!user) return;
    await toast.promise(deleteUserLoops(loop.ident), {
      pending: 'Deleting history...',
      success: 'History deleted',
      error: 'Error deleting history'
    });
    await getUserLoops(user?.id).then((res) => setLoops(res));
  };

  return (
    <div className="border border-zinc-700 max-w-xl rounded-md m-auto">
      <div className="px-5 py-5">
        {title && (
          <div className="flex align-middle content-center justify-between">
            <h3 className="text-2xl mb-1 font-medium">{title}</h3>
            <Menu as="div" className="relative inline-block text-left">
              <div>
                <Menu.Button className="inline-flex w-full justify-center rounded-md text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
                  <SettingsOutlinedIcon
                    fontSize="medium"
                    className="hover:cursor-pointer text-zinc-900"
                  />
                </Menu.Button>
              </div>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 mt-2 w-20 origin-top-right divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="px-1 py-1 ">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          className={`${
                            active ? 'bg-zinc-500 text-white' : 'text-zinc-900'
                          } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                        >
                          Edit
                        </button>
                      )}
                    </Menu.Item>
                  </div>

                  <div className="px-1 py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          className={`${
                            active ? 'bg-zinc-500 text-white' : 'text-zinc-900'
                          } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                          onClick={handleDeleteLoop}
                        >
                          Delete
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
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
              {capitalizeFirstLetter(description)}
            </div>
          </p>
        )}
        <p className="overflow-scroll h-16">{children}</p>
      </div>
      {footer && (
        <div className="border-t border-zinc-700 bg-zinc-200 p-4 text-zinc-500 rounded-b-md">
          {footer}
        </div>
      )}
    </div>
  );
}

export default function Loops() {
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [automation, setAutomation] = useState<string>('');
  const [automationType, setAutomationType] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [webhookAccept, setWebhookAccept] = useState<string>('');
  const [webhookDecline, setWebhookDecline] = useState<string>('');
  const { user, loops, setLoops } = useUser();

  const handleTitle = (e: any) => {
    setTitle(e.target.value);
  };

  const handleDescription = (e: any) => {
    setDescription(e.target.value);
  };

  const handleWebhookAccept = (e: any) => {
    setWebhookAccept(e.target.value);
  };

  const handleWebhookDecline = (e: any) => {
    setWebhookDecline(e.target.value);
  };

  const handleAddProcess = async () => {
    if (!user) return alert('You need to be logged in to do that!');
    setIsOpen(true);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    if (!user) return alert('You need to be logged in to do that!');
    if (!automation) return toast.error('Please select an automation!');
    if (!automationType) return toast.error('Please select the type!');
    if (!title) return toast.error('Please enter a title!');
    if (!description) return toast.error('Please enter a description!');

    const loop = {
      ident: generateUUID(),
      created_at: getCurrentDate(),
      name: title,
      user_id: user.id,
      description,
      tool: automation,
      type: automationType,
      hook: null,
      acceptHook: webhookAccept,
      declineHook: webhookDecline
    };

    try {
      await insertUserLoops(user.id, loop);
      await getUserLoops(user.id).then((res) => setLoops(res));
      toast.success('Loops added successfully!');
      setIsOpen(false);
      setLoading(false);
    } catch (error) {
      toast.error('Something went wrong!');
      setLoading(false);
      setIsOpen(false);
    }
  };

  return (
    <section className="bg-neutral-100 mb-32">
      <div className="max-w-6xl mx-auto pt-8 sm:pt-24 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:flex-col sm:align-center">
          <h1 className="text-4xl font-extrabold text-black sm:text-center sm:text-6xl">
            Process
          </h1>
          <p className="mt-5 text-xl text-zinc-800 sm:text-center sm:text-2xl max-w-2xl m-auto">
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
                    <div className="bg-zinc-200 rounded-full w-9 h-9">
                      <AddIcon className="text-zinc-900" fontSize="large" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <ModalForm
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              submit={handleSubmit}
              data={{
                automation,
                automationType,
                title,
                description,
                webhookAccept,
                webhookDecline
              }}
              setAutomation={setAutomation}
              setAutomationType={setAutomationType}
              setTitle={handleTitle}
              setDescription={handleDescription}
              setWebhookAccept={handleWebhookAccept}
              setWebhookDecline={handleWebhookDecline}
            />

            {loops?.map((loop: Loop) => {
              return (
                <div key={loop.ident}>
                  <Card
                    loop={loop}
                    process={loop}
                    title={loop.name}
                    description={loop.type}
                    footer={
                      <div className="flex items-start justify-between flex-col sm:flex-row sm:items-center">
                        <p className="pb-4 sm:pb-0">
                          {loop.hook === null && (
                            <PendingOutlinedIcon
                              fontSize="medium"
                              color="warning"
                            />
                          )}
                          {loop.hook == true && (
                            <CheckCircleOutlinedIcon
                              fontSize="medium"
                              color="success"
                            />
                          )}
                          {loop.hook == false && (
                            <ErrorOutlineOutlinedIcon
                              fontSize="medium"
                              color="error"
                            />
                          )}
                        </p>
                        <p className="pb-4 sm:pb-0">
                          {capitalizeFirstLetter(loop.tool as string)}
                        </p>
                      </div>
                    }
                  >
                    {loop.description}
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

interface ModalFormProps {
  isOpen: boolean;
  setIsOpen: (value: any) => void;
  submit: (e: any) => void;
  setAutomation: (value: any) => void;
  setAutomationType: (value: any) => void;
  setTitle: (value: any) => void;
  setDescription: (value: any) => void;
  setWebhookAccept: (value: any) => void;
  setWebhookDecline: (value: any) => void;
  data: {
    automation: string;
    automationType: string;
    title: string;
    description: string;
    webhookAccept: string;
    webhookDecline: string;
  };
}

export function ModalForm({
  data,
  isOpen,
  setIsOpen,
  submit,
  setAutomation,
  setAutomationType,
  setTitle,
  setDescription,
  setWebhookAccept,
  setWebhookDecline
}: ModalFormProps) {
  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setIsOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    New Loop
                  </Dialog.Title>
                  <div className="mt-2">
                    <form onSubmit={submit} className="flex flex-col space-y-4">
                      <List onChange={setAutomation} options={automation} />
                      <List onChange={setAutomationType} options={type} />
                      <TextField
                        onChange={setTitle}
                        label="Title"
                        className="ring-0 border-0 outline-none"
                        size="small"
                        value={data.title}
                        required
                      />
                      <TextField
                        onChange={setDescription}
                        label="Description"
                        multiline
                        className="ring-0 border-0 outline-none"
                        rows={4}
                        value={data.description}
                        required
                      />
                      {data.automation === 'webhook' && (
                        <>
                          <TextField
                            onChange={setWebhookAccept}
                            label="Webhook Accept"
                            className="ring-0 border-0 outline-none"
                            size="small"
                            value={data.webhookAccept}
                          />
                          <TextField
                            onChange={setWebhookDecline}
                            label="Webhook Decline"
                            className="ring-0 border-0 outline-none"
                            size="small"
                            value={data.webhookDecline}
                          />
                        </>
                      )}

                      <div className="mt-4">
                        <button
                          type="submit"
                          onClick={submit}
                          className="inline-flex justify-center rounded-md border border-transparent bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-100 hover:bg-zinc-700 focus:outline-none"
                        >
                          Create Loop
                        </button>
                      </div>
                    </form>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}

const automation = [
  { id: 1, value: '', name: 'Select Automation', logo: '' },
  { id: 2, value: 'make', name: 'Make', logo: '/make.png' },
  { id: 3, value: 'zappier', name: 'Zappier', logo: '/zapier.svg' },
  { id: 4, value: 'webhook', name: 'Webhook', logo: '/webhook.svg' }
];

const type = [
  { id: 1, value: '', name: 'Select Type' },
  { id: 2, value: 'text', name: 'Text' },
  { id: 3, value: 'picture', name: 'Picture' },
  { id: 4, value: 'video', name: 'Video' }
];

interface ListProps {
  onChange: (status: string) => void;
  options: Option[];
}

interface Option {
  id: number;
  value: string;
  logo?: string;
  icon?: any;
  name: string;
}

export function List({ onChange, options }: ListProps) {
  const [selected, setSelected] = useState(options[0]);

  useEffect(() => {
    onChange(selected.value);
  }, [selected]);

  return (
    <Listbox value={selected} onChange={setSelected}>
      <div className="relative mt-1">
        <Listbox.Button className="relative w-full cursor-pointer rounded-md bg-white py-3 pl-3 pr-10 text-left shadow-md focus:outline-none  sm:text-sm">
          <span className="block truncate text-sm">{selected.name}</span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronUpDownIcon
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </span>
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute z-50 mt-2 max-h-60 w-full overflow-auto rounded-md bg-zinc-200 py-1 text-base shadow-lg focus:outline-none sm:text-sm">
            {options.map((option) => (
              <Listbox.Option
                key={option.id}
                className={({ active }) =>
                  `relative cursor-pointer select-none py-3 pl-10 pr-4 ${
                    active ? 'bg-zinc-100 text-zinc-900' : 'text-gray-900'
                  }`
                }
                value={option}
              >
                {({ selected }) => (
                  <div className="flex items-center gap-2">
                    {option.logo && (
                      <Image src={option.logo} width={18} height={18} />
                    )}
                    {option.value === 'text' && (
                      <FormatAlignLeftOutlinedIcon
                        style={{
                          width: 18,
                          height: 18
                        }}
                      />
                    )}
                    {option.value === 'picture' && (
                      <InsertPhotoOutlinedIcon
                        style={{
                          width: 18,
                          height: 18
                        }}
                      />
                    )}
                    {option.value === 'video' && (
                      <VideoCameraBackOutlinedIcon
                        style={{
                          width: 18,
                          height: 18
                        }}
                      />
                    )}
                    <span
                      className={`block truncate ${
                        selected ? 'font-medium' : 'font-normal'
                      }`}
                    >
                      {option.name}
                    </span>
                    {selected ? (
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-900">
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    ) : null}
                  </div>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
}
