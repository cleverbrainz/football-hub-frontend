import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import ExploreSharpIcon from '@material-ui/icons/ExploreSharp';
import AddLocationSharpIcon from '@material-ui/icons/AddLocationSharp';
import {
  Typography,
  Tabs, 
  Tab,
  Box,
  AppBar,
  InputLabel,
  FormControl,
  Container,
  OutlinedInput
} from "@material-ui/core";
import axios from 'axios'
import auth from '../../lib/auth'
import LocationPageTable from '../../components/LocationPageTable'
import AddLocation from '../../pages/admin/AddLocation'
import DeleteComponent from '../../Dashboards/dashboardComponents/DeleteComponent'
import CircularProgress from '@material-ui/core/CircularProgress'
import LocationFilter from '../../components/LocationFilter'
import { geocodeByAddress, getLatLng } from "react-places-autocomplete";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";

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
  },
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-evenly",
    textAlign: "center",
    padding: '20px'
  },
  addForm: {
    width: "50%",
    minWidth: "300px",
    display: "flex",
    flexDirection: "column",
    height: "100%",
    justifyContent: "space-around",
    marginTop: '50px'
  },
}));

export default function Locations({ componentTabValue }) {
  const classes = useStyles();
  const [value, setValue] = useState(componentTabValue);
  const [companyLocations, setCompanyLocations] = useState()
  const [open, setOpen] = useState(false)
  const [stateRefreshInProgress, setStateRefreshInProgress] = useState(false)
  const [locationToBeDeleted, setLocationToBeDeleted] = useState({id:''})
  // company courses only in need if location is deleted, need to deleted courses related to location
  const [companyCourses, setCompanyCourses] = useState()
  const [locationToBeEdited, setLocationToBeEdited] = useState()
  const [isLoading, setIsLoading] = useState(true)
  const [isAddNewLocation, setIsAddNewLocation] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [location, setLocation] = useState({companyId: auth.getUserId()})
  const [address, setAddress] = useState()

  useEffect(() => {
    axios
      .get(`/users/${auth.getUserId()}`, { headers: { Authorization: `Bearer ${auth.getToken()}` }})
      .then(res => {
        setCompanyLocations(res.data[0].locations);
        if (res.data[0].locations.length !== 0 && !dialogOpen) {
          setIsAddNewLocation(false)
        }
        setCompanyCourses(res.data[0].courses);
        setIsLoading(false)
      })
      .catch(e => {
        setIsLoading(false)
        console.log(e)})
  }, [!stateRefreshInProgress]);

  // const handleSetLocationId = (locationId, venue) => {
  //   setOpen(true)
  //   setLocationToBeDeleted({ id: locationId, venue })
  // }

  const handleClose = () => {
    setOpen(false);
  };

  const handleStateRefresh = async () => {
    await setStateRefreshInProgress(!stateRefreshInProgress)
    setValue(0)
  }

  // async function deleteCourses(coursesToBeDeletedArr) {

  //   await coursesToBeDeletedArr.forEach(el => {
  //     axios.delete(`/companies/courses/${el.courseId}`, {
  //       headers: { Authorization: `Bearer ${auth.getToken()}` },
  //     })
  //     // console.log(el.courseId)
  //   })
  // }

  // const handleDelete = () => {
  //   setStateRefreshInProgress(true);
  //   console.log(locationToBeDeleted);
  //   axios
  //     .delete(`/companies/locations/${locationToBeDeleted.id}`, {
  //       headers: { Authorization: `Bearer ${auth.getToken()}` },
  //     })
  //     .then(() => {
  //       const coursesToBeDeleted = companyCourses.filter(el => {
  //         return el.courseDetails.location === locationToBeDeleted.venue
  //       })
  //       deleteCourses(coursesToBeDeleted)
  //     })
  //     .then(() => {
  //       setStateRefreshInProgress(false);
  //       handleClose();
  //     })
  //     .catch((err) => {
  //       console.error(err);
  //       setStateRefreshInProgress(false);
  //       handleClose();
  //     });
  // }

  const handleLocationDeletion = (locationId) => {
    setOpen(true)
    setLocationToBeDeleted({ id: locationId})
  }

  const handleDelete = () => {
    // const {id} =  locationToBeDeleted
    // console.log('the location delete command is working')
    // axios.delete(`/companies/locations/${id}`, {
    //   headers: { Authorization: `Bearer ${auth.getToken()}` }
    // })
    //   .then((res) => {
    //     setStateRefreshInProgress(false);
    //     handleClose();
    //   })
    //   .catch((err) => {
    //     setStateRefreshInProgress(false);
    //     handleClose();
    //   });
    console.log('location delete')
  }

  const handleEditLocation = (location) => {
    console.log('location edit')
    // setValue(2)
    // setLocationToBeEdited(location)
  }

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleSelect = async (value) => {
    const results = await geocodeByAddress(value);
    const latLng = await getLatLng(results[0]);

    setAddress(value)
    setLocation({
      ...location,
      fullAddress: value,
      latitude: latLng.lat,
      longitude: latLng.lng
    })
  };

  const handleSave= () => {
    axios.post("/companies/locations", location, { headers: { Authorization: `Bearer ${auth.getToken()}` }})
      .then(res => {
        setDialogOpen(true)
      })
      .catch(err => {
        console.log(err)
      })
  }

  const handleDialogClose = () => {
    setDialogOpen(false)
    setIsAddNewLocation(false)
    handleStateRefresh()
  }

  const handleAddAnother = () => {
    setLocation({companyId: auth.getUserId()})
    setAddress('')
    setDialogOpen(false)
  }

  return (
    <div className={classes.root}>
      {isLoading && <div>
        <CircularProgress style= {{position: 'absolute', left: 'calc(50% - 50px)', top: 'calc(50% - 50px)', width: '100px', height: '100px', margin: 'auto'}}/>
      </div>}

      {(!isLoading && isAddNewLocation) && <Container className={classes.container}>
        <form className={classes.addForm}>
          <Typography style={{fontSize: '20px', fontWeight: 'bold', marginBottom: '50px'}}>Add Your Coaching Locations</Typography>
          <FormControl variant="outlined"
            style={{ marginBottom: '20px'}}>
            <InputLabel>Place Name</InputLabel>
            <OutlinedInput
              type="text"
              label="Place Name"
              value={location.venue ? location.venue : ''}
              onChange={e => setLocation({ ...location, venue: e.target.value })}
            />
          </FormControl>

          <LocationFilter address={address} handleSelect={e => handleSelect(e)} setAddress={setAddress} />

          <FormControl variant="outlined"
            style={{ marginBottom: '20px' }}>
            <InputLabel>Location Post Code</InputLabel>
            <OutlinedInput
              type="text"
              label="Location Post Code"
              value={location.postCode ? location.postCode : ''}
              onChange={e => setLocation({ ...location, postCode: e.target.value })}
            />
          </FormControl>
        </form>
        <Button style={{backgroundColor: '#02a7f0', color: 'white', minWidth: '300px', marginTop: '50px'}}
          onClick={() => handleSave()}>Finish</Button>
        <Dialog
          open={dialogOpen}
          onClose={handleDialogClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="add-location-dialog-title">
            {"Do you want to add another location?"}
          </DialogTitle>
          <DialogActions>
            <Button onClick={handleAddAnother}>Yes</Button>
            <Button onClick={handleDialogClose}>No</Button>
          </DialogActions>
        </Dialog>
      </Container> }

      {(!isLoading && !isAddNewLocation) && <div>
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
            <Tab label="Current Locations" icon={<ExploreSharpIcon />} {...a11yProps(0)} />
            <Tab label="Add New Location" icon={<AddLocationSharpIcon />} {...a11yProps(1)} />
          </Tabs>
        </AppBar>

        {/* tab 1 content */}
        <TabPanel value={value} index={0}>
          {companyLocations && <LocationPageTable
            handleEditLocation={e => handleEditLocation(e)}
            handleLocationDeletion={(locationId) => handleLocationDeletion(locationId)}
            // handleSetLocationId={(locationId, venue) => handleSetLocationId(locationId, venue)}
            locations={companyLocations} />}
        </TabPanel>

        {/* tab 2 content */}
        <TabPanel className={classes.formContainer} value={value} index={1}>
          <AddLocation
            stateRefreshInProgress={stateRefreshInProgress}
            handleStateRefresh={() => handleStateRefresh()} classes={classes} />
        </TabPanel>

        {open && <DeleteComponent
          open={open}
          handleDelete={e => handleDelete(e)}
          handleClose={e => handleClose(e)}
          name='location' />}
      </div>}
    </div>
  );
}