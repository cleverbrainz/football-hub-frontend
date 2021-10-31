import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import axios from 'axios'
import Checkbox from '@material-ui/core/Checkbox';
import auth from '../lib/auth';
import { Grid, Button, Fab, FormControlLabel } from '@material-ui/core';
import { ReactComponent as EditIcon } from '../assets/img/edit_icon.svg';
import AddIcon from '@material-ui/icons/Add';
import CircularProgress from '@material-ui/core/CircularProgress'

const useRowStyles = makeStyles({
  root: {
    '& > *': {
      borderBottom: 'unset',
    }
  },
  icons: {
    "&:hover": {
      cursor: "pointer",
    },
  },
  detailBox: {
    borderColor: '#02a7f0',
    border: 'solid',
    borderWidth: '1px',
    borderRadius: '6px',
    padding: '10px'
  },
  detailText: {
    fontSize: '11pt',
    marginTop: '10px'
  },
  fab: {
    backgroundColor: '#02a7f0',
    "&:hover": {
      backgroundColor: '#02a7f0',
    },
  },
  roundBox: {
    width: '20px',
    height: '20px',
    textAlign: 'center',
    lineHeight: '20px',
    fontSize: "15px",
    fontWeight: "600"
  },
  complete: {
    color: 'white',
    backgroundColor: '#02a7f0'
  },
});



export default function SessionsPageTable({ companyCoachIds, companyCoachInfo, courses, handleEditCourse, handleCourseDeletion, registers, setIsEditCourse, setEditCourse, setIsAddNewCourse }) {
  const classes = useRowStyles(); 

  function CourseItem({ course, index }) {

    const { startDate, endDate, cost, age, optionalName } = course.courseDetails
    const [clickedItem, setClickedItem] = React.useState()
    const [courseCoaches, setCourseCoaches] = React.useState(course.coaches)
    const [isProgress, setIsProgress] = React.useState(false)
    const [isAssignCoaches, setIsAssignCoaches] = useState(false)  
    

    const handleChange = (userId) => {
      let tempCoaches
      if (courseCoaches.indexOf(userId) > -1) {
        tempCoaches = courseCoaches.filter(el => el !== userId)
      } else {
        tempCoaches = [...courseCoaches, userId]
      }
      setCourseCoaches(tempCoaches);
    }

    const assignCoaches = () => {
      setIsProgress(true)
      const coachName = []
      for (const coach of companyCoachInfo) {
        for (const selectedId of courseCoaches) {
          if (coach.userId === selectedId) {
            coachName.push(coach.name)
          }
        }
      }
      axios.patch(`/courses/${course.courseId}/coaches`, { coaches: courseCoaches, companyId: course.companyId, courseId: course.courseId, coachName: coachName }, { headers: { Authorization: `Bearer ${auth.getToken()}` }})
      .then(res => {
        setClickedItem(-1)
        setIsProgress(false)
        setIsAssignCoaches(true)
      })
      .catch(err => {
        setIsProgress(false)
        console.log(err)})
    }

    const handleEdit = () => {
      setIsEditCourse(true)
      setEditCourse(course)
    }

    return (
    <Grid item xs={12} sm={4}>
      {clickedItem !== index && <div className={classes.detailBox}>
        <div style={{display: 'flex', justifyContent: 'space-between'}}>
          <Typography gutterBottom component="div" style={{fontWeight: 'bold'}}> {optionalName} </Typography>
          <EditIcon onClick={() => handleEdit()}/>
        </div>
        <Typography component="div" className={classes.detailText}> {dateFormat(startDate) + ' to ' + dateFormat(endDate)} </Typography>
        <Typography component="div" className={classes.detailText}> {age + ' years old'} </Typography>   
        <Typography component="div" className={classes.detailText}> {'£' + cost + ' per player'} </Typography>                 
        <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '15px', alignItems: 'center'}}>
          {(!isAssignCoaches && course.coaches.length === 0) && <Button 
            style={{backgroundColor: '#02a7f0', textTransform: 'none', color: 'white'}}
            onClick={() => setClickedItem(index)}>
            Assign Coach</Button>}
          {(isAssignCoaches || course.coaches.length > 0) && <div style={{display: 'flex', alignItems: 'center'}}>
            <Typography gutterBottom component="div" style={{fontWeight: 'bold', fontSize: '11pt'}}> Coach Assigned </Typography>
            <Box className={`${classes.roundBox} ${classes.complete}`} border={1} borderRadius="50%" style={{marginLeft: '10px'}}>✓</Box>
          </div>}
          <Button style={{textTransform: 'none', borderStyle: 'solid', borderWidth: '1px', borderColor: 'black'}}>View Register</Button>
        </div>             
      </div>}
      {clickedItem === index && <div className={classes.detailBox}>
        <Typography gutterBottom component="div" style={{fontWeight: 'bold'}}> Assign a coach to this course </Typography>
        <Typography component="div" className={classes.detailText}> You can assign more than one, this enables the coach to login and take a register for the session. You can update this during the course alo if there any changes. </Typography>
        <Typography component="div" style={{fontWeight: 'bold', fontSize: '11pt', marginTop: '20px'}}> Your available coaches </Typography>
        {companyCoachInfo.map((name) => {
          return (
            <FormControlLabel
              style={{display: 'block', marginLeft: '10px'}}
              control={<Checkbox
              checked={courseCoaches.indexOf(name.userId) > -1}
              onChange={() => handleChange(name.userId)}                      
              name={name.userId} />}
                label={name.coachInfo.name}
            />
          )})
        }
        <div style={{display: 'flex', justifyContent: 'space-between'}}>
          <div></div>
          <Button style={{backgroundColor: '#02a7f0', textTransform: 'none', color: 'white', minWidth: '100px'}}
            onClick={() => assignCoaches()}>Assign
            {isProgress ? <CircularProgress size={20} style={{marginLeft: '10px', color: 'white'}} /> : null}
          </Button>
        </div>
      </div>}
    </Grid>)
  }  

  const dateFormat = (date) => {
    var d = new Date(date);
    return d.getDate() + " " + d.toLocaleString("default", { month: "long" }) + " " + d.getFullYear()
  }


  return (
    <div style={{padding: '20px'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', margin: '10px 0'}}>
        <Typography variant="h6" gutterBottom component="div"> Courses </Typography>
        <Fab className={classes.fab}
          aria-label="add"
          size='small'
          onClick={() => setIsAddNewCourse(true)}>
          <AddIcon style={{color: 'white'}}/>
        </Fab>
      </div>
      <Grid container spacing={3}>
        {courses && courses.active.map((course, index) => {        
          const { courseType } = course.courseDetails
          if (courseType === 'Weekly') return <CourseItem key={index} course={course} index={index} />
        }
        )}
      </Grid>

      <div style={{display: 'flex', justifyContent: 'space-between', margin: '20px 0'}}>
        <Typography variant="h6" gutterBottom component="div"> Camps </Typography>
        <Fab className={classes.fab}
          aria-label="add"
          size='small'>
          <AddIcon style={{color: 'white'}}/>
        </Fab>
      </div>
      <Grid container spacing={3}>
        {courses && courses.active.map((course, index) => {
          const { courseType, endDate, startDate, cost, age, optionalName } = course.courseDetails
          if (courseType === 'Camp') return <CourseItem key={index} course={course} index={index} />
        }
        )}
      </Grid>
    </div>
  );
}
