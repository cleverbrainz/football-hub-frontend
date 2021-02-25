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
import {
  Box,
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

import axios from 'axios'
import auth from '../lib/auth'

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


const Application = ({ permissions, application, applications, setApplications, index, setEditing, open, setOpen, editing }) => {
  const [userId, email, applicationInfo] = application
  const { personal_details, player_attributes, challenges, football_history } = applicationInfo

  const [ratings, setRatings] = useState(applicationInfo.ratings)

  console.log({ratings})

  const handleSave = (event, approval=false) => {
    console.log('handling')
    event.preventDefault()
    const newApps = [...applications]
    const newApplication = { ...applicationInfo, ratings: { ...ratings }}
    newApps[index] = [userId, email, newApplication]
    axios.patch(`/users/${userId}`, { userId, updates: { applications: { benfica: newApplication } }}, { headers: { authorization: 'Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjBlYmMyZmI5N2QyNWE1MmQ5MjJhOGRkNTRiZmQ4MzhhOTk4MjE2MmIiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vZm9vdGJhbGwtaHViLTQwMThhIiwiYXVkIjoiZm9vdGJhbGwtaHViLTQwMThhIiwiYXV0aF90aW1lIjoxNjE0MTc4MjAwLCJ1c2VyX2lkIjoiYUJEZGh1UDhEOWFiblJEM0x4b09LdU51N1dyMiIsInN1YiI6ImFCRGRodVA4RDlhYm5SRDNMeG9PS3VOdTdXcjIiLCJpYXQiOjE2MTQxNzgyMDAsImV4cCI6MTYxNDE4MTgwMCwiZW1haWwiOiJhcHBsaWNhdGlvbnBsYXllcjJAbWFpbGRyb3AuY2MiLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZW1haWwiOlsiYXBwbGljYXRpb25wbGF5ZXIyQG1haWxkcm9wLmNjIl19LCJzaWduX2luX3Byb3ZpZGVyIjoicGFzc3dvcmQifX0.hMClettXXaYczzQoAYy5eoVBxUxRrVrigQMDXzbOff1wgshSWUSPFT7JzIXtzSawh3kRAcMrg1TErnLghEVRje_0pFthqXWGVQp17RTfy5_JmCUgGRuAbQhFgLcyU6O0dl1yhprzYsOCsLpg1fvzzW0sbv5But8X-QmhvhxdvXTuKQ0BF6epsPOE3-sc7wPRymBfnr7ii6R-rWoOjU5dzx8cHY_-_eOI-MPp4euZ2gD2iLOeoqJLT-nRV1A3of3N3ThjQ2wYBPe58bSbsKOF4u_6N-hQUm0EPkNdzvuplcw-xwu6IxbowDMrI5vXJ5pkAB17WPQArZY16gyRq-eWGA'}}).then(res => {
      console.log(res)
      if (approval && ratings.indulge === 'Yes') {
        axios.post('/contactPlayer', {type: 'applicationSuccessful',
        recipient: { recipientId: userId },
        emailContent: {contentCourse: 'Benfica Summer Camp'}}).then(res => {
          console.log(res)
        })
      } else if (approval && ratings.indulge === 'No') {
        axios.post('/contactPlayer', {type: 'applicationUnsuccessful',
        recipient: { recipientId: userId },
        emailContent: {contentCourse: 'Benfica Summer Camp'}}).then(res => {
          console.log(res)
        })
      }
      setApplications(newApps)
      setEditing(false)
    })
  }

 if (permissions === 0) return (
  // <Container>
  <>
    <Grid container justify="center"
  alignItems="center" spacing={2}>
      <Grid item xs={6}>
        <Typography variant="h5">Player Details</Typography>
        <Typography>Name: {personal_details.name}</Typography>
        <Typography>DOB: {personal_details.dob}</Typography>
        <Typography>Gender: {personal_details.gender}</Typography>
        <Typography>Address: {[personal_details.address_line_1, personal_details.address_line_2, personal_details.city, personal_details.postcode].join(', ')}</Typography>
        <Typography>{<a href={personal_details.residency_certificate} target="_blank" rel="noopener noreferrer">View Residency Certificate </a>}</Typography>

        <Typography>Height: {player_attributes.height}</Typography>
        <Typography>Weight: {player_attributes.weight}kg</Typography>
        <Typography>Position: {player_attributes.position}</Typography>
        <Typography>Preferred Foot: {player_attributes.preferred_foot}</Typography>
        <br/>

      <Typography variant="h5">Challenge Details</Typography>
        <Typography>Challenge 1: <a href={challenges.link_1} target="_blank" rel="noopener noreferrer">Open video</a></Typography>
        <Typography>Challenge 2: <a href={challenges.link_2} target="_blank" rel="noopener noreferrer">Open video</a></Typography>
        <Typography>Challenge 3: <a href={challenges.link_3} target="_blank" rel="noopener noreferrer">Open video</a></Typography>
      </Grid>
      <Grid item xs={6}>
      <Typography variant="h5">Application Details</Typography>
      <Typography>Bio: {football_history.bio_description}</Typography>
      <Typography>Current Club: {football_history.current_club}</Typography>
      <Typography>Previous Clubs: {football_history.previous_clubs}</Typography>
      <Typography>Previous Trials Attended: {football_history.previous_trails_attended}</Typography>
      <Typography>Social Media Links: {football_history.social_media_link}</Typography>
      <Typography>{<a href={football_history.highlights_footage_link} target="_blank" rel="noopener noreferrer">View Highlights Footage</a>}</Typography>
      
        <br />
        <Typography variant="h6">Overall Score: {Object.values(ratings.challengesMap).reduce((x,y) => x + y, 0) === 0 || ratings.application === 0 ? 'N/A' : Number((Object.values(ratings.challengesMap).reduce((x,y) => x + y, 0) / 3).toFixed(1)) + Number(ratings.application)}</Typography>
        <Typography>Application Score: {ratings.application === 0 ? 'N/A' : ratings.application}</Typography>
        <Typography>Challenge Score: {ratings.challenges === 0 ? 'N/A' : (Object.values(ratings.challengesMap).reduce((x,y) => x + y, 0) / 3).toFixed(1)}</Typography>
        <br />
        <Typography>Approve For Course</Typography>
        <FormControl style={{ display: 'flex', flexDirection: 'row'}}>
        {/* <InputLabel>Rating</InputLabel> */}
        <Select value={ratings.indulge} style={{ marginRight: '10px' }} onChange={(event) => {
          setEditing(true)
          setRatings({ ...ratings, indulge: event.target.value})}}>
        <MenuItem value={0} disabled>-</MenuItem>
          <MenuItem value={'Yes'}>Yes</MenuItem>
          <MenuItem value={'No'}>No</MenuItem>
        </Select>
        {/* <FormHelperText></FormHelperText> */}
        { editing && <Button variant="contained" color="primary" onClick={(event) => handleSave(event, true)}>Save</Button>}
      </FormControl>
      </Grid>
    </Grid>
    <AlertDialog open={open} setOpen={setOpen} handleSave={handleSave} setEditing={setEditing}/>
  </>
    // </Container>
 )
 if (permissions === 1) return (
   // <Container>
   <>
    <Grid container justify="center"
  alignItems="center" spacing={2}>
      <Grid item xs={6}>
        <Typography variant="h5">Player Details</Typography>
        <Typography>Name: {personal_details.name}</Typography>
        <Typography>DOB: {personal_details.dob}</Typography>
        <Typography>Gender: {personal_details.gender}</Typography>
        <Typography>Address: {[personal_details.address_line_1, personal_details.address_line_2, personal_details.city, personal_details.postcode].join(', ')}</Typography>
        <Typography>{<a href={personal_details.residency_certificate} target="_blank" rel="noopener noreferrer">View Residency Certificate </a>}</Typography>

        <Typography>Height: {player_attributes.height}</Typography>
        <Typography>Weight: {player_attributes.weight}kg</Typography>
        <Typography>Position: {player_attributes.position}</Typography>
        <Typography>Preferred Foot: {player_attributes.preferred_foot}</Typography>
      </Grid>
      <Grid item xs={6}>
      <Typography variant="h5">Application Details</Typography>
      <Typography>Bio: {football_history.bio_description}</Typography>
      <Typography>Current Club: {football_history.current_club}</Typography>
      <Typography>Previous Clubs: {football_history.previous_clubs}</Typography>
      <Typography>Previous Trials Attended: {football_history.previous_trails_attended}</Typography>
      <Typography>Social Media Links: {football_history.social_media_link}</Typography>
      {/* current_club: 'Sheffield United',
    current_coaching_school: 'Sheffield United Academy',
    previous_clubs: '',
    previous_trails_attended: '',
    highlights_footage_link: '',
    social_media_link: '',
    bio_description: '', */}

        <br />
        <Typography>Select Rating For Application</Typography>
        <FormControl style={{ display: 'flex', flexDirection: 'row'}}>
        {/* <InputLabel>Rating</InputLabel> */}
        <Select value={ratings.application} style={{ marginRight: '10px' }} onChange={(event) => {
          setEditing(true)
          setRatings({ ...ratings, application: event.target.value})}}>
        <MenuItem value={0} disabled>-</MenuItem>
          <MenuItem value={3}>3</MenuItem>
          <MenuItem value={2}>2</MenuItem>
          <MenuItem value={1}>1</MenuItem>
        </Select>
        {/* <FormHelperText></FormHelperText> */}
        { editing && <Button variant="contained" color="primary" onClick={(event) => handleSave(event)}>Save</Button>}
      </FormControl>
      </Grid>
    </Grid>
    <AlertDialog open={open} setOpen={setOpen} handleSave={handleSave} setEditing={setEditing}/>
  </>
    

  // </Container>
 )
 if (permissions === 2) return (
  // <Container >
  <>
    <Grid container justify="center"
  alignItems="center" spacing={2}>
      <Grid item xs={6}>
        <Typography variant="h5">Player Details</Typography>
        <Typography>Name: {personal_details.name}</Typography>
        <Typography>DOB: {personal_details.dob}</Typography>
        <Typography>Gender: {personal_details.gender}</Typography>
        <Typography>Height: {player_attributes.height}</Typography>
        <Typography>Weight: {player_attributes.weight}kg</Typography>
        <Typography>Position: {player_attributes.position}</Typography>
        <Typography>Preferred Foot: {player_attributes.preferred_foot}</Typography>
      </Grid>
      <Grid item xs={6}>
      <Typography variant="h5">Challenge Details</Typography>
        <Typography>Challenge 1: <a href={challenges.link_1} target="_blank" rel="noopener noreferrer">Open video</a></Typography>
        <FormControl>
          <Select value={ratings.challengesMap.challenge1} style={{ marginRight: '10px' }} onChange={(event) => {
          setEditing(true)
          setRatings({ ...ratings, challengesMap: { ...ratings.challengesMap, challenge1: event.target.value}})
          }}>
        <MenuItem value={0} disabled>-</MenuItem>
          <MenuItem value={3}>3</MenuItem>
          <MenuItem value={2}>2</MenuItem>
          <MenuItem value={1}>1</MenuItem>
        </Select>
        </FormControl>
        <Typography>Challenge 2: <a href={challenges.link_2} target="_blank" rel="noopener noreferrer">Open video</a></Typography><FormControl>
        <Select value={ratings.challengesMap.challenge2} style={{ marginRight: '10px' }} onChange={(event) => {
        setEditing(true)
        setRatings({ ...ratings, challengesMap: { ...ratings.challengesMap, challenge2: event.target.value}})
        }}>
      <MenuItem value={0} disabled>-</MenuItem>
        <MenuItem value={3}>3</MenuItem>
        <MenuItem value={2}>2</MenuItem>
        <MenuItem value={1}>1</MenuItem>
      </Select>
      </FormControl>
        <Typography>Challenge 3: <a href={challenges.link_3} target="_blank" rel="noopener noreferrer">Open video</a></Typography><FormControl>
        <Select value={ratings.challengesMap.challenge3} style={{ marginRight: '10px' }} onChange={(event) => {
        setEditing(true)
        setRatings({ ...ratings, challengesMap: { ...ratings.challengesMap, challenge3: event.target.value}})
        }}>
      <MenuItem value={0} disabled>-</MenuItem>
        <MenuItem value={3}>3</MenuItem>
        <MenuItem value={2}>2</MenuItem>
        <MenuItem value={1}>1</MenuItem>
      </Select>
      </FormControl>
        <br />
        <Typography>{<a href={football_history.highlights_footage_link} target="_blank" rel="noopener noreferrer">View Highlights Footage</a>}</Typography>
        <br />
        <Typography>Current Rating For Challenges</Typography>
        <FormControl style={{ display: 'flex', flexDirection: 'row'}}>
        {/* <InputLabel>Rating</InputLabel> */}
        {/* <Select value={ratings.challenges} style={{ marginRight: '10px' }} onChange={(event) => {
          setEditing(true)
          setRatings({ ...ratings, challenges: event.target.value})
          }}>
        <MenuItem value={0} disabled>-</MenuItem>
          <MenuItem value={3}>3</MenuItem>
          <MenuItem value={2}>2</MenuItem>
          <MenuItem value={1}>1</MenuItem>
        </Select> */}
        <Typography>{(Object.values(ratings.challengesMap).reduce((acc, res) => acc + res, 0) / 3).toFixed(1)}</Typography>
        { editing && <Button variant="contained" color="primary" onClick={(event) => handleSave(event)}>Save</Button>}
        {/* <FormHelperText></FormHelperText> */}
      </FormControl>
      </Grid>
    </Grid>
    <AlertDialog open={open} setOpen={setOpen} handleSave={handleSave} setEditing={setEditing}/>
      </>
    // </Container>
 )
}






const ApplicationDashboard = ({locale}) => {
  const [user, setUser] = useState(null)
  const [permissions, setPermissions] = useState(1)
  const [tabValue, setTabValue] = useState(0)
  const [coursesModerating, setCoursesModerating] = useState(['course1', 'course2'])
  const [selectedCourse, setSelectedCourse] = useState('select')
  const [applications, setApplications] = useState([])
  const [applicantIndex, setApplicantIndex] = useState(0)
  const [editing, setEditing] = useState(false)
  const [open, setOpen] = useState(false)
  // const [language, setLanguage] = useState(null)

  // console.log(props)

  // const benficaUserIds = ['aBDdhuP8D9abnRD3LxoOKuNu7Wr2', 'vfqmRwEAeXMijj2WUozS8aT034M2', '6KIIPGyFOzLPePWhCeupWCBBjRw1']
  const benficaUserIds = ['aBDdhuP8D9abnRD3LxoOKuNu7Wr2', 'vfqmRwEAeXMijj2WUozS8aT034M2', 'zAUwes3cC5ZMLHBPV79AKeM9vVK2']
  

  console.log(permissions)

  const getData = async function () {
    // let userData = await axios.get(`/users/${auth.getUserId()}`)
    // userData = await userData.data[0]
    // const { courses, adminLevel } = userData
    // const courseArray = []
    const applicantArray = []
    for (const benficaUser of benficaUserIds) {
      let userData = await axios.get(`/users/${benficaUser}`)
      userData = await userData.data[0]
      const app = [userData.userId, userData.email]
      userData.applications.benfica ? app.push(userData.applications.benfica) : app.push(userData.applications.benfica_application)
      applicantArray.push(app)
    }
    setApplications(applicantArray)
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
      ApplicationList: 'Application List',
      ViewSingleApplication: 'View Single Application',
      Name: 'Name',
      Age: 'Age',
      City: 'City',
      Status: 'Status',
      Approved: 'Approved',
      ViewApplication: 'View Application'
    },
    ko: {
      Courses: '과정',
      ApplicationList: '응용',
      ViewSingleApplication: '응용 프로그램보기',
      Name: '이름',
      Age: '나이',
      City: '시티',
      Status: '상태',
      Approved: '승인 됨',
      ViewApplication: '응용 프로그램보기'

    }
  }


  console.log({applications})
  if (applications.length === 0 || !locale) return null
  return (
    <Container>
      <br/>
      <br/>
      <br/>
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
          Select a course to view applications
          </MenuItem>
        { coursesModerating.map((course, index) => {
        return (
          <MenuItem value={index}>{course}</MenuItem>
        )
        })}
        </Select>
        {/* <FormHelperText></FormHelperText> */}
      </FormControl>

      <AppBar position="static" color="default">
        <Tabs
          // className={classes.AppBar}
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
          <Tab label={text[locale].ApplicationList} icon={<ListIcon/>} />
          { tabValue === 1 && <Tab label={text[locale].ViewSingleApplication} icon={<PersonIcon/>} /> }

          {/* <Tab label="Current Companies" icon={<PeopleAltSharpIcon />} {...a11yProps(0)} /> */}
          {/* <Tab label="New Requests" icon={<PersonAddSharpIcon />} {...a11yProps(1)} /> */}
        </Tabs>
      </AppBar>

      <TabPanel value={tabValue} index={0}>
      <Table>
        <TableHead>
        <TableRow>
                <TableCell align="right">{text[locale].Name}</TableCell>
                <TableCell align="right">{text[locale].Age}</TableCell>
                <TableCell align="right">{text[locale].City}</TableCell>
                <TableCell align="right">{text[locale].Status}</TableCell>
                { permissions === 0 && <TableCell align="right">{text[locale].Approved}</TableCell> }
                <TableCell align="right"></TableCell>
              </TableRow>
        </TableHead>
        <TableBody>
          { applications.map(([userId, email, applicant], index) => {
            const { personal_details, ratings } = applicant
            return (
              <TableRow>
                <TableCell>{personal_details.name}</TableCell>
                <TableCell>{personal_details.dob}</TableCell>
                <TableCell>{personal_details.city}</TableCell>
                { permissions === 0 ? <TableCell>{ratings.application > 0 && ratings.challenges > 0 ? 'Checked' : 'Awaiting Check'}</TableCell> :
                permissions === 1 ? <TableCell>{ratings.application > 0 ? 'Checked' : 'Awaiting Check'}</TableCell> : 
                <TableCell>{Object.values(ratings.challengesMap).reduce((x,y) => x + y, 0) > 0 ? 'Checked' : 'Awaiting Check'}</TableCell>}
                { permissions === 0 && <TableCell>{ratings.indulge === 0 ? 'Awaiting Approval' : ratings.indulge }</TableCell> }
                <TableCell><Link onClick={() => {
                  setApplicantIndex(index) 
                  setTabValue(1)}}>{text[locale].ViewApplication}</Link></TableCell>
              </TableRow>
            )
          }) }
        </TableBody>
      </Table>
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
      <Application editing={editing} open={open} setOpen={setOpen} setEditing={setEditing} applications={applications} application={applications[applicantIndex]} permissions={permissions} setApplications={setApplications} index={applicantIndex}/>
      </TabPanel>
    </Container>
  )
}

export default ApplicationDashboard
