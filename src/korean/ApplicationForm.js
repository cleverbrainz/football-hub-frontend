import React, { useState, useEffect } from 'react';
import { application, buttons, snackbar_messages, authorization } from './LanguageSkeleton'
import { NationalityDropDown } from './Nationality'
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
import PhoneDropDown from '../pages/admin/PhoneDropdown';

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
    fontSize: '13px'
  },
  field: {
    flex: 1,
    margin: '20px 0',
    [theme.breakpoints.up('md')]: {
      margin: '7px 5px'
    },

  },
  subHeading: {
    margin: 0,
    color: 'orange',
    [theme.breakpoints.up('md')]: {
      marginBottom: '10px',

    },
  },

  chip: {
    transform: 'translateY(-1px)',
    fontSize: '11px',
    margin: '0 5px'
  },

  challengeRowContainer: {
    display: 'flex',
    flexDirection: 'column',
    padding: '30px 0',
    [theme.breakpoints.up('md')]: {
      flexDirection: 'row',
    },
  },
  challengeRowReversed: {
    display: 'flex',
    flexDirection: 'column',
    padding: '30px 0',
    [theme.breakpoints.up('md')]: {
      flexDirection: 'row-reverse',
    },

  },
  challengeDescription: {
    padding: '50px 25px 35px',
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '50%',
    },
  },
  videoContainer: {
    width: '100%',
    height: '40vh',
    [theme.breakpoints.up('md')]: {
      width: '50%',
      height: 'auto',
    },

  },
  challengeNumber: {
    position: 'absolute',
    transform: 'translate(-2px, -56px)',
    opacity: 0.28,
    fontFamily: 'Roboto Condensed'
  }

}));




export default function ApplicationForm({ history, location, locale, match, setLocale }) {
  // console.log(match)

  // console.log(history, location)
  const classes = useStyles();
  const [message, setMessage] = useState()
  const [isLoading, setIsLoading] = useState(false)
  const [activeStep, setActiveStep] = useState(0);
  const [isSafari, setIsSafari] = useState(false)
  const [open, setOpen] = useState(false);
  const [accountCategory, setAccountCategory] = useState()

  if (match.params.locale && locale !== match.params.locale) {
    // console.log(match.params.locale, locale)
    setLocale(match.params.locale)
  }


  const [applicationDetails, setApplicationDetails] = useState({
    personal_details: {
      player_first_name: '',
      player_last_name: '',
      gender: '',
      dob: '',
      address_line_1: '',
      address_line_2: '',
      city: '',
      postcode: '',
      contact_number: ['+', '', ''],
      alt_contact_number: ['+', '', ''],
      can_provide_certificates: false,
      nationality: '',
      country: '',
    },
    player_attributes: {
      height: '',
      weight: '',
      position: '',
      preferred_foot: '',
      other_positions: []
    },
    football_history: {
      current_club: {
        age_group: '',
        club: '',
        // k1_affiliated: false,
        middle_school: '',
        k1_club: ''
      },
      previous_clubs: [],
      // private_coaching: false,
      private_coach_name: '',
      private_coach_company: '',
      private_coach_website: '',
      award_name: '',
      award_date: '',
      award_reasoning: '',
      award_achieved: false,
      highlights_footage_link: [],
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
    player_first_name,
    player_last_name,
    guardian_last_name,
    guardian_first_name,
    gender,
    contact_number,
    alt_contact_number,
    dob,
    address_line_1,
    address_line_2,
    city,
    postcode,
    nationality,
    email,
    country,
    can_provide_certificates
  } = applicationDetails.personal_details
  const {
    height,
    weight,
    position,
    other_positions,
    preferred_foot } = applicationDetails.player_attributes
  const {
    current_club,
    // private_coaching,
    // award_achieved,
    award_name,
    award_date,
    award_reasoning,
    previous_clubs,
    highlights_footage_link,
    bio_description,
    private_coach_name,
    private_coach_website,
    private_coach_company,

  } = applicationDetails.football_history
  const {
    link_1,
    link_2,
    link_3
  } = applicationDetails.challenges

  const [videoLinks, setVideoLinks] = useState()

  const isValidNewOption = (inputValue, selectValue) => {
    return inputValue.length > 0 && selectValue.length < 2;
  }

  const playing_positions = application['17']['en'].split('/').map((x, i) => {
    return {
      value: x.toLowerCase(),
      label: application['17'][locale].split('/')[i]
    }
  })

  function getData() {
    axios.get(`/users/${auth.getUserId()}`)
      .then(res => {
        console.log('THISS ISSSS', res.data[0])
        const { applications, email, category,
          guardian_first_name, guardian_last_name,
          player_first_name, player_last_name } = res.data[0]
        const { personal_details, player_attributes } = applicationDetails


        if (!applications.hasOwnProperty('ajax_application')) {
          setApplicationDetails({
            ...applicationDetails,
            personal_details: {
              ...personal_details,
              email,
              player_first_name,
              player_last_name,
              ...(category === 'parent' && {
                guardian_first_name,
                guardian_last_name,
              })
            }
          })
          setVideoLinks([
            {
              title: application['9a'][locale],
              src: 'https://www.youtube.com/embed/JJzwWOiLu1g?rel=0',
              desc: application['9g'][locale]
            },
            {
              title: application['9b'][locale],
              src: 'https://www.youtube.com/embed/DCxK_LIeOfc?rel=0',
              desc: application['9h'][locale]
            },
            {
              title: application['9c'][locale],
              src: 'https://www.youtube.com/embed/eWSKqaATIxE?rel=0',
              desc: application['9i'][locale]
            }
          ])
          setAccountCategory(category)
        } else {
          const { ajax_application } = res.data[0].applications
          const { position } = ajax_application.player_attributes
          setApplicationDetails(ajax_application)
          setAccountCategory(category)
          setVideoLinks(position === 'goalkeeper' ? [
            {
              title: application['9a'][locale],
              src: 'https://www.youtube.com/embed/JJzwWOiLu1g?rel=0',
              desc: application['9g'][locale]
            },
            {
              title: application['9b'][locale],
              src: 'https://www.youtube.com/embed/DCxK_LIeOfc?rel=0',
              desc: application['9h'][locale]
            },
            {
              title: application['9c'][locale],
              src: 'https://www.youtube.com/embed/eWSKqaATIxE?rel=0',
              desc: application['9i'][locale]
            }
          ] : [
              {
                title: application['9d'][locale],
                src: 'https://www.youtube.com/embed/9bNPjGHyO2M?rel=0',
                desc: application['9j'][locale]
              },
              {
                title: application['9e'][locale],
                src: 'https://www.youtube.com/embed/JcIcTsQlROs?rel=0',
                desc: application['9k'][locale]
              },
              {
                title: application['9f'][locale],
                src: 'https://www.youtube.com/embed/rFhow4TOoD4?rel=0',
                desc: application['9l'][locale]
              }
            ])
        }

      })
  }


  useEffect(() => {

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
    const group = age < 13 ? 13 : (age !== 14 && age < 15) ? age + 1 : 15
    console.log(applicationDetails.personal_details)
    handleClose()


    axios.patch(`/users/${auth.getUserId()}`, {
      userId: auth.getUserId(),
      updates: {
        dob,
        applications: {
          ajax_application: {
            ...(type === 'submit' && {
              age_group: `Under ${group}s`,
              submitted: true,
              submission_date: moment()
            }),
            ...applicationDetails,
            personal_details: {
              ...applicationDetails.personal_details,
              contact_number: type === 'submit' ? contact_number.join('') : contact_number,
              alt_contact_number:  type === 'submit' ? (alt_contact_number[1] && alt_contact_number[2]) ? alt_contact_number.join('') : contact_number.join('') : alt_contact_number
            }
          }
        }
      }
    }, { headers: { Authorization: `Bearer ${auth.getToken()}` } })
      .then(res => {
        if (type === 'submit') {
          axios.post('/contactPlayer', {
            type: 'applicationReceived',
            recipient: { recipientId: auth.getUserId() },
            emailContent: { contentCourse: `Ajax Camp: Under ${group}s` },
            locale: locale
          }).then((res) => {
            setMessage({ success: snackbar_messages['1a'][locale], info: res.info })
            setIsLoading(false)
          })
        } else {
          setMessage({ success: `${snackbar_messages['1b'][locale]} Redirecting to profile...` })
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

  const handleClose = () => {
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

    function checkRequiredFields(arr) {
      const check = arr.filter(x => !x && x === '')
      console.log(check)

      if (check !== [] && check.length > 0) {
        setMessage({
          error: `${snackbar_messages['8a'][locale]} ${activeStep === 2 ? snackbar_messages['8b'][locale] : snackbar_messages['8c'][locale]}.`
        })
      } else {

        if (activeStep === 2) {
          setOpen(true)
        } else {
          scroll()
          setActiveStep((prevActiveStep) => prevActiveStep + 1);
        }
      }
    }

    if (activeStep === 0) {

      const required = [height, weight, position,
        preferred_foot, country, email, nationality, postcode, city, address_line_1,
        dob, contact_number, gender, player_first_name, player_last_name]

      checkRequiredFields(required)


    } else if (activeStep === 1) {

      const required = [bio_description,
        current_club.age_group, current_club.club, current_club.middle_school]

      if (previous_clubs.length > 0 && previous_clubs !== []) {
        previous_clubs.forEach((x, i) => {
          const arr = [previous_clubs[i].club, previous_clubs[i].age_group]
          arr.forEach(x => required.push(x))
        })
      }

      checkRequiredFields(required)

    } else if (activeStep === 2) {

      const required = [link_1, link_2, link_3]
      checkRequiredFields(required)
    }
  };

  const handleBack = () => {
    scroll()
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  function getSteps() {
    return [application['2e'][locale], application['2c'][locale], application['2d'][locale]];
  }

  function handleApplicationChange(e, i) {
    const { personal_details, football_history } = applicationDetails
    const { id, name, value } = e.target


    if (name === 'position') {
      setVideoLinks(value === 'goalkeeper' ? [
        {
          title: application['9a'][locale],
          src: 'https://www.youtube.com/embed/JJzwWOiLu1g?rel=0',
          desc: application['9g'][locale]
        },
        {
          title: application['9b'][locale],
          src: 'https://www.youtube.com/embed/DCxK_LIeOfc?rel=0',
          desc: application['9h'][locale]
        },
        {
          title: application['9c'][locale],
          src: 'https://www.youtube.com/embed/eWSKqaATIxE?rel=0',
          desc: application['9i'][locale]
        }
      ] : [
          {
            title: application['9d'][locale],
            src: 'https://www.youtube.com/embed/9bNPjGHyO2M?rel=0',
            desc: application['9j'][locale]
          },
          {
            title: application['9e'][locale],
            src: 'https://www.youtube.com/embed/JcIcTsQlROs?rel=0',
            desc: application['9k'][locale]
          },
          {
            title: application['9f'][locale],
            src: 'https://www.youtube.com/embed/rFhow4TOoD4?rel=0',
            desc: application['9l'][locale]
          }
        ])
    }

    if (name === 'current_club') {
      setApplicationDetails({
        ...applicationDetails,
        football_history: {
          ...football_history,
          current_club: {
            ...current_club, [id]: value
          }
        }
      })
    } else if (name === 'previous_clubs') {
      const arr = previous_clubs
      arr[i] = { ...arr[i], [id]: value }

      setApplicationDetails({
        ...applicationDetails,
        football_history: {
          ...football_history,
          previous_clubs: arr
        }
      })
    } else if (name === 'highlights_footage_link') {
      const arr = highlights_footage_link
      arr[i] = value

      setApplicationDetails({
        ...applicationDetails,
        football_history: {
          ...football_history,
          highlights_footage_link: arr
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
      const group = age < 13 ? 13 : (age !== 14 && age < 15) ? age + 1 : 15

      setMessage((age > 11 && age < 15) ? {
        info: snackbar_messages['3'][locale].replace('s', `${group}s`)
      } : {
          error: snackbar_messages['4'][locale]
        })

      if (age > 11 && age < 15) {
        setApplicationDetails({
          ...applicationDetails,
          personal_details: {
            ...personal_details,
            dob: value
          }
        })
      }


    } else if (name === 'country_code' || name === 'contact_number') {
      const newNumber = [...personal_details.contact_number]
      const element = name === 'country_code' ? 1 : 2
      newNumber[element] = value
      setApplicationDetails({
        ...applicationDetails,
        personal_details: {
          ...personal_details,
          contact_number: newNumber
        }
      })

    } else if (name === 'alt_country_code' || name === 'alt_contact_number') {
      const newNumber = [...personal_details.contact_number]
      const element = name === 'alt_country_code' ? 1 : 2
      newNumber[element] = value
      setApplicationDetails({
        ...applicationDetails,
        personal_details: {
          ...personal_details,
          alt_contact_number: newNumber
        }
      })

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

  // const handleResidencyDocumentUpload = (e) => {

  //   const doc = e.target.files

  //   setIsLoading(true)
  //   const certificate = new FormData()
  //   certificate.append('owner', auth.getUserId())
  //   certificate.append('certificate', doc[0], doc[0].name)

  //   handleApplicationSave()

  //   axios.post(`/korean-residency`, certificate,
  //     { headers: { Authorization: `Bearer ${auth.getToken()}` } })
  //     .then(res => {
  //       console.log('HELLOOO DOCU UPLOADED')
  //       getData()
  //       setMessage({ success: 'Document successfully uploaded.' })
  //       setIsLoading(false)
  //     })
  //     .catch(async err => {
  //       const res = err.response.data.error

  //       await setMessage({
  //         error: res === 'Error verifying token' ?
  //           snackbar_messages['6a'][locale] : snackbar_messages['6b'][locale]
  //       })
  //       await setIsLoading(false)

  //       setTimeout(() => {
  //         history.push('/authentication')
  //       }, (3000));
  //     })
  // }

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
            <div>{application['5h'][locale]}</div>
          )}
      </components.Menu>
    );
  };

  const ageGroupSelection = (
    <>
      <option value="under 12s"> Under 12s </option>
      <option value="under 13s"> Under 13s </option>
      <option value="under 14s"> Under 14s </option>
      <option value="under 15s"> Under 15s </option>
    </>
  )

  const k1ClubSelection = (

    application['18']['en'].split('/').map((x, i) => {
      return <option value={x.toLowerCase()}> {application['18'][locale].split('/')[i]} </option>
    })
  )

  const firstPage = (
    <>


      {accountCategory === 'parent' && <>

        <Typography className={classes.subHeading} component='div' >
          <Box
            fontSize={15}
            fontWeight="fontWeightBold" m={0}>
            {application['2a'][locale]}
          </Box>
        </Typography>


        <div className="field" style={{
          borderBottom: '1px #f1f1f1 dotted',
          paddingBottom: '25px',
          marginBottom: '20px'
        }}>
          <div class="field-body">

            <div className={classes.field}>
              <div className={classes.label}>
                <label> <span style={{ color: 'red' }}>*</span>  {application['3a'][locale]}
                </label>
              </div>
              <p class="control is-expanded">
                <input
                  value={guardian_first_name}
                  class="input" type="text"
                  name='guardian_first_name'
                  placeholder='John' />
              </p>
            </div>


            <div className={classes.field}>
              <div className={classes.label}>
                <label> <span style={{ color: 'red' }}>*</span>  {application['3b'][locale]}
                </label>
              </div>
              <p class="control is-expanded">
                <input
                  value={guardian_last_name}
                  class="input" type="text"
                  name='guardian_last_name'
                  placeholder='Doe' />
              </p>
            </div>



          </div>

          <div className="field-body">

            <div className={classes.field}>
              <div className={classes.label}>
                <label> <span style={{ color: 'red' }}>*</span>  {application['4'][locale]}
                </label>
              </div>
              <div className="field has-addons">
                <p class="control">
                  <a class="button">
                    <select style={{ border: 'none' }} value={contact_number[1]} class="input-block-level" id="countryCode" name="country_code">
                      <PhoneDropDown locale={locale} />
                    </select>
                  </a>
                </p>
                <p class="control is-expanded">
                  <input
                    name='contact_number'
                    value={contact_number[2]}
                    class="input" type="tel" placeholder='123456789' />
                </p>
              </div>
            </div>
            <div className={classes.field}>
              <div className={classes.label}>
                <label> {application['4a'][locale]}
                </label>
              </div>
              <div className="field has-addons">
                <p class="control">
                  <a class="button">
                    <select style={{ border: 'none' }} value={alt_contact_number[1]} class="input-block-level" id="altCountryCode" name="alt_country_code">
                      <PhoneDropDown locale={locale} />
                    </select>
                  </a>
                </p>
                <p class="control is-expanded">
                  <input
                    name='alt_contact_number'
                    value={alt_contact_number[2]}
                    class="input" type="tel" placeholder='123456789' />
                </p>
              </div>
            </div>
          </div>

          <div className={classes.field}>
              <div className={classes.label}>
                <label> <span style={{ color: 'red' }}>*</span>  {authorization['4d'][locale]}
                </label>
              </div>
              <p class="control is-expanded">
                <input
                  value={email}
                  class="input" type="email"
                  name='email'
                  placeholder='john_doe@hotmail.com' />
              </p>
            </div>
        </div>


       


      </>}


      <Typography className={classes.subHeading} component='div' >
        <Box
          fontSize={15}
          fontWeight="fontWeightBold" m={0}>
          {application['2b'][locale]}
        </Box>
      </Typography>

      <div class="field" style={{
        borderBottom: '1px #f1f1f1 dotted',
        paddingBottom: '25px',
        marginBottom: '20px'
      }}>
        <div class="field-body">

          <div className={classes.field}>
            <div className={classes.label}>
              <label> <span style={{ color: 'red' }}>*</span> {application['3a'][locale]}

              </label>
            </div>
            <p class="control is-expanded">
              <input
                value={player_first_name}
                class="input" type="text"
                name='player_first_name'
                placeholder='John' />
            </p>
          </div>


          <div className={classes.field}>
            <div className={classes.label}>
              <label> <span style={{ color: 'red' }}>*</span> {application['3b'][locale]}
              </label>
            </div>
            <p class="control is-expanded">
              <input
                value={player_last_name}
                class="input" type="text"
                name='player_last_name'
                placeholder='Doe' />
            </p>
          </div>
        </div>

        {accountCategory === 'player' && (
          <div className="field-body">

            <div className={classes.field}>
              <div className={classes.label}>
                <label> <span style={{ color: 'red' }}>*</span> {application['4'][locale]}
                </label>
              </div>
              <div className="field has-addons">
                <p class="control">
                  <a class="button">
                    <select style={{ border: 'none' }} value={contact_number[1]} class="input-block-level" id="countryCode" name="country_code">
                      <PhoneDropDown locale={locale} />
                    </select>
                  </a>
                </p>
                <p class="control is-expanded">
                  <input
                    name='contact_number'
                    value={contact_number[2]}
                    class="input" type="tel" placeholder='123456789' />
                </p>
              </div>
            </div>
            <div className={classes.field}>
              <div className={classes.label}>
                <label> {application['4a'][locale]} </label>
              </div>
              <div className="field has-addons">
                <p class="control">
                  <a class="button">
                    <select style={{ border: 'none' }} value={alt_contact_number[1]} class="input-block-level" id="altCountryCode" name="alt_country_code">
                      <PhoneDropDown locale={locale} />
                    </select>
                  </a>
                </p>
                <p class="control is-expanded">
                  <input
                    name='alt_contact_number'
                    value={alt_contact_number[2]}
                    class="input" type="tel" placeholder='123456789' />
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="field-body">

          {accountCategory === 'player' &&
            <div className={classes.field}>
              <div className={classes.label}>
                <label> <span style={{ color: 'red' }}>*</span> {authorization['4d'][locale]}
                </label>
              </div>
              <p class="control is-expanded">
                <input
                  value={email}
                  class="input" type="email"
                  name='email'
                  placeholder='john_doe@hotmail.com' />
              </p>
            </div>}

          <div className={classes.field} style={{ flex: 0.5 }}>
            <div className={classes.label}>
              <label > <span style={{ color: 'red' }}>*</span> {application['4b'][locale]}
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

          <div className={classes.field} style={{ flex: 0.5 }}>
            <div className={classes.label}>
              <label > <span style={{ color: 'red' }}>*</span> {`${application['4d'][locale]} ${isSafari ? '(YYYY-MM-DD)' : ''}`}
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




      </div >

      <div className="field"
        style={{
          borderBottom: '1px #f1f1f1 dotted',
          paddingBottom: '25px',
          marginBottom: '20px'
        }}>

        <Typography className={classes.subHeading} component='div' >
          <Box
            fontSize={15}
            fontWeight="fontWeightBold" m={0}>
            {application['4k'][locale]} 
        </Box>
        </Typography>

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

          <div className={classes.field} style={{ flex: '0.5' }}>
            <div className={classes.label}>
              <label> <span style={{ color: 'red' }}>*</span> {application['4g'][locale]} </label>
            </div>
            <p class="control is-expanded">
              <input value={city} name='city' class="input" type="text" placeholder="City" />
            </p>
          </div>
        </div>

        <div class="field-body">

          <div className={classes.field}>
            <div className={classes.label}>
              <label> <span style={{ color: 'red' }}>*</span> {application['4h'][locale]}</label>
            </div>
            <p class="control is-expanded">
              <input value={country} name='country' class="input" type="text" placeholder="South Korea" />
            </p>
          </div>




          <div className={classes.field}>
            <div className={classes.label}>
              <label> <span style={{ color: 'red' }}>*</span> {application['4h'][locale]} </label>
            </div>
            <p class="control is-expanded">
              <input value={postcode} name='postcode' class="input" type="text" placeholder=" Postcode" />
            </p>
          </div>


          <div className={classes.field} style={{ flex: 0 }} >
            <div className={classes.label}>
              <label> <span style={{ color: 'red' }}>*</span> {application['4i'][locale]}</label>
            </div>
            <div class="select">
              <NationalityDropDown value={nationality} />
            </div>
          </div>



        </div>

        <div class="field-body" >


          <div className="field-body">

            <FormControlLabel
              style={{ transform: 'translate(5px, 5px)', marginTop: '5px' }}
              onClick={() => {
                setApplicationDetails({
                  ...applicationDetails,
                  personal_details: {
                    ...applicationDetails.personal_details,
                    can_provide_certificates: !can_provide_certificates
                  }
                })
              }}
              control={<Radio className='radio-check' checked={can_provide_certificates} />}
              label={`${(nationality !== 'south korean' && locale !== 'en') ? application['4m'][locale] : ''} 
              ${locale === 'ko' ? application['4l'][locale] : nationality === 'south korean' ? 
              application['4l'][locale] : application['4l'][locale].replace('residency', `residency ${application['4m'][locale]}`)}`} />
          </div>



          {/* <div className={classes.field} >
            <div className={classes.label}>
              <label> <span style={{ color: 'red' }}>*</span>   {nationality.toLowerCase() === 'south korean' ?
                'Resident Registration Certificate' : 'Foreigner Registration Certificate'}
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

                <span
                  onClick={() => window.open(residency_certificate, '_blank')}
                  class="file-name" style={{ flex: 1 }}>
                  {!residency_certificate ?
                    'No file uploaded' :
                    <Tooltip placement="bottom-start" title="Click to view uploaded document">
                      <span> {residency_certificate} </span>
                    </Tooltip>
                  }
                </span>

              </label>
            </div>
          </div> */}
        </div>






      </div>


      <Typography component='div'
        className={classes.subHeading} >
        <Box
          fontSize={15}
          fontWeight="fontWeightBold" m={0}>
          {application['5a'][locale]}
        </Box>
      </Typography>

      <div class="field-body">
        <div className={classes.field} style={{ flex: 'none' }}>
          <div className={classes.label}>
            <label> <span style={{ color: 'red' }}>*</span> {application['5b'][locale]} (cm) </label>
          </div>
          <p class="control is-expanded">
            <input value={height} name='height' class="input" type="number" min={150} placeholder={application['5b'][locale]} />
          </p>
        </div>

        <div className={classes.field} style={{ flex: 'none' }}>
          <div className={classes.label}>
            <label> <span style={{ color: 'red' }}>*</span> {application['5c'][locale]} (kg) </label>
          </div>
          <p class="control is-expanded">
            <input value={weight} name='weight' class="input" type="number" min={50} placeholder={application['5c'][locale]} />
          </p>
        </div>


        <div className={classes.field} style={{ flex: 'none' }}>
          <div className={classes.label}>
            <label> <span style={{ color: 'red' }}>*</span> {application['5e'][locale]} </label>
          </div>
          <div class="select" style={{ width: '100%' }} >
            <select style={{ width: '100%' }} value={preferred_foot} name='preferred_foot'>
              <option disabled={preferred_foot !== ''} value=""> </option>
              <option value="left"> {application['5f'][locale].split('/')[0]} </option>
              <option value="right"> {application['5f'][locale].split('/')[1]}</option>
              <option value="both"> {application['5f'][locale].split('/')[2]} </option>
            </select>
          </div>
        </div>
      </div>

      <div className="field-body">
        <div className={classes.field} style={{ flex: 'none' }}>

          <div className={classes.label}>
            <label> <span style={{ color: 'red' }}>*</span> {application['5d'][locale]} </label>
          </div>

          <div class="select" style={{ width: '100%' }} >
            <select style={{ width: '100%' }} value={position} name='position'>
              <option disabled={position !== ''} value=""> </option>
              {playing_positions.map(x => <option value={x.value.toLowerCase()}> {x.label} </option>)}
            </select>
          </div>

        </div>

        <div className={classes.field} style={{ flex: 0.45 }}>
          <div className={classes.label}>
            <label> {application['5g'][locale]} </label>
          </div>

          <Selector
            closeMenuOnSelect={false}
            menuPlacement='top'
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
          fontSize={15}
          fontWeight="fontWeightBold" m={0}>
          {application['6'][locale]}
        </Box>
      </Typography>


      <div class="field" style={{ paddingBottom: '25px', marginBottom: '20px', borderBottom: '1px dotted #f1f1f1' }}>



        <div class="field-body">
          <div className={classes.field}>
            <div className={classes.label}>
              <label> {application['6a'][locale]}   </label>
            </div>
          </div>
        </div>

        <div class="field-body">
          <div className={classes.field} style={{ flex: 'none' }} >
            <div className={classes.label}>
              <label> <span style={{ color: 'red' }}>*</span> {application['6i'][locale]} </label>
            </div>
            <div class="select">
              <select
                onChange={(e) => handleApplicationChange(e)}
                value={current_club.age_group} id='age_group' name='current_club'>
                <option disabled={current_club.age_group !== ''} value=""> </option>
                {ageGroupSelection}
              </select>
            </div>
          </div>

          <div className={classes.field}>
            <div className={classes.label}>
              <label> <span style={{ color: 'red' }}>*</span> {application['6j'][locale]}  </label>
            </div>
            <p class="control is-expanded">
              <input
                onChange={(e) => handleApplicationChange(e)}
                value={current_club.club} id='club' name='current_club' class="input" type="text"
                placeholder='Club Name' />
            </p>
          </div>

          <div className={classes.field}>
            <div className={classes.label}>
              <label> <span style={{ color: 'red' }}>*</span> {application['6k'][locale]} </label>
            </div>
            <p class="control is-expanded">
              <input
                onChange={(e) => handleApplicationChange(e)}
                value={current_club.middle_school} id='middle_school' name='current_club' class="input" type="text"
                placeholder='Middle School' />
            </p>
          </div>

        </div>

        <div className={classes.field}  >
          <div className={classes.label}>
            <label>  {application['6l'][locale]} </label>
          </div>
          <div class="select" style={{ width: '100%' }} >
            <select
              style={{ width: '100%' }}
              onChange={(e) => handleApplicationChange(e)}
              value={current_club.k1_club} id='k1_club' name='current_club'>
              <option disabled={current_club.k1_club !== ''} value=""> </option>
              {k1ClubSelection}
            </select>
          </div>
        </div>

        {/* <FormControlLabel
        style={{ transform: 'translateX(5px)' }}

        onClick={() => {
          setApplicationDetails({
            ...applicationDetails,
            football_history: {
              ...applicationDetails.football_history,
              current_club: {
                ...current_club,
                k1_affiliated: !current_club.k1_affiliated,
                ...(!current_club.k1_affiliated === false && {
                  k1_club: ''
                })
              }
            }
          })
        }}
        control={<Radio className='radio-check' checked={current_club.k1_affiliated} />}
        label={application['6m'][locale]} /> */}




        <div class="field-body"
          style={{
            marginTop: '1.75rem',
            ...(previous_clubs.length === 0 && {
              marginBottom: '1.75rem'
            })
          }}>
          <div className={classes.field}>
            <div className={classes.label}>
              <label>  {application['11'][locale]} </label>
              <p style={{ fontWeight: 'initial', position: 'relative' }} class="help"> {application['11a'][locale]}

                {previous_clubs.length !== 3 && <Fab
                  onClick={() => {
                    setApplicationDetails({
                      ...applicationDetails,
                      football_history: {
                        ...applicationDetails.football_history,
                        previous_clubs: [...previous_clubs, {
                          age_group: '',
                          club: '',
                          // k1_affiliated: false,
                          k1_club: ''
                        }]
                      }
                    })
                  }}
                  style={{
                    position: 'absolute',
                    top: '-22px',
                    left: '17.5rem',
                    width: '36px',
                    height: '10px'
                  }}
                  size="small" color="primary" aria-label="add">
                  <AddIcon />
                </Fab>}

                {previous_clubs.length !== 0 && <Fab
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
                    top: '-22px',
                    left: '20.5rem',
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
            <div style={{
              ...(i === previous_clubs.length - 1 && {
                marginBottom: '1.75rem'
              })
            }}>
              <div class="field-body">
                <div className={classes.field} style={{ flex: 'none' }}>
                  <div className={classes.label}>
                    <label> <span style={{ color: 'red' }}>*</span> {application['6i'][locale]} </label>
                  </div>
                  <div class="select">
                    <select
                      onChange={(e) => handleApplicationChange(e, i)}
                      value={el.age_group} id='age_group' name='previous_clubs'>
                      <option disabled={el.age_group !== ''} value=""> </option>
                      {ageGroupSelection}
                    </select>
                  </div>
                </div>

                <div className={classes.field}>
                  <div className={classes.label}>
                    <label> <span style={{ color: 'red' }}>*</span> {application['6j'][locale]}</label>
                  </div>
                  <p class="control is-expanded">
                    <input
                      onChange={(e) => handleApplicationChange(e, i)}
                      value={el.club} id='club' name='previous_clubs' class="input" type="text"
                      placeholder='Club Name' />
                  </p>
                </div>


              </div>

              <div className={classes.field} >
                <div className={classes.label}>
                  <label> {application['6l'][locale]} </label>
                </div>
                <div class="select" style={{ width: '100%' }}>
                  <select style={{ width: '100%' }}
                    onChange={(e) => handleApplicationChange(e, i)}
                    value={el.k1_club} id='k1_club' name='previous_clubs'>
                    <option disabled={el.k1_club !== ''} value=""> </option>
                    {k1ClubSelection}
                  </select>
                </div>
              </div>

              {/* <FormControlLabel
              style={{ transform: 'translateX(5px)' }}

              onClick={() => {
                const arr = previous_clubs
                arr[i] = {
                  ...arr[i],
                  k1_affiliated: !el.k1_affiliated,
                  ...(!el.k1_affiliated === false && {
                    k1_club: ''
                  })
                }

                setApplicationDetails({
                  ...applicationDetails,
                  football_history: {
                    ...applicationDetails.football_history,
                    previous_clubs: arr
                  }
                })
              }}
              control={<Radio className='radio-check' checked={el.k1_affiliated} />}
              label='This club is affiliated with a K1 or K2 club' /> */}


            </div>
          )
        })}

        {/* <div className="field-body" style={{ marginTop: '1rem' }}>
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
          control={<Radio className='radio-check' checked={private_coaching} />}
          label='Please check if you are currently attending private coaching sessions' />

      </div> */}

        <div className="field-body">
          <div className={classes.field}>
            <div className={classes.label}>
              <label> {application['12'][locale]} </label>
            </div>
            {/* <p class="control is-expanded">
            </p> */}
          </div>
        </div>

        <div className="field-body">
          <div className={classes.field}>
            <div className={classes.label}>
              <label>  {application['12a'][locale]}</label>
            </div>
            <p class="control is-expanded">
              <input value={private_coach_name}
                name='private_coach_name'
                class="input" type="text" placeholder='John Doe' />
            </p>
          </div>

          <div className={classes.field}>
            <div className={classes.label}>
              <label>  {application['12b'][locale]} </label>
            </div>
            <p class="control is-expanded">
              <input value={private_coach_company}
                name='private_coach_company'
                class="input" type="text" placeholder='John Doe Company' />
            </p>
          </div>

          <div className={classes.field}>
            <div className={classes.label}>
              <label> {application['12c'][locale]}</label>
            </div>
            <p class="control is-expanded">
              <input value={private_coach_website}
                name='private_coach_website'
                class="input" type="text" placeholder='www.johndoecoaching.com' />
            </p>
          </div>
        </div>
      </div>

      <div className="field">

        <Typography className={classes.subHeading} component='div' >
          <Box
            fontSize={15}
            fontWeight="fontWeightBold" m={0}>
            {application['13'][locale]}
          </Box>
        </Typography>

        {/* <div class="field-body">
          <FormControlLabel
            style={{ transform: 'translateX(5px)' }}
            onClick={() => {
              setApplicationDetails({
                ...applicationDetails,
                football_history: {
                  ...applicationDetails.football_history,
                  award_achieved: !award_achieved
                }
              })
            }}
            control={<Radio className='radio-check' checked={award_achieved} />}
            label='Please check if you have achieved any awards (KFA, Regional FA, Foundation)' />
        </div> */}

        <div className="field-body">
          <div className={classes.field}>
            <div className={classes.label}>
              <label> {application['14'][locale]} </label>
            </div>
            {/* <p class="control is-expanded">
            </p> */}
          </div>
        </div>

        <div className="field-body">
          <div className={classes.field} style={{ flex: 'none' }}>
            <div className={classes.label}>
              <label>  {application['14a'][locale]} </label>
            </div>
            <div class="select">
              <select
                value={award_name}
                name='award_name'>
                <option value=""> </option>
                <option value="kfa"> {application['14d'][locale].split('/')[0]} </option>
                <option value="regional"> {application['14d'][locale].split('/')[1]} </option>
                <option value="foundation">{application['14d'][locale].split('/')[2]} </option>
              </select>
            </div>
          </div>
          <div className={classes.field} style={{ flex: 'none' }}>
            <div className={classes.label}>
              <label> {application['14b'][locale]} </label>
            </div>
            <div class="select">
              <select
                name='award_date'
                value={award_date}>
                <option value=""> </option>
                <option value="2015"> 2015</option>
                <option value="2016"> 2016</option>
                <option value="2017"> 2017 </option>
                <option value="2018"> 2018</option>
                <option value="2019"> 2019 </option>
                <option value="2020"> 2020 </option>
              </select>
            </div>
          </div>
          <div className={classes.field}>
            <div className={classes.label}>
              <label> {application['14c'][locale]}</label>
            </div>
            <p class="control is-expanded">
              <input
                value={award_reasoning}
                name='award_reasoning'
                class="input" type="text" />
            </p>
          </div>
        </div>

        {/* <div className={classes.field}>
          <div className={classes.label}>
            <label > If you have any game footage highlights, list the URL here </label>
          </div>
          <p class="control is-expanded">
            <input value={highlights_footage_link} name='highlights_footage_link' class="input" type="text" placeholder={application['6e'][locale]} />
          </p>
        </div> */}

        <div class="field-body"
          style={{
            marginTop: '1.75rem',
            ...(highlights_footage_link.length === 0 && {
              marginBottom: '1.75rem'
            })
          }}>
          <div className={classes.field}>
            <div className={classes.label}>
              <label>  {application['15a'][locale]}</label>
              <p style={{ fontWeight: 'initial', position: 'relative' }} class="help"> {application['15b'][locale]}

                {highlights_footage_link.length !== 3 && <Fab
                  onClick={() => {
                    setApplicationDetails({
                      ...applicationDetails,
                      football_history: {
                        ...applicationDetails.football_history,
                        highlights_footage_link: [...highlights_footage_link, '']
                      }
                    })
                  }}
                  style={{
                    position: 'absolute',
                    top: '-22px',
                    left: '17.5rem',
                    width: '36px',
                    height: '10px'
                  }}
                  size="small" color="primary" aria-label="add">
                  <AddIcon />
                </Fab>}

                {highlights_footage_link.length !== 0 && <Fab
                  onClick={() => {
                    setApplicationDetails({
                      ...applicationDetails,
                      football_history: {
                        ...applicationDetails.football_history,
                        highlights_footage_link: highlights_footage_link.filter((x, i) => i !== highlights_footage_link.length - 1)
                      }
                    })
                  }}
                  style={{
                    position: 'absolute',
                    top: '-22px',
                    left: '20.5rem',
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

        {highlights_footage_link.map((el, i) => {
          return (
            <div class="field-body"
              style={{
                ...(i === highlights_footage_link.length - 1 && {
                  marginBottom: '1.75rem'
                })
              }}>
              <div className={classes.field}>
                <div className={classes.label}>
                  <label> <span style={{ color: 'red' }}>*</span> {application['15c'][locale]} {i + 1} </label>
                </div>
                <p class="control is-expanded">
                  <input
                    onChange={(e) => handleApplicationChange(e, i)}
                    value={el} name='highlights_footage_link' class="input" type="text"
                    placeholder='Footage Link' />
                </p>
              </div>
            </div>
          )
        }
        )}



      </div >

      <div class="field">
        <div class="field-body">
          <div className={classes.field}>
            <div className={classes.label}>
              <label> <span style={{ color: 'red' }}>*</span>   {application['6g'][locale]}</label>
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

      {videoLinks && videoLinks.map((x, i) => {
        const value = i === 0 ? link_1 : i === 1 ? link_2 : link_3
        const name = `link_${i + 1}`

        return (

          <section className={i !== 1 ? classes.challengeRowContainer : classes.challengeRowReversed}>
            <div className={classes.videoContainer}>
              <iframe title='video' width='100%' height='100%' src={x.src} frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen='true'> </iframe>
            </div>

            <div className={classes.challengeDescription}>

              <Typography component='div' style={{ position: 'relative' }}>
                <Box
                  className={classes.challengeNumber}
                  fontSize={75}
                  fontWeight="fontWeightBold" m={0}>
                  0{i + 1}
                </Box>

                <Box
                  style={{ fontFamily: 'Roboto Condensed' }}
                  fontSize={25}
                  fontWeight="fontWeightBold" m={0}>
                  {x.title}
                </Box>

                <Box
                  fontSize={14}
                  fontWeight="fontWeightRegular" mb={5}>
                  {x.desc}
                </Box>
              </Typography>

              <div className={classes.field}>
                <div className={classes.label}>
                  <label> <span style={{ color: 'red' }}>*</span> {x.title} {locale === 'en' ? 'Link' : 'Korean'}
                  </label>
                </div>
                <p class="control is-expanded">
                  <input
                    value={value}
                    class="input" type="text"
                    name={name} />
                </p>
              </div>

            </div>
          </section>
        )
      })}




    </>
  )

  return (
    <div className={classes.root}>
      <Typography component='div' >
        <Box
          className={classes.title}
          align='center'
          fontWeight="fontWeightRegular" pb={3} pt={3}>
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
            onClick={() => {
              handleApplicationSave()
              setTimeout(() => {
                history.push(`/user/${auth.getUserId()}`)
              }, 3000)
            }}
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
          {application['16a'][locale]}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            {application['16b'][locale]}
            <br /> <br />
            {application['16c'][locale]}
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>
            {application['10a'][locale]}
          </Button>
          <Button variant='outlined' onClick={() => {
            handleApplicationSave('submit')
            setTimeout(() => {
              history.push(`/user/${auth.getUserId()}`)
            }, (3000));
          }} color="primary" autoFocus>
             {buttons['6'][locale]}
          </Button>
        </DialogActions>
      </Dialog>}

    </div>
  );
}
