import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import ExploreSharpIcon from '@material-ui/icons/ExploreSharp';
import AddLocationSharpIcon from '@material-ui/icons/AddLocationSharp';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import {
  Typography,
  Button,
  Select
} from "@material-ui/core";
import Box from '@material-ui/core/Box';
import axios from 'axios'
import auth from '../../lib/auth'
import DeleteComponent from '../../pages/admin/DeleteComponent'
import SessionsPageTable from '../../components/SessionsPageTable'
import MaterialUIPickers from '../../pages/admin/CampMultiDetails'
import WeeklyCourseDetails from '../../pages/admin/WeeklyCourseDetails'


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
    width: '100%',
  },
  AppBar: {
    // backgroundColor: 'white',
  },
  card: {
    height: "100px",
    width: "200px",
    margin: '20px',
    position: 'relative'
  },
  icons: {
    zIndex: 5,
    position: "absolute",
    color: "#EF5B5B",
    top: "-2%",
    right: "-2%",
    "&:hover": {
      cursor: "pointer",
    },
  },
  formContainer: {

  },
  form: {
    margin: '0 auto',
    width: '50%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  select: {
    width: `${(window.innerWidth - 100) / 3}px`,
    marginBottom: '30px'
  },
  inputs: {
    margin: '7px 0',
    width: `${(window.innerWidth - 100) / 3}px`
  }
}));




export default function Sessions() {
  const classes = useStyles();
  const [value, setValue] = useState(0);
  const [companyCourses, setCompanyCourses] = useState()
  const [open, setOpen] = useState(false)
  const [stateRefreshInProgress, setStateRefreshInProgress] = useState(false)
  const [courseIdToBeDeleted, setCourseIdToBeDeleted] = useState()
  const [newCourseDetail, setNewCourseDetail] = useState()
  const [courseToBeEdited, setCourseToBeEdited] = useState()

  useEffect(() => {
    axios
      .get(`/users/${auth.getUserId()}`)
      .then(res => {
        setCompanyCourses(res.data[0].courses);
      })
      .catch(e => console.log(e))
  }, [!stateRefreshInProgress]);

  const handleSetLocationId = locationId => {
    setOpen(true)
    setCourseIdToBeDeleted(locationId)
  }

  const handleClose = () => {
    setOpen(false);
  };

  function handleStateRefresh() {
    setValue(0)
    setStateRefreshInProgress(!stateRefreshInProgress)
  }

  function handleCampResetInformation(e) {
    const { courseType } = courseToBeEdited.courseDetails
    setValue(1)
    if (courseType === 'Weekly') setNewCourseDetail('weekly')
    else setNewCourseDetail('camp')
  }

  const handleDelete = () => {
    setStateRefreshInProgress(true);
    console.log(courseIdToBeDeleted);
    // axios
    //   .delete(`/companies/locations/${courseIdToBeDeleted}`, {
    //     headers: { Authorization: `Bearer ${auth.getToken()}` },
    //   })
    //   .then((res) => {
    //     console.log(res.data);
    //     setStateRefreshInProgress(false);
    //     handleClose();
    //   })
    //   .catch((err) => {
    //     console.error(err);
    //     setStateRefreshInProgress(false);
    //     handleClose();
    //   });
  };

  const handleEditCourse = (course) => {
    console.log(course)
    setValue(2)
    setCourseToBeEdited(course)
  }


  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>

      <AppBar position="static" color="default">
        <Tabs
          className={classes.AppBar}
          value={value}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons="on"
          indicatorColor="primary"
          textColor="primary"
          aria-label="scrollable force tabs example"
        >
          <Tab label="Current" icon={<ExploreSharpIcon />} {...a11yProps(0)} />
          <Tab label="Add New" icon={<AddLocationSharpIcon />} {...a11yProps(2)} />
          <Tab label="Edit Existing" icon={<AddLocationSharpIcon />} {...a11yProps(3)} />
        </Tabs>
      </AppBar>

      {/* tab 1 content */}
      <TabPanel value={value} index={0}>
        <SessionsPageTable 
        handleEditCourse={e => handleEditCourse(e)}
        courseToBeEdited={courseToBeEdited} courses={companyCourses} />
      </TabPanel>

      {/* tab 2 content */}
      <TabPanel className={classes.formContainer} value={value} index={1}>
        <FormControl variant="outlined" className={classes.formControl}>
          <InputLabel id="demo-simple-select-outlined-label">Who type of course are you adding?</InputLabel>
          <Select
            className={classes.select}
            labelId="demo-simple-select-filled-label"
            id="demo-simple-select-filled"
            label='Who type of course are you adding?'
            value={newCourseDetail}
            onChange={e => setNewCourseDetail(e.target.value)}
          >

            <MenuItem value='camp'> Camp </MenuItem>
            <MenuItem value='weekly'> Weekly Course </MenuItem>

          </Select>
        </FormControl>

        {newCourseDetail ? newCourseDetail === 'camp' ?   <MaterialUIPickers /> : (
          <WeeklyCourseDetails />
        ) : null}
      
      </TabPanel>

      {/* tab 5 content */}
      <TabPanel className={classes.formContainer} value={value} index={2}>
      {courseToBeEdited ? courseToBeEdited.courseDetails.courseType === 'Camp' ?  <MaterialUIPickers 
      handleCampResetInformation={e => handleCampResetInformation(e)}
      course={courseToBeEdited}
      /> : (
          <WeeklyCourseDetails course={courseToBeEdited}
          handleStateRefresh={() => handleStateRefresh()}
          handleCampResetInformation={e => handleCampResetInformation(e)}/>
        ) : null}
      </TabPanel>

      <DeleteComponent
        open={open}
        handleDelete={e => handleDelete(e)}
        handleClose={e => handleClose(e)}
        name='location' />
    </div>
  );
}



