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


const Application = ({ permissions, application, applications, setApplications, index, setEditing, open, setOpen, editing, averages }) => {
  const [userId, email, applicationInfo] = application
  const { personal_details, player_attributes, challenges, football_history } = applicationInfo

  const [ratings, setRatings] = useState(applicationInfo.ratings)
  const [averagePositionScore, averageCategoryScore, playerCategory] = averages(player_attributes.position)

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
        <Typography>Application Score: {ratings.application === 0 ? 'N/A' : ratings.application}</Typography>
        <Typography>Challenge Score: {Object.values(ratings.challengesMap).some(value => value === 0) ? 'N/A' : (Object.values(ratings.challengesMap).reduce((x,y) => x + y, 0))}</Typography>
        <Typography variant="h6">Overall Score: {Object.values(ratings.challengesMap).reduce((x,y) => x + y, 0) === 0 || ratings.application === 0 ? 'N/A' : Number((Object.values(ratings.challengesMap).reduce((x,y) => x + y, 0))) + Number(ratings.application)}</Typography>
        <br />
        <Typography>Average score for {player_attributes.position}: {averagePositionScore}</Typography>
        { !['Striker', 'Goalkeeper'].some(x => x === player_attributes.position) && <Typography>Average score for {playerCategory}: {averageCategoryScore}</Typography> }
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
        <Typography>{<a href={football_history.highlights_footage_link} target="_blank" rel="noopener noreferrer">View Highlights Footage</a>}</Typography>
        <br />
        <Typography>Select Rating For Application</Typography>
        <FormControl style={{ display: 'flex', flexDirection: 'row'}}>
        {/* <InputLabel>Rating</InputLabel> */}
        <Select value={ratings.application} style={{ marginRight: '10px' }} onChange={(event) => {
          setEditing(true)
          setRatings({ ...ratings, application: event.target.value})}}>
        <MenuItem value={0} disabled>Unrated</MenuItem>
          <MenuItem value={5}>5 - Poor</MenuItem>
          <MenuItem value={4}>4 - Below Average</MenuItem>
          <MenuItem value={3}>3 - Average</MenuItem>
          <MenuItem value={2}>2 - Good</MenuItem>
          <MenuItem value={1}>1 - Excellent</MenuItem>
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
        <MenuItem value={0} disabled>Unrated</MenuItem>
          <MenuItem value={5}>5 - Poor</MenuItem>
          <MenuItem value={4}>4 - Below Average</MenuItem>
          <MenuItem value={3}>3 - Average</MenuItem>
          <MenuItem value={2}>2 - Good</MenuItem>
          <MenuItem value={1}>1 - Excellent</MenuItem>
        </Select>
        </FormControl>
        <Typography>Challenge 2: <a href={challenges.link_2} target="_blank" rel="noopener noreferrer">Open video</a></Typography><FormControl>
        <Select value={ratings.challengesMap.challenge2} style={{ marginRight: '10px' }} onChange={(event) => {
        setEditing(true)
        setRatings({ ...ratings, challengesMap: { ...ratings.challengesMap, challenge2: event.target.value}})
        }}>
      <MenuItem value={0} disabled>Unrated</MenuItem>
          <MenuItem value={5}>5 - Poor</MenuItem>
          <MenuItem value={4}>4 - Below Average</MenuItem>
          <MenuItem value={3}>3 - Average</MenuItem>
          <MenuItem value={2}>2 - Good</MenuItem>
          <MenuItem value={1}>1 - Excellent</MenuItem>
      </Select>
      </FormControl>
        <Typography>Challenge 3: <a href={challenges.link_3} target="_blank" rel="noopener noreferrer">Open video</a></Typography><FormControl>
        <Select value={ratings.challengesMap.challenge3} style={{ marginRight: '10px' }} onChange={(event) => {
        setEditing(true)
        setRatings({ ...ratings, challengesMap: { ...ratings.challengesMap, challenge3: event.target.value}})
        }}>
      <MenuItem value={0} disabled>Unrated</MenuItem>
        <MenuItem value={5}>5 - Poor</MenuItem>
          <MenuItem value={4}>4 - Below Average</MenuItem>
          <MenuItem value={3}>3  - Average</MenuItem>
          <MenuItem value={2}>2  - Good</MenuItem>
          <MenuItem value={1}>1  - Excellent</MenuItem>
      </Select>
      </FormControl>
        <br />
        <br />
        { player_attributes.position === 'Goalkeeper' && <Typography>{<a href={football_history.highlights_footage_link} target="_blank" rel="noopener noreferrer">View Highlights Footage</a>}</Typography> }
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
        <Typography>{(Object.values(ratings.challengesMap).reduce((acc, res) => acc + res, 0))}</Typography>
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
  const [filteredApplications, setFilteredApplications] = useState([])
  const [applicantIndex, setApplicantIndex] = useState(0)
  const [editing, setEditing] = useState(false)
  const [open, setOpen] = useState(false)
  const [filters, setFilters] = useState({
    ageRange: '0-100',
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

  const getAverageScore = (position, cat='') => {

    let playerCategory = cat
    if (cat !== 'All') {
      for (const cat of Object.keys(positions)) {
        if (positions[cat].some(x => x === position)) {
          playerCategory = cat
        }
      }
    }
    const filteredCategoryPlayers = []
    const filteredPositionPlayers = []
    for (const application of applications) {
      const [id, email, player] = application
      if (player.ratings.application > 0 && !Object.values(player.ratings.challengesMap).some(x => x === 0)) {
        const sum = Number(player.ratings.application) + Number(Object.values(player.ratings.challengesMap).reduce((x,y) => x + y, 0))
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
  const benficaUserIds = ['aBDdhuP8D9abnRD3LxoOKuNu7Wr2', 'vfqmRwEAeXMijj2WUozS8aT034M2', 'zAUwes3cC5ZMLHBPV79AKeM9vVK2', 'Tyel8gUXLCNK1o9Cx7DobGAtRPk2']


  const handleFilterChange = (event) => {
    console.log(event)
    const name = event.target.name
    const newFilters = name === 'positionCategory' ? { ...filters, [name]: event.target.value, position: 'All'} : { ...filters, [name]: event.target.value }
    console.log(newFilters)
    const [lowAge, highAge] = newFilters.ageRange.split('-')
    const filteredPlayers = []
    for (const application of applications) {
      const [id, email, player] = application
      // if (
      //   Number(auth.dobToAge(player.personal_details.dob)) >= lowAge &&
      //   Number(auth.dobToAge(player.personal_details.dob)) <= highAge
      // ) {
        if (newFilters.positionCategory === 'All') {
          filteredPlayers.push(application)
        } else if (positions[newFilters.positionCategory].includes(player.player_attributes.position)) {
          if (newFilters.position === 'All' || newFilters.position === player.player_attributes.position) {
            filteredPlayers.push(application)
          }
        } 
      // }
    }

    console.log({filteredPlayers})
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
        const sortA = Object.values(a[2].ratings.challengesMap).some(x => x === 0) ? 100 : (Number(a[2].ratings.application) + Number(Object.values(a[2].ratings.challengesMap).reduce((x,y) => x + y, 0)))
        const sortB = Object.values(b[2].ratings.challengesMap).some(x => x === 0) ? 100 : (Number(b[2].ratings.application) + Number(Object.values(b[2].ratings.challengesMap).reduce((x,y) => x + y, 0)))
        return sortA - sortB
        // return (Number(a[2].ratings.application) + Number(Object.values(a[2].ratings.challengesMap).reduce((x,y) => x + y, 0))) - (Number(b[2].ratings.application) + Number(Object.values(b[2].ratings.challengesMap).reduce((x,y) => x + y, 0)))
      })
    } else {
      sorted.sort((a, b) => a[2][parent][key].localeCompare(b[2][parent][key]))
    }
    
    if (sorted[0][0] === filteredApplications[0][0] && newSort.type === sort.type) {
     sorted.reverse()
    }
      
    //  === filteredApplications ? filteredApplications.sort((a, b) => b[2][parent][key] > a[2][parent][key]) : filteredApplications.sort((a, b) => a[2][parent][key] > b[2][parent][key])
    console.log(sorted)
    setSort({ ...newSort })
    setFilteredApplications(sorted)
    
  }
  

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
    setFilteredApplications(applicantArray)
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
      Position: 'Position',
      Score: 'Score',
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
      Position: 'Position',
      Score: 'Score',
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
        <Container style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', textAlign: 'center' }}>
          <div>
      <FormControl>
                    <InputLabel id="demo-simple-select-label">
                      Category
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={filters.positionCategory}
                      inputProps={{
                        name: 'positionCategory',
                      }}
                      onChange={handleFilterChange}
                    >
                      <MenuItem value={'All'}>All positions</MenuItem>
                      <MenuItem value={'Goalkeeper'}>Goalkeeper</MenuItem>
                      <MenuItem value={'Defence'}>Defence</MenuItem>
                      <MenuItem value={'Midfield'}>Midfield</MenuItem>
                      <MenuItem value={'Attack'}>Attack</MenuItem>
                    </Select>
                  </FormControl>
                  { !['All', 'Attack', 'Goalkeeper'].some(x => x === filters.positionCategory) && <FormControl>
                  <InputLabel id="demo-simple-select-label">
                      Position
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={filters.position}
                      inputProps={{
                        name: 'position',
                      }}
                      onChange={handleFilterChange}
                    >
                      <MenuItem value={'All'}>All</MenuItem>
                     { positions[filters.positionCategory].map(position => {
                        return (
                          <MenuItem value={position}>{position}</MenuItem>
                        )
                      })}
                    </Select>
                  </FormControl> }
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
                  { permissions === 0 && <Typography variant="h6">{filters.positionCategory === 'All' ? `Average Completed Application Score: ${getAverageScore('All', 'All')[0]}` : filters.position === 'All' ? `Average ${filters.positionCategory} Score: ${getAverageScore('All', filters.positionCategory)[1]}` : `Average ${filters.position} Score: ${getAverageScore(filters.position, filters.positionCategory)[1]}` }</Typography> }
                  </Container>
      <Table>
        <TableHead>
        <TableRow>
                <TableCell align="right">
                  <Button onClick={(event) => handleSort(event, 'personal_details name')}>
                    {text[locale].Name} {sort.type === 'name' ? sort.direction === 'down' ? <ArrowDropDownIcon/> : <ArrowDropUpIcon/> : <ArrowDropDownIcon style={{ opacity: 0}}/>  }
                  </Button>
                </TableCell>
                <TableCell align="right" >
                  <Button onClick={(event) => handleSort(event, 'personal_details dob')}>
                    {text[locale].Age}  {sort.type === 'dob' ? sort.direction === 'down' ? <ArrowDropDownIcon/> : <ArrowDropUpIcon/> : <ArrowDropDownIcon style={{ opacity: 0}}/>  }
                  </Button>
                </TableCell>
                <TableCell align="right">
                  <Button onClick={(event) => handleSort(event, 'personal_details city')}>
                    {text[locale].City} {sort.type === 'city' ? sort.direction === 'down' ? <ArrowDropDownIcon/> : <ArrowDropUpIcon/> : <ArrowDropDownIcon style={{ opacity: 0}}/>  }
                  </Button>
                </TableCell>
                { (permissions === 0 || permissions === 2) && 
                <TableCell align="right" >
                  <Button onClick={(event) => handleSort(event, 'player_attributes position')}>
                    {text[locale].Position} {sort.type === 'position' ? sort.direction === 'down' ? <ArrowDropDownIcon/> : <ArrowDropUpIcon/> : <ArrowDropDownIcon style={{ opacity: 0}}/> }
                  </Button>
                  </TableCell> 
                }
                <TableCell align="right">
                  {/* <Button onClick={(event) => handleSort(event, 'personal_details status')}> */}
                  {/* {text[locale].Status} {sort.type === 'city' ? sort.direction === 'down' ? <ArrowDropDownIcon/> : <ArrowDropUpIcon/> : '' } */}
                  {/* </Button> */}
                  {text[locale].Status}
                  </TableCell>
                { permissions === 0 && 
                  <TableCell align="right">
                    <Button onClick={(event) => handleSort(event, 'player score')}>
                      {text[locale].Score} {sort.type === 'score' ? sort.direction === 'down' ? <ArrowDropDownIcon/> : <ArrowDropUpIcon/> : <ArrowDropDownIcon style={{ opacity: 0}}/> }
                    </Button>
                  </TableCell> }
                { permissions === 0 && <TableCell align="right">{text[locale].Approved}</TableCell> }
                <TableCell align="right"></TableCell>
              </TableRow>
        </TableHead>
        <TableBody>
          { filteredApplications.map(([userId, email, applicant], index) => {
            const { personal_details, player_attributes, ratings } = applicant
            return (
              <TableRow>
                <TableCell>{personal_details.name}</TableCell>
                <TableCell>{auth.dobToAge(personal_details.dob)}</TableCell>
                <TableCell>{personal_details.city}</TableCell>
                { (permissions === 0 || permissions === 2)&& 
                <TableCell>{player_attributes.position}</TableCell> 
                }
                { permissions === 0 ? 
                <TableCell>
                  {ratings.application > 0 && !Object.values(ratings.challengesMap).some(challenge => challenge === 0) ? 'Checked' : 'Awaiting Check'}
                </TableCell> :
                permissions === 1 ? 
                <TableCell>
                  {ratings.application > 0 ? 'Checked' : 'Awaiting Check'}
                  </TableCell> : 
                <TableCell>
                  {!Object.values(ratings.challengesMap).some(challenge => challenge === 0) ? 'Checked' : 'Awaiting Check'}
                  </TableCell>
                }
                { permissions === 0 && 
                <TableCell>
                  {ratings.application > 0 && !Object.values(ratings.challengesMap).some(challenge => challenge === 0) ? Number(ratings.application) + Number(Object.values(ratings.challengesMap).reduce((x,y) => x + y, 0)) : 'N/A' }
                </TableCell> }
                { permissions === 0 && 
                <TableCell>
                  {ratings.indulge === 0 ? 'Awaiting Approval' : ratings.indulge }
                  </TableCell>
                }
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
      <Application editing={editing} open={open} setOpen={setOpen} setEditing={setEditing} applications={applications} application={filteredApplications[applicantIndex]} permissions={permissions} setApplications={setApplications} index={applicantIndex} averages={getAverageScore}/>
      </TabPanel>
    </Container>
  )
}

export default ApplicationDashboard
