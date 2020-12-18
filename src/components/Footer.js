import React from 'react';
import { makeStyles } from "@material-ui/core/styles";
import { Link } from 'react-router-dom'

const useStyles = makeStyles((theme) => ({
  footer: {
    width: '100vw',
    height: '20vh',
    display: 'flex',
    alignItems: 'flex-start',
    flexDirection: 'column',
    justifyContent: 'center',
    paddingLeft: '30px',

    [theme.breakpoints.up("sm")]: {
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      alignItems: 'center',
    },
  }
}))

const Footer = () => {

  const classes = useStyles();

  return (
    <footer className={classes.footer}>
      <a href=""> Terms & Conditions </a>
      <Link to='/about'> About Us </Link>
      <Link to='/privacy-policy'> Privacy Policy </Link>
      <a href=""> Contact Us </a>
    </footer>
  );
};

export default Footer;