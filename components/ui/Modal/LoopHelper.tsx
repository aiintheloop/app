import { FC, Fragment, useState } from 'react';

import { Dialog, Transition } from '@headlessui/react';
import Link from 'next/link';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import { useUser } from '@/utils/useUser';
import { toast } from 'react-toastify';

interface Props {
  isOpenHelper: boolean;
  setIsOpenHelper: (isOpen: boolean) => void;
}

export const LoopHelper: FC<Props> = ({ isOpenHelper, setIsOpenHelper }) => {
  const { userDetails } = useUser();
  const [isShowAgain, setIsShowAgain] = useState<boolean>(false);
  const [hideApiKey, setHideApiKey] = useState<boolean>(true);

  const handleOk = () => {
    setIsOpenHelper(false);
    if (isShowAgain) {
      localStorage.setItem('isShowAgain', 'false');
    }
  };

  const handleCopy = () => {
    toast.info('API Key copied to clipboard');
  };

  return (
    <>
      <Transition appear show={isOpenHelper} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setIsOpenHelper(false)}
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
            <div className="fixed inset-0 bg-base-300 bg-opacity-25 backdrop-blur-sm" />
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
                <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-neutral p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title as="h3" className="text-lg pb-4 leading-6">
                    Next steps
                  </Dialog.Title>
                  <Dialog.Description className="my-2 mx-auto">
                    <div>
                      <ol className="list-decimal list-inside">
                        <li className="mb-2">
                          Login to{' '}
                          <Link
                            href="http://make.com"
                            className="link link-accent"
                          >
                            Make
                          </Link>
                        </li>
                        <li className="mb-2">
                          Create a new Scenario with our AI2Loop App
                        </li>
                        <li className="mb-2">Choose the AI2Loop trigger</li>
                        <li className="mb-2">
                          We will present you the Loop in a dropdown
                        </li>
                      </ol>
                    </div>
                  </Dialog.Description>

                  <div className="flex items-center my-4 justify-between">
                    <p className="bg-base-300 px-2 py-1 rounded-md">
                      {hideApiKey
                        ? '*********************'
                        : userDetails?.api_key
                        ? userDetails?.api_key
                        : ''}
                    </p>

                    <div className="flex flex-row gap-2 items-center">
                      {hideApiKey ? (
                        <VisibilityIcon
                          style={{ cursor: 'pointer' }}
                          onClick={() => setHideApiKey(false)}
                        />
                      ) : (
                        <VisibilityOffIcon
                          style={{ cursor: 'pointer' }}
                          onClick={() => setHideApiKey(true)}
                        />
                      )}

                      <CopyToClipboard
                        text={String(userDetails?.api_key)}
                        onCopy={() => handleCopy()}
                      >
                        <ContentPasteIcon style={{ cursor: 'pointer' }} />
                      </CopyToClipboard>
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="label cursor-pointer max-w-[17rem]">
                      <span className="label-text">
                        Don't show me this message again
                      </span>
                      <input
                        type="checkbox"
                        checked={isShowAgain}
                        onChange={() => setIsShowAgain(!isShowAgain)}
                        className="checkbox checkbox-primary checkbox-sm"
                      />
                    </label>

                    <div className="flex flex-row items-center gap-2">
                      <button
                        type="button"
                        onClick={handleOk}
                        className="inline-flex justify-center border border-transparent btn btn-primary normal-case btn-sm focus:outline-none"
                      >
                        OK Got It
                      </button>
                      <a
                        href={'#'}
                        className="link link-secondary text-sm"
                        target="_blank"
                      >
                        Video help
                      </a>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};
