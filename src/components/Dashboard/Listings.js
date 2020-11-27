import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import PlaylistAddSharpIcon from '@material-ui/icons/PlaylistAddSharp';
import FormatListNumberedSharpIcon from '@material-ui/icons/FormatListNumberedSharp';
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
import AddListings from './AddListings'
import EditSharpIcon from '@material-ui/icons/EditSharp';
import ListingsPageTable from './ListingsPageTable'

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




export default function Listings() {
  const classes = useStyles();
  const [value, setValue] = useState(0);
  const [companyListings, setCompanyListings] = useState()
  const [open, setOpen] = useState(false)
  const [stateRefreshInProgress, setStateRefreshInProgress] = useState(false)
  const [locationIdToBeDeleted, setLocationIdToBeDeleted] = useState()
  const [listingToBeEdited, setListingToBeEdited] = useState()


  const [listingTransferListInfo, setListingTransferListInfo] = useState({
    coaches: [],
    services: [],
    courses: [],
    camps: [],
    companyName: '',
    images: []
  })

  useEffect(() => {
    axios
      .get(`/users/${auth.getUserId()}`)
      .then(res => {
        const { coaches, services, courses, name, images } = res.data[0]
        setCompanyListings(res.data[0].listings);
        setListingTransferListInfo({ coaches, services, courses, companyName: name, images })
      })
      .catch(e => console.log(e))
  }, [!stateRefreshInProgress]);

  const handleSetLocationId = locationId => {
    setOpen(true)
    setLocationIdToBeDeleted(locationId)
  }

  const handleClose = () => {
    setOpen(false);
  };

  function handleStateRefresh() {
    setValue(0)
    setStateRefreshInProgress(!stateRefreshInProgress)
  }

  const handleDelete = () => {
    setStateRefreshInProgress(true);
    console.log(locationIdToBeDeleted);
    // axios
    //   .delete(`/companies/locations/${locationIdToBeDeleted}`, {
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


  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleSetListingToBeEdited = listing => {
    setValue(2)
    setListingToBeEdited(listing)
  }

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
          <Tab label="Current Listings" icon={<FormatListNumberedSharpIcon />} {...a11yProps(0)} />
          <Tab label="Add New Listing" icon={<PlaylistAddSharpIcon />} {...a11yProps(1)} />
          <Tab label="Edit Listing" icon={<EditSharpIcon />} {...a11yProps(2)} />
        </Tabs>
      </AppBar>

      {/* tab 1 content */}
      <TabPanel value={value} index={0}>
        {companyListings && <ListingsPageTable listings={companyListings}
        handleSetListingToBeEdited={listing => handleSetListingToBeEdited(listing)} />}
      </TabPanel>

      {/* tab 2 content */}
      <TabPanel className={classes.formContainer} value={value} index={1}>
        <AddListings
          listingTransferListInfo={listingTransferListInfo}
          handleStateRefresh={() => handleStateRefresh()} classes={classes} />
      </TabPanel>

      {/* tab 2 content */}
      <TabPanel className={classes.formContainer} value={value} index={2}>
        {listingToBeEdited && <AddListings
          listingToBeEdited={listingToBeEdited}
          listingTransferListInfo={listingTransferListInfo}
          handleStateRefresh={() => handleStateRefresh()} classes={classes} />}
      </TabPanel>

      <DeleteComponent
        open={open}
        handleDelete={e => handleDelete(e)}
        handleClose={e => handleClose(e)}
        name='location' />
    </div>
  );
}



