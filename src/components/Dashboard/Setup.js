import React, {useState, useLayoutEffect} from 'react';
import { Paper, Grid, Typography } from '@material-ui/core'
import { Link } from 'react-router-dom'
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
    // height: '40vh',
    borderRadius: '20px',
    position: 'relative',
  },
  fab: {
    position: 'absolute',
    bottom: '3%',
    right: '2%'
  }
}));

const Setup = ({ handleComponentChange }) => {

  const classes = useStyles();
  const [paperHeight, setPaperHeight] = useState('')

  useLayoutEffect(() => {
    function updateSize() {
      if (window.innerHeight<768) {
        setPaperHeight('50vh')
      } else {
        setPaperHeight('40vh')
      }
    }
    window.addEventListener('resize', updateSize);
    updateSize();
  }, []);

  const cards = [
    {
      text: 'Services', component: 'Misc',
      description: 'Add one or more services you offer, this is a place to really sell what you do'
    },
    {
      text: 'Courses & Camps', component: 'Sessions',
      description: 'Add the courses and camps you run for the different age groups you offer your coaching to'
    },
    {
      text: 'Coaches', component: 'Coaches',
      description: 'Add yourself and/or others to your list of coaches that will run the classes you do'
    },
    {
      text: 'Locations', component: 'Locations',
      description: 'Add your locations/venues you use for your coaching sessions'
    },
    {
      text: 'Images', component: 'Images',
      description: 'Add your professional images, these will be show cased on your listing'
    },
    {
      text: 'Contact Info', component: 'Contact',
      description: 'Add your social media handles and contact info for people to get in touch with you'
    }
  ]

  return (
    <div className={classes.root}>
      <Grid container
        spacing={3}>
        <>
          {cards.map((el, i) => {
            return (
              <Grid item xs={12} sm={6} md={3}>
                <Paper elevation={4}
                  className={classes.paper} style={{height: paperHeight}}>
                  <Typography gutterBottom variant="h5">
                    {el.text}
                  </Typography>

                  <Typography gutterBottom variant="p">
                    {el.description}
                  </Typography>

                  {el.text !== 'Images' && (<Fab className={classes.fab}
                    style={{ right: '65px' }}
                    size="small"
                    onClick={() => handleComponentChange(el.component, 0)}
                    color="secondary"
                    aria-label="edit">
                    <EditIcon />
                  </Fab>
                  )}

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

          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={4}
              className={classes.paper} style={{height: paperHeight}}>
              <Typography gutterBottom variant="h5">
                Payment Details
              </Typography>

              <Typography gutterBottom variant="p">
                Update your subscription and account settings to enable online payments
              </Typography>

             <Fab className={classes.fab}
                size="small"
                onClick={() => handleComponentChange('Subscription', 0)}
                color="secondary"
                aria-label="edit">
                <EditIcon />
              </Fab>
            </Paper>
          </Grid>
        </>
      </Grid>
    </div>
  );
};

export default Setup;
