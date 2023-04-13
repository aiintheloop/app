import React, { useState } from "react";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

interface EditablePopupProps {
  data: Record<string, string>;
  open: boolean;
  onClose: () => void;
  onSave: (data: Record<string, string>) => void;
}

const EditablePopup: React.FC<EditablePopupProps> = ({ data, open, onClose, onSave }) => {
  const [editableData, setEditableData] = useState<Record<string, string>>(data);

  const handleFieldChange = (field: string, value: string) => {
    setEditableData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
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
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Data</DialogTitle>
      <DialogContent>
        {Object.entries(editableData).map(([key, value]) => (
          <TextField
            key={key}
            label={key}
            value={value}
            onChange={(event) => handleFieldChange(key, event.target.value)}
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
