import React, { useEffect, useRef, useState } from 'react';
import Typography from '@mui/material/Typography';
import {
  CheckIcon,
  PencilSquareIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

interface EditableTypographyProps {
  initialText: string;
  onChange?: (text: string) => void;
}

const EditableTypography: React.FC<EditableTypographyProps> = ({
  initialText,
  onChange
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [text, setText] = useState<string>(initialText);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [originalText, setOriginalText] = useState<string>(initialText);

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);
  };

  const handleEditModeToggle = () => {
    if (!editMode) {
      setOriginalText(text);
    } else {
      setText(originalText);
    }
    setEditMode(!editMode);
  };

  const handleSaveClick = () => {
    setEditMode(false);
    if (onChange) {
      onChange(text);
    }
  };

  const handleCancelClick = () => {
    setText(originalText);
    setEditMode(false);
  };

  useEffect(() => {
    if (editMode && textareaRef.current) {
      textareaRef.current.style.height = '0px';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = scrollHeight + 'px';
    }
  }, [text, editMode]);

  return (
    <div style={{ alignItems: 'center' }}>
      {editMode ? (
        <div className="flex flex-col gap-1">
          <div className="flex flex-row gap-1 mb-2 justify-end">
            <CheckIcon
              title="Save"
              className="w-6 h-6 cursor-pointer hover:text-success"
              aria-hidden="true"
              onClick={handleSaveClick}
            />
            <XMarkIcon
              title="Cancel"
              className="w-6 h-6 cursor-pointer hover:text-error"
              aria-hidden="true"
              onClick={handleCancelClick}
            />
          </div>
          <textarea
            ref={textareaRef}
            value={text}
            onChange={handleTextChange}
            className="textarea w-full textarea-primary text-base"
          />
        </div>
      ) : (
        <div className="flex flex-col gap-1">
          <button className="flex flex-row gap-1 mb-2 justify-end">
            <PencilSquareIcon
              onClick={handleEditModeToggle}
              className="w-6 h-6 cursor-pointer"
              aria-hidden="true"
            />
          </button>
          <Typography
            variant="body1"
            style={{
              marginRight: '16px',
              width: '100%',
              marginBottom: '12px',
              whiteSpace: 'pre-wrap',
              wordWrap: 'break-word'
            }}
          >
            {text}
          </Typography>
        </div>
      )}
    </div>
  );
};

export default EditableTypography;
