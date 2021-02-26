import React, {useEffect} from 'react';
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
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: '120px',
    [theme.breakpoints.up('md')]: {
      paddingTop: '0px',
    },
  },
  main: {
    minHeight: '57vh',
    width: '85%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    [theme.breakpoints.up('md')]: {
      width: '65%',
    },
  },
  section: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'column',
    [theme.breakpoints.up('md')]: {
      flexDirection: 'row'
    },

  },
  subSection: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    height: '35vh',
    [theme.breakpoints.up('md')]: {
      width: '45%',
    },
  },
  title: {
    fontSize: '22px',
    fontWeight: 'bold'
  },
  subTitle: {
    textAlign: 'center', 
    margin: '30vh 0 6vh 0',
    [theme.breakpoints.up('md')]: {
      margin: '0 0 20px 0',
    },
  }
}))

const ApplicationProcessFlow = () => {

  const classes = useStyles()

  useEffect(() => {
    localStorage.removeItem('token')
  }, [])

  return (
    <div className={classes.root}>

      <Typography style={{ marginBottom: '30px' }} component='div'>
        <Box
          className={classes.boldText}
          fontSize={30} fontWeight="fontWeightBold" m={0}>
          Indulge Benfica Camp
          </Box>
      </Typography>

      <main className={classes.main}>

        <Typography className={classes.subTitle} component='div'>
          <Box
            fontSize={27} fontWeight="fontWeightBold" m={0}>
            Thank you for applying
          </Box>
          <Box
            fontSize={16} fontWeight="fontWeightRegular" m={0}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Vestibulum varius, quam eget vehicula sodales, neque metus tincidunt mi,
            eget maximus nibh risus ut velit. Sed ut vehicula elit. Suspendisse nec porttitor urna.
          </Box>

        </Typography>

        <Typography component='div'>
          <Box
            fontSize={17} fontWeight="fontWeightBold" m={0}>
            What's next?
          </Box>
        </Typography>

        <section className={classes.section}>

          <div className={classes.subSection}>

            <div>
              <h3> 1. <span className={classes.title}>The Challenges </span> </h3>
              <p>
                Completion of three challenges and an opportunity to tell us more about your
                skills and experience.
            </p>
            </div>
            <div>
              <h3 > 2. <span className={classes.title}>Review & Result </span> </h3>
              <p>
                Review of your application and completed challenges submitted. We'll inform you via email
                of the outcome, whether you've been successful or not.
           </p>
            </div>
          </div>

          <div className={classes.subSection}>
            <div>
              <h3 >  3. <span className={classes.title}>Camp Onboarding</span>   </h3>
              <p>
                Upon a successful application, we'll have you registered for the camp and send
                out further information regarding itinerary and payment details.
            </p>
            </div>
            <div>
              <h3 >  4.<span className={classes.title}> Attend Camp</span> </h3>
              <p>
                Attend the camp for your age group and learn from the best with the chance to
                get scouted by Benfica F.C.
            </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ApplicationProcessFlow;