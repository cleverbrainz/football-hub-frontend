import React, { useEffect, useState } from 'react';
import { Paper, Grid, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import axios from 'axios'
import auth from '../../lib/auth'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: '24px',
    height: window.innerHeight - 80
  },
  paper: {
    padding: theme.spacing(2),
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
    { text: 'Age Groups', component: 'Misc', userObject: 'ageDetails' },
    { text: 'Services', component: 'Misc', userObject: 'services' },
    { text: 'Courses & Camps', component: 'Sessions', userObject: 'courses' },
    { text: 'Coaches', component: 'Coaches', userObject: 'coaches' }
  ]

  const [user, setUser] = useState()

  useEffect(() => {
    axios.get(`/users/${auth.getUserId()}`)
      .then(res => setUser(res.data[0]))
  }, [])

  console.log(user)
  function renderRecentlyAdded(detail) {

    const textArr = []

    const length = user && (detail === 'courses' ? user[detail].active.length : user[detail].length)
    for (let i = length - 1; i >= 0; i--) {
      switch (detail) {
        case 'ageDetails':
          textArr.push(`Added ${user[detail][i].startAge} - ${user[detail][i].endAge} group`)
          break;
        case 'services':
          textArr.push(`Added ${user[detail][i].name} service - ${user[detail][i].description}`)
          break;
        case 'courses':
          textArr.push(`Added ${user[detail].active[i].courseDetails.courseType} for ${user[detail].active[i].courseDetails.age} at 
          ${user[detail].active[i].courseDetails.location}`)
          break;

        default:
          break;
      }
    }
    

    return textArr
  }



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

                <Typography gutterBottom variant="p">
                  {user && (el.userObject === 'courses' ? user[el.userObject].active.length !== 0 : user[el.userObject].length !== 0) ? (
                    <p> You currently have
                      <span style={{ fontWeight: 'bold' }}> {el.userObject === 'courses' ? user[el.userObject].active.length : user[el.userObject].length} {el.text.slice(0, -1) + '(s)'}
                      </span> added to your profile </p>
                  ) : <p> There are currently <span style={{ fontWeight: 'bold' }}> 0 {el.text} </span> on your profile, please select the + icon to add {el.text} </p>}
                </Typography>

                <Typography style={{ marginTop: '30px' }} gutterBottom variant="h6">
                  Recently Added {el.text}
                </Typography>

                <Typography gutterBottom variant="p">
                  {renderRecentlyAdded(el.userObject).map((el, i) => <p> {i + 1}. {el} </p>)}
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
