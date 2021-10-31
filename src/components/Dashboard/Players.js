import React, { useState, useEffect } from 'react'
import AssignPlayerToCourse from './AssignPlayerToCourse'
import { Link } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import DeleteForeverSharpIcon from '@material-ui/icons/DeleteForeverSharp'
import Accordion from '@material-ui/core/Accordion'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import AccordionDetails from '@material-ui/core/AccordionDetails'
import Typography from '@material-ui/core/Typography'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import FormHelperText from '@material-ui/core/FormHelperText'
import FormControl from '@material-ui/core/FormControl'
import Button from '@material-ui/core/Button'
import Select from '@material-ui/core/Select'
import ClearSharpIcon from '@material-ui/icons/ClearSharp'
import CheckSharpIcon from '@material-ui/icons/CheckSharp'
import IconButton from '@material-ui/core/IconButton'
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp'
import Box from '@material-ui/core/Box'
import Collapse from '@material-ui/core/Collapse'
import axios from 'axios'
import auth from '../../lib/auth'
import { TextField } from '@material-ui/core'

const useStyles = makeStyles({
  table: {
    minWidth: 650,
    overflow: 'scroll',
  },
  icon: {
    color: '#EF5B5B',
    '&:hover': {
      cursor: 'pointer',
    },
  },
})

export default function CompanyPlayersList() {
  const [companyData, setCompanyData] = useState([])
  const [players, setPlayers] = useState([])
  const [filteredNames, setFilteredNames] = useState([])
  const [filters, setFilters] = useState({
    // minimumAge: 0,
    // maximumAge: 100,
    ageRange: '0-100',
    status: 'All',
  })
  const [emailRequest, setEmailRequest] = useState('')
  const [message, setMessage] = useState('')
  const [open, setOpen] = useState({})
  const [dataChange, setDataChange] = useState([false, '']);

  async function getData() {
    let playerlist = {}
    const response = await axios.get(`/users/${auth.getUserId()}`, { headers: { Authorization: `Bearer ${auth.getToken()}` }})
    const data = await response.data[0]
    for (const player of Object.keys(data.players)) {
      let playerInfo
      const response = await axios.get(`/users/${player}`, { headers: { Authorization: `Bearer ${auth.getToken()}` }})
      playerInfo = await response.data[0]
      playerlist[player] = playerInfo
      setOpen({...open, [playerInfo.userId]: playerInfo.Id === dataChange[1] ? true : false })
    }
    setCompanyData(data)
    setPlayers(playerlist)
    setFilteredNames(Object.keys(playerlist))
  }

  useEffect(() => {
    getData()
  }, [!dataChange[0]])

  const handleFilterChange = (event) => {
    const name = event.target.name
    const newFilters = {
      ...filters,
      [name]: event.target.value,
    }
    const [lowAge, highAge] = newFilters.ageRange.split('-')
    const filteredPlayers = []
    for (const player of Object.keys(players)) {
      if (
        Number(auth.dobToAge(players[player].dob)) >= lowAge &&
        Number(auth.dobToAge(players[player].dob)) <= highAge
      ) {
        companyData.players[player].status === newFilters.status ||
        newFilters.status === 'All'
          ? filteredPlayers.push(player)
          : console.log('filtered')
      }
    }
    setFilters(newFilters)
    setFilteredNames(filteredPlayers)
  }

  const handleOpen = (event, item) => {
    event.preventDefault()
      const newOpen = {...open}
      const prev = open[item]
      for (const key of Object.keys(newOpen)) {
        newOpen[key] = false
      }
      setOpen({...newOpen, [item]: !prev})
  }

  const handleEmailChange = (event) => {
    event.preventDefault()
    setEmailRequest(event.target.value)
    setMessage('')
  }

  const isValidEmail = string => {
    const emailRegEx = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return emailRegEx.test(string)
  }

  const sendEmailRequest = (event) => {
    event.preventDefault()

    if (!isValidEmail(emailRequest)) {
      setMessage('Email address is not valid. Please try again.')
      return
    }
    axios.post('/emailRequest', { email: emailRequest, companyName: companyData.name, companyId: companyData.userId, type: window.location.hostname },
      { headers: { Authorization: `Bearer ${auth.getToken()}`}})
      .then(res => {
        setMessage('Email Sent!')
        setEmailRequest('')
      })
      .catch(err => setMessage(err.response.data.message))
  }

  const classes = useStyles()
  // if (!players) return null
  if (companyData && players)
    return (
      <>
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>
                  <FormControl className={classes.formControl}>
                    <InputLabel id="demo-simple-select-label">
                      Age Range
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
                      <MenuItem value={'7-9'}>7 - 9 Years Old</MenuItem>
                      <MenuItem value={'10-13'}>10 - 13 Years Old</MenuItem>
                      <MenuItem value={'13-16'}>13 - 16 Years Old</MenuItem>
                      <MenuItem value={'17-18'}>17 - Adults</MenuItem>
                      <MenuItem value={'18-100'}>Adults</MenuItem>
                    </Select>
                  </FormControl>
                </TableCell>
                <TableCell>
                  <FormControl className={classes.formControl}>
                    <InputLabel id="demo-simple-select-label">
                      Status
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={filters.status}
                      inputProps={{
                        name: 'status',
                      }}
                      onChange={handleFilterChange}
                    >
                      <MenuItem value={'All'}>All</MenuItem>
                      <MenuItem value={'Active'}>Active</MenuItem>
                      <MenuItem value={'Past'}>Past</MenuItem>
                      <MenuItem value={'Prospect'}>Prospect</MenuItem>
                    </Select>
                  </FormControl>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="right"> </TableCell>
                <TableCell align="right">Name</TableCell>
                <TableCell align="right">Age</TableCell>
                <TableCell align="right">Email Address</TableCell>
                <TableCell align="right">Status</TableCell>
                <TableCell align="right"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredNames.map((el, i) => {
                {/* console.log(players[el]) */}
                const activeCourses = players[el].courses[companyData.userId]?.active ? players[el].courses[companyData.userId].active : []
                const pastCourses = players[el].courses[companyData.userId]?.past ? players[el].courses[companyData.userId].past : []
                return (
                <>
                  <TableRow key={i}>
                    {/* <TableCell component="th" scope="row">
                {el.name}
              </TableCell> */}
                    <TableCell>
                      <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={(event) => handleOpen(event, el)}
                      >
                        {open[el] ? (
                          <KeyboardArrowUpIcon />
                        ) : (
                          <KeyboardArrowDownIcon />
                        )}
                      </IconButton>
                    </TableCell>
                    <TableCell align="right">
                      <Link to={`/${players[el].userId}/profile`}>
                        {players[el].name}
                      </Link>
                    </TableCell>
                    <TableCell align="right">{auth.dobToAge(players[el].dob)}</TableCell>
                    <TableCell align="right">{players[el].email}</TableCell>
                    <TableCell align="right">
                      {companyData['players'][el].status}
                    </TableCell>
                    <TableCell align="right">
                      <DeleteForeverSharpIcon
                        // onClick={() => handleSetCoachId(el.coachId)}
                        className={classes.icon}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      style={{ paddingBottom: 0, paddingTop: 0 }}
                      colSpan={6}
                    >
                      <Collapse in={open[el]} timeout="auto" unmountOnExit>
                        <Box margin={1}>
                          <Typography variant="h6" gutterBottom component="div">
                            Course Info
                          </Typography>
                          <Typography
                            variant="subtitle1"
                            gutterBottom
                            component="div"
                          >
                            Current Courses:{' '}
                            { activeCourses ? 
                              `${activeCourses.length}`
                              : 
                              '0' }
                          </Typography>

                          {players[el].courses[auth.getUserId()] && (

                            activeCourses.length > 0 &&
                            <TableContainer component={Paper}>
                              <Table aria-label="collapsible table">
                                <TableHead>
                                  <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell align="right">
                                      Start Date
                                    </TableCell>
                                    <TableCell align="right">
                                      End Date
                                    </TableCell>
                                    <TableCell align="right">
                                      Age Group
                                    </TableCell>
                                    <TableCell align="right"></TableCell>
                                    <TableCell align="right"></TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  { activeCourses.map((elCourse, i) => {
                                    {/* console.log({elCourse, companyData}) */}
                                    for (const correctCourse of companyData.courses.active) {
                                      {/* console.log(elCourse, correctCourse.courseId) */}
                                      if (elCourse === correctCourse.courseId)
                                        {
                                          return (
                                            <TableRow>
                                              <TableCell align="right">
                                              {correctCourse.courseDetails.optionalName}
                                              </TableCell>
                                              <TableCell align="right">
                                              {correctCourse.courseDetails.startDate}
                                              </TableCell>
                                              <TableCell align="right">
                                              {correctCourse.courseDetails.endDate}
                                              </TableCell>
                                              <TableCell align="right">
                                              {correctCourse.courseDetails.age}
                                              </TableCell>
                                              <TableCell align="right"></TableCell>
                                            </TableRow>
                                          )
                                        }
                                    }
                                  })}
                                </TableBody>
                              </Table>
                            </TableContainer>
                          )}
                          <Typography
                            variant="subtitle1"
                            gutterBottom
                            component="div"
                          >
                            Past Courses:{' '}
                            { pastCourses
                              ? `${
                                  pastCourses.length
                                }`
                              : '0'}
                          </Typography>

                          {players[el].courses[auth.getUserId()] && (
                            pastCourses.length > 0 &&
                            <TableContainer component={Paper}>
                              <Table aria-label="collapsible table">
                                <TableHead>
                                  <TableRow>
                                    <TableCell>Name </TableCell>
                                    <TableCell align="right">
                                      Start Date
                                    </TableCell>
                                    <TableCell align="right">
                                      End Date
                                    </TableCell>
                                    <TableCell align="right">Venue</TableCell>
                                    <TableCell align="right">
                                      Age Group
                                    </TableCell>
                                    <TableCell align="right"></TableCell>
                                    <TableCell align="right"></TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {pastCourses && pastCourses.map((elCourse, i) => {
                                    {/* console.log({elCourse, companyData}) */}
                                    for (const correctCourse of companyData.courses.past) {
                                      {/* console.log(elCourse, correctCourse.courseId) */}
                                      if (elCourse === correctCourse.courseId)
                                        {
                                          return (
                                            <TableRow>
                                              <TableCell align="right">
                                              {correctCourse.courseDetails.optionalName}
                                              </TableCell>
                                              <TableCell align="right">
                                              {correctCourse.courseDetails.startDate}
                                              </TableCell>
                                              <TableCell align="right">
                                              {correctCourse.courseDetails.endDate}
                                              </TableCell>
                                              <TableCell align="right">
                                              {correctCourse.courseDetails.courseType === 'Camp' ? correctCourse.courseDetails.location : correctCourse.courseDetails.sessions[0].location }
                                              </TableCell>
                                              <TableCell align="right">
                                              {correctCourse.courseDetails.age}
                                              </TableCell>
                                              <TableCell align="right"></TableCell>
                                            </TableRow>
                                          )
                                        }
                                    }
                                  })}
                                </TableBody>
                              </Table>
                            </TableContainer>
                          )}
                        </Box>
                        <div style={{ margin: '15px 0'}}>
                        <AssignPlayerToCourse
                          setDataChange={setDataChange}
                          player={players[el]}
                          courses={companyData.courses.active} 
                          companyId={companyData.userId}/>
                          </div>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </>
              )})}
            </TableBody>
          </Table>
        </TableContainer>
        <Box style={{ marginTop: '30px'}}>

        <Typography>Add new player</Typography>

        <FormControl>
          <TextField 
          placeholder="Enter email address" 
          value={emailRequest} 
          onChange={(e) => handleEmailChange(e)}/>

          <Typography>
            {message}
          </Typography>

          {message && <p style={{ color: 'red', textAlign: 'center' }}> {message} </p>}

          <Button 
          variant="contained" 
          color='primary'
          onClick={(e) => sendEmailRequest(e)}>
            Send Request
          </Button>
        </FormControl>
        </Box>
      </>
    )
}
