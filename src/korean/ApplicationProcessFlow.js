import React from 'react';
import {
  Typography,
  Grid,
  Fab,
  Box,
  Switch,
  Card,
  CardActions,
  CardContent,
  Button,
  InputAdornment,
  FormControl,
  Input
} from "@material-ui/core";
import { withStyles, makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100vw',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  main: {
    
  }
}))

const ApplicationProcessFlow = () => {

  const classes = useStyles()

  return (
    <div className={classes.root}>
     
     <main className={classes.main}>
        <Typography component='div'>
          <Box
            className={classes.boldText}
            fontSize={27} fontWeight="fontWeightBold" m={0}>
            Indulge Benfica Camp
          </Box>
        </Typography>

        </main>
    </div>
  );
};

export default ApplicationProcessFlow;