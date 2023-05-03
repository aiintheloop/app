import { useState, ReactNode, useEffect } from 'react';
import { useUser } from 'utils/useUser';

import AddIcon from '@mui/icons-material/Add';
import PendingOutlinedIcon from '@mui/icons-material/PendingOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
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
import { Loop } from 'models/loop';
import {
  deleteUserLoops,
  getUserLoops,
  insertUserLoops,
  updateUserLoops
} from '@/utils/supabase-client';
import {
  capitalizeFirstLetter,
  generateUUID,
  getCurrentDate
} from '@/utils/helpers';
import { Settings } from '@mui/icons-material';
import Link from 'next/link';

interface Props {
  title?: string | null;
  description?: string | null;
  footer?: ReactNode;
  children: ReactNode;
  process?: Loop;
  loop: Loop;
  setIsOpen: (isOpen: boolean) => void;
  setIsEdit: (isEdit: boolean) => void;
  selectedEditLoops: (loop: Loop) => void;
}

function Card({
  title,
  description,
  footer,
  children,
  loop,
  setIsEdit,
  setIsOpen,
  selectedEditLoops
}: Props) {
  const { setLoops, user } = useUser();
  const handleDeleteLoop = async () => {
    if (!user) return;
    await toast.promise(deleteUserLoops(loop.ident), {
      pending: 'Deleting Loop...',
      success: 'Loop deleted',
      error: 'Error deleting loop'
    });
    await getUserLoops(user?.id).then((res) => setLoops(res));
  };

  return (
    <div className="border border-zinc-300 max-w-xl rounded-md m-auto">
      <div className="px-5 py-5">
        {title && (
          <div className="flex align-middle content-center justify-between">
            <Link href={`/loops/${loop.ident}`}>
              <h3 className="text-2xl mb-1 font-medium cursor-pointer hover:text-zinc-600 block overflow-hidden overflow-ellipsis w-full whitespace-nowrap">
                {title}
              </h3>
            </Link>
            <Menu as="div" className="relative inline-block text-left">
              <div>
                <Menu.Button className="inline-flex w-full justify-center rounded-md text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
                  <Settings
                    fontSize="medium"
                    className="hover:cursor-pointer text-zinc-600"
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
                <Menu.Items className="absolute right-0 mt-2 w-20 origin-top-right divide-gray-100 rounded-md bg-zinc-100 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="px-1 py-1 ">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          className={`${
                            active
                              ? 'bg-zinc-300 text-zinc-900'
                              : 'text-zinc-900'
                          } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                          onClick={() => {
                            selectedEditLoops(loop);
                            setIsEdit(true);
                            setIsOpen(true);
                          }}
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
                            active
                              ? 'bg-zinc-300 text-zinc-900'
                              : 'text-zinc-900'
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
          <p className="text-zinc-100 my-2">
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
        <p className="overflow-scroll scrollbar-hide h-16 mt-4">{children}</p>
      </div>
      {footer && (
        <div className="border-t border-zinc-300 p-4 text-zinc-500 rounded-b-md">
          {footer}
        </div>
      )}
    </div>
  );
}

export default function Loops() {
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedEditLoops, setSelectedEditLoops] = useState<Loop>();
  const [automation, setAutomation] = useState<string>('');
  const [automationType, setAutomationType] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [webhookAccept, setWebhookAccept] = useState<string>('');
  const [webhookDecline, setWebhookDecline] = useState<string>('');
  const { user, loops, setLoops } = useUser();

  useEffect(() => {
    if (selectedEditLoops && isEdit) {
      setTitle(selectedEditLoops?.name || '');
      setDescription(selectedEditLoops?.description || '');
      setAutomation(selectedEditLoops?.tool || '');
      setAutomationType(selectedEditLoops?.type || '');
      setWebhookAccept(selectedEditLoops?.acceptHook || '');
      setWebhookDecline(selectedEditLoops?.declineHook || '');
    }
    if (!isOpen && !isEdit) {
      setTitle('');
      setDescription('');
      setAutomation('');
      setAutomationType('');
      setWebhookAccept('');
      setWebhookDecline('');
    }
    if (!isOpen) setIsEdit(false);
  }, [isEdit, isOpen, selectedEditLoops]);

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
    if (!title) return toast.error('Please write a title!');
    if (!description) return toast.error('Please write a description!');
    if (automation == 'webhook') {
      if (!webhookAccept)
        return toast.error('Please write the webhook accept!');
      if (!webhookDecline)
        return toast.error('Please write the webhook decline!');
    }

    if (isEdit) {
      const loop = {
        ident: selectedEditLoops?.ident as string,
        created_at: selectedEditLoops?.created_at as string,
        name: title,
        user_id: user.id,
        description,
        tool: automation,
        type: automationType,
        hook: selectedEditLoops?.hook,
        acceptHook: webhookAccept,
        declineHook: webhookDecline
      };

      try {
        await updateUserLoops(selectedEditLoops?.ident as string, loop);
        await getUserLoops(user.id).then((res) => setLoops(res));
        toast.success('Loops updated successfully!');
        setIsOpen(false);
        setIsEdit(false);
        setLoading(false);
      } catch (error) {
        toast.error('Something went wrong!');
        setLoading(false);
        setIsOpen(false);
        setIsEdit(false);
      }
    } else {
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
    }
  };

  return (
    <section className="mb-32">
      <div className="max-w-6xl mx-auto pt-4 sm:pt-12 pb-4 px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:flex-col sm:align-center">
          <h1 className="text-4xl font-extrabold text-black sm:text-center sm:text-6xl">
            Loops
          </h1>
          <p className="mt-5 text-xl text-zinc-800 sm:text-center sm:text-2xl max-w-2xl m-auto">
            Configure your loops
          </p>
        </div>
      </div>
      <div className="p-4 pt-8 sm:pt-20">
        <section className="max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-3 gap-6 m-auto">
            <div onClick={handleAddProcess}>
              <div className="border border-zinc-300 max-w-xl h-full rounded-md m-auto hover:cursor-pointer hover:border-zinc-400">
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
              isEdit={isEdit}
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
                    selectedEditLoops={setSelectedEditLoops}
                    setIsEdit={setIsEdit}
                    setIsOpen={setIsOpen}
                    loop={loop}
                    process={loop}
                    title={loop.name}
                    description={loop.type}
                    footer={
                      <div className="flex items-start justify-between flex-col sm:flex-row sm:items-center">
                        <p className="pb-4 sm:pb-0">
                          {loop.acceptHook && loop.declineHook && (
                            <CheckCircleOutlinedIcon
                              fontSize="medium"
                              className="text-success"
                              width={24}
                              height={24}
                            />
                          )}
                          {(!loop.acceptHook || !loop.declineHook) && (
                            <ErrorOutlineOutlinedIcon
                              fontSize="medium"
                              className="text-error"
                              width={24}
                              height={24}
                            />
                          )}
                        </p>
                        <Image
                          src={
                            loop.tool !== 'make'
                              ? `/${loop.tool}.svg`
                              : '/make.png'
                          }
                          width={24}
                          height={24}
                        />
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
  isEdit: boolean;
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
  isEdit,
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
                    className="text-lg pb-4 font-medium leading-6 text-gray-900"
                  >
                    New Loop
                  </Dialog.Title>
                  <div className="mt-2">
                    <form onSubmit={submit} className="flex flex-col space-y-4">
                      <List
                        onChange={setAutomation}
                        options={automation}
                        data={capitalizeFirstLetter(data.automation)}
                      />
                      <List
                        onChange={setAutomationType}
                        options={type}
                        data={capitalizeFirstLetter(data.automationType)}
                      />
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
                        rows={6}
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
                            required
                            value={data.webhookAccept}
                          />
                          <TextField
                            onChange={setWebhookDecline}
                            label="Webhook Decline"
                            className="ring-0 border-0 outline-none"
                            size="small"
                            required
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
                          {isEdit ? 'Update Loop' : 'Create Loop'}
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
  { id: 3, value: 'zapier', name: 'Zapier', logo: '/zapier.svg' },
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
  data?: string;
}

interface Option {
  id: number;
  value: string;
  logo?: string;
  icon?: any;
  name: string;
}

export function List({ onChange, options, data }: ListProps) {
  const [selected, setSelected] = useState(options[0]);

  useEffect(() => {
    if (selected.value) onChange(selected.value);
  }, [selected]);

  return (
    <Listbox value={selected} onChange={setSelected}>
      <div className="relative mt-1">
        <Listbox.Button className="relative w-full cursor-pointer rounded-md bg-white py-3 pl-3 pr-10 text-left shadow-md focus:outline-none  sm:text-sm">
          <span className="block truncate text-sm">
            {data || selected.name}
          </span>
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
