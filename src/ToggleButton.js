// ToggleButton.js
import React, { useContext } from 'react';
import { ThemeContext } from './ThemeContext';
import { Button } from '@mui/material';
import ContrastIcon from '@mui/icons-material/Contrast';

const ToggleButton = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <Button  onClick={toggleTheme}>
      {/* Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode */}
      <ContrastIcon color="action"/>
    </Button>
  );
};

export default ToggleButton;
