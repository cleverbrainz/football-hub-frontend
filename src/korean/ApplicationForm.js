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
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import CloudUploadSharpIcon from '@material-ui/icons/CloudUploadSharp';
import axios from 'axios'
import { useStripe } from "@stripe/react-stripe-js";

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
    marginBottom: '3px',
    fontSize: '14px'
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
  },
  subHeading: {
    margin: 0,
    color: 'orange',
    [theme.breakpoints.up('md')]: {
      marginBottom: '10px',

    },
  }
}));




export default function ApplicationForm() {
  const stripe = useStripe()
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);
  const [videoSource, setVideoSource] = useState('https://www.youtube.com/embed/HmWpssuh_9A?rel=0')
  const [applicationDetails, setApplicationDetails] = useState({
    personal_details: {
      name: '',
      gender: '',
      dob: '',
      address_line_1: '',
      address_line_2: '',
      city: '',
      postcode: '',
      residency_certificate: ''
    },
    player_attributes: {
      height: '',
      weight: '',
      position: '',
      preferred_foot: ''
    },
    football_history: {
      current_club: '',
      current_coaching_school: '',
      previous_clubs: '',
      previous_trails_attended: '',
      highlights_footage_link: '',
      social_media_link: '',
      bio_description: ''
    },
    challenges: {
      link_1: '',
      link_2: '',
      link_3: '',
    },
    ratings: {
      indulge: 0,
      application: 0,
      challenges: 0
    }
  })
  const steps = getSteps();

  const handleNext = async () => {
    if (activeStep === 2) {
      let checkout = await axios.post('/korean-application-fee', {})
      const session = await checkout.data

      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
      })

      if (result.error) {
        // props.history.push('/checkout')
      }

    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }

  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  function getSteps() {
    return ['Player Information', 'Football History', 'Challenges'];
  }

  function handleApplicationChange(e) {
    const { name, value } = e.target

    Object.keys(applicationDetails).forEach(x => {
      if (applicationDetails[x].hasOwnProperty(name)) {
        const y = applicationDetails[x]
        setApplicationDetails({
          ...applicationDetails,
          [x]: {
            ...y, [name]: value
          }
        })
      }
    })
  }

  function getStepContent(step) {
    switch (step) {
      case 0:
        return firstPage;
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

  const firstPage = (
    <>
      <Typography className={classes.subHeading} component='div' >
        <Box
          fontSize={18}
          fontWeight="fontWeightBold" m={0}>
          Personal Details
        </Box>
      </Typography>

      <div class="field">
        <div class="field-body">

          <div className={classes.field}>
            <div className={classes.label}>
              <label> <span style={{ color: 'red' }}>*</span> Player Full Name </label>
            </div>
            <p class="control is-expanded">
              <input class="input" type="text" name='name' placeholder="Player Full Name" />
            </p>
          </div>

          <div className={classes.field} style={{ flex: 0.4 }}>
            <div className={classes.label}>
              <label > <span style={{ color: 'red' }}>*</span> Gender </label>
            </div>
            <div class="select" style={{ width: '100%' }}>
              <select name='gender' style={{ width: '100%' }}>
                <option value="male"> Male </option>
                <option value="female"> Female </option>
                <option value="custom"> Custom</option>
              </select>
            </div>
          </div>

          <div className={classes.field} style={{ flex: 0.4 }}>
            <div className={classes.label}>
              <label > <span style={{ color: 'red' }}>*</span> Date of Birth </label>
            </div>
            <p class="control" >
              <input name='dob' class="input" type="date" />
            </p>
          </div>




        </div>

        <div class="field-body">
          <div className={classes.field}>
            <div className={classes.label}>
              <label> <span style={{ color: 'red' }}>*</span> Address Line 1 </label>
            </div>
            <p class="control is-expanded">
              <input name='address_line_1' class="input" type="text" placeholder="Address Line 1" />
            </p>
          </div>

          <div className={classes.field}>
            <div className={classes.label}>
              <label>Address Line 2 </label>
            </div>
            <p class="control is-expanded">
              <input name='address_line_2' class="input" type="text" placeholder="Address Line 2" />
            </p>
          </div>

        </div>

        <div class="field-body"
          style={{ width: '40%' }}
        >

          <div className={classes.field}>
            <div className={classes.label}>
              <label> <span style={{ color: 'red' }}>*</span> City </label>
            </div>
            <p class="control is-expanded">
              <input name='city' class="input" type="text" placeholder="City" />
            </p>
          </div>

          <div className={classes.field}>
            <div className={classes.label}>
              <label> <span style={{ color: 'red' }}>*</span> Postcode </label>
            </div>
            <p class="control is-expanded">
              <input name='postcode' class="input" type="text" placeholder=" Postcode" />
            </p>
          </div>




        </div>

        <div class="field-body">
          <div className={classes.field}>
            <div className={classes.label}>
              <label> <span style={{ color: 'red' }}>*</span>
                Resident Registration / Family Relation Certificate
               </label>
            </div>
            <div class="file has-name">
              <label class="file-label">
                <input class="file-input" type="file" name='residency_certificate' />
                <span class="file-cta">
                  <span style={{ marginRight: '15px' }} class="file-icon">
                    <CloudUploadSharpIcon
                      style={{
                        fontSize: '23px',
                        transform: 'translate(-2px, -2px)'
                      }}
                    />
                  </span>
                  <span class="file-label">
                    Upload a file...
                </span>
                </span>
                {/* render span file-name when document is uploaded to show file name */}
                {/* <span class="file-name">
                  Screen Shot 2017-07-29 at 15.54.25.png
               </span> */}
              </label>
            </div>
          </div>

        </div>



      </div>


      <Typography component='div'
        className={classes.subHeading} >
        <Box
          fontSize={18}
          fontWeight="fontWeightBold" m={0}>
          Player Attributes
        </Box>
      </Typography>

      <div class="field-body" style={{ width: '70%' }}>
        <div className={classes.field}>
          <div className={classes.label}>
            <label> <span style={{ color: 'red' }}>*</span> Height (cm) </label>
          </div>
          <p class="control is-expanded">
            <input name='height' class="input" type="number" min={150} placeholder="Height" />
          </p>
        </div>

        <div className={classes.field}>
          <div className={classes.label}>
            <label> <span style={{ color: 'red' }}>*</span> Weight (kg) </label>
          </div>
          <p class="control is-expanded">
            <input name='weight' class="input" type="number" min={50} placeholder="Weight" />
          </p>
        </div>
        <div className={classes.field}>
          <div className={classes.label}>
            <label> <span style={{ color: 'red' }}>*</span> Preferred Position </label>
          </div>
          <div class="select">
            <select name='position'>
              <option value="goalkeeper"> Goalkeeper </option>
              <option value="right fullback"> Right Fullback </option>
              <option value="left fullback"> Left Fullback </option>
              <option value="center back"> Center Back</option>
              <option value="defending / holding midfielder"> Defending / Holding Midfielder </option>
              <option value="right midfielder / winger"> Right Midfielder / Winger </option>
              <option value="left midfielder / winger"> Left Midfielder / Wingers </option>
              <option value="central / box-to-box midfielder">Central / Box-to-Box Midfielder </option>
              <option value="attacking midfielder / playmaker"> Attacking Midfielder / Playmaker </option>
              <option value="striker">Striker </option>
            </select>
          </div>
        </div>

        <div className={classes.field}>
          <div className={classes.label}>
            <label> <span style={{ color: 'red' }}>*</span> Preferred Foot </label>
          </div>
          <div class="select">
            <select name='preferred_foot'>
              <option value="left"> Left </option>
              <option value="right"> Right </option>
              <option value="both"> Both </option>
            </select>
          </div>
        </div>



      </div>



    </>
  )

  const secondPage = (
    <>
      <div class="field">

        <div class="field-body">

          <div className={classes.field}>
            <div className={classes.label}>
              <label> <span style={{ color: 'red' }}>*</span> Current Club</label>
            </div>
            <p class="control is-expanded">
              <input name='current_club' class="input" type="text" placeholder="Current Club" />

            </p>
          </div>
          <div className={classes.field}>
            <div className={classes.label}>
              <label > <span style={{ color: 'red' }}>*</span> Current Coaching School </label>
            </div>
            <p class="control is-expanded">
              <input name='current_coaching_school' class="input" type="email" placeholder="Current Coaching School" />

            </p>
          </div>
        </div>

        <div class="field-body">
          <div className={classes.field}>
            <div className={classes.label}>
              <label >Previous Clubs </label>
            </div>
            <p class="control is-expanded">
              <input name='previous_clubs' class="input" type="text" placeholder="Previous Clubs " />

            </p>
          </div>
          <div className={classes.field}>
            <div className={classes.label}>
              <label >Previous Trials Attended </label>
            </div>
            <p class="control is-expanded">
              <input name='previous_trails_attended' class="input" type="email" placeholder="Previous Trials Attended " />

            </p>
          </div>
        </div>


        <div class="field-body">
          <div className={classes.field}>
            <div className={classes.label}>
              <label >Web URL of Video Footage</label>
            </div>
            <p class="control is-expanded">
              <input name='highlights_footage_link' class="input" type="text" placeholder="Web URL of Video Footage" />

            </p>
          </div>
          <div className={classes.field}>
            <div className={classes.label}>
              <label > <span style={{ color: 'red' }}>*</span> Social Media Link </label>
            </div>
            <p class="control is-expanded">
              <input name='social_media_link' class="input" type="email" placeholder="Social Media Link " />

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

              <textarea name='bio_description' style={{ minHeight: '15rem' }} class="textarea" placeholder="Write a short description about yourself "></textarea>
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
          <iframe title='video' width="480" height="245" src={videoSource} frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen> </iframe>

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
              <input name='link_1' class="input" type="text" placeholder="Web URL of Video Footage" />
            </p>
          </div>
          <div className={classes.webfield}>
            <div className={classes.label}>
              <label > Challenge #2 Link </label>
            </div>
            <p class="control is-expanded">
              <input name='link_2' class="input" type="text" placeholder="Web URL of Video Footage" />
            </p>
          </div>
          <div className={classes.webfield}>
            <div className={classes.label}>
              <label > Challenge #3 Link </label>
            </div>
            <p class="control is-expanded">
              <input name='link_3' class="input" type="text" placeholder="Web URL of Video Footage" />
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

      <div className={classes.formContainer}>
        <Typography className={classes.instructions}>
          <form onChange={(e) => handleApplicationChange(e)} action="">
            {getStepContent(activeStep)}
          </form>

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
            // onClick={handleBack}
            variant="outlined"
            color="primary"
            className={classes.button}
            endIcon={<SaveAltIcon />}>
            Save draft
              </Button>

          <Button
            variant="outlined"
            color="primary"
            onClick={handleNext}
            className={classes.button}
            endIcon={<ArrowForwardIcon />}>

            {activeStep === steps.length - 1 ? 'Submit & Pay' : 'Next'}
          </Button>
        </div>
      </div>

    </div>
  );
}
