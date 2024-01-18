import { createTheme } from '@mui/material/styles';

const defaultTheme = createTheme({
  palette: {
    primary: {
      main: '#383838',
      dark: '#000',
      medium: '#787878',
      light: '#fafafa'
    },
    secondary: {
      main: '#0E402D',
      dark: '#295135',
      medium: '#5A6650',
      light: '#9FCC2E'
    },
    third: {
      main: '#9FCC2E',
      dark: '#9FCC2E',
      medium: '#9FCC2E',
      light: '#9FCC2E'
    },
  },
  components:{
    MuiPopover:{
      styleOverrides:{
        paper:{
          backgroundColor: '#383838',
          borderRadius: 10,
          '&::-webkit-scrollbar': {
            width: '0.4em',
          },
          '&::-webkit-scrollbar-track': {
            boxShadow: 'inset 0 0 6px rgba(0,0,0,0.5)',
            webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.50)'
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(255,255,255,1)',
            borderRadius: 2,
          }
        }
      }
    }
  },
});

export default defaultTheme