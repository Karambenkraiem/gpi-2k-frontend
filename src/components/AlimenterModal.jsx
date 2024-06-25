import React, { useState } from 'react';
import { Modal, Box, TextField, Button, Typography } from '@mui/material';

const AlimenterModal = ({ open, handleClose, refArt, onSave }) => {
  const [quantity, setQuantity] = useState(0);

  const handleChange = (e) => {
    setQuantity(Number(e.target.value));
  };

  const handleAdd = () => {
    onSave(quantity);
    handleClose();
  };

  const handleSubtract = () => {
    onSave(-quantity);
    handleClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
        <Typography variant="h6" component="h2">
          Alimenter Stock pour {refArt}
        </Typography>
        <TextField
          type="number"
          label="Quantité"
          value={quantity}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Button variant="contained" color="primary" onClick={handleAdd}>
            Ajouter
          </Button>
          <Button variant="contained" color="secondary" onClick={handleSubtract}>
            Diminuer
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default AlimenterModal;
