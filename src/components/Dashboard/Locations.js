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
  Button
} from "@material-ui/core";
import Box from '@material-ui/core/Box';
import axios from 'axios'
import auth from '../../lib/auth'
import DeleteComponent from '../../pages/admin/DeleteComponent'
import LocationPageTable from '../../components/LocationPageTable'
import AddLocation from '../../pages/admin/AddLocation'

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




export default function Locations() {
  const classes = useStyles();
  const [value, setValue] = useState(0);
  const [companyLocations, setCompanyLocations] = useState()
  const [open, setOpen] = useState(false)
  const [deleteInProgress, setDeleteInProgress] = useState(false)
  const [locationIdToBeDeleted, setLocationIdToBeDeleted] = useState()

  useEffect(() => {
    axios
      .get(`/users/${auth.getUserId()}`)
      .then(res => {
        setCompanyLocations(res.data[0].locations);
      })
      .catch(e => console.log(e))
  }, [!deleteInProgress]);

  const handleSetLocationId = locationId => {
    setOpen(true)
    setLocationIdToBeDeleted(locationId)
  }

  const handleClose = () => {
    setOpen(false);
  };

  function handleStateRefresh() {
    setDeleteInProgress(!deleteInProgress)
  }

  const handleDelete = () => {
    setDeleteInProgress(true);
    console.log(locationIdToBeDeleted);
    // axios
    //   .delete(`/companies/locations/${locationIdToBeDeleted}`, {
    //     headers: { Authorization: `Bearer ${auth.getToken()}` },
    //   })
    //   .then((res) => {
    //     console.log(res.data);
    //     setDeleteInProgress(false);
    //     handleClose();
    //   })
    //   .catch((err) => {
    //     console.error(err);
    //     setDeleteInProgress(false);
    //     handleClose();
    //   });
  };


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
          <Tab label="Current Locations" icon={<ExploreSharpIcon />} {...a11yProps(0)} />
          <Tab label="Add New Location" icon={<AddLocationSharpIcon />} {...a11yProps(1)} />
        </Tabs>
      </AppBar>

      {/* tab 1 content */}
      <TabPanel value={value} index={0}>
        {companyLocations && <LocationPageTable
          handleSetLocationId={(locationId) => handleSetLocationId(locationId)}
          locations={companyLocations} />}
      </TabPanel>

      {/* tab 2 content */}
      <TabPanel className={classes.formContainer} value={value} index={1}>
        <AddLocation 
        deleteInProgress={deleteInProgress}
        handleStateRefresh={() => handleStateRefresh()} classes={classes} />
      </TabPanel>

      <DeleteComponent
        open={open}
        handleDelete={e => handleDelete(e)}
        handleClose={e => handleClose(e)}
        name='location' />
    </div>
  );
}



