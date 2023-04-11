import React, { useState } from "react";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { Prompt } from '../../../models/prompt';

interface EditablePopupProps {
  data: Prompt[];
  open: boolean;
  onClose: () => void;
  onSave: (data: Prompt[]) => void;
}

const EditablePopup: React.FC<EditablePopupProps> = ({ data, open, onClose, onSave }) => {
  const [editableData, setEditableData] = useState<Prompt[]>(data);

  const handleFieldChange = (id: string, value: string) => {
    const newData = editableData.map(prompt => {
      if (prompt.id === id) {
        return {
          ...prompt,
          prompt: value
        };
      } else {
        return prompt;
      }
    });
    setEditableData(newData);
  };

  const handleSaveClick = () => {
    onSave(editableData);
    onClose();
  };

  const handleCancelClick = () => {
    setEditableData([...data]); // Create a new copy of the data array
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Data</DialogTitle>
      <DialogContent>
        {editableData.map((prompt) => (
          <TextField
            key={prompt.id}
            label={prompt.id}
            value={prompt.prompt}
            onChange={(event) => handleFieldChange(prompt.id, event.target.value)}
            fullWidth
            margin="normal"
          />
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancelClick}>Cancel</Button>
        <Button onClick={handleSaveClick} variant="contained" color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditablePopup;
