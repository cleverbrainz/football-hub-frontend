import React from 'react';
import { withRouter, useLocation } from 'react-router-dom'
import {
  Typography,
  Grid,
  Fab,
  Switch,
} from "@material-ui/core";
import { withStyles, makeStyles} from '@material-ui/core/styles';



const SwitchLanguageFab = (props) => {

  const location = useLocation()

  const useStyles = makeStyles((theme) => ({
    text: {
      fontSize: '12px'
    },
    fab: {
      height: '40px',
      position: 'fixed',
      left: '2%',
      bottom: '2%',
      zIndex: '1000',
      display: location.pathname.slice(0,12) === '/application' ? 'none' : location.pathname.slice(0,11) === '/challenges' ? 'none' : 'initial'
    },
  }))
  const classes = useStyles()
  const AntSwitch = withStyles((theme) => ({
    root: {
      width: 28,
      height: 16,
      padding: 0,
      display: location.pathname.slice(0,12) === '/application' ? 'none' : location.pathname.slice(0,11) === '/challenges' ? 'none' : 'flex'
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

  const { handleLocaleChange, locale } = props

  // console.log(props)
  // console.log(locale, handleLocaleChange)

  return (
    <Fab className={classes.fab} variant="extended">
      <Typography component="div">
        <Grid component="label" container alignItems="center" spacing={1} style={{ margin: '0px' }}>
          <Grid className={classes.text} item> KR </Grid>
          <Grid item>
            <AntSwitch
              checked={locale === 'en'}
              onChange={(e) => handleLocaleChange(e)}
              name="checkedC" />
          </Grid>
          <Grid className={classes.text} item> EN </Grid>
        </Grid>
      </Typography>
    </Fab>
  );
};

export default withRouter(SwitchLanguageFab);

