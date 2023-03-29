import React, { useState } from "react";
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

interface EditableTypographyProps {
  initialText: string;
  onChange?: (text: string) => void;
}

const EditableTypography: React.FC<EditableTypographyProps> = ({ initialText, onChange }) => {
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

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {editMode ? (
        <div>
          <textarea value={text} onChange={handleTextChange} style={{ width: '100%', height: '100px', padding: '8px' }} />
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
            <IconButton onClick={handleSaveClick} style={{ backgroundColor: '#4caf50', marginRight: '8px', color: '#fff' }}>
              <SaveIcon />
            </IconButton>
            <IconButton onClick={handleCancelClick} style={{ backgroundColor: '#f44336', color: '#fff' }}>
              <CancelIcon />
            </IconButton>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
          <Typography variant="body1" style={{ marginRight: '16px', width: '100%' }}>{text}</Typography>
          <IconButton onClick={handleEditModeToggle} style={{ backgroundColor: '#2196f3', color: '#fff' }}>
            <EditIcon />
          </IconButton>
        </div>
      )}
    </div>
  );
};

export default EditableTypography;
