import React, { useEffect, useState, useContext } from 'react';
import { Redirect } from 'react-router-dom'
import { Paper, Grid, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import axios from 'axios'
import auth from '../../lib/auth'
import { Link } from 'react-router-dom'
import moment from 'moment'
import {
  Button,
  Tab,
  Tabs,
  AppBar,
  Select,
  Container
} from "@material-ui/core";
import Box from '@material-ui/core/Box';
import ArrowForwardSharpIcon from '@material-ui/icons/ArrowForwardSharp';
import { AuthContext } from "../../lib/context"
import IntroductionPage from './IntroductionPage';
import { isEmpty } from 'lodash';
import { ChevronRight } from '@material-ui/icons';
import PropTypes from 'prop-types';
import CircularProgress from '@material-ui/core/CircularProgress'


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

function a11yProps(index) {
  return {
    id: `scrollable-force-tab-${index}`,
    'aria-controls': `scrollable-force-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: '24px',
    height: window.innerHeight - 80
  },
  paper: {
    padding: theme.spacing(2),
    minHeight: '40vh',
    borderRadius: '20px',
    position: 'relative'
  },
  fab: {
    position: 'absolute',
    bottom: '3%',
    right: '2%'
  },
  notiContainer: {
    backgroundColor: '#02a7f0',
    padding: '20px'
  },
  enquiryContainer: {    
    [theme.breakpoints.up("sm")]: {
      display: 'flex',
      justifyContent: 'center'
    },
    marginBottom: '20px'
  },
  enquiryItem: {
    marginTop: '15px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    color: 'black',
    [theme.breakpoints.up("sm")]: {
      marginRight: '20px'
    },
    padding: '20px 0px 20px 20px'
  },
  textContainer: {
    display: 'grid'
  },
  titleText: {
    fontSize: '9pt',
    marginBottom: '5px'
  },
  notiText: {
    fontSize: '11pt'
  },
  boldText: {
    fontWeight: 'bold',
    fontSize: '12pt',
    marginRight: '5px'
  },
  quickItem: {
    borderColor: '#02a7f0',
    border: 'solid',
    borderWidth: '2px',
    borderRadius: '8px',
    minHeight: '100px'
  },
  quickButton: {
    width: '100%',
    height: '100%',
    minHeight: '100px'
  },
  dayButton: {
    minWidth: '40px',
    maxWidth: '100px',
    padding: '6px'
  }
}));

const Summary = ({ handleComponentChange }) => {

  const { user, userData, setUserData } = useContext(AuthContext)
  const classes = useStyles();

  const cards = [
    { text: 'Players', component: 'Players', userObject: 'players' },
    { text: 'Courses & Camps', component: 'Sessions', userObject: 'courses' },
    { text: 'Coaches', component: 'Coaches', userObject: 'coaches' }
  ]

  // const [user, setUser] = useState()
  const date = moment()
  const [registers, setRegisters] = useState([])
  const [thisWeek, setThisWeek] = useState([])
  const [companyMessages, setCompanyMessages] = useState()
  const [value, setValue] = useState(0);
  const [isLoading, setIsLoading] = useState(true)
  const today = new Date();

  async function getData() {
    if (!user.user) return
    let registerArray = []
    let coachArray = []
    const response = await axios.get(`/users/${user.userId}`, { headers: { Authorization: `Bearer ${auth.getToken()}` }})
    const data = await response.data[0]

    for (const course of data.courses.active) {
      let register
      const response = await axios.get(`/courses/${course.courseId}`, { headers: { Authorization: `Bearer ${auth.getToken()}` }})
      register = await response.data
      if (register.register) registerArray.push([course.courseDetails, course.courseId, register.register.sessions, course.coachName])
    }

    for (const id of data.coaches) {
      let coach
      const response = await axios.get(`/users/${id}`, { headers: { Authorization: `Bearer ${auth.getToken()}` }})
      coach = await response.data[0] ? response.data[0] : response.data
      coachArray.push({ ...coach.coachInfo })
      // console.log('THIS ISSS', coach.coachInfo)
    }
    // console.log('HSHAHAHA', coachArray)
    setUserData({ ...data, coaches: coachArray })
    setRegisters(registerArray)
    setThisWeek(sortRegisters(registerArray))
    setIsLoading(false)
  }

  const getMessages = () => {
    axios.get('/enquiries/company', { headers: { Authorization: `Bearer ${auth.getToken()}` } })
      .then(async res => {
        console.log(res.data)
        if (isEmpty(res.data) || res.data === null) {
          console.log('The message data is empty.')
        } else  {
          const orderedMessages = res.data.sort((a, b) => {
            const messageA = a.enquiryInfo.messages[a.enquiryInfo.messages.length - 1]
            const messageB = b.enquiryInfo.messages[b.enquiryInfo.messages.length - 1]
            const dateA = new Date(messageA.createdAt._seconds * 1000 + messageA.createdAt._nanoseconds / 1000000)
            const dateB = new Date(messageB.createdAt._seconds * 1000 + messageB.createdAt._nanoseconds / 1000000)
  
            return dateB - dateA
          })
          setCompanyMessages(orderedMessages)
        }        
      })
      .catch(err => console.log(err))
  }

  const sortRegisters = (registers) => {
    const monday = date.startOf('week')
    const weekdays = {}
    for (let i = 1; i <= 7; i++) {
      weekdays[(monday.add(1, 'days').format('YYYY-MM-DD'))] = []
    }
    registers.forEach(([courseDetails, id, sessionDates, coachNames]) => {
      for (const session of sessionDates) {
        if (Object.keys(weekdays).indexOf(session) !== -1) {
          const correctSession = courseDetails.courseType === 'Camp' ?
            courseDetails.sessions.filter(infoSession => moment.unix(infoSession.sessionDate._seconds).format('dddd') === moment(session).format('dddd'))[0]
            :
            courseDetails.sessions.filter(infoSession => infoSession.day === moment(session).format('dddd'))[0]
          weekdays[session].push([courseDetails, id, correctSession, coachNames])
        }
      }
    })
    // console.log(weekdays)
    return weekdays
  }

  useEffect(() => {
    getMessages()
    getData()
  }, [!user.user])
  // console.log(userData)

  function renderRecentlyAdded(detail) {
    const textArr = []
    const { players, courses, coaches } = userData
    const length = userData && (detail === 'courses' && courses.active) ? courses.active.length :
      detail === 'players' ? Object.keys(players).length : coaches.length

    for (let i = length - 1; i >= 0; i--) {
      switch (detail) {
        case 'courses': {
          const { age, courseType, sessions, location } = courses.active[i].courseDetails
          courseType === 'Camp' ?
            textArr.push(`Added ${courseType} for ${age} at ${location}`)
            :
            textArr.push(`Added ${courseType} for ${age} at ${sessions.map((el, i) => i === sessions.length - 1 ? el.location : `${el.location},`)}`)
        }
          break;
        case 'players':
          Object.keys(players).forEach((key) => {
            const { name, status, age, dob } = players[key]
            textArr.push(`Added ${name} as ${status} player.${age ? isNaN(auth.dobToAge(age)) ? ''  : ` Age: ${auth.dobToAge(age)}` : isNaN(auth.dobToAge(dob)) ? ''  : ` Age: ${auth.dobToAge(age)}`}`)
          })
          break
        case 'coaches':
          const { name, coaching_level } = coaches[i]
          textArr.push(`${name} joined company${coaching_level ? ` at ${coaching_level}` : ''}`)
          break
        default:
          break;
      }
    }
    return textArr
  }

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  if (!userData.courses) return null
  if (userData && !userData.subscriptions) handleComponentChange('Subscription', 0)
  if (userData && userData.listings.length === 0) return <IntroductionPage handleComponentChange={handleComponentChange} />
  return (
    <div className={classes.root} style={{backgroundColor: 'white'}}>
      {isLoading && <div>
        <CircularProgress style= {{position: 'absolute', left: 'calc(50% - 50px)', top: 'calc(50% - 50px)', width: '100px', height: '100px', margin: 'auto'}}/>
      </div>}
      {!isLoading && <div>
        <div style={{backgroundColor: '#02a7f0', margin: '-34px -24px', padding: '24px'}}>
          <Typography variant="h6" style={{color: 'white'}}>{`${today.toDateString()}`}</Typography>
          <Typography variant="h5" style={{color: 'white', textAlign: 'center', marginTop: '20px'}}>Welcome Back {`${userData.name}`}</Typography>
          <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <Typography variant="h6" style={{color: 'white', fontWeight: 'bold'}}>What's new?</Typography>
            <Button style={{color: 'white'}}>
              View All {'>'}
            </Button>
          </div>
          <div className={classes.enquiryContainer}>
            <div xs={12} sm={4} className={classes.enquiryItem}>
              <div className={classes.textContainer}>
                <Typography className={classes.titleText}>New Player Enquiry</Typography>
                <Typography className={classes.notiText}>Paul Smith-How much does each course...</Typography>
              </div>
              <ChevronRight style={{fontSize: '30pt'}}/>
            </div>

            <div xs={12} sm={4} className={classes.enquiryItem}>
              <div className={classes.textContainer}>
                <Typography className={classes.titleText}>New Camp Booking</Typography>
                <Typography className={classes.notiText}>Summer Elite Camp</Typography>
              </div>
              <ChevronRight style={{ fontSize: '30pt'}}/>
            </div>

            <div xs={12} sm={4} className={classes.enquiryItem}>
              <div className={classes.textContainer}>
                <Typography className={classes.titleText}>New Player Enquiry</Typography>
                <Typography className={classes.notiText}>Paul Smith-How much does each course...</Typography>
              </div>
              <ChevronRight style={{fontSize: '30pt'}}/>
            </div>
          </div>
        </div>
        <div style={{backgroundColor: 'white', margin: '0 -24px', padding: '24px'}}>
          <Typography variant="h6" style={{color: 'black', fontWeight: 'bold'}}>What's on this week?</Typography>
          <div style={{border: 'solid', borderColor: '#02a7f0', borderWidth: '2px', minHeight: '200px'}}>
            <div position="static" color="default" style={{backgroundColor: '#f2f2f2'}}>
              <Tabs
                centered
                className={classes.AppBar}
                value={value}
                onChange={handleChange}
                indicatorColor="primary"
                textColor="primary"
                aria-label="scrollable force tabs example"            >
                <Tab label="MON" {...a11yProps(0)} className={classes.dayButton}/>
                <Tab label="Tue" {...a11yProps(1)} className={classes.dayButton}/>
                <Tab label="Wed" {...a11yProps(2)} className={classes.dayButton}/>
                <Tab label="Thu" {...a11yProps(3)} className={classes.dayButton}/>
                <Tab label="Fri" {...a11yProps(4)} className={classes.dayButton}/>
                <Tab label="Sat" {...a11yProps(5)} className={classes.dayButton}/>
                <Tab label="Sun" {...a11yProps(6)} className={classes.dayButton}/>
              </Tabs>
            </div>
            <TabPanel value={value} index={0}>
              {
                Object.keys(thisWeek).map(oneDay => {
                  if (thisWeek[oneDay].length !== 0) {
                    return(
                    <>
                      {thisWeek[oneDay].map(([courseDetails, id, sessionInfo, coachNames]) => {
                        if (sessionInfo.day === "Monday") {
                          return(
                          <div key={id} style={{marginTop: '25px'}}>
                            <div style={{display: 'flex'}}>
                              <Typography className={classes.boldText}>Course Name:</Typography>
                              <Typography>{`${courseDetails.optionalName}`}</Typography>
                            </div>

                            <div style={{display: 'flex'}}>
                              <Typography className={classes.boldText}>Age Group:</Typography>
                              <Typography>{`${courseDetails.age}`}</Typography>
                            </div>

                            {coachNames && <div style={{display: 'flex'}}>
                              <Typography className={classes.boldText}>Coach:</Typography>
                              {coachNames && coachNames.map((name, index) => {
                                  return (                                  
                                    <p sm={12}>{index !== 0 ? ',' + name : '  ' + name}</p>
                                  )
                                })
                              }
                            </div>}
                            
                            <div style={{display: 'flex'}}>
                              <Typography className={classes.boldText}>Location:</Typography>
                              <Typography>{`${sessionInfo.location}`}</Typography>
                            </div>

                            <div style={{display: 'flex'}}>
                              <Typography className={classes.boldText}>Time:</Typography>
                              <Typography>{`${sessionInfo.startTime}`}</Typography>
                            </div>
                          </div>)
                        }
                      })}
                    </>
                    )
                  }
                })
              }
            </TabPanel>
            <TabPanel value={value} index={1}>
              {
                Object.keys(thisWeek).map(oneDay => {
                  if (thisWeek[oneDay].length !== 0) {
                    return(
                    <>
                      {thisWeek[oneDay].map(([courseDetails, id, sessionInfo, coachNames]) => {
                        if (sessionInfo.day === "Tuesday") {
                          return(
                          <div key={id} style={{marginTop: '25px'}}>
                            <div style={{display: 'flex'}}>
                              <Typography className={classes.boldText}>Course Name:</Typography>
                              <Typography>{`${courseDetails.optionalName}`}</Typography>
                            </div>

                            <div style={{display: 'flex'}}>
                              <Typography className={classes.boldText}>Age Group:</Typography>
                              <Typography>{`${courseDetails.age}`}</Typography>
                            </div>

                            {coachNames && <div style={{display: 'flex'}}>
                              <Typography className={classes.boldText}>Coach:</Typography>
                              {coachNames && coachNames.map((name, index) => {
                                  return (                                  
                                    <p sm={12}>{index !== 0 ? ',' + name : '  ' + name}</p>
                                  )
                                })
                              }
                            </div>}
                            
                            <div style={{display: 'flex'}}>
                              <Typography className={classes.boldText}>Location:</Typography>
                              <Typography>{`${sessionInfo.location}`}</Typography>
                            </div>

                            <div style={{display: 'flex'}}>
                              <Typography className={classes.boldText}>Time:</Typography>
                              <Typography>{`${sessionInfo.startTime}`}</Typography>
                            </div>
                          </div>)
                        }
                      })}
                    </>
                    )
                  }
                })
              }
            </TabPanel>
            <TabPanel value={value} index={2}>
              {
                Object.keys(thisWeek).map(oneDay => {
                  if (thisWeek[oneDay].length !== 0) {
                    return(
                    <>
                      {thisWeek[oneDay].map(([courseDetails, id, sessionInfo, coachNames]) => {
                        if (sessionInfo.day === "Wednesday") {
                          return(
                          <div key={id} style={{marginTop: '25px'}}>
                            <div style={{display: 'flex'}}>
                              <Typography className={classes.boldText}>Course Name:</Typography>
                              <Typography>{`${courseDetails.optionalName}`}</Typography>
                            </div>

                            <div style={{display: 'flex'}}>
                              <Typography className={classes.boldText}>Age Group:</Typography>
                              <Typography>{`${courseDetails.age}`}</Typography>
                            </div>

                            {coachNames && <div style={{display: 'flex'}}>
                              <Typography className={classes.boldText}>Coach:</Typography>
                              {coachNames && coachNames.map((name, index) => {
                                  return (                                  
                                    <p sm={12}>{index !== 0 ? ',' + name : '  ' + name}</p>
                                  )
                                })
                              }
                            </div>}
                            
                            <div style={{display: 'flex'}}>
                              <Typography className={classes.boldText}>Location:</Typography>
                              <Typography>{`${sessionInfo.location}`}</Typography>
                            </div>

                            <div style={{display: 'flex'}}>
                              <Typography className={classes.boldText}>Time:</Typography>
                              <Typography>{`${sessionInfo.startTime}`}</Typography>
                            </div>
                          </div>)
                        }
                      })}
                    </>
                    )
                  }
                })
              }
            </TabPanel>
            <TabPanel value={value} index={3}>
              {
                Object.keys(thisWeek).map(oneDay => {
                  if (thisWeek[oneDay].length !== 0) {
                    return(
                    <>
                      {thisWeek[oneDay].map(([courseDetails, id, sessionInfo, coachNames]) => {
                        if (sessionInfo.day === "Thursday") {
                          return(
                          <div key={id} style={{marginTop: '25px'}}>
                            <div style={{display: 'flex'}}>
                              <Typography className={classes.boldText}>Course Name:</Typography>
                              <Typography>{`${courseDetails.optionalName}`}</Typography>
                            </div>

                            <div style={{display: 'flex'}}>
                              <Typography className={classes.boldText}>Age Group:</Typography>
                              <Typography>{`${courseDetails.age}`}</Typography>
                            </div>

                            {coachNames && <div style={{display: 'flex'}}>
                              <Typography className={classes.boldText}>Coach:</Typography>
                              {coachNames && coachNames.map((name, index) => {
                                  return (                                  
                                    <p sm={12}>{index !== 0 ? ',' + name : '  ' + name}</p>
                                  )
                                })
                              }
                            </div>}
                            
                            <div style={{display: 'flex'}}>
                              <Typography className={classes.boldText}>Location:</Typography>
                              <Typography>{`${sessionInfo.location}`}</Typography>
                            </div>

                            <div style={{display: 'flex'}}>
                              <Typography className={classes.boldText}>Time:</Typography>
                              <Typography>{`${sessionInfo.startTime}`}</Typography>
                            </div>
                          </div>)
                        }
                      })}
                    </>
                    )
                  }
                })
              }
            </TabPanel>
            <TabPanel value={value} index={4}>
              {
                Object.keys(thisWeek).map(oneDay => {
                  if (thisWeek[oneDay].length !== 0) {
                    return(
                    <>
                      {thisWeek[oneDay].map(([courseDetails, id, sessionInfo, coachNames]) => {
                        if (sessionInfo.day === "Friday") {
                          return(
                          <div key={id} style={{marginTop: '25px'}}>
                            <div style={{display: 'flex'}}>
                              <Typography className={classes.boldText}>Course Name:</Typography>
                              <Typography>{`${courseDetails.optionalName}`}</Typography>
                            </div>

                            <div style={{display: 'flex'}}>
                              <Typography className={classes.boldText}>Age Group:</Typography>
                              <Typography>{`${courseDetails.age}`}</Typography>
                            </div>

                            {coachNames && <div style={{display: 'flex'}}>
                              <Typography className={classes.boldText}>Coach:</Typography>
                              {coachNames && coachNames.map((name, index) => {
                                  return (                                  
                                    <p sm={12}>{index !== 0 ? ',' + name : '  ' + name}</p>
                                  )
                                })
                              }
                            </div>}
                            
                            <div style={{display: 'flex'}}>
                              <Typography className={classes.boldText}>Location:</Typography>
                              <Typography>{`${sessionInfo.location}`}</Typography>
                            </div>

                            <div style={{display: 'flex'}}>
                              <Typography className={classes.boldText}>Time:</Typography>
                              <Typography>{`${sessionInfo.startTime}`}</Typography>
                            </div>
                          </div>)
                        }
                      })}
                    </>
                    )
                  }
                })
              }
            </TabPanel>
            <TabPanel value={value} index={5}>
              {
                Object.keys(thisWeek).map(oneDay => {
                  if (thisWeek[oneDay].length !== 0) {
                    return(
                    <>
                      {thisWeek[oneDay].map(([courseDetails, id, sessionInfo, coachNames]) => {
                        if (sessionInfo.day === "Saturday") {
                          return(
                          <div key={id} style={{marginTop: '25px'}}>
                            <div style={{display: 'flex'}}>
                              <Typography className={classes.boldText}>Course Name:</Typography>
                              <Typography>{`${courseDetails.optionalName}`}</Typography>
                            </div>

                            <div style={{display: 'flex'}}>
                              <Typography className={classes.boldText}>Age Group:</Typography>
                              <Typography>{`${courseDetails.age}`}</Typography>
                            </div>

                            {coachNames && <div style={{display: 'flex'}}>
                              <Typography className={classes.boldText}>Coach:</Typography>
                              {coachNames && coachNames.map((name, index) => {
                                  return (                                  
                                    <p sm={12}>{index !== 0 ? ',' + name : '  ' + name}</p>
                                  )
                                })
                              }
                            </div>}
                            
                            <div style={{display: 'flex'}}>
                              <Typography className={classes.boldText}>Location:</Typography>
                              <Typography>{`${sessionInfo.location}`}</Typography>
                            </div>

                            <div style={{display: 'flex'}}>
                              <Typography className={classes.boldText}>Time:</Typography>
                              <Typography>{`${sessionInfo.startTime}`}</Typography>
                            </div>
                          </div>)
                        }
                      })}
                    </>
                    )
                  }
                })
              }
            </TabPanel>
            <TabPanel value={value} index={6}>
              {
                Object.keys(thisWeek).map(oneDay => {
                  if (thisWeek[oneDay].length !== 0) {
                    return(
                    <>
                      {thisWeek[oneDay].map(([courseDetails, id, sessionInfo, coachNames]) => {
                        if (sessionInfo.day === "Sunday") {
                          return(
                          <div key={id} style={{marginTop: '25px'}}>
                            <div style={{display: 'flex'}}>
                              <Typography className={classes.boldText}>Course Name:</Typography>
                              <Typography>{`${courseDetails.optionalName}`}</Typography>
                            </div>

                            <div style={{display: 'flex'}}>
                              <Typography className={classes.boldText}>Age Group:</Typography>
                              <Typography>{`${courseDetails.age}`}</Typography>
                            </div>

                            {coachNames && <div style={{display: 'flex'}}>
                              <Typography className={classes.boldText}>Coach:</Typography>
                              {coachNames && coachNames.map((name, index) => {
                                  return (                                  
                                    <p sm={12}>{index !== 0 ? ',' + name : '  ' + name}</p>
                                  )
                                })
                              }
                            </div>}
                            
                            <div style={{display: 'flex'}}>
                              <Typography className={classes.boldText}>Location:</Typography>
                              <Typography>{`${sessionInfo.location}`}</Typography>
                            </div>

                            <div style={{display: 'flex'}}>
                              <Typography className={classes.boldText}>Time:</Typography>
                              <Typography>{`${sessionInfo.startTime}`}</Typography>
                            </div>
                          </div>)
                        }
                      })}
                    </>
                    )
                  }
                })
              }
            </TabPanel>
          </div>
        </div>
        <div>
          <Typography variant="h6" style={{color: 'black', fontWeight: 'bold'}}>Quick Actions</Typography>
          <div>
            <Grid container
              spacing={3}>  
              <Grid item xs={4} >
                <div className={classes.quickItem}>
                  <Button className={classes.quickButton}
                    onClick={() => {
                      handleComponentChange('Sessions', 1)}
                    }>
                    ADD NEW COURSE
                  </Button>
                </div>
              </Grid>

              <Grid item xs={4} >
                <div className={classes.quickItem}>
                  <Button className={classes.quickButton}
                    onClick={() => {
                      handleComponentChange('Players', 0)}
                    }>
                    ADD NEW PLAYER
                  </Button>
                </div>
              </Grid>

              <Grid item xs={4}>
                <div className={classes.quickItem}>
                  <Button className={classes.quickButton}
                    onClick={() => {
                      handleComponentChange('Coaches', 1)}
                    }>
                    ADD A COACH
                  </Button>
                </div>
              </Grid>       
            </Grid>
          </div>
        </div>
      </div>}
    </div>
  )
}

export default Summary;

{/* <div className={classes.root}> */}
    //   <Grid container
    //     spacing={3}>
    //     <Grid item xs={12} sm={7}>
    //       <Paper elevation={4}
    //         className={classes.paper}>
    //         <Typography gutterBottom variant="h5">
    //           Current Week Running Courses
    //         </Typography>

    //         <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
    //           {Object.keys(thisWeek).map(day => {
    //             if (thisWeek[day].length !== 0) {
    //               return (
    //                 <Grid style={{ display: 'flex', flexDirection: 'column' }}>
    //                   <Typography gutterBottom={true} variant="h6">{moment(day).format('dddd Do')}</Typography>

    //                   {thisWeek[day].map(([courseDetails, id, sessionInfo]) => {
    //                     const { courseType } = courseDetails
    //                     return (
    //                       <Typography style={{ display: 'block' }} gutterBottom={true} variant="p">
    //                         <span style={{ display: 'block' }}>Course: {courseDetails.optionalName} </span>
    //                         <span style={{ display: 'block' }}> Details: {sessionInfo.startTime} - {sessionInfo.endTime} @ {courseType === 'Camp' ? courseDetails.location : sessionInfo.location} </span>
    //                         {/* <Link to={`/courses/${id}/register/${day}`}>
    //                           View Register
    //                       </Link> */}
    //                       </Typography>
    //                     )
    //                   })}
    //                 </Grid>
    //               )
    //             }
    //           })}
    //         </div>
    //       </Paper>
    //     </Grid>

    //     <Grid item xs={12} sm={5}>
    //       <Paper elevation={4}
    //         className={classes.paper}>
    //         <Typography gutterBottom variant="h5">
    //           Recent Messages
    //         </Typography>

    //         <div>
    //           {companyMessages && companyMessages.map((el, i) => {
    //             const { name, messages } = el.enquiryInfo
    //             const { _seconds, _nanoseconds } = i > 0 && companyMessages[i - 1].enquiryInfo.messages[companyMessages[i - 1].enquiryInfo.messages.length - 1].createdAt
    //             const currentDate = new Date(messages[messages.length - 1].createdAt._seconds * 1000 + messages[0].createdAt._nanoseconds / 1000000)
    //             const lastestDate = new Date(_seconds * 1000 + _nanoseconds / 1000000)
    //             const sameDay = moment(lastestDate).format('DD-MM-YYYY') === moment(currentDate).format('DD-MM-YYYY')

    //             if (i >= 6) return
    //             return (
    //               <Grid style={{ display: 'flex', flexDirection: 'column' }}>
    //                 <Typography gutterBottom={true} variant="h6">
    //                   {!sameDay && moment(currentDate).format('DD-MM-YYYY')}
    //                 </Typography>

    //                 <Typography gutterBottom={true} variant="p"
    //                   style={{ display: 'flex', alignItems: 'center', margin: 0 }}>
    //                   {messages[0].enquiryType ? 'Booking' : 'General'} Enquiry sent from {name}
    //                   <ArrowForwardSharpIcon style={{ marginLeft: '10px' }}
    //                     onClick={() => handleComponentChange('Messages', el)} />
    //                 </Typography>
    //               </Grid>
    //             )
    //           })}
    //         </div>
    //       </Paper>
    //     </Grid>

    //     {cards.map((el, i) => {

    //       return (
    //         <Grid item xs={12} sm={4}>
    //           <Paper elevation={4}
    //             className={classes.paper}>
    //             <Typography gutterBottom variant="h5">
    //               {el.text}
    //             </Typography>

    //             <Typography gutterBottom variant="p">
    //               {userData && (userData[el.userObject].active ? userData[el.userObject].active.length !== 0 : userData[el.userObject].length !== 0) ? (
    //                 <p> You currently have
    //                   <span style={{ fontWeight: 'bold' }}> {el.userObject === 'courses' ? userData[el.userObject].active.length :
    //                     el.userObject === 'players' ? Object.keys(userData.players).length : userData[el.userObject].length} {el.text.slice(0, -1) + '(s)'}
    //                   </span> added to your profile </p>
    //               ) : <p> There are currently <span style={{ fontWeight: 'bold' }}> 0 {el.text} </span> on your profile, please select the + icon to add {el.text} </p>}
    //             </Typography>

    //             <Typography style={{ marginTop: '30px' }} gutterBottom variant="h6">
    //               Recently Added {el.text}
    //             </Typography>

    //             <Typography gutterBottom variant="p">
    //               {renderRecentlyAdded(el.userObject).map((el, i) => i < 4 && <p> {i + 1}. {el} </p>)}
    //             </Typography>

    //             <Fab className={classes.fab}
    //               style={{ right: '75px' }}
    //               size="small"
    //               onClick={() => handleComponentChange(el.component, 0)}
    //               color="secondary"
    //               aria-label="edit">
    //               <EditIcon />
    //             </Fab>
                
    //             <Fab className={classes.fab}
    //               size="small"
    //               onClick={() => handleComponentChange(el.component, 1)}
    //               color="primary"
    //               aria-label="add">
    //               <AddIcon />
    //             </Fab>
    //           </Paper>
    //         </Grid>
    //       )
    //     })}
    //   </Grid>
    // </div>
