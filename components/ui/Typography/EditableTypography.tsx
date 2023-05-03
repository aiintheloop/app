import React, { useEffect, useRef, useState } from 'react';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
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
        <div>
          <textarea
            ref={textareaRef}
            value={text}
            onChange={handleTextChange}
            className="border border-zinc-600 p-2 rounded-md bg-transparent h-auto outline-0 w-full"
          />
          <div
            style={{
              display: 'flex',
              gap: '4px',
              justifyContent: 'flex-start',
              marginTop: '4px'
            }}
          >
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
        </div>
      ) : (
        <div>
          <Typography
            variant="body1"
            style={{ marginRight: '16px', width: '100%', marginBottom: '4px' }}
          >
            {text}
          </Typography>
          <PencilSquareIcon
            onClick={handleEditModeToggle}
            className="w-6 h-6 cursor-pointer"
            aria-hidden="true"
          />
        </div>
      )}
    </div>
  );
};

export default EditableTypography;
