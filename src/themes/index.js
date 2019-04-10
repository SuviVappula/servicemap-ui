import { createMuiTheme } from '@material-ui/core';

const SMTheme = createMuiTheme({
  // Color palette
  palette: {
    primary: {
      main: '#1964e6',
    },
    secondary: {
      main: '#000000',
    },
  },
  // Typography
  typography: {
    useNextVariants: true,
    fontSize: 16,
    // Use the system font instead of the default Roboto font.
    fontFamily: [
      'Lato',
    ].join(','),
    body1: {
      fontSize: '1.043rem',
      letterSpacing: '0.03125rem', // 0.5px
    },
    body2: {
      fontSize: '0.913rem',
      letterSpacing: '0.015625rem', // 0.25px
      lineHeight: '1.25rem',
    },
    subtitle1: {
      fontSize: '1.03rem',
      fontWeight: 'bold',
      letterSpacing: '0.00937rem', // 0.15px
      lineHeight: '1.5rem',
    },
    h1: {
      fontSize: '6.259rem',
      letterSpacing: '-0.09375em', // -1.5px
    },
    h2: {
      fontSize: '3.862rem',
      fontWeight: 'bold',
      letterSpacing: '-0.03125rem', // -0.5px
    },
    h3: {
      fontSize: '3.089rem',
      fontWeight: 'bold',
      letterSpacing: 0,
    },
    h4: {
      fontSize: '2.214rem',
      letterSpacing: '0.015625rem', // 0.25px
    },
    h5: {
      fontSize: '1.564rem',
      letterSpacing: 0,
    },
    h6: {
      fontSize: '1.288rem',
      fontWeight: 'bold',
      letterSpacing: '0.015625rem', // 0.25px
      lineHeight: '1.5rem',
    },
  },
  spacing: {
    unit: 8,
  },
});

export default { SMTheme };
