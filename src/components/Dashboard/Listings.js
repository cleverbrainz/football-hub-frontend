import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import PlaylistAddSharpIcon from '@material-ui/icons/PlaylistAddSharp';
import FormatListNumberedSharpIcon from '@material-ui/icons/FormatListNumberedSharp';
import AssignmentSharpIcon from '@material-ui/icons/AssignmentSharp';
import {
  Typography,
  Fab,
  Button
} from "@material-ui/core";
import Box from '@material-ui/core/Box';
import axios from 'axios'
import auth from '../../lib/auth'
import DeleteComponent from '../../pages/admin/DeleteComponent'
import AddListings from './AddListings'
import EditSharpIcon from '@material-ui/icons/EditSharp';
import ListingsPageTable from './ListingsPageTable'
import ListingInstructionDialogue from './ListingInstructionDialogue'

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
    position: 'relative',
    height: window.innerHeight - 80
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
  fab: {
    position: 'absolute',
    right: '3%',
    bottom: '3%'
  }
}));




export default function Listings() {
  const classes = useStyles();
  const [value, setValue] = useState(0);
  const [companyListings, setCompanyListings] = useState()
  const [open, setOpen] = useState(false)
  const [stateRefreshInProgress, setStateRefreshInProgress] = useState(false)
  const [listingIdToBeDeleted, setListingIdToBeDeleted] = useState()
  const [listingToBeEdited, setListingToBeEdited] = useState()
  const [instructionsOpen, setInstructionsOpen] = React.useState(false);


  const [listingTransferListInfo, setListingTransferListInfo] = useState({
    coaches: [],
    services: [],
    courses: [],
    camps: [],
    companyName: '',
    images: []
  })

  async function getData(data) {
    let coachArray = []

    for (const request of data) {
      let coach
      const response = await axios.get(`/users/${request}`)
      coach = await response.data[0]
      coachArray.push(coach)
    }
    return coachArray
  }

  useEffect(() => {
    axios
      .get(`/users/${auth.getUserId()}`)
      .then(async res => {
        const { services, courses, name, images, listings } = res.data[0]
        let { coaches } = res.data[0]
        coaches = await getData(coaches)
        setCompanyListings(listings);
        setListingTransferListInfo({ ...listingTransferListInfo, coaches, services, courses, companyName: name, images })
      })
      .catch(e => console.log(e))
  }, [!stateRefreshInProgress]);

  const handleSetListingId = listingId => {
    setOpen(true)
    setListingIdToBeDeleted(listingId)
  }

  const handleClose = () => {
    setOpen(false);
  };

  const handleInstructionsClose = () => {
    setInstructionsOpen(false);
  };

  async function handleStateRefresh() {
    await setStateRefreshInProgress(!stateRefreshInProgress)
    setValue(0)
  }

  const handleDelete = () => {
    setStateRefreshInProgress(true);

    console.log(listingIdToBeDeleted)

    axios
      .delete(`/companies/listings/${listingIdToBeDeleted}`, {
        headers: { Authorization: `Bearer ${auth.getToken()}` },
      })
      .then((res) => {
        console.log(res.data);
        setStateRefreshInProgress(false);
        handleClose();
      })
      .catch((err) => {
        console.error(err);
        setStateRefreshInProgress(false);
        handleClose();
      });
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
        {companyListings &&
          <ListingsPageTable
            listings={companyListings}
            handleSetListingId={listingId => handleSetListingId(listingId)}
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
        {listingToBeEdited &&
          <AddListings
            listingToBeEdited={listingToBeEdited}
            listingTransferListInfo={listingTransferListInfo}
            handleStateRefresh={() => handleStateRefresh()} classes={classes} />}
      </TabPanel>

      <Fab variant="extended"
        onClick={() => setInstructionsOpen(!instructionsOpen)}
        color="primary" className={classes.fab}>
        <AssignmentSharpIcon style={{ marginRight: '10px' }} />
        Listing Instructions
      </Fab>

      <DeleteComponent
        open={open}
        handleDelete={e => handleDelete(e)}
        handleClose={e => handleClose(e)}
        name='listing' />

      <ListingInstructionDialogue
        open={instructionsOpen}
        handleClose={e => handleInstructionsClose(e)}
      />
    </div>
  );
}



