import React, { useEffect, useState } from 'react';
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
  Select,
  Container
} from "@material-ui/core";
import Box from '@material-ui/core/Box';
import ArrowForwardSharpIcon from '@material-ui/icons/ArrowForwardSharp';

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
  }
}));


const Summary = ({ handleComponentChange }) => {

  const classes = useStyles();

  const cards = [
    { text: 'Services', component: 'Misc', userObject: 'services' },
    { text: 'Courses & Camps', component: 'Sessions', userObject: 'courses' },
    { text: 'Coaches', component: 'Coaches', userObject: 'coaches' }
  ]

  const [user, setUser] = useState()
  const date = moment()
  const [registers, setRegisters] = useState([])
  const [thisWeek, setThisWeek] = useState([])
  const [companyMessages, setCompanyMessages] = useState()

  async function getData() {
    let registerArray = []
    const response = await axios.get(`/users/${auth.getUserId()}`)
    const data = await response.data[0]
    for (const course of data.courses) {
      let register
      const response = await axios.get(`/courses/${course.courseId}`)
      register = await response.data
      if (register.register) registerArray.push([course.courseDetails, course.courseId, register.register.sessions])
    }
    setUser(data)
    setRegisters(registerArray)
    setThisWeek(sortRegisters(registerArray))
  }

  const getMessages = () => {
    axios.get('/enquiries/company', { headers: { Authorization: `Bearer ${auth.getToken()}` } })
      .then(async res => {
        console.log(res.data)
        const orderedMessages = res.data.sort((a, b) => {
          const messageA = a.enquiryInfo.messages[a.enquiryInfo.messages.length - 1]
          const messageB = b.enquiryInfo.messages[b.enquiryInfo.messages.length - 1]
          const dateA = new Date(messageA.createdAt._seconds * 1000 + messageA.createdAt._nanoseconds / 1000000)
          const dateB = new Date(messageB.createdAt._seconds * 1000 + messageB.createdAt._nanoseconds / 1000000)

          return dateB - dateA
        })

        setCompanyMessages(orderedMessages)
      })
  }

  const sortRegisters = (registers) => {
    const monday = date.startOf('week')
    const weekdays = {}
    for (let i = 1; i <= 7; i++) {
      weekdays[(monday.add(1, 'days').format('YYYY-MM-DD'))] = []
    }
    registers.forEach(([courseDetails, id, sessionDates]) => {
      for (const session of sessionDates) {
        if (Object.keys(weekdays).indexOf(session) !== -1) {
          const correctSession = courseDetails.courseType === 'Camp' ?
            courseDetails.sessions.filter(infoSession => moment.unix(infoSession.sessionDate._seconds).format('dddd') === moment(session).format('dddd'))[0]
            :
            courseDetails.sessions.filter(infoSession => infoSession.day === moment(session).format('dddd'))[0]
          weekdays[session].push([courseDetails, id, correctSession])
        }
      }
    })
    console.log(weekdays)

    return weekdays
  }


  useEffect(() => {
    getMessages()
    getData()
  }, [])

  function renderRecentlyAdded(detail) {

    const textArr = []

    const length = user && user[detail].length
    for (let i = length - 1; i >= 0; i--) {
      switch (detail) {
        case 'services':
          textArr.push(`Added ${user[detail][i].name} service - ${user[detail][i].description}`)
          break;
        case 'courses':
          textArr.push(`Added ${user[detail][i].courseDetails.courseType} for ${user[detail][i].courseDetails.age} at 
          ${user[detail][i].courseDetails.location}`)
          break;

        default:
          break;
      }
    }

    return textArr
  }



  return (
    <div className={classes.root}>
      <Grid container
        spacing={3}>

        <Grid item xs={12} sm={7}>
          <Paper elevation={4}
            className={classes.paper}>
            <Typography gutterBottom variant="h5">
              Current Week Running Courses
                </Typography>

            <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
              {Object.keys(thisWeek).map(day => {
                if (thisWeek[day].length !== 0) {
                  return (
                    <Grid style={{ display: 'flex', flexDirection: 'column' }}>
                      <Typography gutterBottom={true} variant="h6">{moment(day).format('dddd Do')}

                      </Typography>
                      {thisWeek[day].map(([courseDetails, id, sessionInfo]) => {
                        return (
                          <Typography style={{ display: 'block' }} gutterBottom={true} variant="p">
                            <span style={{ display: 'block' }}>Course: {courseDetails.optionalName} </span>
                            <span style={{ display: 'block' }}> Details: {sessionInfo.startTime} - {sessionInfo.endTime} @ {courseDetails.location} </span>
                            {/* <Link to={`/courses/${id}/register/${day}`}>
                              View Register
                          </Link> */}
                          </Typography>
                        )
                      })}
                    </Grid>
                  )
                }
              })}

            </div>

          </Paper>
        </Grid>

        <Grid item xs={12} sm={5}>
          <Paper elevation={4}
            className={classes.paper}>
            <Typography gutterBottom variant="h5">
              Recent Messages
                </Typography>

            <div>
              {companyMessages && companyMessages.map((el, i) => {
                const { name, messages } = el.enquiryInfo
                const { _seconds, _nanoseconds } = i > 0 && companyMessages[i - 1].enquiryInfo.messages[companyMessages[i - 1].enquiryInfo.messages.length - 1].createdAt
                const currentDate = new Date(messages[messages.length - 1].createdAt._seconds * 1000 + messages[0].createdAt._nanoseconds / 1000000)
                const lastestDate = new Date(_seconds * 1000 + _nanoseconds / 1000000)
                const sameDay = moment(lastestDate).format('DD-MM-YYYY') === moment(currentDate).format('DD-MM-YYYY')

                if (i >= 6) return
                return (
                  <Grid style={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography gutterBottom={true} variant="h6">
                      {!sameDay && moment(currentDate).format('DD-MM-YYYY')}
                    </Typography>

                    <Typography gutterBottom={true} variant="p" 
                    style={{ display: 'flex', alignItems: 'center', margin: 0}}>
                      {messages[0].enquiryType ? 'Booking' : 'General'} Enquiry sent from {name}

                    <ArrowForwardSharpIcon style={{marginLeft: '10px'}}
                      onClick={() => handleComponentChange('Messages', el)} />
                    </Typography>

                  </Grid>
                )
              })}

            </div>

          </Paper>
        </Grid>




        {cards.map((el, i) => {
          return (
            <Grid item xs={12} sm={4}>
              <Paper elevation={4}
                className={classes.paper}>
                <Typography gutterBottom variant="h5">
                  {el.text}
                </Typography>

                <Typography gutterBottom variant="p">
                  {user && user[el.userObject].length !== 0 ? (
                    <p> You currently have
                      <span style={{ fontWeight: 'bold' }}> {user[el.userObject].length} {el.text.slice(0, -1) + '(s)'}
                      </span> added to your profile </p>
                  ) : <p> There are currently <span style={{ fontWeight: 'bold' }}> 0 {el.text} </span> on your profile, please select the + icon to add {el.text} </p>}
                </Typography>

                <Typography style={{ marginTop: '30px' }} gutterBottom variant="h6">
                  Recently Added {el.text}
                </Typography>

                <Typography gutterBottom variant="p">
                  {renderRecentlyAdded(el.userObject).map((el, i) => <p> {i + 1}. {el} </p>)}
                </Typography>


                <Fab className={classes.fab}
                  style={{ right: '75px' }}
                  size="small"
                  onClick={() => handleComponentChange(el.component, 0)}
                  color="secondary"
                  aria-label="edit">
                  <EditIcon />
                </Fab>
                <Fab className={classes.fab}
                  size="small"
                  onClick={() => handleComponentChange(el.component, 1)}
                  color="primary"
                  aria-label="add">
                  <AddIcon />
                </Fab>
              </Paper>
            </Grid>
          )
        })}
      </Grid>
    </div>
  );
};

export default Summary;
