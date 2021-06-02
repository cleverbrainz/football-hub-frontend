import React, { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../lib/context'
import { Link, Redirect } from 'react-router-dom'
import PropTypes from 'prop-types';
import ImportExportSharpIcon from '@material-ui/icons/ImportExportSharp';
import CssBaseline from '@material-ui/core/CssBaseline';
import {
  Box,
  Container,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableCell,
  TableHead,
  TableBody,
  TableRow,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Drawer,
  FormControl,
  FormGroup,
  Button
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';

import axios from 'axios'
import auth from '../lib/auth'
import AssessmentCategoryDashboard from './Assessment/AssessmentCategoryDashboard'
import AssessmentCoachView from './Assessment/AssessmentCoachView'

const drawerWidth = 230

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    paddingTop: '100px'
  },
  appBar: {
    height: '70px'
  },
  tabs: {
    fontSize: '12px'
  },
  tableHeading: {
    textTransform: 'capitalize',
    fontWeight: 'bold',
  },
  tableHeadingIcon: {
    paddingLeft: '5px'
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
  selectContainer: {
    margin: '0.75rem 0',
    width: '100%'
  },
  select: {
    marginTop: '.5rem',
    fontSize: '14px',
    paddingTop: '0.5rem',

  },
  menuItems: {
    fontSize: '14px'
  },
  button: {
    fontSize: '12px',
  },
  label: {
    fontSize: '13px',
    fontWeight: 'bold'
  },
  inputContainers: {
    color: '#3100F7',
    margin: '30px 0 8px 0 '
  },
  applicationHeader: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    [theme.breakpoints.up('md')]: {
      flexDirection: 'row',
    },
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    zIndex: 1,

  },
  drawerPaper: {
    padding: '1.5rem 1.3rem',
    width: drawerWidth,
  },
  // necessary for content to be below app bar
  toolbar: { ...theme.mixins.toolbar, height: '80px' },
  content: {

    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    // padding: theme.spacing(3),
  }

}))

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


const Application = ({ viewSelect, permissions, application, filteredApplications, applications, setFilteredApplications, setApplications, filteredIndex, setEditing, open, setOpen, editing, averages, text, locale }) => {

  const classes = useStyles()
  const [userId, email, applicationInfo] = application
  const { personal_details, player_attributes, challenges, football_history, submitted, challenges_submitted, post_app_actions } = applicationInfo
  const { name, player_first_name, player_last_name, address_line_1, address_line_2, city, country, postcode, nationality, can_provide_certificates } = personal_details
  const { allergies, kit_size_bottom, kit_size_top, injury_history, agree_tcs, payment_confirm, others } = post_app_actions
  const { position } = player_attributes
  const { current_club, bio_description, previous_clubs, private_coach_name, private_coaching, highlights_footage_link, award_achieved, award_reasoning } = football_history

  const [ratings, setRatings] = useState(applicationInfo.ratings)
  const [[averagePositionScore, averageCategoryScore, playerCategory], setAverageScores] = useState(averages(player_attributes.position))

  // console.log({ ratings })

  const handleSave = (event, approval = false) => {
    console.log('handling')
    event.preventDefault()
    const newFiltered = [...filteredApplications]
    const newApps = [...applications]
    const newApplication = { ...applicationInfo, ratings: { ...ratings } }
    const applicationsIndex = applications.findIndex(app => app[0] === userId)
    newApps[applicationsIndex] = [userId, email, newApplication]
    newFiltered[filteredIndex] = [userId, email, newApplication]
    axios.patch(`/users/${userId}`, { userId, updates: { applications: { ajax_application: newApplication } } }, { headers: { authorization: `Bearer ${auth.getToken()}` } }).then(res => {
      // console.log(res)
      if (approval && ratings.indulge === 'Yes') {
        axios.post('/contactPlayer', {
          type: 'applicationSuccessful',
          recipient: { recipientId: userId },
          emailContent: { contentCourse: 'Ajax Summer Camp' }
        }).then(res => {
          // console.log(res)
        })
      } else if (approval && ratings.indulge === 'No') {
        axios.post('/contactPlayer', {
          type: 'applicationUnsuccessful',
          recipient: { recipientId: userId },
          emailContent: { contentCourse: 'Ajax Summer Camp' }
        }).then(res => {
          // console.log(res)
        })
      }
      setApplications(newApps)
      setFilteredApplications(newFiltered)
      setAverageScores(averages(player_attributes.position))
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

    <>

      <Typography
        className={classes.applicationHeader}

        component='div' >
        <Box
          fontSize={35} fontWeight="fontWeightBold" m={0}>
          {player_first_name} {player_last_name}
        </Box>
        {viewSelect === 'All' &&
          <FormControl style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end' }}>

            <div>
              <Box
                style={{ color: '#3100F7' }}
                fontSize={12} fontWeight="fontWeightBold" m={0}>
                Approve
          </Box>

              <Select disabled={!challenges_submitted} value={ratings.indulge} style={{ fontSize: '14px' }} onChange={(event) => {
                setEditing(true)
                setRatings({ ...ratings, indulge: event.target.value })
              }}>
                <MenuItem value={0} disabled>-</MenuItem>
                <MenuItem value={'Yes'}>Yes</MenuItem>
                <MenuItem value={'No'}>No</MenuItem>
              </Select>
            </div>

            {editing && <Button disabled={!challenges_submitted} style={{ marginLeft: '30px', height: '37px', padding: '.5rem 1.75rem' }} variant="contained" color="primary" onClick={(event) => handleSave(event, true)}>{text[locale].Save}</Button>}
          </FormControl>
        }
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

      {viewSelect === 'All' &&
        <>
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
                  style={{ color: '#3100F7' }}
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

          {/* <Typography className={classes.inputContainers} component='div'>
        <Box
          fontSize={14} fontWeight="fontWeightBold" m={0}>
          Highlights Footage Links
        </Box>
      </Typography> */}

          <div class="field-body" >
            {highlights_footage_link.map((el, i) => {
              return (
                <div class='field'
                  onClick={() => {
                    el.slice(0, 8) === 'https://' ? window.open(el, '_blank') : window.open(`//${el}`, '_blank')
                  }}
                >
                  <label className={classes.label}> Link {i + 1} </label>
                  <div class="control">
                    <input class="input is-small" type="text" value={el} readonly />
                  </div>
                </div>
              )
            })}
          </div>

          <div class="field-body" >
            {['private_coach_name', 'private_coach_company', 'private_coach_website'].map((el, i) => {
              // if (!private_coaching && el === 'private_coach_name') return
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
        </>
      }
      {viewSelect === 'Approved' &&
        <>
          <Typography className={classes.inputContainers} component='div'>
            <Box
              fontSize={14} fontWeight="fontWeightBold" m={0}>
              Application Responses
    </Box>
          </Typography>
          <div class="field-body" >
            {['allergies', 'kit_size_top', 'kit_size_bottom', 'injuries', 'others'].map((el, i) => {
              // if (!private_coaching && el === 'private_coach_name') return
              const label = el.includes('_') ? capitalise(el) : el.charAt(0).toUpperCase() + el.slice(1)
              return (
                <div class='field' style={{ marginBottom: '10px' }} >
                  <label className={classes.label} > {text[locale][label] ? text[locale][label] : label} </label>
                  <div class="control">
                    <input class="input is-small" type="text" value={post_app_actions[el] ? post_app_actions[el] : 'None'} readonly />
                  </div>
                </div>
              )
            })}

          </div>
        </>
      }

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
              style={{ color: '#3100F7' }}
              fontSize={12} fontWeight="fontWeightBold" m={0}>
              {text[locale].SelectRating}
            </Box>

            <Select
              disabled={!submitted}
              value={ratings.application}
              style={{ fontSize: '14px' }}
              onChange={(event) => {
                setEditing(true)
                setRatings({ ...ratings, application: event.target.value })
              }}>
              <MenuItem value={0} disabled>Unrated</MenuItem>
              <MenuItem value={1}>{text[locale].Excellent}</MenuItem>
              <MenuItem value={2}>{text[locale].Good}</MenuItem>
              <MenuItem value={3}>{text[locale].Average}</MenuItem>
              <MenuItem value={4}>{text[locale].BelowAverage}</MenuItem>
              <MenuItem value={5}>{text[locale].Poor}</MenuItem>
            </Select>
          </div>

          {editing && <Button disabled={!submitted} style={{ marginLeft: '30px', height: '37px' }} variant="outlined" color="primary" onClick={(event) => handleSave(event)}>{text[locale].Save}</Button>}
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
          style={{ marginRight: '10px' }}>
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
              style={{ color: '#3100F7' }}
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


      {(award_achieved || award_reasoning) && (
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
        {highlights_footage_link.map((el, i) => {
          return (
            <div class='field'
              onClick={() => {
                el.slice(0, 8) === 'https://' ? window.open(el, '_blank') : window.open(`//${el}`, '_blank')
              }}
            >
              <label className={classes.label}> Link {i + 1} </label>
              <div class="control">
                <input class="input is-small" type="text" value={el} readonly />
              </div>
            </div>
          )
        })}
      </div>

      <div class="field-body" >
        {['private_coach_name', 'private_coach_company', 'private_coach_website'].map((el, i) => {
          // if (!private_coaching && el === 'private_coach_name') return
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
        {editing && <Button style={{ marginLeft: '30px', height: '37px' }} variant="outlined" color="primary" disabled={!challenges_submitted} onClick={(event) => handleSave(event)}>Save</Button>}
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
              style={{ color: '#3100F7' }}
              fontSize={12} fontWeight="fontWeightBold" m={0}>
              Select Rating
            </Box>

            <Select
              disabled={!challenges_submitted}
              style={{ fontSize: '14px' }}
              value={ratings.challengesMap.challenge1} onChange={(event) => {
                setEditing(true)
                setRatings({ ...ratings, challengesMap: { ...ratings.challengesMap, challenge1: event.target.value } })
              }}>
              <MenuItem value={0} disabled>Unrated</MenuItem>
              <MenuItem value={1}>1 - Excellent</MenuItem>
              <MenuItem value={2}>2 - Good</MenuItem>
              <MenuItem value={3}>3 - Average</MenuItem>
              <MenuItem value={4}>4 - Below Average</MenuItem>
              <MenuItem value={5}>5 - Poor</MenuItem>
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
              style={{ color: '#3100F7' }}
              fontSize={12} fontWeight="fontWeightBold" m={0}>
              Select Rating
            </Box>

            <Select disabled={!challenges_submitted} value={ratings.challengesMap.challenge2}
              style={{ fontSize: '14px' }} onChange={(event) => {
                setEditing(true)
                setRatings({ ...ratings, challengesMap: { ...ratings.challengesMap, challenge2: event.target.value } })
              }}>
              <MenuItem value={0} disabled>Unrated</MenuItem>
              <MenuItem value={1}>1 - Excellent</MenuItem>
              <MenuItem value={2}>2 - Good</MenuItem>
              <MenuItem value={3}>3 - Average</MenuItem>
              <MenuItem value={4}>4 - Below Average</MenuItem>
              <MenuItem value={5}>5 - Poor</MenuItem>
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
              style={{ color: '#3100F7' }}
              fontSize={12} fontWeight="fontWeightBold" m={0}>
              Select Rating
            </Box>

            <Select disabled={!challenges_submitted} value={ratings.challengesMap.challenge3}
              style={{ fontSize: '14px' }} onChange={(event) => {
                setEditing(true)
                setRatings({ ...ratings, challengesMap: { ...ratings.challengesMap, challenge3: event.target.value } })
              }}>
              <MenuItem value={0} disabled>Unrated</MenuItem>
              <MenuItem value={1}>1 - Excellent</MenuItem>
              <MenuItem value={2}>2 - Good</MenuItem>
              <MenuItem value={3}>3 - Average</MenuItem>
              <MenuItem value={4}>4 - Below Average</MenuItem>
              <MenuItem value={5}>5 - Poor</MenuItem>
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
      <br />
      <br />
      <br />


      <AlertDialog open={open} setOpen={setOpen} handleSave={handleSave} setEditing={setEditing} />

    </>
  )
}





const ApplicationDashboard = ({ locale }) => {

  const { user } = useContext(AuthContext)
  const classes = useStyles()
  const [permissions, setPermissions] = useState()
  const [initialPermission, setInitialPermission] = useState()
  const [tabValue, setTabValue] = useState(0)
  const [currentUserCount, setCurrentUserCount] = useState(0)
  const [coursesModerating, setCoursesModerating] = useState(['Ajax'])
  const [selectedCourse, setSelectedCourse] = useState('select')
  const [applications, setApplications] = useState([])
  const [filteredApplications, setFilteredApplications] = useState([])
  const [applicantIndex, setApplicantIndex] = useState(0)
  const [editing, setEditing] = useState(false)
  const [open, setOpen] = useState(false)
  const [viewSelect, setViewSelect] = useState('All')
  const [filters, setFilters] = useState({
    ageRange: 'All',
    positionCategory: 'All',
    position: 'All',
    applicationStatus: 'All'
  })
  const [sort, setSort] = useState({ type: '', direction: 'down' })

  // useEffect(() => {
  //   setFilters({
  //     ...filters,
  //     applicationStatus: 'enrolled'
  //   })
  //   setSelectedCourse('ajax')
  //   setTabValue(2)
  // }, [])

  const positions = {
    Defence: ['Right Back', 'Right Wing Back', 'Left Wing Back', 'Left Back', 'Centre Back', 'Sweeper'],
    Midfield: ['Right Wing', 'Right Midfield', 'Left Wing', 'Left Midfield', 'Central Midfield', 'Defensive Midfield', 'Attacking Midfield'],
    Attack: ['Striker'],
    Goalkeeper: ['Goalkeeper'],
  }
  const [redirect, setRedirect] = useState(false)

  const [assessmentView, setAssessmentView] = useState()

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
    // console.log(filteredCategoryPlayers)

    return [averagePositionScore, averageCategoryScore, playerCategory]
  }



  const handleFilterChange = (event) => {

    //applicationStatus
    const name = event.target.name
    const newFilters = name === 'positionCategory' ? { ...filters, [name]: event.target.value, position: 'All' } : { ...filters, [name]: event.target.value }

    const filteredPlayers = []
    for (const application of applications) {
      const [id, email, player] = application
      const { post_app_actions, challenges_submitted, submitted } = player

      const status = (post_app_actions?.payment_confirm === 'indulge' && post_app_actions?.agree_tcs === 'yes')
        ? 'enrolled' : challenges_submitted ? 'complete' : submitted ? 'onlyApplication' : 'started'

      if (newFilters.applicationStatus === 'All' || newFilters.applicationStatus === status) {
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
    }

    setFilters(newFilters)
    setFilteredApplications(filteredPlayers)
  }



  const handleSort = (event, type) => {
    const [parent, key] = type.split(' ')

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

      })
    } else {

      sorted.sort((a, b) => a[2][parent][a[2][parent][key] ? key : 'player_first_name'].localeCompare(a[2][parent][b[2][parent][key] ? key : 'player_first_name']))
    }

    if (sorted[0][0] === filteredApplications[0][0] && newSort.type === sort.type) {
      sorted.reverse()
    }


    setSort({ ...newSort })
    setFilteredApplications(sorted)

  }




  const checkAdmin = async function () {
    let adminData = await axios.get(`/users/${auth.getUserId()}`)
    adminData = await adminData.data[0]
    if (adminData.category !== 'admin') {
      setRedirect(true)
    } else {
      setInitialPermission(adminData.permissions)
      setPermissions(adminData.permissions)
    }

  }

  const getData = async function () {

    if (selectedCourse === 'select') return
    const applicantArray = []
    let arr = await axios.get(`/getApplicationIds/${selectedCourse.toLowerCase()}_application`)
    arr = await arr.data

    for (const ajaxUser of arr.applications) {
      const app = [ajaxUser.userId, ajaxUser.email, ajaxUser.applications[`${selectedCourse.toLowerCase()}_application`]]

      if (app.length === 3 && app[2].ratings.challengesMap && auth.dobToAge(app[2].personal_details.dob) <= 15) applicantArray.push(app)
    }

    setApplications(applicantArray)
    setFilteredApplications(applicantArray)
    setCurrentUserCount(arr.length)

  }
  useEffect(() => {
    if (initialPermission === undefined) {
      checkAdmin()
    } else {
      getData()
    }
  }, [initialPermission, selectedCourse])


  // const handleFix = () => {
  //   axios.get('/fixbenfica').then(res => console.log(res))
  // }


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
      ViewApplication: 'View',
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

  const ApplicationDashboardOptions = () => {
    const classes = useStyles();

    return (
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
        anchor="left"
      >
        <div className={classes.toolbar} />
        <FormGroup >
          <Typography component='div'>
            <Box fontSize={16} fontWeight="fontWeightBold" mt={0} mb={1.25}>
              Apply Filters
            </Box>
          </Typography>

          {initialPermission === 0 && <FormControl className={classes.selectContainer}>
            <InputLabel> Access Type </InputLabel>
            <Select className={classes.select}
              disabled={tabValue === 2 || tabValue === 3}
              value={permissions}
              inputProps={{
                name: 'access',
              }}
              onChange={(event) => setPermissions(Number(event.target.value))}>

              <MenuItem className={classes.menuItems} value={0}> Indulge Football </MenuItem>
              <MenuItem className={classes.menuItems} value={1}> NYSES </MenuItem>
              <MenuItem className={classes.menuItems} value={2}> UK Coaching Staff </MenuItem>
            </Select>
          </FormControl>}

          <FormControl className={classes.selectContainer}>
            <InputLabel>{text[locale].Courses}</InputLabel>
            <Select
              className={classes.select}
              disabled={tabValue !== 0}
              value={selectedCourse}
              onChange={(event) => setSelectedCourse(event.target.value)}>
              <MenuItem className={classes.menuItems} value="select" disabled>
                {text[locale].SelectACourse}
              </MenuItem>
              {coursesModerating.map((course, index) => {
                return (
                  <MenuItem className={classes.menuItems} value={course}>{course}</MenuItem>
                )
              })}
            </Select>
          </FormControl>

          {selectedCourse === 'Ajax' &&
            <>
              <FormControl className={classes.selectContainer}>
                <InputLabel>Application Status</InputLabel>
                <Select className={classes.select}
                  disabled={tabValue !== 0}
                  value={applicationStatus}
                  inputProps={{
                    name: 'applicationStatus',
                  }}
                  onChange={handleFilterChange}>

                  <MenuItem className={classes.menuItems} value={'All'}>
                    All
                  </MenuItem>
                  <MenuItem className={classes.menuItems} value="started">Started but not submitted</MenuItem>
                  <MenuItem className={classes.menuItems} value="onlyApplication">Submitted Application</MenuItem>
                  <MenuItem className={classes.menuItems} value="complete">Submitted Application & Challenges</MenuItem>
                  <MenuItem className={classes.menuItems} value="enrolled">Application Accepted & Enrolled</MenuItem>
                </Select>
              </FormControl>

              <FormControl className={classes.selectContainer}>
                <InputLabel> Age Group </InputLabel>
                <Select className={classes.select}
                  disabled={tabValue !== 0}
                  value={ageRange} inputProps={{
                    name: 'ageRange',
                  }} onChange={handleFilterChange}>
                  <MenuItem className={classes.menuItems} value={'All'}>
                    All
              </MenuItem>
                  <MenuItem className={classes.menuItems} value="Under 12s">Under 12</MenuItem>
                  <MenuItem className={classes.menuItems} value="Under 13s">Under 13</MenuItem>
                  <MenuItem className={classes.menuItems} value="Under 14s">Under 14</MenuItem>
                  <MenuItem className={classes.menuItems} value="Under 15s">Under 15</MenuItem>
                </Select>
              </FormControl>

              <FormControl className={classes.selectContainer}>
                <InputLabel id="demo-simple-select-label">
                  {text[locale].Category}
                </InputLabel>
                <Select
                  disabled={tabValue !== 0}
                  className={classes.select}
                  style={{ fontSize: '14px' }}
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={filters.positionCategory}
                  inputProps={{
                    name: 'positionCategory',
                  }}
                  onChange={handleFilterChange}
                >
                  <MenuItem className={classes.menuItems} value={'All'}>{text[locale].AllPositions}</MenuItem>
                  <MenuItem className={classes.menuItems} value={'Goalkeeper'}>Goalkeeper</MenuItem>
                  <MenuItem className={classes.menuItems} value={'Defence'}>Defence</MenuItem>
                  <MenuItem className={classes.menuItems} value={'Midfield'}>Midfield</MenuItem>
                  <MenuItem className={classes.menuItems} value={'Attack'}>Attack</MenuItem>
                </Select>
              </FormControl>
              {
                !['All', 'Attack', 'Goalkeeper'].some(x => x === filters.positionCategory) && <FormControl
                  style={{ cursor: tabValue === 1 ? 'not-allowed' : 'inital' }}>
                  <InputLabel id="demo-simple-select-label">
                    {text[locale].Position}
                  </InputLabel>
                  <Select
                    disabled={tabValue !== 0}
                    className={classes.select}
                    style={{ fontSize: '14px' }}
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={filters.position}
                    inputProps={{
                      name: 'position',
                    }}
                    onChange={handleFilterChange}
                  >
                    <MenuItem className={classes.menuItems} value={'All'}>{text[locale].AllPositions}</MenuItem>
                    {positions[filters.positionCategory].map(position => {
                      return (
                        <MenuItem className={classes.menuItems} value={position}>{position}</MenuItem>
                      )
                    })}
                  </Select>
                </FormControl>
              }

              <FormControl className={classes.selectContainer}>
                <InputLabel> Application Type </InputLabel>
                <Select className={classes.select}
                  disabled={tabValue !== 0 || selectedCourse === 'select'}
                  value={viewSelect}
                  onClick={e => setViewSelect(e.target.value)}>
                  <MenuItem className={classes.menuItems} value={'All'}>
                    All
              </MenuItem>
                  <MenuItem className={classes.menuItems} value="Approved"> Approved </MenuItem>
                </Select>
              </FormControl>

            </>
          }

          <Button
            style={{ marginTop: '1rem' }}
            className={classes.button}
            onClick={() => {

              if (tabValue !== 0) {

                if (tabValue === 3) {
                  setTabValue(2)
                  return
                }

                setTabValue(0)
                setFilters({ ...filters })
                setSelectedCourse(selectedCourse)
                setViewSelect(viewSelect)
                setFilteredApplications([...filteredApplications])
                return
              }

              setFilters({
                ageRange: 'All',
                positionCategory: 'All',
                position: 'All',
                applicationStatus: 'All'
              })
              setSelectedCourse('select')
              setViewSelect('All')
              setFilteredApplications([])
            }}
            variant='outlined' disabled={selectedCourse === 'select'} color='secondary'>
            {tabValue === 3 ? 'Return to Ass. List' : tabValue !== 0 ? 'Return to App. List' : 'Clear Filters'}
          </Button>
        </FormGroup>

      </Drawer >

    )
  }

  const { ageRange, applicationStatus } = filters

  if (initialPermission === undefined || permissions === undefined) return null
  if (redirect) return (
    <Redirect />
  )
  if (typeof permissions === 'number') return (
    <div className={classes.root}>
      <CssBaseline />
      <ApplicationDashboardOptions locale={locale} />
      <Container>

        <TabPanel value={tabValue} index={0}>
          {selectedCourse === 'Ajax' ?
            <>
              <Container>
                <div className={classes.containerInner}>
                  <Typography component='div' >
                    <Box
                      fontSize={30} fontWeight="fontWeightBold" mt={2} mb={-1}>
                      Indulge Ajax Camp: {text[locale].ApplicationList}
                    </Box>
                  </Typography>
                </div>

                <div className="field-body" style={{ margin: '10px 0', borderBottom: '1px dashed grey', padding: '20px 0' }}>

                  {permissions === 0 && <div class='field' style={{ flex: 'none' }}>
                    <label className={classes.label} > {filters.positionCategory === 'All' ?
                      `Average Completed Application Score` :
                      filters.position === 'All' ? `Average ${filters.positionCategory} Score` :
                        `Avergae ${filters.position} Score`}
                    </label>

                    <div class="control">
                      <input class="input is-small is-static" type="text" value={filters.positionCategory === 'All' ?
                        getAverageScore('All', 'All')[0] :
                        filters.position === 'All' ? getAverageScore('All', filters.positionCategory)[1] :
                          getAverageScore(filters.position, filters.positionCategory)[1]} readonly />
                    </div>
                  </div>}


                  <div class='field' style={{ flex: 'none', margin: '0 2rem' }}>
                    <label className={classes.label} > Total Players Registered </label>
                    <div class="control">
                      <input class="input is-small is-static" type="text" value={currentUserCount} readonly />
                    </div>
                  </div>

                  <div class='field' style={{ flex: 'none' }}>
                    <label className={classes.label} > Filter Results </label>
                    <div class="control">
                      <input class="input is-small is-static" type="text" value={`${filteredApplications.length} Applications`} readonly />
                    </div>
                  </div>


                </div>

              </Container>

              {viewSelect === 'All' ?
                <Table aria-label="collapsible table">
                  <TableHead >
                    <TableRow>
                      <TableCell className={classes.tableHeadingIcon} align="right">
                        <Button
                          className={classes.tableHeading}

                          onClick={(event) => handleSort(event, 'personal_details name')}>
                         
                          {text[locale].Name}  <ImportExportSharpIcon className={classes.sortIcons} />
                        </Button>
                      </TableCell>
                      <TableCell className={classes.tableHeadingIcon} align="right" >
                        <Button className={classes.tableHeading} onClick={(event) => handleSort(event, 'personal_details dob')}>
                          
                          {text[locale].Age}  <ImportExportSharpIcon className={classes.sortIcons} />
                        </Button>
                      </TableCell>
                      <TableCell className={classes.tableHeadingIcon} align="right">
                        <Button className={classes.tableHeading} onClick={(event) => handleSort(event, 'personal_details city')}>
                        
                          {text[locale].City} <ImportExportSharpIcon className={classes.sortIcons} />
                        </Button>
                      </TableCell>
                      {(permissions === 0 || permissions === 2) &&
                        <TableCell className={classes.tableHeadingIcon} align="right" >
                          <Button className={classes.tableHeading} onClick={(event) => handleSort(event, 'player_attributes position')}>
                            {text[locale].Position} <ImportExportSharpIcon className={classes.sortIcons} />
                          </Button>
                        </TableCell>
                      }

                      {filters.applicationStatus !== 'enrolled' &&
                        <TableCell
                          className={classes.tableHeading}
                          style={{ paddingLeft: '1rem' }}
                          align="right">
                          {text[locale].Status}
                        </TableCell>
                      }

                      {permissions === 0 &&
                        <TableCell className={classes.tableHeadingIcon} align="right">
                          <Button className={classes.tableHeading} onClick={(event) => handleSort(event, 'player score')}>
                            {text[locale].Score} <ImportExportSharpIcon className={classes.sortIcons} />
                          </Button>
                        </TableCell>}


                      {filters.applicationStatus !== 'enrolled' &&
                        permissions === 0 && <TableCell className={classes.tableHeading} align="right">{text[locale].Approved}</TableCell>}


                      <TableCell className={classes.tableHeading} align="right">Submission Status</TableCell>
                      <TableCell align="right"></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredApplications.map(([userId, email, applicant], index) => {
                      const { personal_details, player_attributes, ratings, submitted, challenges_submitted, post_app_actions } = applicant
                      return (
                        <TableRow>
                          <TableCell>{`${personal_details.player_first_name} ${personal_details.player_last_name}`}</TableCell>
                          <TableCell>{auth.dobToAge(personal_details.dob)}</TableCell>
                          <TableCell>{personal_details.city}</TableCell>
                          {(permissions === 0 || permissions === 2) &&
                            <TableCell>{player_attributes.position}</TableCell>
                          }


                          {filters.applicationStatus !== 'enrolled' && (
                            <>
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
                                  </TableCell>}

                            </>
                          )}
                          {permissions === 0 &&
                            <TableCell>
                              {ratings.application > 0 && !Object.values(ratings.challengesMap).some(challenge => challenge === 0) ? Number(ratings.application) + Number(Object.values(ratings.challengesMap).reduce((x, y) => x + y, 0)) : 'N/A'}
                            </TableCell>}

                          {filters.applicationStatus !== 'enrolled' && permissions === 0 &&
                            <TableCell>
                              {ratings.indulge === 0 ? text[locale].AwaitingApproval : ratings.indulge}
                            </TableCell>
                          }



                          <TableCell align="right">{(post_app_actions?.payment_confirm === 'indulge' &&
                            post_app_actions?.agree_tcs === 'yes') ? 'Application Accepeted & Enrolled' :
                            (submitted && challenges_submitted) ? 'Application & Challenges Submitted'
                              : submitted ? 'Only Application' : 'Started'}</TableCell>
                          <TableCell>


                            <Link className={classes.tabs} onClick={() => {
                              if (filters.applicationStatus === 'enrolled') {
                                setTabValue(2)
                              } else {
                                setTabValue(1)
                              }
                              setApplicantIndex(index)
                            }}>
                              {filters.applicationStatus === 'enrolled' ? 'View Assessment' : text[locale].ViewApplication}
                            </Link>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
                :
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell className={classes.tableHeadingIcon} align="right">
                        <Button
                          className={classes.tableHeading}
                          onClick={(event) => handleSort(event, 'personal_details name')}>

                          {text[locale].Name}  <ImportExportSharpIcon className={classes.sortIcons} />
                        </Button>
                      </TableCell>
                      <TableCell className={classes.tableHeadingIcon} align="right" >
                        <Button className={classes.tableHeading} onClick={(event) => handleSort(event, 'personal_details dob')}>

                          {text[locale].Age}  <ImportExportSharpIcon className={classes.sortIcons} />
                        </Button>
                      </TableCell>
                      <TableCell className={classes.tableHeading} align="right">Position</TableCell>
                      <TableCell className={classes.tableHeading} align="right">T&Cs</TableCell>
                      <TableCell className={classes.tableHeading} align="right">Paid</TableCell>
                      <TableCell className={classes.tableHeading} align="right">
                        Allergies
                  </TableCell>
                      <TableCell className={classes.tableHeading} align="right" >
                        Injuries
                    </TableCell>
                      <TableCell className={classes.tableHeading} align="right">Other</TableCell>
                      <TableCell
                        className={classes.tableHeading}
                        align="right">
                        Kit Size
                  </TableCell>
                      <TableCell
                        className={classes.tableHeading}
                        // style={{ paddingLeft: '1rem' }}
                        align="right">
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredApplications.map(([userId, email, applicant], index) => {
                      const { personal_details, player_attributes, ratings, submitted, challenges_submitted, post_app_actions } = applicant
                      const { allergies, kit_size_bottom, kit_size_top, injury_history, agree_tcs, payment_confirm, others } = post_app_actions ? post_app_actions : {}
                      return (
                        <TableRow>
                          <TableCell>{`${personal_details.player_first_name} ${personal_details.player_last_name}`}</TableCell>
                          <TableCell>{auth.dobToAge(personal_details.dob)}</TableCell>

                          {(permissions === 0 || permissions === 2) &&
                            <TableCell>{player_attributes.position}</TableCell>
                          }
                          <TableCell>{agree_tcs === 'yes' ? 'Agreed' : 'Not Yet Agreed'}</TableCell>
                          <TableCell>{payment_confirm === 'indulge' ? 'Confirmed' : payment_confirm === 'yes' ? 'Pending' : 'No'}</TableCell>
                          <TableCell>{allergies ? 'True' : 'None'}</TableCell>
                          <TableCell>{injury_history ? 'True' : 'None'}</TableCell>
                          <TableCell>{others ? 'True' : 'None'}</TableCell>
                          <TableCell>{kit_size_top} / {kit_size_bottom}</TableCell>

                          <TableCell><Link className={classes.tabs} onClick={() => {
                            setApplicantIndex(index)
                            setTabValue(1)
                          }}>View</Link></TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              }
            </> :
            <Typography component='div'>
              <Box fontSize={16} fontWeight="fontWeightBold" >
                Select a course to review applications
              </Box>
            </Typography>
          }
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Application
            viewSelect={viewSelect}
            editing={editing}
            open={open}
            setOpen={setOpen}
            setEditing={setEditing}
            applications={applications}
            filteredApplications={filteredApplications}
            application={filteredApplications[applicantIndex]}
            permissions={permissions}
            setApplications={setApplications}
            setFilteredApplications={setFilteredApplications}
            filteredIndex={applicantIndex}
            averages={getAverageScore}
            text={text}
            locale={locale} />
        </TabPanel>


        <TabPanel value={tabValue} index={2}>
          <AssessmentCategoryDashboard
            setAssessmentView={setAssessmentView}
            setTabValue={setTabValue}
            filteredApplications={filteredApplications}
            application={filteredApplications[applicantIndex]}
          />
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          <AssessmentCoachView
            assessmentView={assessmentView}
            // applications={applications}
            setTabValue={setTabValue}
            application={filteredApplications[applicantIndex]}
          />
        </TabPanel>


      </Container>
    </div>
  )
}

export default ApplicationDashboard
