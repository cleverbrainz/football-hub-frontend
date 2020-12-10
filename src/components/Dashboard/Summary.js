import React from 'react';
import { Paper, Grid, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: '24px',
    height: window.innerHeight - 80
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    height: '40vh',
    borderRadius: '20px',
    position: 'relative'
  },
  fab: {
    position: 'absolute',
    bottom: '3%',
    right: '2%'
  }
}));


const Summary = ({ handleComponentChange }) => {

  const classes = useStyles();

  const cards = [
    { text: 'Age Groups', component: 'Misc' },
    { text: 'Services', component: 'Misc' },
    { text: 'Courses & Camps', component: 'Sessions' },
    { text: 'Coaches', component: 'Coaches' }
  ]

  return (
    <div className={classes.root}>
      <Grid container
        spacing={3}>

        {cards.map((el, i) => {
          return (
            <Grid item xs={12} sm={6}>
              <Paper elevation={4}
                className={classes.paper}>
                <Typography gutterBottom variant="h5">
                  {el.text}
                </Typography>

                <Fab className={classes.fab}
                  style={{ right: '75px' }}
                  size="small"
                  onClick={() => handleComponentChange(el.component, 0)}
                  color="secondary"
                  aria-label="edit">
                  <EditIcon />
                </Fab>
                <Fab className={classes.fab}
                  size="small"
                  onClick={() => handleComponentChange(el.component, 1)}
                  color="primary"
                  aria-label="add">
                  <AddIcon />
                </Fab>
              </Paper>
            </Grid>
          )
        })}
      </Grid>
    </div>
  );
};

export default Summary;
