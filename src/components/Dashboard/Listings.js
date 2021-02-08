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
  Button,
  Container
} from "@material-ui/core";
import Box from '@material-ui/core/Box';
import axios from 'axios'
import auth from '../../lib/auth'
import DeleteComponent from '../../pages/admin/DeleteComponent'
import AddListings from './AddListings'
import EditSharpIcon from '@material-ui/icons/EditSharp';
import ListingsPageTable from './ListingsPageTable'
import ListingInstructionDialogue from './ListingInstructionDialogue'
import { getDate } from 'date-fns';

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
  const [companyListings, setCompanyListings] = useState([])
  const [open, setOpen] = useState(false)
  const [completedSetup, setCompletedSetup] = useState(false)
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

  async function getData() {

    const data = await axios.get(`/users/${auth.getUserId()}`)
    const { coaches, listings, stripe_account, services, courses, name, images, verification } = await data.data[0]

    let coachArray = []
    let listingArray = []

    for (const id of coaches) {
      let coach
      const response = await axios.get(`/users/${id}`)
      coach = await response.data[0] ? response.data[0] : response.data
      coachArray.push(coach)
    }

    for (const id of listings) {
      console.log('THIS IS', id)
      let listing
      const response = await axios.get(`/listings/${id}`)
      listing = await response.data[0] ? response.data[0] : response.data
      listingArray.push(listing)
    }

    console.log(coachArray, listingArray)

    setCompanyListings(listingArray);
    setListingTransferListInfo({
      ...listingTransferListInfo,
      stripe_account,
      coaches: coachArray,
      services,
      courses,
      companyName: name,
      images
    })
    setCompletedSetup(verification.setup)
  }

  useEffect(() => {
    // console.log('helloo')
    getData()
  }, []);



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

  function handleStateRefresh() {
    setValue(0)
    // setStateRefreshInProgress(false);
  }

  const handleDelete = () => {


    axios
      .delete(`/companies/listings/${listingIdToBeDeleted}`, {
        headers: { Authorization: `Bearer ${auth.getToken()}` },
      })
      .then((res) => {
        // console.log(res.data);
        handleClose();
        getData()

      })
      .catch((err) => {
        // console.error(err);
        handleClose();
        getData()


      });
  };


  const handleChange = (event, newValue) => {
    setValue(newValue);
    if (newValue !== 2) setListingToBeEdited(null)
  };

  const handleSetListingToBeEdited = listing => {
    setValue(2)
    setListingToBeEdited(listing)
  }
  return (
    <div className={classes.root}>

      <AppBar position="static" color="default">
        {completedSetup ? <Tabs
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
          {listingToBeEdited && <Tab label="Edit Listing" icon={<EditSharpIcon />} {...a11yProps(2)} />}

        </Tabs>
          :
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
          </Tabs>
        }
      </AppBar>

      {/* tab 1 content */}
      <TabPanel value={value} index={0}>
        {(completedSetup && companyListings) &&
          <ListingsPageTable

            listings={companyListings}
            handleSetListingId={listingId => handleSetListingId(listingId)}
            handleSetListingToBeEdited={listing => handleSetListingToBeEdited(listing)} />}
        {!completedSetup &&
          <Container>
            <Typography>Please finish setting up your account before adding a listing</Typography>
          </Container>
        }
      </TabPanel>

      {/* tab 2 content */}
      <TabPanel className={classes.formContainer} value={value} index={1}>
        <AddListings
          getData={() => getData()}
          listingTransferListInfo={listingTransferListInfo}
          handleStateRefresh={() => handleStateRefresh()} classes={classes} />
      </TabPanel>

      {/* tab 3 content */}
      <TabPanel className={classes.formContainer} value={value} index={2}>
        {listingToBeEdited &&
          <AddListings
          getData={() => getData()}
            listingToBeEdited={listingToBeEdited}
            listingTransferListInfo={listingTransferListInfo}
            handleStateRefresh={() => handleStateRefresh()} classes={classes} />}
      </TabPanel>

      {value === 0 && <Fab variant="extended"
        onClick={() => setInstructionsOpen(!instructionsOpen)}
        color="primary" className={classes.fab}>
        <AssignmentSharpIcon style={{ marginRight: '10px' }} />
        Listing Instructions
      </Fab>}


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



