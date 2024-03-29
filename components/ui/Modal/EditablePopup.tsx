import React, { useState, Fragment } from 'react';

import { Dialog, Transition } from '@headlessui/react';

interface EditablePopupProps {
  data: Array<Record<string, string>>;
  open: boolean;
  onClose: () => void;
  onSave: (data: Array<Record<string, string>>) => void;
}

const EditablePopup: React.FC<EditablePopupProps> = ({
  data,
  open,
  onClose,
  onSave
}) => {
  const [editableData, setEditableData] =
    useState<Array<Record<string, string>>>(data);

  const handleFieldChange = (identifier: string, newPrompt: string) => {
    setEditableData((prevData) => {
      return prevData.map(item => {
        if (item.identifier === identifier) {
          return { ...item, prompt: newPrompt };
        }
        return item;
      });
      }
    );
  };

  const handleSaveClick = () => {
    onSave(editableData);
    onClose();
  };

  const handleCancelClick = () => {
    setEditableData(data);
    onClose();
  };

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
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
                  Edit Data
                </Dialog.Title>
                <span className="text-sm">
                  Edit the prompts below and click Save to reloop.
                </span>
                <section className="my-2 mx-auto">
                  <section>
                    {editableData.map((obj) => (
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text">{obj["identifier"]}</span>
                          </label>
                          <textarea
                        key={obj["identifier"]}
                        value={obj["prompt"]}
                        onChange={(event) =>
                          handleFieldChange(obj["identifier"], event.target.value)
                        }
                        placeholder={obj["identifier"]}
                        className="textarea textarea-primary w-full"
                      />
                      </div>
                    ))}
                  </section>
                </section>
                <div className="mt-4">
                  <div className="grid grid-cols-2 w-48 gap-2 mx-auto">
                    <button
                      className="btn btn-md btn-error"
                      onClick={handleCancelClick}
                    >
                      Cancel
                    </button>
                    <button
                      className="btn btn-md btn-success"
                      onClick={handleSaveClick}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default EditablePopup;
