import React from 'react'
import axios from 'axios'
import { FormControl, FormHelperText, Select, InputLabel, MenuItem, Button } from '@material-ui/core'
import auth from '../../lib/auth';

const AssignPlayerToCourse = ({player, courses, companyId, setDataChange}) => {
  const [assignedCourse, setAssignedCourse] = React.useState('');

  const handleChange = (event) => {
    setAssignedCourse(event.target.value);
  };

  const handleAssign = (event) => {
    event.preventDefault()    
    setDataChange([true, player.userId])
    const body = {
      companyId: companyId,
      playerId: player.userId,
      playerName: player.name,
      playerDob: player.dob
    }
    axios.patch(`/courses/${assignedCourse}/players`, body, { headers: { Authorization: `Bearer ${auth.getToken()}` }})
      .then(res => {
        console.log(res)
        setDataChange([false, player.userId])
      })
      .catch(err => {
        // console.log(err)
        setDataChange([false, player.userId])
      })
  }

  return (
    
    <FormControl>
        <InputLabel id="demo-simple-select-label">Courses</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={assignedCourse}
          onChange={handleChange}
        >
          <MenuItem value="" disabled>
          Assign Player To Course
          </MenuItem>
    {courses.map(course => {
      if (!player.courses[companyId] || player.courses[companyId].active.indexOf(course.courseId) === -1) {
      return (
          <MenuItem value={course.courseId}>{course.courseDetails.optionalName}</MenuItem>
      )
      }
    })}
  </Select>
  <FormHelperText>Assign Player To Course</FormHelperText>
  <Button onClick={(event) => handleAssign(event)} variant="contained" color="primary">Confirm</Button>
  </FormControl>

  )
}

export default AssignPlayerToCourse