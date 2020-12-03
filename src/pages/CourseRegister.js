import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import Icon from '@material-ui/core/Icon';
import SaveIcon from '@material-ui/icons/Save';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
    overflow: 'scroll'
  },
  icon: {
    color: "#EF5B5B",
    "&:hover": {
      cursor: "pointer",
    },
  }
});


const CourseRegister = ({ match }) => {
  console.log(match)
  const courseId = match.params.courseId
  const [register, setRegister] = useState([])
  const [course, setCourse] = useState([])
  const classes = useStyles();

  useEffect(() => {
    console.log('use')
    axios.get(`/courses/${courseId}`)
      .then(res => {
        console.log('axios!')
        console.log(res.data.playerList)
        setCourse(res.data)
        res.data.register ? setRegister(res.data.register) : setRegister(register)

      })
  },[])

  const handleChange = (event) => {
    console.log(event.target)
    const [playerId, date, field] = event.target.name.split('.')
    const newRegister = {...register}
    newRegister[playerId][date][field] = event.target.value
    setRegister(newRegister)
  };

  const saveChanges = (event) => {
    event.preventDefault()
    axios.patch(`/courses/${courseId}`, { updatedRegister: register })
      .then(res => {
        console.log(res)
        window.location.reload()
      })
      .catch(err => console.log(err))
  }

  console.log(register)
  if (register.length === 0) return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableCell>
    <Typography variant='h5'>No player data currently available</Typography>
    </TableCell>
        </TableHead>
        </Table>
        </TableContainer>
  )
  return (
    <>
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>

      <TableRow>
            <TableCell>Player Name</TableCell>
            {
              register.sessions.map(session => {
                return <TableCell align="right">{session}</TableCell>
              })
            }
          </TableRow>
          </TableHead>
          <TableBody>
          {course.playerList.map((player, i) => {
            return (
            <TableRow key={i}>
              <TableCell component="th" scope="row">
                {register[player].name}
              </TableCell>
              {register.sessions.map(week => {
                const { attendance, notes } = register[player][week]
                return (
                  <TableCell align="right">
                    <FormControl className={classes.formControl}>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={attendance}
          inputProps={{
            name: `${player}.${week}.attendance`
          }}
          onChange={handleChange}
        >
          <MenuItem value={null}> - </MenuItem>
          <MenuItem value={true}>Attended</MenuItem>
          <MenuItem value={false}>Didn't Attend</MenuItem>
        </Select>
      </FormControl>
      { attendance === false && 
      <FormControl className={classes.formControl}>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={notes}
        inputProps={{
          name: `${player}.${week}.notes`
        }}
        onChange={handleChange}
      >
        <MenuItem value={''}> - </MenuItem>
        <MenuItem value={'Not well'}>Not well</MenuItem>
        <MenuItem value={'Injured'}>Injured</MenuItem>
        <MenuItem value={'Couldn\'t get there'}>Couldn't get there</MenuItem>
        <MenuItem value={'Other'}>Other</MenuItem>
        <MenuItem value={'Don\'t know yet'}>Don't know yet</MenuItem>
      </Select>
    </FormControl>
      }
                  </TableCell>
                )
              })
            }
            </TableRow>
            )
          })
        }
          </TableBody>
      </Table>
    </TableContainer>
    <div className="buttons">
    
      <Button
        variant="contained"
        color="default"
        className={classes.button}
        startIcon={<DeleteIcon />}
      >
        Discard Changes
      </Button>
      {/* This Button uses a Font Icon, see the installation instructions in the Icon component docs. */}
      <Button
        variant="contained"
        color="primary"
        className={classes.button}
        startIcon={<SaveIcon />}
        onClick={saveChanges}
      >
        Save Changes
      </Button>
    </div>
    </>
  )
}


export default CourseRegister