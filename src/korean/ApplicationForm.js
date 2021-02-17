import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Check from '@material-ui/icons/Check';
import PersonSharpIcon from '@material-ui/icons/PersonSharp';
import HistorySharpIcon from '@material-ui/icons/HistorySharp';
import DirectionsRunSharpIcon from '@material-ui/icons/DirectionsRunSharp';
import StepConnector from '@material-ui/core/StepConnector';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Box from '@material-ui/core/Box';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';


const ColorlibConnector = withStyles({
  alternativeLabel: {
    top: 22,
  },
  active: {
    '& $line': {
      backgroundColor: 'orange',
    },
  },
  completed: {
    '& $line': {
      backgroundColor: 'orange',
    },
  },
  line: {
    height: 3,
    border: 0,
    backgroundColor: '#eaeaf0',
    borderRadius: 1,
  },
})(StepConnector);

const useColorlibStepIconStyles = makeStyles({
  root: {
    backgroundColor: '#ccc',
    zIndex: 1,
    color: '#fff',
    width: 37,
    height: 37,
    display: 'flex',
    borderRadius: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  active: {
    backgroundColor: 'orange',
    boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
  },
  completed: {
    backgroundColor: 'orange',
  },
  icon: {
    fontSize: '20px'
  }
});

function ColorlibStepIcon(props) {
  const classes = useColorlibStepIconStyles();
  const { active, completed } = props;

  const icons = {
    1: <PersonSharpIcon className={classes.icon} />,
    2: <HistorySharpIcon className={classes.icon} />,
    3: <DirectionsRunSharpIcon className={classes.icon} />,
  };

  return (
    <div
      className={clsx(classes.root, {
        [classes.active]: active,
        [classes.completed]: completed,
      })}
    >
      {icons[String(props.icon)]}
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    paddingTop: '110px'
  },
  button: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  title: {
    fontSize: 22,
    textAlign: 'center',
    margin: '10px 0',
    [theme.breakpoints.up('md')]: {
      fontSize: 27
    },
  },
  formContainer: {
    width: '85%',
    margin: '0 auto',
    overflow: 'scroll',
    height: '60vh',
    paddingBottom: '25px',
    [theme.breakpoints.up('md')]: {
      width: '70%',
    },
  },
  label: {
    fontWeight: 'bold',
    marginBottom: '3px'
  },
  field: {
    flex: 1,
    margin: '20px 0',
    [theme.breakpoints.up('md')]: {
      margin: '7px 5px'
    },

  },
  webfield: {
    flex: 1,
    margin: '15px 0',
    [theme.breakpoints.up('md')]: {
      margin: '12px 20px '
    },
  },
  videoContainer: {
    marginTop: '30px',
    display: 'flex',
    flexDirection: 'column',

    [theme.breakpoints.up('md')]: {
      flexDirection: 'row',
    },
  }
}));




export default function ApplicationForm() {
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(2);
  const [videoSource, setVideoSource] = useState('https://www.youtube.com/embed/HmWpssuh_9A?rel=0')
  const steps = getSteps();

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };


  function getSteps() {
    return ['Player Information', 'Football History', 'Challenges'];
  }

  function getStepContent(step) {
    switch (step) {
      case 0:
        return 'Select campaign settings...';
      case 1:
        return secondPage;
      case 2:
        return thirdPage;
      default:
        return 'Unknown step';
    }
  }

  const videoLinks = [
    {
      title: '#1',
      src: 'https://www.youtube.com/embed/HmWpssuh_9A?rel=0'
    },
    {
      title: '#2',
      src: 'https://www.youtube.com/embed/1OWOrbmvUhc?rel=0'
    },
    {
      title: '#3',
      src: 'https://www.youtube.com/embed/Q-hR_gNElo0?rel=0'
    },

  ]

  const secondPage = (
    <>
      <div class="field">

        <div class="field-body">

          <div className={classes.field}>
            <div className={classes.label}>
              <label> <span style={{ color: 'red' }}>*</span> Current Club</label>
            </div>
            <p class="control is-expanded">
              <input class="input" type="text" placeholder="Current Club" />

            </p>
          </div>
          <div className={classes.field}>
            <div className={classes.label}>
              <label > <span style={{ color: 'red' }}>*</span> Current Coaching School </label>
            </div>
            <p class="control is-expanded">
              <input class="input" type="email" placeholder="Current Coaching School" />

            </p>
          </div>
        </div>

        <div class="field-body">
          <div className={classes.field}>
            <div className={classes.label}>
              <label >Previous Clubs </label>
            </div>
            <p class="control is-expanded">
              <input class="input" type="text" placeholder="Previous Clubs " />

            </p>
          </div>
          <div className={classes.field}>
            <div className={classes.label}>
              <label >Previous Trials Attended </label>
            </div>
            <p class="control is-expanded">
              <input class="input" type="email" placeholder="Previous Trials Attended " />

            </p>
          </div>
        </div>


        <div class="field-body">
          <div className={classes.field}>
            <div className={classes.label}>
              <label >Web URL of Video Footage</label>
            </div>
            <p class="control is-expanded">
              <input class="input" type="text" placeholder="Web URL of Video Footage" />

            </p>
          </div>
          <div className={classes.field}>
            <div className={classes.label}>
              <label > <span style={{ color: 'red' }}>*</span> Social Media Link </label>
            </div>
            <p class="control is-expanded">
              <input class="input" type="email" placeholder="Social Media Link " />

            </p>
          </div>
        </div>

      </div>


      <div class="field">
        <div class="field-body">
          <div className={classes.field}>
            <div className={classes.label}>
              <label> <span style={{ color: 'red' }}>*</span> Write about yourself  </label>
              <p style={{ fontWeight: 'initial' }} class="help"> Tell us more about your experiences, including achievements and goals </p>
            </div>

            <div class="control">

              <textarea style={{ minHeight: '15rem' }} class="textarea" placeholder="Write a short description about yourself "></textarea>
            </div>
          </div>
        </div>
      </div>
    </>
  )

  const thirdPage = (
    <>
      <Typography component='div' >
        <Box
          fontSize={20}
          fontWeight="fontWeightBold" m={0}>
          Complete the following challenges
        </Box>
        <Box
          fontSize={16}
          fontWeight="fontWeightRegular" m={0}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. In at pellentesque purus, at euismod ligula.
        </Box>
      </Typography>

      <section className={classes.videoContainer}>
        <div>
          <iframe title='video' 
          width="480" 
          height="245" 
          src={videoSource} 
          frameborder="0" 
          allow="accelerometer; 
          autoplay; 
          clipboard-write; 
          encrypted-media; 
          gyroscope; 
          picture-in-picture" allowfullscreen>
            
          </iframe>
          
          <Breadcrumbs aria-label="breadcrumb">
         {/* <Typography> Demonstration Videos: </Typography>  */}
            {videoLinks.map(el => {
              return (
                <Link
                  style={{ color: videoSource === el.src ? 'blue' : 'initial' }}
                  onClick={() => setVideoSource(el.src)}
                  > 
                  {el.title} 
                </Link>
              )
            })}
          </Breadcrumbs>
        </div>



        <div style={{ flex: 1 }}>
          <div className={classes.webfield}>
            <div className={classes.label}>
              <label > Challenge #1 Link </label>
            </div>
            <p class="control is-expanded">
              <input class="input" type="text" placeholder="Web URL of Video Footage" />
            </p>
          </div>
          <div className={classes.webfield}>
            <div className={classes.label}>
              <label > Challenge #2 Link </label>
            </div>
            <p class="control is-expanded">
              <input class="input" type="text" placeholder="Web URL of Video Footage" />
            </p>
          </div>
          <div className={classes.webfield}>
            <div className={classes.label}>
              <label > Challenge #3 Link </label>
            </div>
            <p class="control is-expanded">
              <input class="input" type="text" placeholder="Web URL of Video Footage" />
            </p>
          </div>
        </div>

      </section>

    </>
  )

  return (
    <div className={classes.root}>
      <Typography component='div' >
        <Box
          className={classes.title}
          fontWeight="fontWeightBold" m={0}>
          Project Football Korea: Application Form
        </Box>
      </Typography>

      <Stepper alternativeLabel activeStep={activeStep} connector={<ColorlibConnector />}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel StepIconComponent={ColorlibStepIcon}>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <div>
        {activeStep === steps.length ? (
          <div>
            <Typography className={classes.instructions}>
              All steps completed - you&apos;re finished
            </Typography>
            <Button onClick={handleReset} className={classes.button}>
              Reset
            </Button>
          </div>
        ) : (


            <div className={classes.formContainer}>
              <Typography className={classes.instructions}>
                {getStepContent(activeStep)}
              </Typography>
              <div style={{ textAlign: 'end' }}>


                <Button
                  style={{ display: activeStep === 0 ? 'none' : 'initial' }}
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  className={classes.button}>
                  Back
              </Button>

                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleNext}
                  className={classes.button}
                  endIcon={<ArrowForwardIcon />}>

                  {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                </Button>
              </div>
            </div>
          )}
      </div>
    </div>
  );
}
