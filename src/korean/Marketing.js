import React, { useState, useEffect } from 'react';
import languages from './LanguageSkeleton'
import {
  Typography,
  Grid,
  Fab,
  Box,
  Switch
} from "@material-ui/core";
// import Switch from '@material-ui/core/Switch';
import { withStyles, makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  text: {
    fontSize: '12px'
  },
  fab: {
    height: '40px',
    position: 'absolute',
    right: '2%',
    bottom: '2%'
  },
  root: {
    width: '100vw',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  section: {
    height: '100%',
    width: '80%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    [theme.breakpoints.up('md')]: {
      flexDirection: 'row'
    },
  },
}));

const Marketing = () => {
  const classes = useStyles()
  const [locale, setLocale] = useState('ko')
  const AntSwitch = withStyles((theme) => ({
    root: {
      width: 28,
      height: 16,
      padding: 0,
      display: 'flex',
    },
    switchBase: {
      padding: 2,
      color: theme.palette.grey[500],
      '&$checked': {
        transform: 'translateX(12px)',
        color: theme.palette.common.white,
        '& + $track': {
          opacity: 1,
          backgroundColor: theme.palette.primary.main,
          borderColor: theme.palette.primary.main,
        },
      },
    },
    thumb: {
      width: 12,
      height: 12,
      boxShadow: 'none',
    },
    track: {
      opacity: 1,
      borderRadius: 16 / 2,
      backgroundColor: theme.palette.secondary.main,
      borderColor: theme.palette.secondary.main,
    },
    checked: {},
  }))(Switch);


  const fab = (
    <Fab className={classes.fab} variant="extended">
      <Typography component="div">
        <Grid component="label" container alignItems="center" spacing={1}>
          <Grid className={classes.text} item> KR </Grid>
          <Grid item>
            <AntSwitch
              checked={locale === 'en'}
              onChange={e => e.target.checked ? setLocale('en') : setLocale('ko')}
              name="checkedC" />
          </Grid>
          <Grid className={classes.text} item> EN </Grid>
        </Grid>
      </Typography>
    </Fab>
  )


  return (
    <div className={classes.root}>
      {fab}


      <main>
       
        <h1>
          {languages[locale].mainTitle}
        </h1>

        <div>
          <h2>
            {languages[locale].headerMain}
          </h2>

          <p>
          {languages[locale].headerParagraph}
          </p>
        </div>

      </main>

    </div>
  );
};

export default Marketing;