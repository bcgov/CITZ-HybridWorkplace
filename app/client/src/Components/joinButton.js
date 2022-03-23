import Button from "@mui/material/Button";
import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { red, green } from '@mui/material/colors';

const theme = createTheme({
  palette: {
    primary: {
      main: green[600],
    },
    secondary: {
      main: '#f44336',
    },
  },
});


function ButtonClick() {
 const [flag, setFlag] = React.useState(true);
 const primary = red[500]; 
 const handleClick = () => {
   setFlag(!flag);
 };

 return (
    <ThemeProvider theme={theme}>
   <Button
     onClick={handleClick}
     variant="contained"
     color={flag ? "primary" : 'secondary' }
     size="small"
   >
     {flag? "Join" : "Remove"}
   </Button>
   </ThemeProvider>
 );
}
export default ButtonClick;