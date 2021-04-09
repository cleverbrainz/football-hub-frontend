import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormControl from '@material-ui/core/FormControl'
import FormLabel from '@material-ui/core/FormLabel'
import PropTypes from 'prop-types';
import ListIcon from '@material-ui/icons/List';
import PersonIcon from '@material-ui/icons/Person';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import SortByAlphaSharpIcon from '@material-ui/icons/SortByAlphaSharp';
import ImportExportSharpIcon from '@material-ui/icons/ImportExportSharp';
import ArrowBackSharpIcon from '@material-ui/icons/ArrowBackSharp';
import {
  Box,
  TextField,
  Container,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableCell,
  TableHead,
  TableBody,
  TableRow,
  Grid,
  Typography,
  AppBar,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from '@material-ui/core'
import { makeStyles, withStyles, useTheme } from '@material-ui/core/styles';

import axios from 'axios'
import auth from '../lib/auth'

const useStyles = makeStyles((theme) => ({
  appBar: {
    height: '70px'
  },
  tabs: {
    fontSize: '12px'
  },
  tableHeading: {
    textTransform: 'capitalize',
    fontWeight: 'bold',
    paddingLeft: 0,
  },
  sortIcons: {
    fontSize: '1rem',
    transform: 'translate(8px, 1px)'
  },
  containerInner: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: '1rem'
  },
  select: {
    fontSize: '14px',
    marginLeft: '20px'
  },
  button: {
    fontSize: '12px',
  },
  label: {
    fontSize: '13px',
    fontWeight: 'bold'
  },
  inputContainers: {
    color: 'orange',
    margin: '30px 0 8px 0 '
  },
  applicationHeader: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    [theme.breakpoints.up('md')]: {
      flexDirection: 'row',
    },
  }

}))
// const user1 = {
//   personal_details: {
//     name: 'Test Applicant',
//     gender: 'Male',
//     dob: '1990-2-10',
//     address_line_1: '123 Fake St',
//     address_line_2: 'Haringey',
//     city: 'London',
//     postcode: 'N15 2PP',
//     residency_certificate: '',
//   },
//   player_attributes: {
//     height: '6ft 2',
//     weight: '75',
//     position: 'RM',
//     preferred_foot: 'R',
//   },
//   football_history: {
//     current_club: 'Sheffield United',
//     current_coaching_school: 'Sheffield United Academy',
//     previous_clubs: '',
//     previous_trails_attended: '',
//     highlights_footage_link: '',
//     social_media_link: '',
//     bio_description: '',
//   },
//   challenges: {
//     link_1: '',
//     link_2: '',
//     link_3: '',
//   },
//   ratings: {
//     indulge: 0,
//     application: 0,
//     challenges: 1
//   }
// }

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  const classes = useStyles()

  return (
    <div

      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-force-tabpanel-${index}`}
      aria-labelledby={`scrollable-force-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function AlertDialog({ open, setOpen, handleSave, setEditing }) {
  // console.log('handle', handleSave)


  const handleClose = (event, save) => {
    console.log(save)
    if (save) {
      handleSave(event)
    } else {
      setEditing(false)
    }
    setOpen(false);
  };

  return (
    <div>
      <Dialog
        open={open}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Unsaved Changes"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            There are unsaved changes on this application.
            Do you want to save them?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleClose(false)} color="primary">
            No
          </Button>
          <Button onClick={(event) => handleClose(event, true)} color="primary" autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}


const Application = ({ permissions, application, applications, setApplications, index, setEditing, open, setOpen, editing, averages, text, locale }) => {

  const classes = useStyles()
  const [userId, email, applicationInfo] = application
  const { personal_details, player_attributes, challenges, football_history } = applicationInfo
  const { name, player_first_name, player_last_name, address_line_1, address_line_2, city, country, postcode, nationality, can_provide_certificates } = personal_details
  const { position } = player_attributes
  const { current_club, bio_description, previous_clubs, private_coach_name, private_coaching, highlights_footage_link, award_achieved } = football_history

  const [ratings, setRatings] = useState(applicationInfo.ratings)
  const [averagePositionScore, averageCategoryScore, playerCategory] = averages(player_attributes.position)

  console.log({ ratings })

  const handleSave = (event, approval = false) => {
    console.log('handling')
    event.preventDefault()
    const newApps = [...applications]
    const newApplication = { ...applicationInfo, ratings: { ...ratings } }
    newApps[index] = [userId, email, newApplication]
    axios.patch(`/users/${userId}`, { userId, updates: { applications: { benfica: newApplication } } }, { headers: { authorization: `Bearer ${auth.getToken()}` } }).then(res => {
      console.log(res)
      if (approval && ratings.indulge === 'Yes') {
        axios.post('/contactPlayer', {
          type: 'applicationSuccessful',
          recipient: { recipientId: userId },
          emailContent: { contentCourse: 'Benfica Summer Camp' }
        }).then(res => {
          console.log(res)
        })
      } else if (approval && ratings.indulge === 'No') {
        axios.post('/contactPlayer', {
          type: 'applicationUnsuccessful',
          recipient: { recipientId: userId },
          emailContent: { contentCourse: 'Benfica Summer Camp' }
        }).then(res => {
          console.log(res)
        })
      }
      setApplications(newApps)
      setEditing(false)
    })
  }

  function capitalise(str) {
    var i, frags = str.split('_');
    for (i = 0; i < frags.length; i++) {
      frags[i] = frags[i].charAt(0).toUpperCase() + frags[i].slice(1);
    }
    return frags.join(' ');
  }


  if (permissions === 0) return (
    // <Container>
    <>
      {/* <Grid container justify="center"
        alignItems="center" spacing={2}>



        <Grid item xs={6}> */}

      <Typography
        className={classes.applicationHeader}

        component='div' >
        <Box
          fontSize={35} fontWeight="fontWeightBold" m={0}>
          {player_first_name} {player_last_name}
        </Box>

        <FormControl style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end' }}>

          <div>
            <Box
              style={{ color: 'orange' }}
              fontSize={12} fontWeight="fontWeightBold" m={0}>
              Approve
          </Box>

            <Select value={ratings.indulge} style={{ fontSize: '14px' }} onChange={(event) => {
              setEditing(true)
              setRatings({ ...ratings, indulge: event.target.value })
            }}>
              <MenuItem value={0} disabled>-</MenuItem>
              <MenuItem value={'Yes'}>Yes</MenuItem>
              <MenuItem value={'No'}>No</MenuItem>
            </Select>
          </div>

          {editing && <Button style={{ marginLeft: '30px', height: '37px' }} variant="outlined" color="primary" onClick={(event) => handleSave(event, true)}>{text[locale].Save}</Button>}
        </FormControl>
      </Typography>

      <div className="field-body" style={{ margin: '10px 0', borderBottom: '1px dashed grey', padding: '20px 0' }}>

        <div class='field' style={{ flex: 'none' }}>
          <label className={classes.label} > Application Score </label>
          <div class="control">
            <input class="input is-small is-static" type="text" value={ratings.application === 0 ? 'N/A' : ratings.application} readonly />
          </div>
        </div>

        <div class='field' style={{ flex: 'none' }}>
          <label className={classes.label} > Challenge Score </label>
          <div class="control">
            <input class="input is-small is-static" type="text"
              value={Object.values(ratings.challengesMap).some(value => value === 0) ? 'N/A' : (Object.values(ratings.challengesMap).reduce((x, y) => x + y, 0))} readonly />
          </div>
        </div>

        <div class='field' style={{ flex: 'none' }}>
          <label className={classes.label} > Overall Score </label>
          <div class="control">
            <input class="input is-small is-static" type="text"
              value={Object.values(ratings.challengesMap).reduce((x, y) => x + y, 0) === 0 || ratings.application === 0 ? 'N/A' : Number((Object.values(ratings.challengesMap).reduce((x, y) => x + y, 0))) + Number(ratings.application)} readonly />
          </div>
        </div>

        <div class='field' style={{ flex: 'none' }}>
          <label className={classes.label} > Av. Score for {position.includes(' ') ? position.match(/\b(\w)/g).join('') : position.substring(0, 3)} </label>
          <div class="control">
            <input class="input is-small is-static" type="text"
              value={averagePositionScore} />
          </div>
        </div>

        {!['Striker', 'Goalkeeper'].some(x => x === player_attributes.position) &&
          <div class='field' style={{ flex: 'none' }}>
            <label className={classes.label} > Av. score for {playerCategory} </label>
            <div class="control">
              <input class="input is-small is-static" type="text"
                value={averageCategoryScore} />
            </div>
          </div>}

      </div>

      <Typography className={classes.inputContainers} component='div' >
        <Box
          fontSize={14} fontWeight="fontWeightBold" m={0}>
          {text[locale].PlayerDetails}
        </Box>
      </Typography>


      <div class="field-body" style={{ marginBottom: '1rem' }}>

        <div class='field'
          style={{ flex: '0.8', marginRight: '10px' }}>
          <label className={classes.label} > Email Address </label>
          <div class="control">
            <input class="input is-small" type="text" value={email} readonly />
          </div>
        </div>


        <div class="field"
          style={{ marginRight: '10px' }}>
          <label className={classes.label}> {text[locale].Address} </label>
          <div class="control">
            <input class="input is-small" type="text"
              value={[address_line_1, address_line_2, city, country, postcode].join(', ')} readonly />
          </div>
        </div>


        <div class="field"
          style={{ marginRight: '10px', flex: '0.8' }}>
          <label className={classes.label}>
            {`Can Provide Residency${nationality !== 'south korean' ? ' & Passport' : ''} Evidence`}
          </label>
          <div class="control">
            <input class="input is-small" type="text"
              value={can_provide_certificates} readonly />
          </div>
        </div>

      </div>

      <div className="field-body">
        {['contact_number', 'dob', 'gender', 'nationality'].map((el, index) => {
          const label = el.includes('_') ? capitalise(el) : el.charAt(0).toUpperCase() + el.slice(1)
          return (
            <div class='field'
              style={{ marginRight: '10px' }}>
              <label className={classes.label} > {text[locale][label] ? text[locale][label] : label} </label>
              <div class="control">
                <input class="input is-small" type="text" value={personal_details[el]} readonly />
              </div>
            </div>
          )
        })}

      </div>


      <Typography className={classes.inputContainers} component='div'>
        <Box
          fontSize={14} fontWeight="fontWeightBold" m={0}>
          {text[locale].PlayerAttributes}
        </Box>
      </Typography>

      <div class="field-body" >
        {Object.keys(player_attributes).map(el => {
          const label = el.includes('_') ? capitalise(el) : el.charAt(0).toUpperCase() + el.slice(1)
          return (
            <div class='field'>
              <label className={classes.label} > {text[locale][label] ? text[locale][label] : label} </label>
              <div class="control">
                <input class="input is-small" type="text" value={player_attributes[el]} readonly />
              </div>
            </div>
          )
        })}
      </div>

      <Typography className={classes.inputContainers} component='div'>
        <Box
          fontSize={14} fontWeight="fontWeightBold" m={0}>
          Current Club
        </Box>
      </Typography>

      <div class="field-body" >
        {Object.keys(current_club).map((el, i) => {
          const label = el.includes('_') ? capitalise(el) : el.charAt(0).toUpperCase() + el.slice(1)
          return (
            <div class='field' style={{ flex: 'none' }}>
              <label className={classes.label} > {text[locale][label] ? text[locale][label] : label} </label>
              <div class="control">
                <input class="input is-small" type="text" value={current_club[el]} readonly />
              </div>
            </div>
          )
        })}
      </div>

      <Typography className={classes.inputContainers} component='div'>
        <Box
          fontSize={14} fontWeight="fontWeightBold" m={0}>
          Previous Clubs
        </Box>
      </Typography>

      {previous_clubs.map((club, i) => {
        return (
          <div className="field-body" style={{ marginBottom: '1rem' }}>
            <Box
              style={{ color: 'orange' }}
              fontSize={12} fontWeight="fontWeightBold" mr={1}>
              {i + 1}.
            </Box>
            {Object.keys(club).map(field => {
              const label = field.includes('_') ? capitalise(field) : field.charAt(0).toUpperCase() + field.slice(1)
              return (
                <div class='field' style={{ flex: 'none' }}>
                  <label className={classes.label} > {text[locale][label] ? text[locale][label] : label} </label>
                  <div class="control">
                    <input class="input is-small" type="text" value={club[field]} readonly />
                  </div>
                </div>
              )
            }
            )}
          </div>
        )
      })}


      {award_achieved && (
        <>
          <Typography className={classes.inputContainers} component='div'>
            <Box
              fontSize={14} fontWeight="fontWeightBold" m={0}>
              Awards Achieved
            </Box>
          </Typography>

          <div className="field-body">
            {['award_name', 'award_date', 'award_reasoning'].map(el => {
              const label = el.includes('_') ? capitalise(el) : el.charAt(0).toUpperCase() + el.slice(1)
              return (
                <div class='field' style={{ flex: el === 'award_reasoning' ? 1 : 'none' }}>
                  <label className={classes.label} > {text[locale][label] ? text[locale][label] : label} </label>
                  <div class="control">
                    <input class="input is-small" type="text" value={football_history[el]} readonly />
                  </div>
                </div>
              )
            }
            )}
          </div>
        </>
      )}


      <Typography className={classes.inputContainers} component='div'>
        <Box
          fontSize={14} fontWeight="fontWeightBold" m={0}>
          Challenges
        </Box>
      </Typography>

      <div class="field-body" >
        {Object.keys(challenges).map(el => {
          const label = capitalise(el)
          return (
            <div class='field'
              onClick={() => window.open(`//${challenges[el]}`, '_blank')}
            >
              <label className={classes.label} > {label} </label>
              <div class="control">
                <input class="input is-small" type="text" value={challenges[el]} readonly />
              </div>
            </div>
          )
        })}
      </div>

      <Typography className={classes.inputContainers} component='div'>
        <Box
          fontSize={14} fontWeight="fontWeightBold" m={0}>
          Other Application Details
            </Box>
      </Typography>

      <div class="field-body" >
        {['highlights_footage_link', 'private_coach_name'].map((el, i) => {
          if (!private_coaching && el === 'private_coach_name') return
          const label = el.includes('_') ? capitalise(el) : el.charAt(0).toUpperCase() + el.slice(1)
          return (
            <div class='field' style={{ marginBottom: '10px' }} >
              <label className={classes.label} > {text[locale][label] ? text[locale][label] : label} </label>
              <div class="control">
                <input class="input is-small" type="text" value={football_history[el]} readonly />
              </div>
            </div>
          )
        })}
      </div>

      <div class="field-body" >
        <div class='field'>
          <label className={classes.label} > Description </label>
          <div class="control">
            <textarea class="textarea is-small" onfocus="this.blur()" type="text" value={bio_description} readonly />
          </div>
        </div>

      </div>


      <AlertDialog open={open} setOpen={setOpen} handleSave={handleSave} setEditing={setEditing} />
    </>

  )
  if (permissions === 1) return (
    <>
      <Typography
        className={classes.applicationHeader}

        component='div' >
        <Box
          fontSize={35} fontWeight="fontWeightBold" m={0}>
          {player_first_name} {player_last_name}
        </Box>

        <FormControl style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end' }}>

          <div>
            <Box
              style={{ color: 'orange' }}
              fontSize={12} fontWeight="fontWeightBold" m={0}>
              {text[locale].SelectRating}
            </Box>

            <Select
              value={ratings.application}
              style={{ fontSize: '14px' }}
              onChange={(event) => {
                setEditing(true)
                setRatings({ ...ratings, application: event.target.value })
              }}>
              <MenuItem value={0} disabled>Unrated</MenuItem>
              <MenuItem value={5}>{text[locale].Poor}</MenuItem>
              <MenuItem value={4}>{text[locale].BelowAverage}</MenuItem>
              <MenuItem value={3}>{text[locale].Average}</MenuItem>
              <MenuItem value={2}>{text[locale].Good}</MenuItem>
              <MenuItem value={1}>{text[locale].Excellent}</MenuItem>
            </Select>
          </div>

          {editing && <Button style={{ marginLeft: '30px', height: '37px' }} variant="outlined" color="primary" onClick={(event) => handleSave(event)}>{text[locale].Save}</Button>}
        </FormControl>
      </Typography>

      <Typography className={classes.inputContainers} component='div' >
        <Box
          fontSize={14} fontWeight="fontWeightBold" m={0}>
          {text[locale].PlayerDetails}
        </Box>
      </Typography>


      <div class="field-body" style={{ marginBottom: '1rem' }}>

        <div class='field'
          style={{ flex: '0.8', marginRight: '10px' }}>
          <label className={classes.label} > Email Address </label>
          <div class="control">
            <input class="input is-small" type="text" value={email} readonly />
          </div>
        </div>


        <div class="field"
          style={{ marginRight: '10px'}}>
          <label className={classes.label}> {text[locale].Address} </label>
          <div class="control">
            <input class="input is-small" type="text"
              value={[address_line_1, address_line_2, city, country, postcode].join(', ')} readonly />
          </div>
        </div>


        <div class="field"
          style={{ marginRight: '10px', flex: 0.8 }}>
          <label className={classes.label}>
            {`Can Provide Residency${nationality !== 'south korean' ? ' & Passport' : ''} Evidence`}
          </label>
          <div class="control">
            <input class="input is-small" type="text"
              value={can_provide_certificates} readonly />
          </div>
        </div>

      </div>

      <div className="field-body">
        {['contact_number', 'dob', 'gender', 'nationality'].map((el, index) => {
          const label = el.includes('_') ? capitalise(el) : el.charAt(0).toUpperCase() + el.slice(1)
          return (
            <div class='field'
              style={{ marginRight: '10px' }}>
              <label className={classes.label} > {text[locale][label] ? text[locale][label] : label} </label>
              <div class="control">
                <input class="input is-small" type="text" value={personal_details[el]} readonly />
              </div>
            </div>
          )
        })}

      </div>


      <Typography className={classes.inputContainers} component='div'>
        <Box
          fontSize={14} fontWeight="fontWeightBold" m={0}>
          {text[locale].PlayerAttributes}
        </Box>
      </Typography>

      <div class="field-body" >
        {Object.keys(player_attributes).map(el => {
          const label = el.includes('_') ? capitalise(el) : el.charAt(0).toUpperCase() + el.slice(1)
          return (
            <div class='field'>
              <label className={classes.label} > {text[locale][label] ? text[locale][label] : label} </label>
              <div class="control">
                <input class="input is-small" type="text" value={player_attributes[el]} readonly />
              </div>
            </div>
          )
        })}
      </div>

      {/* <Typography className={classes.inputContainers} component='div'>
        <Box
          fontSize={14} fontWeight="fontWeightBold" m={0}>
          {text[locale].ApplicationDetails}
        </Box>
      </Typography> */}

      <Typography className={classes.inputContainers} component='div'>
        <Box
          fontSize={14} fontWeight="fontWeightBold" m={0}>
          Current Club
        </Box>
      </Typography>

      <div class="field-body" >
        {Object.keys(current_club).map((el, i) => {
          const label = el.includes('_') ? capitalise(el) : el.charAt(0).toUpperCase() + el.slice(1)
          return (
            <div class='field' style={{ flex: 'none' }}>
              <label className={classes.label} > {text[locale][label] ? text[locale][label] : label} </label>
              <div class="control">
                <input class="input is-small" type="text" value={current_club[el]} readonly />
              </div>
            </div>
          )
        })}
      </div>

      <Typography className={classes.inputContainers} component='div'>
        <Box
          fontSize={14} fontWeight="fontWeightBold" m={0}>
          Previous Clubs
        </Box>
      </Typography>

      {previous_clubs.map((club, i) => {
        return (
          <div className="field-body" style={{ marginBottom: '1rem' }}>
            <Box
              style={{ color: 'orange' }}
              fontSize={12} fontWeight="fontWeightBold" mr={1}>
              {i + 1}.
            </Box>
            {Object.keys(club).map(field => {
              const label = field.includes('_') ? capitalise(field) : field.charAt(0).toUpperCase() + field.slice(1)
              return (
                <div class='field' style={{ flex: 'none' }}>
                  <label className={classes.label} > {text[locale][label] ? text[locale][label] : label} </label>
                  <div class="control">
                    <input class="input is-small" type="text" value={club[field]} readonly />
                  </div>
                </div>
              )
            }
            )}
          </div>
        )
      })}


      {award_achieved && (
        <>
          <Typography className={classes.inputContainers} component='div'>
            <Box
              fontSize={14} fontWeight="fontWeightBold" m={0}>
              Awards Achieved
            </Box>
          </Typography>

          <div className="field-body">
            {['award_name', 'award_date', 'award_reasoning'].map(el => {
              const label = el.includes('_') ? capitalise(el) : el.charAt(0).toUpperCase() + el.slice(1)
              return (
                <div class='field' style={{ flex: el === 'award_reasoning' ? 1 : 'none' }}>
                  <label className={classes.label} > {text[locale][label] ? text[locale][label] : label} </label>
                  <div class="control">
                    <input class="input is-small" type="text" value={football_history[el]} readonly />
                  </div>
                </div>
              )
            }
            )}
          </div>
        </>
      )}

      <Typography className={classes.inputContainers} component='div'>
        <Box
          fontSize={14} fontWeight="fontWeightBold" m={0}>
          Other Application Details
            </Box>
      </Typography>

      <div class="field-body" >
        {['highlights_footage_link', 'private_coach_name'].map((el, i) => {
          if (!private_coaching && el === 'private_coach_name') return
          const label = el.includes('_') ? capitalise(el) : el.charAt(0).toUpperCase() + el.slice(1)
          return (
            <div class='field' style={{ marginBottom: '10px' }} >
              <label className={classes.label} > {text[locale][label] ? text[locale][label] : label} </label>
              <div class="control">
                <input class="input is-small" type="text" value={football_history[el]} readonly />
              </div>
            </div>
          )
        })}
      </div>

      <div class="field-body" >
        <div class='field'>
          <label className={classes.label} > Description </label>
          <div class="control">
            <textarea class="textarea is-small" onfocus="this.blur()" type="text" value={bio_description} readonly />
          </div>
        </div>

      </div>



      <AlertDialog open={open} setOpen={setOpen} handleSave={handleSave} setEditing={setEditing} />
    </>

  )
  if (permissions === 2) return (

    <>

      <Typography
        className={classes.applicationHeader}
        component='div' >
        <Box
          fontSize={35} fontWeight="fontWeightBold" m={0}>
          {player_first_name} {player_last_name}
        </Box>
        {editing && <Button style={{ marginLeft: '30px', height: '37px' }} variant="outlined" color="primary" onClick={(event) => handleSave(event)}>Save</Button>}
      </Typography>


      <div className="field-body" style={{ margin: '10px 0', borderBottom: '1px dashed grey', padding: '20px 0' }}>


        <div class='field' style={{ flex: 'none' }}>
          <label className={classes.label} > Current Rating For Challenges </label>
          <div class="control">
            <input class="input is-small is-static" type="text" value={(Object.values(ratings.challengesMap).reduce((acc, res) => acc + res, 0))}
              readonly />
          </div>
        </div>
      </div>

        <Typography className={classes.inputContainers} component='div' >
          <Box
            fontSize={14} fontWeight="fontWeightBold" m={0}>
            {text[locale].PlayerDetails}
          </Box>
        </Typography>


        <div class="field-body" style={{ marginBottom: '1rem' }}>

          <div class='field'
            style={{ flex: '0.8', marginRight: '10px' }}>
            <label className={classes.label} > Email Address </label>
            <div class="control">
              <input class="input is-small" type="text" value={email} readonly />
            </div>
          </div>


          <div class="field"
            style={{ marginRight: '10px' }}>
            <label className={classes.label}> {text[locale].Address} </label>
            <div class="control">
              <input class="input is-small" type="text"
                value={[address_line_1, address_line_2, city, country, postcode].join(', ')} readonly />
            </div>
          </div>


          <div class="field"
            style={{ marginRight: '10px', flex: '0.8' }}>
            <label className={classes.label}>
              {`Can Provide Residency${nationality !== 'south korean' ? ' & Passport' : ''} Evidence`}
            </label>
            <div class="control">
              <input class="input is-small" type="text"
                value={can_provide_certificates} readonly />
            </div>
          </div>

        </div>

      <div className="field-body">
        {['contact_number', 'dob', 'gender', 'nationality'].map((el, index) => {
          const label = el.includes('_') ? capitalise(el) : el.charAt(0).toUpperCase() + el.slice(1)
          return (
            <div class='field'
              style={{ marginRight: '10px' }}>
              <label className={classes.label} > {text[locale][label] ? text[locale][label] : label} </label>
              <div class="control">
                <input class="input is-small" type="text" value={personal_details[el]} readonly />
              </div>
            </div>
          )
        })}

      </div>


      <Typography className={classes.inputContainers} component='div'>
        <Box
          fontSize={14} fontWeight="fontWeightBold" m={0}>
          {text[locale].PlayerAttributes}
        </Box>
      </Typography>

      <div class="field-body" >
        {Object.keys(player_attributes).map(el => {
          const label = el.includes('_') ? capitalise(el) : el.charAt(0).toUpperCase() + el.slice(1)
          return (
            <div class='field'>
              <label className={classes.label} > {text[locale][label] ? text[locale][label] : label} </label>
              <div class="control">
                <input class="input is-small" type="text" value={player_attributes[el]} readonly />
              </div>
            </div>
          )
        })}
      </div>






      <Typography className={classes.inputContainers} component='div'>
        <Box
          fontSize={14} fontWeight="fontWeightBold" m={0}>
          Challenges
        </Box>
      </Typography>

      <div class="field-body" >


        <div class='field'>
          <label className={classes.label} > Link 1 </label>
          <div onClick={() => window.open(challenges.link_1, '_blank')} class="control">
            <input class="input is-small" type="text" value={challenges.link_1} readonly />
          </div>

          <FormControl
            style={{ marginTop: '15px', width: '50%' }}
          >
            <Box
              style={{ color: 'orange' }}
              fontSize={12} fontWeight="fontWeightBold" m={0}>
              Select Rating
            </Box>

            <Select
              style={{ fontSize: '14px' }}
              value={ratings.challengesMap.challenge1} onChange={(event) => {
                setEditing(true)
                setRatings({ ...ratings, challengesMap: { ...ratings.challengesMap, challenge1: event.target.value } })
              }}>
              <MenuItem value={0} disabled>Unrated</MenuItem>
              <MenuItem value={5}>5 - Poor</MenuItem>
              <MenuItem value={4}>4 - Below Average</MenuItem>
              <MenuItem value={3}>3 - Average</MenuItem>
              <MenuItem value={2}>2 - Good</MenuItem>
              <MenuItem value={1}>1 - Excellent</MenuItem>
            </Select>
          </FormControl>
        </div>


        <div class='field'>
          <label className={classes.label} > Link 2 </label>
          <div onClick={() => window.open(challenges.link_2, '_blank')} class="control">
            <input class="input is-small" type="text" value={challenges.link_2} readonly />
          </div>

          <FormControl
            style={{ marginTop: '15px', width: '50%' }}
          >

            <Box
              style={{ color: 'orange' }}
              fontSize={12} fontWeight="fontWeightBold" m={0}>
              Select Rating
            </Box>

            <Select value={ratings.challengesMap.challenge2}
              style={{ fontSize: '14px' }} onChange={(event) => {
                setEditing(true)
                setRatings({ ...ratings, challengesMap: { ...ratings.challengesMap, challenge2: event.target.value } })
              }}>
              <MenuItem value={0} disabled>Unrated</MenuItem>
              <MenuItem value={5}>5 - Poor</MenuItem>
              <MenuItem value={4}>4 - Below Average</MenuItem>
              <MenuItem value={3}>3 - Average</MenuItem>
              <MenuItem value={2}>2 - Good</MenuItem>
              <MenuItem value={1}>1 - Excellent</MenuItem>
            </Select>
          </FormControl>
        </div>

        <div class='field'>
          <label className={classes.label} > Link 3 </label>
          <div class="control"
            onClick={() => window.open(challenges.link_3, '_blank')}
          >
            <input
              class="input is-small" type="text" value={challenges.link_3} readonly />
          </div>

          <FormControl
            style={{ marginTop: '15px', width: '50%' }}
          >

            <Box
              style={{ color: 'orange' }}
              fontSize={12} fontWeight="fontWeightBold" m={0}>
              Select Rating
            </Box>

            <Select value={ratings.challengesMap.challenge3}
              style={{ fontSize: '14px' }} onChange={(event) => {
                setEditing(true)
                setRatings({ ...ratings, challengesMap: { ...ratings.challengesMap, challenge3: event.target.value } })
              }}>
              <MenuItem value={0} disabled>Unrated</MenuItem>
              <MenuItem value={5}>5 - Poor</MenuItem>
              <MenuItem value={4}>4 - Below Average</MenuItem>
              <MenuItem value={3}>3 - Average</MenuItem>
              <MenuItem value={2}>2 - Good</MenuItem>
              <MenuItem value={1}>1 - Excellent</MenuItem>
            </Select>
          </FormControl>
        </div>
      </div>


      {player_attributes.position === 'Goalkeeper' && (
        <div className="fieid-body" style={{ marginTop: '20px', width: '50%' }}>
          <div class='field'>
            <label className={classes.label} > Highlight Footage </label>
            <div onClick={() => window.open(highlights_footage_link, '_blank')} class="control">
              <input class="input is-small" type="text" value={highlights_footage_link} readonly />
            </div>
          </div>
        </div>
      )}


      <AlertDialog open={open} setOpen={setOpen} handleSave={handleSave} setEditing={setEditing} />

    </>
  )
}






const ApplicationDashboard = ({ locale }) => {
  const classes = useStyles()
  const [user, setUser] = useState(null)
  const [permissions, setPermissions] = useState(1)
  const [tabValue, setTabValue] = useState(0)
  const [coursesModerating, setCoursesModerating] = useState(['Benfica'])
  const [selectedCourse, setSelectedCourse] = useState('select')
  const [applications, setApplications] = useState([])
  const [filteredApplications, setFilteredApplications] = useState([])
  const [applicantIndex, setApplicantIndex] = useState(0)
  const [editing, setEditing] = useState(false)
  const [open, setOpen] = useState(false)
  const [filters, setFilters] = useState({
    ageRange: 'All',
    positionCategory: 'All',
    position: 'All'
  })
  const [sort, setSort] = useState({ type: '', direction: 'down' })

  const positions = {
    Defence: ['Right Back', 'Right Wing Back', 'Left Wing Back', 'Left Back', 'Centre Back', 'Sweeper'],
    Midfield: ['Right Wing', 'Right Midfield', 'Left Wing', 'Left Midfield', 'Central Midfield', 'Defensive Midfield', 'Attacking Midfield'],
    Attack: ['Striker'],
    Goalkeeper: ['Goalkeeper'],
  }

  const getAverageScore = (position, cat = '') => {

    let playerCategory = cat
    if (cat !== 'All') {
      for (const cat of Object.keys(positions)) {
        if (positions[cat].map(item => item.toLowerCase()).some(x => x === position)) {
          playerCategory = cat
        }
      }
    }
    const filteredCategoryPlayers = []
    const filteredPositionPlayers = []
    for (const application of applications) {
      const [id, email, player] = application
      if (player.ratings.application > 0 && !Object.values(player.ratings.challengesMap).some(x => x === 0)) {
        const sum = Number(player.ratings.application) + Number(Object.values(player.ratings.challengesMap).reduce((x, y) => x + y, 0))
        if (playerCategory === 'All' || (positions[playerCategory].includes(player.player_attributes.position) && position === 'All')) {
          filteredCategoryPlayers.push(sum)
          filteredPositionPlayers.push(sum)
        } else if (position === player.player_attributes.position) {
          filteredCategoryPlayers.push(sum)
        }
      }
    }
    const averagePositionScore = filteredPositionPlayers.length > 0 ? (filteredPositionPlayers.reduce((a, b) => a + b, 0) / filteredPositionPlayers.length).toFixed(1) : 'N/A'
    const averageCategoryScore = filteredCategoryPlayers.length > 0 ? (filteredCategoryPlayers.reduce((a, b) => a + b, 0) / filteredCategoryPlayers.length).toFixed(1) : 'N/A'
    console.log(filteredCategoryPlayers)

    return [averagePositionScore, averageCategoryScore, playerCategory]
  }

  // const [language, setLanguage] = useState(null)

  // console.log(props)

  // const benficaUserIds = ['aBDdhuP8D9abnRD3LxoOKuNu7Wr2', 'vfqmRwEAeXMijj2WUozS8aT034M2', '6KIIPGyFOzLPePWhCeupWCBBjRw1']
  const benficaUserIds = ['xBe3mKbMtGg0G33FRnOOgjiWJvu2', 'aBDdhuP8D9abnRD3LxoOKuNu7Wr2', 'vfqmRwEAeXMijj2WUozS8aT034M2', 'zAUwes3cC5ZMLHBPV79AKeM9vVK2', 'Tyel8gUXLCNK1o9Cx7DobGAtRPk2', 'rXWw1onbxLcDHIJwBsozumJ6UlG2']


  const handleFilterChange = (event) => {
    console.log(event)
    const name = event.target.name
    const newFilters = name === 'positionCategory' ? { ...filters, [name]: event.target.value, position: 'All' } : { ...filters, [name]: event.target.value }
    console.log(newFilters)
    const filteredPlayers = []
    for (const application of applications) {
      const [id, email, player] = application
      console.log(newFilters.ageRange, player.age_group)
      if (newFilters.ageRange === player.age_group || newFilters.ageRange === 'All') {
      if (newFilters.positionCategory === 'All') {
        filteredPlayers.push(application)
      } else if (positions[newFilters.positionCategory].map(item => item.toLowerCase()).includes(player.player_attributes.position)) {
        if (newFilters.position === 'All' || newFilters.position.toLowerCase() === player.player_attributes.position) {
          filteredPlayers.push(application)
        }
      }
      }
    }

    console.log({ filteredPlayers })
    setFilters(newFilters)
    setFilteredApplications(filteredPlayers)
  }

  const handleSort = (event, type) => {
    const [parent, key] = type.split(' ')
    console.log(parent, key)
    // console.log(event)
    const newSort = sort.type === key ? sort.direction === 'down' ? { type: key, direction: 'up' } : { type: key, direction: 'down' } : { type: key, direction: 'down' }
    event.preventDefault()
    const sorted = [...filteredApplications]
    if (key === 'dob') {
      sorted.sort((a, b) => b[2][parent][key].localeCompare(a[2][parent][key]))
    } else if (key === 'score') {
      sorted.sort((a, b) => {
        const sortA = Object.values(a[2].ratings.challengesMap).some(x => x === 0) ? 100 : (Number(a[2].ratings.application) + Number(Object.values(a[2].ratings.challengesMap).reduce((x, y) => x + y, 0)))
        const sortB = Object.values(b[2].ratings.challengesMap).some(x => x === 0) ? 100 : (Number(b[2].ratings.application) + Number(Object.values(b[2].ratings.challengesMap).reduce((x, y) => x + y, 0)))
        return sortA - sortB
        // return (Number(a[2].ratings.application) + Number(Object.values(a[2].ratings.challengesMap).reduce((x,y) => x + y, 0))) - (Number(b[2].ratings.application) + Number(Object.values(b[2].ratings.challengesMap).reduce((x,y) => x + y, 0)))
      })
    } else {
      
      sorted.sort((a, b) => a[2][parent][a[2][parent][key] ? key : 'player_first_name'].localeCompare(a[2][parent][b[2][parent][key] ? key : 'player_first_name']))
    }

    if (sorted[0][0] === filteredApplications[0][0] && newSort.type === sort.type) {
      sorted.reverse()
    }

    //  === filteredApplications ? filteredApplications.sort((a, b) => b[2][parent][key] > a[2][parent][key]) : filteredApplications.sort((a, b) => a[2][parent][key] > b[2][parent][key])
    // console.log(sorted)
    setSort({ ...newSort })
    setFilteredApplications(sorted)

  }


  // console.log(permissions)

  const getData = async function () {
    // let userData = await axios.get(`/users/${auth.getUserId()}`)
    // userData = await userData.data[0]
    // const { courses, adminLevel } = userData
    // const courseArray = []
    const applicantArray = []
    let arr = await axios.get('/getApplicationIds')
    arr = await arr.data
    console.log({ arr })
    for (const benficaUser of arr) {
      let userData = await axios.get(`/users/${benficaUser}`)
      userData = await userData.data[0]
      const app = [userData.userId, userData.email]
      userData.applications.benfica ? app.push(userData.applications.benfica) : userData.applications.benfica_application ? app.push(userData.applications.benfica_application) : console.log('')
      // if (app.length === 3) applicantArray.push(app)
      if (app.length === 3 && app[2].ratings.challengesMap && auth.dobToAge(app[2].personal_details.dob) <= 15) applicantArray.push(app)
    }
    setApplications(applicantArray)
    setFilteredApplications(applicantArray)
    console.log(applicantArray)
    // for (const course of courses) {
    //   let courseData = await axios.get(`/courses/${course}`)
    //   courseData = await courseData.data[0]
    //   courseArray.push(courseData)
    // }
    // for (const course of courseArray) {
    // }
  }
  useEffect(() => {
    getData()
  }, [])



  const text = {
    en: {
      Courses: 'Courses',
      SelectACourse: 'Select A Course',
      ApplicationList: 'Application List',
      ViewSingleApplication: 'View Mode',
      Name: 'Name',
      Age: 'Age',
      City: 'City',
      Status: 'Status',
      Position: 'Position',
      Score: 'Score',
      Approved: 'Approved',
      AwaitingApproval: 'Awaiting Approval',
      ViewApplication: 'View Application',
      Category: 'Category',
      Checked: 'Checked',
      AwaitingCheck: 'Awaiting Check',
      Yes: 'Yes',
      No: 'No',
      AllPositions: 'All Positions',
      SelectRating: 'Select Rating',
      Poor: '5 - Poor',
      BelowAverage: '4 - Below Average',
      Average: '3 - Average',
      Good: '2 - Good',
      Excellent: '1 - Excellent',
      Dob: 'Date Of Birth',
      Gender: 'Gender',
      'Residency Certificate': null,
      Address: 'Address',
      Height: 'Height',
      Weight: 'Weight (Kg)',
      'Preferred Foot': null,
      ApplicationDetails: 'Application Details',
      'Previous Trails Attended': null,
      'Current Coaching School': null,
      'Current Club': null,
      'Social Media Link': null,
      'Highlights Footage Link': null,
      'Previous Clubs': null,
      Description: null,
      Save: 'Save',
      Back: 'Back',
      PlayerDetails: 'Player Details',
      PlayerAttributes: 'Player Attributes',

    },
    ko: {
      Courses: '과정',
      SelectACourse: '프로그램 선택',
      ApplicationList: '지원서 목록',
      ViewSingleApplication: '보기 모드',
      Name: '이름',
      Age: '나이',
      City: '시티',
      Status: '상태',
      Position: '포지션',
      Score: '점수',
      Approved: '승인됨',
      AwaitingApproval: '미승인',
      ViewApplication: '지원서 보기',
      Category: '카테고리',
      Checked: '확인됨',
      AwaitingCheck: '미확인',
      Yes: '예',
      No: '아니오',
      AllPositions: '모든 포지션',
      SelectRating: '지원자 평점',
      Poor: '5 - 하',
      BelowAverage: '4 - 중하',
      Average: '3 - 중',
      Good: '2 - 중상',
      Excellent: '1 - 상',
      Dob: '생년월일',
      Gender: '성별',
      'Residency Certificate': '거주지 증빙 서류',
      Address: '주소',
      Height: '키',
      Weight: '몸무게 (Kg)',
      'Preferred Foot': '주발',
      PlayerDetails: '선수 정보',
      ApplicationDetails: '지원서 정보',
      'Previous Trails Attended': '선수 선발 테스트/대회 참가 이력',
      'Current Coaching School': '현재 소속 아카데미',
      'Current Club': '현재 소속 구단',
      'Social Media Link': '소셜 미디어 링크',
      'Highlights Footage Link': 'URL 또는 동영상',
      'Previous Clubs': '과거 소속 구단',
      Description: 'Description',
      Save: '저장',
      Back: '뒤로가기',
      PlayerAttributes: '선수 세부 사항',


    }
  }

  const { ageRange } = filters


  // console.log({ applications })
  if (applications.length === 0 || !locale) return null
  return (
    <Container>
      <br />
      <br />
      <br />
      <FormControl component="fieldset">
        <FormLabel component="legend">Access Type</FormLabel>
        <RadioGroup
          row
          aria-label="access"
          name="access"
          value={permissions}
          onChange={(event) => setPermissions(Number(event.target.value))}
        >
          <FormControlLabel value={0} control={<Radio />} label="Indulge" />
          <FormControlLabel value={1} control={<Radio />} label="Korean Company" />
          <FormControlLabel
            value={2}
            control={<Radio />}
            label="UK Coach"
          />
        </RadioGroup>
      </FormControl>

      <FormControl>
        <InputLabel>{text[locale].Courses}</InputLabel>
        <Select value={selectedCourse} onChange={(event) => setSelectedCourse(event.target.value)}>
          <MenuItem value="select" disabled>
            {text[locale].SelectACourse}
          </MenuItem>
          {coursesModerating.map((course, index) => {
            return (
              <MenuItem value={course}>{course}</MenuItem>
            )
          })}
        </Select>
      </FormControl>
      {selectedCourse === 'Benfica' &&
        <FormControl>
          <InputLabel>Select Age Range</InputLabel>
          <Select value={ageRange} inputProps={{
                        name: 'ageRange',
                      }} onChange={handleFilterChange}>
            <MenuItem value={'All'}>
              All age ranges
            </MenuItem>
            <MenuItem value="Under 12s">Under 12</MenuItem>
            <MenuItem value="Under 13s">Under 13</MenuItem>
            <MenuItem value="Under 14s">Under 14</MenuItem>
            <MenuItem value="Under 15s">Under 15</MenuItem>
          </Select>
        </FormControl>
      }
      {/* <FormHelperText></FormHelperText> */}


      <AppBar
        className={classes.appBar}
        position="static" color="default">
        <Tabs
          className={classes.appBarInner}
          value={tabValue}
          variant="scrollable"
          scrollButtons="on"
          indicatorColor="primary"
          textColor="primary"
          aria-label="scrollable force tabs example"
          onChange={(event, newValue) => {
            if (!editing) {
              setTabValue(newValue)
            } else {
              setOpen(true)
            }
          }}
        >

          {tabValue === 1 &&
            <Button
              variant="outlined"
              color="primary"
              onClick={() => setTabValue(0)}
              className={classes.button}
              startIcon={<ArrowBackSharpIcon />}>
              {text[locale].Back}
            </Button>}



          <Tab style={{ display: 'none' }} label={text[locale].ApplicationList} icon={<ListIcon />} />
          <Tab style={{ display: 'none' }} label={text[locale].ViewSingleApplication} icon={<PersonIcon />} />}

        </Tabs>
      </AppBar>

      <TabPanel value={tabValue} index={0}>
        {selectedCourse === 'Benfica' ?
          <>
            <Container
            // style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', textAlign: 'center' }}
            >
              <div className={classes.containerInner}>

                <Typography component='div' >
                  <Box
                    fontSize={25} fontWeight="fontWeightRegular" m={-1}>
                    Indulge Benfica Camp: {text[locale].ApplicationList}
                  </Box>
                </Typography>


                <div>
                  <FormControl className={classes.select}>
                    <InputLabel id="demo-simple-select-label">
                      {text[locale].Category}
                    </InputLabel>
                    <Select
                      style={{ fontSize: '14px' }}
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={filters.positionCategory}
                      inputProps={{
                        name: 'positionCategory',
                      }}
                      onChange={handleFilterChange}
                    >
                      <MenuItem value={'All'}>{text[locale].AllPositions}</MenuItem>
                      <MenuItem value={'Goalkeeper'}>Goalkeeper</MenuItem>
                      <MenuItem value={'Defence'}>Defence</MenuItem>
                      <MenuItem value={'Midfield'}>Midfield</MenuItem>
                      <MenuItem value={'Attack'}>Attack</MenuItem>
                    </Select>
                  </FormControl>

                  {!['All', 'Attack', 'Goalkeeper'].some(x => x === filters.positionCategory) && <FormControl className={classes.select}>
                    <InputLabel id="demo-simple-select-label">
                      {text[locale].Position}
                    </InputLabel>
                    <Select
                      style={{ fontSize: '14px' }}
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={filters.position}
                      inputProps={{
                        name: 'position',
                      }}
                      onChange={handleFilterChange}
                    >
                      <MenuItem value={'All'}>{text[locale].AllPositions}</MenuItem>
                      {positions[filters.positionCategory].map(position => {
                        return (
                          <MenuItem value={position}>{position}</MenuItem>
                        )
                      })}
                    </Select>
                  </FormControl>}
                </div>
              </div>

              {/* <FormControl>
                    <InputLabel id="demo-simple-select-label">
                      Age
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={filters.ageRange}
                      inputProps={{
                        name: 'ageRange',
                      }}
                      onChange={handleFilterChange}
                    >
                      <MenuItem value={'0-100'}>All</MenuItem>
                      <MenuItem value={'20-24'}>20 - 24</MenuItem>
                      <MenuItem value={'24-29'}>24 - 29</MenuItem>
                      <MenuItem value={'30-35'}>30 - 34</MenuItem>
                      {/* Age Groups: 15-16 - 17 - 18 */}
              {/* </Select> */}
              {/* </FormControl> */}
              {permissions === 0 && <Typography variant="h6">{filters.positionCategory === 'All' ? `Average Completed Application Score: ${getAverageScore('All', 'All')[0]}` : filters.position === 'All' ? `Average ${filters.positionCategory} Score: ${getAverageScore('All', filters.positionCategory)[1]}` : `Average ${filters.position} Score: ${getAverageScore(filters.position, filters.positionCategory)[1]}`}</Typography>}
            </Container>


            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="right">
                    <Button
                      className={classes.tableHeading}
                      onClick={(event) => handleSort(event, 'personal_details name')}>
                      {/* {text[locale].Name} {sort.type === 'name' ? sort.direction === 'down' ? <ArrowDropDownIcon /> : <ArrowDropUpIcon /> : <ArrowDropDownIcon style={{ opacity: 0 }} />} */}
                      {text[locale].Name}  <ImportExportSharpIcon className={classes.sortIcons} />
                    </Button>
                  </TableCell>
                  <TableCell align="right" >
                    <Button className={classes.tableHeading} onClick={(event) => handleSort(event, 'personal_details dob')}>
                      {/* {text[locale].Age}  {sort.type === 'dob' ? sort.direction === 'down' ? <ArrowDropDownIcon /> : <ArrowDropUpIcon /> : <ArrowDropDownIcon style={{ opacity: 0 }} />} */}
                      {text[locale].Age}  <ImportExportSharpIcon className={classes.sortIcons} />
                    </Button>
                  </TableCell>
                  <TableCell align="right">
                    <Button className={classes.tableHeading} onClick={(event) => handleSort(event, 'personal_details city')}>
                      {/* {text[locale].City} {sort.type === 'city' ? sort.direction === 'down' ? <ArrowDropDownIcon /> : <ArrowDropUpIcon /> : <ArrowDropDownIcon style={{ opacity: 0 }} />} */}
                      {text[locale].City} <ImportExportSharpIcon className={classes.sortIcons} />
                    </Button>
                  </TableCell>
                  {(permissions === 0 || permissions === 2) &&
                    <TableCell align="right" >
                      <Button className={classes.tableHeading} onClick={(event) => handleSort(event, 'player_attributes position')}>
                        {text[locale].Position} {sort.type === 'position' ? sort.direction === 'down' ? <ArrowDropDownIcon /> : <ArrowDropUpIcon /> : <ArrowDropDownIcon style={{ opacity: 0 }} />}
                      </Button>
                    </TableCell>
                  }
                  <TableCell
                    className={classes.tableHeading}
                    style={{ paddingLeft: '1rem' }}
                    align="right">
                    {/* <Button onClick={(event) => handleSort(event, 'personal_details status')}> */}
                    {/* {text[locale].Status} {sort.type === 'city' ? sort.direction === 'down' ? <ArrowDropDownIcon/> : <ArrowDropUpIcon/> : '' } */}
                    {/* </Button> */}
                    {text[locale].Status}
                  </TableCell>
                  {permissions === 0 &&
                    <TableCell align="right">
                      <Button onClick={(event) => handleSort(event, 'player score')}>
                        {text[locale].Score} {sort.type === 'score' ? sort.direction === 'down' ? <ArrowDropDownIcon /> : <ArrowDropUpIcon /> : <ArrowDropDownIcon style={{ opacity: 0 }} />}
                      </Button>
                    </TableCell>}
                  {permissions === 0 && <TableCell align="right">{text[locale].Approved}</TableCell>}
                  <TableCell align="right"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredApplications.map(([userId, email, applicant], index) => {
                  const { personal_details, player_attributes, ratings } = applicant
                  return (
                    <TableRow>
                      <TableCell>{`${personal_details.player_first_name} ${personal_details.player_last_name}`}</TableCell>
                      <TableCell>{auth.dobToAge(personal_details.dob)}</TableCell>
                      <TableCell>{personal_details.city}</TableCell>
                      {(permissions === 0 || permissions === 2) &&
                        <TableCell>{player_attributes.position}</TableCell>
                      }
                      {permissions === 0 ?
                        <TableCell>
                          {ratings.application > 0 && !Object.values(ratings.challengesMap).some(challenge => challenge === 0) ? text[locale].Checked : text[locale].AwaitingCheck}
                        </TableCell> :
                        permissions === 1 ?
                          <TableCell>
                            {ratings.application > 0 ? text[locale].Checked : text[locale].AwaitingCheck}
                          </TableCell> :
                          <TableCell>
                            {!Object.values(ratings.challengesMap).some(challenge => challenge === 0) ? text[locale].Checked : text[locale].AwaitingCheck}
                          </TableCell>
                      }
                      {permissions === 0 &&
                        <TableCell>
                          {ratings.application > 0 && !Object.values(ratings.challengesMap).some(challenge => challenge === 0) ? Number(ratings.application) + Number(Object.values(ratings.challengesMap).reduce((x, y) => x + y, 0)) : 'N/A'}
                        </TableCell>}
                      {permissions === 0 &&
                        <TableCell>
                          {ratings.indulge === 0 ? text[locale].AwaitingApproval : ratings.indulge}
                        </TableCell>
                      }
                      <TableCell><Link className={classes.tabs} onClick={() => {
                        setApplicantIndex(index)
                        setTabValue(1)
                      }}>{text[locale].ViewApplication}</Link></TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </> :
          <Typography>Select a course to review applications</Typography>
        }
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <Application editing={editing} open={open} setOpen={setOpen} setEditing={setEditing} applications={applications} application={filteredApplications[applicantIndex]} permissions={permissions} setApplications={setApplications} index={applicantIndex} averages={getAverageScore} text={text} locale={locale} />
      </TabPanel>
    </Container>
  )
}

export default ApplicationDashboard
