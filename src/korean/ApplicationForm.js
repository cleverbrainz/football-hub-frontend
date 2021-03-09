import React, { useState, useEffect } from 'react';
import { application, snackbar_messages } from './LanguageSkeleton'
import PropTypes from 'prop-types';
import { makeStyles, withStyles, useTheme } from '@material-ui/core/styles';
import clsx from 'clsx';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import Tooltip from '@material-ui/core/Tooltip';
import StepLabel from '@material-ui/core/StepLabel';
import PersonSharpIcon from '@material-ui/icons/PersonSharp';
import HistorySharpIcon from '@material-ui/icons/HistorySharp';
import DirectionsRunSharpIcon from '@material-ui/icons/DirectionsRunSharp';
import StepConnector from '@material-ui/core/StepConnector';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Box from '@material-ui/core/Box';
import Snackbar from '@material-ui/core/Snackbar';
import ClearSharpIcon from '@material-ui/icons/ClearSharp';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import CloudUploadSharpIcon from '@material-ui/icons/CloudUploadSharp';
import axios from 'axios'
import MuiAlert from '@material-ui/lab/Alert';
import CircularProgress from '@material-ui/core/CircularProgress'
import auth from '../lib/auth'
import moment from 'moment'
import Selector, { components } from 'react-select';
import makeAnimated from 'react-select/animated';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import InfoSharpIcon from '@material-ui/icons/InfoSharp';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { Switch } from '@material-ui/core';
import {
  FormControlLabel,
  Radio,
} from "@material-ui/core";

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
    position: 'relative',
    fontSize: '12px',
    [theme.breakpoints.up('md')]: {
      fontSize: '14px'
    },
  },
  progress: {
    position: 'absolute'
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
  webfieldContainer: {
    flex: 1,
    transform: 'translateY(0px)',
    [theme.breakpoints.up('md')]: {
      transform: 'translateY(-30px)'
    }
  },
  webfield: {
    flex: 1,
    margin: '15px 0',
    [theme.breakpoints.up('md')]: {
      margin: '20px 20px '
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
  video: {
    height: '40vw',
    width: '100%',
    [theme.breakpoints.up('md')]: {
      height: 245,
      minWidth: 470
    },
    position: 'relative'
  },
  subHeading: {
    margin: 0,
    color: 'orange',
    [theme.breakpoints.up('md')]: {
      marginBottom: '10px',

    },
  },
  bufferText: {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    fontWeight: 'bold',
  },
  chip: {
    transform: 'translateY(-1px)',
    fontSize: '11px',
    margin: '0 5px'
  }

}));




export default function ApplicationForm({ history, location, locale }) {
  const classes = useStyles();
  const theme = useTheme();
  const [message, setMessage] = useState()
  const [isLoading, setIsLoading] = useState(false)
  const [activeStep, setActiveStep] = useState(0);
  const [videoSource, setVideoSource] = useState()
  const [isSafari, setIsSafari] = useState(false)
  const animatedComponents = makeAnimated();
  const [open, setOpen] = useState(false);


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
      preferred_foot: '',
      other_positions: []
    },
    football_history: {
      current_club: '',
      previous_clubs: [{
        age_group: '',
        club: '',
        league: '',
        k1_affiliated: false
      }],
      private_coaching: false,
      awards_achieved: false,
      highlights_footage_link: '',
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
      challengesMap: {
        challenge1: 0,
        challenge2: 0,
        challenge3: 0
      }
    }
  })
  const steps = getSteps();

  const {
    name,
    gender,
    dob,
    address_line_1,
    address_line_2,
    city,
    postcode,
    residency_certificate } = applicationDetails.personal_details
  const {
    height,
    weight,
    position,
    other_positions,
    preferred_foot } = applicationDetails.player_attributes
  const {
    current_club,
    private_coaching,
    awards_achieved,
    previous_clubs,
    highlights_footage_link,
    bio_description
  } = applicationDetails.football_history
  const {
    link_1,
    link_2,
    link_3
  } = applicationDetails.challenges

  const videoLinks = {
    goalkeeper_demos: [
      {
        title: application['8'][locale].split('.')[0],
        src: 'https://www.youtube.com/embed/HmWpssuh_9A?rel=0'
      },
      {
        title: application['8'][locale].split('.')[1],
        src: 'https://www.youtube.com/embed/1OWOrbmvUhc?rel=0'
      },
      {
        title: application['8'][locale].split('.')[2],
        src: 'https://www.youtube.com/embed/Q-hR_gNElo0?rel=0'
      }
    ],
    outfield_demos: [
      {
        title: application['8'][locale].split('.')[0],
        src: 'https://www.youtube.com/embed/al41qjS04-Q?rel=0'
      },
      {
        title: application['8'][locale].split('.')[1],
        src: 'https://www.youtube.com/embed/3wAQxJeyyXo?rel=0'
      },
      {
        title: application['8'][locale].split('.')[2],
        src: 'https://www.youtube.com/embed/qUm8TSGtenI?rel=0'
      }
    ],
  }


  const isValidNewOption = (inputValue, selectValue) => {
    return inputValue.length > 0 && selectValue.length < 2;
  }


  const playing_positions = [

    { value: 'goalkeper', label: 'Goalkeeper' },
    { value: 'right back', label: 'Right Back' },
    { value: 'right wing back', label: 'Right Wing Back' },
    { value: 'right wing', label: 'Right Wing' },
    { value: 'right midfield', label: 'Right Midfield' },
    { value: 'centre back', label: 'Centre Back' },
    { value: 'sweeper', label: 'Sweeper' },
    { value: 'left back', label: 'Left Back' },
    { value: 'left wing back', label: 'Left Wing Back' },
    { value: 'left wing', label: 'Left Wing' },
    { value: 'left midfield', label: 'Left Midfield' },
    { value: 'central midfield', label: 'Central Midfield' },
    { value: 'defensive midfield', label: 'Defensive Midfield' },
    { value: 'attacking midfield', label: 'Attacking Midfield' },
    { value: 'striker', label: 'Striker' }]

  function getData() {
    axios.get(`/users/${auth.getUserId()}`)
      .then(res => {
        console.log('THISS ISSSS', res.data[0])
        const { applications, name } = res.data[0]
        const { goalkeeper_demos, outfield_demos } = videoLinks
        const { personal_details } = applicationDetails

        if (!applications.hasOwnProperty('benfica_application')) {

          setApplicationDetails({
            ...applicationDetails,
            personal_details: {
              ...personal_details,
              name
            }
          })
        } else {
          const { benfica_application } = res.data[0].applications
          const { position } = benfica_application.player_attributes
          setVideoSource(position === 'goalkeeper' ? goalkeeper_demos[0].src : outfield_demos[0].src)
          setApplicationDetails(benfica_application)
        }

      })
  }


  useEffect(() => {

    // handleApplicationSave('submit')

    const uA = navigator.userAgent;
    const vendor = navigator.vendor;

    if (/Safari/i.test(uA) && /Apple Computer/.test(vendor) && !/Mobi|Android/i.test(uA)) {
      setIsSafari(true)
    }

    if (!auth.getUserId()) {
      history.push('/authentication')
      return
    } else {
      getData()
    }
  }, [])

  function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

  const closeSnackBar = (event, reason) => {
    if (reason === 'clickaway') return;
    setMessage();
  };

  function handleApplicationSave(type) {
    setIsLoading(true)
    const age = moment('2021-12-31').diff(dob, 'years')
    const group = age < 16 ? 16 : (age !== 18 && age < 19) ? age + 1 : 18

    axios.patch(`/users/${auth.getUserId()}`, {
      userId: auth.getUserId(),
      updates: {
        dob,
        applications: {
          benfica_application: {
            ...(type && {
              localization: locale,
              age_group: `Under ${group}s`,
              submitted: true
            }),
            ...applicationDetails
          }
        }
      }
    }, { headers: { Authorization: `Bearer ${auth.getToken()}` } })
      .then(res => {
        if (type === 'submit') {
          axios.post('/contactPlayer', {
            type: 'applicationReceived',
            recipient: { recipientId: auth.getUserId() },
            emailContent: { contentCourse: `Benfica Camp: Under ${group}s` },
            locale: locale
          }).then((res) => {
            setMessage({ success: snackbar_messages['1a'][locale], info: res.info })
            setIsLoading(false)
          })
        } else {
          setMessage({ success: snackbar_messages['1b'][locale] })
          setIsLoading(false)
        }
      })
      .catch(err => {
        setIsLoading(false)
        setMessage({
          error: snackbar_messages['2'][locale]
        })
      })
  }

  const handleClickOpen = () => {
    console.log('bye')
    setOpen(true);
  };

  const handleClose = () => {
    console.log('fired')
    setOpen(false);
  };

  const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

  const scroll = () => {
    const div = document.querySelector('#scrollable')
    div.scrollTop = 0
  }

  const handleNext = async () => {

    if (activeStep === 2) {

      setOpen(true)




    } else {
      scroll()
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }

  };

  const handleBack = () => {
    scroll()
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  function getSteps() {
    return [application['2a'][locale], application['2b'][locale], application['2c'][locale]];
  }

  function handleApplicationChange(e, i) {

    const { player_attributes, personal_details, football_history } = applicationDetails
    const { id, name, value } = e.target


    if (name === 'previous_clubs') {
      const arr = previous_clubs
      arr[i] = { ...arr[i], [id]: value }

      setApplicationDetails({
        ...applicationDetails,
        football_history: {
          ...football_history,
          previous_clubs: arr
        }
      })

    } else if (value === 'goalkeeper' ||
      (value !== 'goalkeeper' && position === 'goalkeeper')) {
      setVideoSource()
      setApplicationDetails({
        ...applicationDetails,
        player_attributes: {
          ...player_attributes,
          [name]: value
        }
      })
    } else if (name === 'dob') {

      if (isSafari &&
        value.split('').length !== 10 &&
        dob.split('').length !== 10) {
        return setApplicationDetails({
          ...applicationDetails,
          personal_details: {
            ...personal_details,
            dob: value
          }
        })
      }


      const age = moment('2021-12-31').diff(value, 'years')
      const group = age < 16 ? 16 : (age !== 18 && age < 19) ? age + 1 : 18

      setMessage((age > 14 && age < 19) ? {
        info: snackbar_messages['3'][locale].replace('s', `${group}s`)
      } : {
          error: snackbar_messages['4'][locale]
        })

      if (age > 14 && age < 19) {
        setApplicationDetails({
          ...applicationDetails,
          personal_details: {
            ...personal_details,
            dob: value
          }
        })
      }


    } else {

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


  }

  const handleResidencyDocumentUpload = (e) => {

    const doc = e.target.files

    setIsLoading(true)
    const certificate = new FormData()
    certificate.append('owner', auth.getUserId())
    certificate.append('certificate', doc[0], doc[0].name)

    handleApplicationSave()

    axios.post('/korean-residency', certificate,
      { headers: { Authorization: `Bearer ${auth.getToken()}` } })
      .then(res => {
        getData()
        setMessage({ success: snackbar_messages['5'][locale] })
        setIsLoading(false)
      })
      .catch(async err => {
        const res = err.response.data.error

        await setMessage({
          error: res === 'Error verifying token' ?
            snackbar_messages['6a'][locale] : snackbar_messages['6b'][locale]
        })
        await setIsLoading(false)

        setTimeout(() => {
          history.push('/authentication')
        }, (3000));
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

  const Menu = props => {
    const optionSelectedLength = props.getValue().length || 0;

    return (
      <components.Menu {...props}>
        {optionSelectedLength < 2 ? (
          props.children
        ) : (
            <div>Max limit achieved</div>
          )}
      </components.Menu>
    );
  };

  const firstPage = (
    <>
      <Typography className={classes.subHeading} component='div' >
        <Box
          fontSize={18}
          fontWeight="fontWeightBold" m={0}>
          Guardian Details
        </Box>
      </Typography>

      <div className="field">
        <div class="field-body">

          <div className={classes.field}>
            <div className={classes.label}>
              <label> <span style={{ color: 'red' }}>*</span>
                First Name
              </label>
            </div>
            <p class="control is-expanded">
              <input
                value={name}
                class="input" type="text"
                name='guardian_first_name'
                placeholder='John' />
            </p>
          </div>


          <div className={classes.field}>
            <div className={classes.label}>
              <label> <span style={{ color: 'red' }}>*</span>
                Last Name
              </label>
            </div>
            <p class="control is-expanded">
              <input
                value={name}
                class="input" type="text"
                name='guardian_last_name'
                placeholder='Doe' />
            </p>
          </div>



        </div>

        <div className="field-body">

          <div className={classes.field}>
            <div className={classes.label}>
              <label> <span style={{ color: 'red' }}>*</span>
                Email Address
              </label>
            </div>
            <p class="control is-expanded">
              <input
                value={name}
                class="input" type="email"
                name='guardian_email_address'
                placeholder='john_doe@hotmail.com' />
            </p>
          </div>

          <div className={classes.field}>
            <div className={classes.label}>
              <label> <span style={{ color: 'red' }}>*</span>
                Contact Number
               </label>
            </div>
            <div className="field has-addons">
              <p class="control">
                <a class="button is-static">
                  +44
              </a>
              </p>
              <p class="control is-expanded">
                <input class="input" type="tel" placeholder='123456789' />
              </p>
            </div>
          </div>
        </div>
      </div>

      <Typography className={classes.subHeading} component='div' >
        <Box
          fontSize={18}
          fontWeight="fontWeightBold" m={0}>
          Player Details
        </Box>
      </Typography>

      <div class="field">
        <div class="field-body">

          <div className={classes.field}>
            <div className={classes.label}>
              <label> <span style={{ color: 'red' }}>*</span>

                {/* {application['2a'][locale]} */}
                First Name

              </label>
            </div>
            <p class="control is-expanded">
              <input
                value={name}
                class="input" type="text"
                name='name'
                placeholder={application['2a'][locale]} />
            </p>
          </div>


          <div className={classes.field}>
            <div className={classes.label}>
              <label> <span style={{ color: 'red' }}>*</span>

                {/* {application['2a'][locale]} */}
                Last Name

              </label>
            </div>
            <p class="control is-expanded">
              <input
                value={name}
                class="input" type="text"
                name='name'
                placeholder={application['2a'][locale]} />
            </p>
          </div>

          <div className={classes.field} style={{ flex: 0.4 }}>
            <div className={classes.label}>
              <label > <span style={{ color: 'red' }}>*</span>
                {application['4b'][locale]}
              </label>
            </div>
            <div class="select" style={{ width: '100%' }}>
              <select value={gender} name='gender' style={{ width: '100%' }}>
                <option disabled={gender !== ''} value=""> </option>
                <option value="male"> {application['4c'][locale].split('/')[1]} </option>
                <option value="female"> {application['4c'][locale].split('/')[0]}</option>
              </select>
            </div>
          </div>

          <div className={classes.field} style={{ flex: 0.4 }}>
            <div className={classes.label}>
              <label > <span style={{ color: 'red' }}>*</span>
                {`${application['4d'][locale]} ${isSafari ? '(YYYY-MM-DD)' : ''}`}
              </label>
            </div>
            <p class={isSafari ? 'control is-expanded' : 'control'} >

              {isSafari ?
                <input
                  value={dob}
                  class="input"
                  type="text"
                  name='dob'
                  placeholder="YYYY-MM-DD" />
                : <input value={dob} name='dob' class="input" type="date" />}
            </p>
          </div>




        </div>

        <div class="field-body">
          <div className={classes.field}>
            <div className={classes.label}>
              <label> <span style={{ color: 'red' }}>*</span> {application['4e'][locale]} </label>
            </div>
            <p class="control is-expanded">
              <input
                value={address_line_1}
                name='address_line_1'
                class="input"
                type="text"
                placeholder="Address Line 1" />
            </p>
          </div>

          <div className={classes.field}>
            <div className={classes.label}>
              <label> {application['4f'][locale]}</label>
            </div>
            <p class="control is-expanded">
              <input value={address_line_2} name='address_line_2' class="input" type="text" placeholder="Address Line 2" />
            </p>
          </div>

        </div>

        <div class="field-body"
          style={{ width: '70%' }}
        >

          <div className={classes.field}>
            <div className={classes.label}>
              <label> <span style={{ color: 'red' }}>*</span> {application['4g'][locale]} </label>
            </div>
            <p class="control is-expanded">
              <input value={city} name='city' class="input" type="text" placeholder="City" />
            </p>
          </div>

          <div className={classes.field}>
            <div className={classes.label}>
              <label> <span style={{ color: 'red' }}>*</span> Country </label>
            </div>
            <p class="control is-expanded">
              <input value={city} name='country' class="input" type="text" placeholder="South Korea" />
            </p>
          </div>




          <div className={classes.field}>
            <div className={classes.label}>
              <label> <span style={{ color: 'red' }}>*</span> {application['4h'][locale]}</label>
            </div>
            <p class="control is-expanded">
              <input value={postcode} name='postcode' class="input" type="text" placeholder=" Postcode" />
            </p>
          </div>




        </div>

        <div class="field-body">

          <div className={classes.field}>
            <div className={classes.label}>
              <label> <span style={{ color: 'red' }}>*</span> Nationality</label>
            </div>
            <p class="control is-expanded">
              <input value={city} name='nationality' class="input" type="text" placeholder="Korean" />
            </p>
          </div>



          <div className={classes.field}>
            <div className={classes.label}>
              <label> <span style={{ color: 'red' }}>*</span>
                {application['4i'][locale]}
              </label>
            </div>
            <div class="file has-name">
              <label class="file-label">
                <input
                  onChange={(e) => handleResidencyDocumentUpload(e)}
                  class="file-input"
                  type="file"
                  name='residency_certificate' />
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
                    {application['4j'][locale]}
                  </span>
                </span>

                {residency_certificate &&
                  <span
                    onClick={() => window.open(residency_certificate, '_blank')}
                    class="file-name">
                    <Tooltip placement="bottom-start" title="Click to view uploaded document">
                      <span> {residency_certificate} </span>
                    </Tooltip>
                  </span>}

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
          {application['5a'][locale]}
        </Box>
      </Typography>

      <div class="field-body" style={{ width: '100%' }}>
        <div className={classes.field} style={{ flex: 'none' }}>
          <div className={classes.label}>
            <label> <span style={{ color: 'red' }}>*</span> {application['5b'][locale]} (cm) </label>
          </div>
          <p class="control is-expanded">
            <input value={height} name='height' class="input" type="number" min={150} placeholder={application['4e'][locale]} />
          </p>
        </div>

        <div className={classes.field} style={{ flex: 'none' }}>
          <div className={classes.label}>
            <label> <span style={{ color: 'red' }}>*</span> {application['5c'][locale]} (kg) </label>
          </div>
          <p class="control is-expanded">
            <input value={weight} name='weight' class="input" type="number" min={50} placeholder={application['4e'][locale]} />
          </p>
        </div>


        <div className={classes.field} style={{ flex: 'none' }}>
          <div className={classes.label}>
            <label> <span style={{ color: 'red' }}>*</span> {application['5e'][locale]} </label>
          </div>
          <div class="select">
            <select value={preferred_foot} name='preferred_foot'>
              <option disabled={preferred_foot !== ''} value=""> </option>
              <option value="left"> Left </option>
              <option value="right"> Right </option>
              <option value="both"> Both </option>
            </select>
          </div>
        </div>


      </div>

      <div className="field-body">
        <div className={classes.field} style={{ flex: 'none' }}>

          <div className={classes.label}>
            <label> <span style={{ color: 'red' }}>*</span> {application['5d'][locale]} </label>
          </div>

          <div class="select">
            <select value={position} name='position'>
              <option disabled={position !== ''} value=""> </option>
              {playing_positions.map(x => <option value={x.value.toLowerCase()}> {x.label} </option>)}
            </select>
          </div>

        </div>

        <div className={classes.field} style={{ flex: 'none' }}>
          <div className={classes.label}>
            <label> Other Positions </label>
          </div>

          <Selector
            style={{ minWidth: '200px' }}
            closeMenuOnSelect={false}
            components={{ Menu }}
            isMulti
            value={playing_positions.filter(x => other_positions.includes(x.value))}
            name='other_positions'
            onChange={(x, y) => {
              const { option, action, removedValue } = y
              const { player_attributes } = applicationDetails

              let arr

              if (action === 'clear') {
                arr = []
              } else if (action === 'remove-value') {
                const { value } = removedValue
                arr = other_positions
                arr.splice(other_positions.indexOf(value), 1)
              } else {
                const { value } = option
                arr = other_positions.concat(value)
              }

              setApplicationDetails({
                ...applicationDetails,
                player_attributes: {
                  ...player_attributes,
                  other_positions: arr
                }
              })
            }}
            isValidNewOption={isValidNewOption}
            isSearchable={false}
            options={playing_positions}
          />

        </div>


      </div>






    </>
  )

  const secondPage = (
    <>

      <Typography className={classes.subHeading} component='div' >
        <Box
          fontSize={18}
          fontWeight="fontWeightBold" m={0}>
          Playing Details
        </Box>
      </Typography>


      <div class="field">


        <div className={classes.field}>
          <div className={classes.label}>
            <label> <span style={{ color: 'red' }}>*</span> {application['6a'][locale]}</label>
          </div>
          <p class="control is-expanded">
            <input value={current_club} name='current_club' class="input" type="text" placeholder={application['6a'][locale]} />

          </p>
        </div>




        <div className="field-body">
          <FormControlLabel
            style={{ transform: 'translateX(5px)' }}

            onClick={() => {
              setApplicationDetails({
                ...applicationDetails,
                football_history: {
                  ...applicationDetails.football_history,
                  private_coaching: !private_coaching
                }
              })
            }}
            control={<Radio checked={private_coaching} />}
            label='Please check if you are currently attending private coaching sessions' />

        </div>

        {private_coaching && <>

          <div className="field-body">
            <div className={classes.field}>
              <div className={classes.label}>
                <label> <span style={{ color: 'red' }}>*</span> Coach Name</label>
              </div>
              <p class="control is-expanded">
                <input value={applicationDetails.private_coach_name && applicationDetails.private_coach_name}
                  name='private_coach_name'
                  class="input" type="text" placeholder='Coach Name' />
              </p>
            </div>
          </div>

        </>}



        <div class="field-body">
          <div className={classes.field}>
            <div className={classes.label}>
              <label >  {application['6c'][locale]} </label>
              <p style={{ fontWeight: 'initial', position: 'relative' }} class="help"> Add a maximum of 3 previous clubs

             {previous_clubs.length !== 3 && <Fab
                  onClick={() => {
                    setApplicationDetails({
                      ...applicationDetails,
                      football_history: {
                        ...applicationDetails.football_history,
                        previous_clubs: [...previous_clubs, {
                          age_group: '',
                          league: '',
                          club: '',
                          k1_affiliated: false
                        }]
                      }
                    })
                  }}
                  style={{
                    position: 'absolute',
                    top: '-15px',
                    right: previous_clubs.length === 1 ? 0 : '45px',
                    width: '36px',
                    height: '10px'
                  }}
                  size="small" color="primary" aria-label="add">
                  <AddIcon />
                </Fab>}

                {previous_clubs.length !== 1 && <Fab
                  onClick={() => {
                    setApplicationDetails({
                      ...applicationDetails,
                      football_history: {
                        ...applicationDetails.football_history,
                        previous_clubs: previous_clubs.filter((x, i) => i !== previous_clubs.length - 1)
                      }
                    })
                  }}
                  style={{
                    position: 'absolute',
                    top: '-15px',
                    right: 0,
                    width: '36px',
                    height: '10px'
                  }}
                  size="small" color="secondary" aria-label="add">
                  <ClearSharpIcon />
                </Fab>}
              </p>
            </div>
          </div>
        </div>


        {previous_clubs.map((el, i) => {
          return (
            <>
              <div class="field-body">
                <div className={classes.field} style={{ flex: 'none' }}>
                  <div className={classes.label}>
                    <label> Age Group </label>
                  </div>
                  <div class="select">
                    <select
                      onChange={(e) => handleApplicationChange(e, i)}
                      value={el.age_group} id='age_group' name='previous_clubs'>
                      <option disabled={el.age_group !== ''} value=""> </option>
                      <option value="under 16s"> Under 16s </option>
                      <option value="under 10s"> Under 10s </option>
                      <option value="under 14s"> Under 14s </option>
                    </select>
                  </div>
                </div>

                <div className={classes.field} style={{ flex: '0.6' }}>
                  <div className={classes.label}>
                    <label> Club Name </label>
                  </div>
                  <p class="control is-expanded">
                    <input
                      onChange={(e) => handleApplicationChange(e, i)}
                      value={el.club} id='club' name='previous_clubs' class="input" type="text"
                      placeholder='Club Name' />
                  </p>
                </div>

                <div className={classes.field} style={{ flex: 'none' }}>
                  <div className={classes.label}>
                    <label> League </label>
                  </div>
                  <div class="select">
                    <select
                      onChange={(e) => handleApplicationChange(e, i)}
                      value={el.league} id='league' name='previous_clubs'>
                      <option disabled={preferred_foot !== ''} value=""> </option>
                      <option value="league 1"> League 1 </option>
                      <option value="league 2"> League 2 </option>
                      <option value="league 3"> League 3</option>
                    </select>
                  </div>
                </div>


              </div>

              <FormControlLabel
                style={{ transform: 'translateX(5px)' }}

                onClick={() => {
                  const arr = previous_clubs
                  arr[i] = { ...arr[i], k1_affiliated: !el.k1_affiliated }

                  setApplicationDetails({
                    ...applicationDetails,
                    football_history: {
                      ...applicationDetails.football_history,
                      previous_clubs: arr
                    }
                  })
                }}
                control={<Radio checked={el.k1_affiliated} />}
                label='This club is affiliated with a K1 club' />


            </>
          )
        })}

        <div className={classes.field}>
          <div className={classes.label}>
            <label >  {application['6e'][locale]} </label>
          </div>
          <p class="control is-expanded">
            <input value={highlights_footage_link} name='highlights_footage_link' class="input" type="text" placeholder={application['6e'][locale]} />
          </p>
        </div>

        <div class="field-body">
          <FormControlLabel
            style={{ transform: 'translateX(5px)' }}
            onClick={() => {
              setApplicationDetails({
                ...applicationDetails,
                football_history: {
                  ...applicationDetails.football_history,
                  awards_achieved: !awards_achieved
                }
              })
            }}
            control={<Radio checked={awards_achieved} />}
            label='Please check if you have achieved any awards (KFA, Regional FA, Foundation)' />
        </div>

        {awards_achieved && <div className="field-body">
          <div className={classes.field}>
            <div className={classes.label}>
              <label> Award Name </label>
            </div>
            <div class="select">
              <select
                value={applicationDetails.award_name && applicationDetails.award_name}
                name='award_name'>
                <option value=""> </option>
                <option value="kfa"> KFA Award </option>
                <option value="regional"> Regional FA Award </option>
                <option value="foundation"> Foundation Award </option>
              </select>
            </div>
          </div>
        </div>}

      </div>

      <div class="field">
        <div class="field-body">
          <div className={classes.field}>
            <div className={classes.label}>
              <label> <span style={{ color: 'red' }}>*</span>  Personal Statement </label>
              <p style={{ fontWeight: 'initial' }} class="help">  {application['6h'][locale]} </p>
            </div>

            <div class="control">

              <textarea value={bio_description} name='bio_description' style={{ minHeight: '15rem' }} class="textarea" placeholder={application['6g'][locale]}></textarea>
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
          {application['7a'][locale]}
        </Box>
        <Box
          fontSize={16}
          fontWeight="fontWeightRegular" m={0}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. In at pellentesque purus, at euismod ligula.
        </Box>
      </Typography>

      <section className={classes.videoContainer}>
        <div>

          <div className={classes.video}>
            {!videoSource ? <p className={classes.bufferText}> Please select one of the demonstration videos below </p> :
              <iframe title='video' width='100%' height='100%' src={videoSource} frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen> </iframe>
            }
          </div>



          <Breadcrumbs style={{ marginTop: '10px' }} aria-label="breadcrumb">
            {/* <Typography> Demonstration Videos: </Typography>  */}

            {videoLinks[position === 'goalkeeper' ?
              'goalkeeper_demos' : 'outfield_demos'].map(el => {
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



        <div className={classes.webfieldContainer} >
          <div className={classes.webfield}>
            <div className={classes.label}>
              <label>  {application['9a'][locale]}  </label>
            </div>
            <p class="control is-expanded">
              <input value={link_1} name='link_1' class="input" type="text" placeholder={application['9a'][locale]} />
            </p>
          </div>
          <div className={classes.webfield}>
            <div className={classes.label}>
              <label>  {application['9b'][locale]} </label>
            </div>
            <p class="control is-expanded">
              <input value={link_2} name='link_2' class="input" type="text" placeholder={application['9b'][locale]} />
            </p>
          </div>
          <div className={classes.webfield}>
            <div className={classes.label}>
              <label >  {application['9c'][locale]} </label>
            </div>
            <p class="control is-expanded">
              <input value={link_3} name='link_3' class="input" type="text" placeholder={application['9c'][locale]} />
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
          {application['1'][locale]}
        </Box>
      </Typography>

      <Stepper alternativeLabel activeStep={activeStep} connector={<ColorlibConnector />}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel StepIconComponent={ColorlibStepIcon}>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <div id='scrollable' className={classes.formContainer}>
        <Typography className={classes.instructions}>
          <form onChange={(e) => handleApplicationChange(e)} action="">
            {getStepContent(activeStep)}
          </form>

        </Typography>
        <div style={{ textAlign: 'end' }}>


          <Button
            style={{ display: activeStep === 0 ? 'none' : 'initial' }}
            disabled={activeStep === 0 || isLoading}
            onClick={handleBack}
            className={classes.button}>

            {application['10a'][locale]}
          </Button>

          <Button
            disabled={isLoading}
            onClick={() => handleApplicationSave()}
            variant="outlined"
            color="primary"
            className={classes.button}
            endIcon={<SaveAltIcon />}>
            {isLoading && <CircularProgress size={30} className={classes.progress} />}
            {application['10b'][locale]}
          </Button>

          <Button
            disabled={isLoading}
            variant="outlined"
            color="primary"
            onClick={handleNext}
            className={classes.button}
            endIcon={<ArrowForwardIcon />}>
            {isLoading && <CircularProgress size={30} className={classes.progress} />}
            {activeStep === steps.length - 1 ? application['10c'][locale] : application['10d'][locale]}
          </Button>
        </div>
      </div>

      {message && <Snackbar
        open={message}
        autoHideDuration={5000}
        onClose={closeSnackBar}>
        <Alert onClose={closeSnackBar} severity={Object.keys(message)[0]}>
          {message[Object.keys(message)[0]]}
        </Alert>
      </Snackbar>}

      {open && <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">
          Application Submission
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Once you submit your application, you will not be able to amend it further.
            If you would like to review or make changes to your application, please click back
            otherwise, please confirm that you would like to submit your application.
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>
            Back
          </Button>
          <Button variant='outlined' onClick={() => {
            handleApplicationSave('submit')
            setTimeout(() => {
              history.push('/success=true')
            }, (3000));
          }} color="primary" autoFocus>
            Submit
          </Button>
        </DialogActions>
      </Dialog>}

    </div>
  );
}
