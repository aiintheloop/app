import { FC, Fragment } from 'react';

import { Dialog, Transition } from '@headlessui/react';
import Link from 'next/link';

interface Props {
  isOpenHelper: boolean;
  setIsOpenHelper: (isOpen: boolean) => void;
}

export const LoopHelper: FC<Props> = ({ isOpenHelper, setIsOpenHelper }) => {
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
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-neutral p-6 text-left align-middle shadow-xl transition-all">
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
                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={() => setIsOpenHelper(false)}
                      className="inline-flex justify-center border border-transparent btn btn-primary normal-case btn-sm focus:outline-none"
                    >
                      OK Got It
                    </button>
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
