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
  OutlinedInput,
  Snackbar,
} from "@material-ui/core";
import MuiAlert from '@material-ui/lab/Alert';
import Box from '@material-ui/core/Box';
import axios from 'axios'
import auth from '../../lib/auth'
import CompanyDetailsEdit from '../../pages/CompanyDetailsEdit'
import CompanyDetailsEditBeta from '../../pages/CompanyDetailsEditBeta'


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
  form: {
    margin: '0 auto',
    width: '50%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  spacing: {
    width: '60%',
    margin: '10px 0'
  }
}));




export default function ContactInfo({ componentTabValue, handleComponentChange }) {
  const classes = useStyles();
  const [value, setValue] = useState(componentTabValue);
  const [stateRefreshInProgress, setStateRefreshInProgress] = useState(false)
  const  [newInfo, setNewInfo] = useState(true)

  const [basicContactInfo, setBasicContactInfo] = useState({
    website: '',
    instagram: '',
    twitter: '',
    facebook: '',
    adminEmail: '',
    companyId: auth.getUserId()
  })

  const [snackBarOpen, setSnackBarOpen] = useState(false)

  const { website, instagram, twitter, facebook, adminEmail } = basicContactInfo

  useEffect(() => {
    axios
      .get(`/users/${auth.getUserId()}`)
      .then(res => {
        if (res.data[0].hasOwnProperty('contactInformation')) {
          setNewInfo(false)
          setBasicContactInfo({ ...res.data[0].contactInformation })
        }
      })
      .catch(e => console.log(e))
  }, [!stateRefreshInProgress]);

  const handleSubmit = (e) => {
    e.preventDefault()

    if (newInfo) {
      axios.post("/companies/contact", basicContactInfo)
      .then(() => handleStateRefresh())
      .catch((err) => console.log(err))
    } else {
      axios.patch("/companies/array/contact", basicContactInfo,  { headers: { Authorization: `Bearer ${auth.getToken()}` } })
      .then(() => handleStateRefresh())
      .catch((err) => console.log(err))
    }
  }

  const closeSnackBar = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackBarOpen(false);
  };


  const handleStateRefresh = async () => {
    await setStateRefreshInProgress(!stateRefreshInProgress)
    setSnackBarOpen(true)
    setValue(1)
  }

  function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }



  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const basicContactForm = (

    <form className={classes.form} onSubmit={(e) => handleSubmit(e)} autoComplete="off" >
      <FormControl variant="outlined" className={classes.spacing}>
        <InputLabel htmlFor="component-outlined"> Website link </InputLabel>
        <OutlinedInput
          label="Website link"
          value={website}
          onChange={(e) => setBasicContactInfo({ ...basicContactInfo, website: e.target.value })}
        ></OutlinedInput>
      </FormControl>

      <FormControl variant="outlined" className={classes.spacing}>
        <InputLabel htmlFor="component-outlined"> Instagram handle </InputLabel>
        <OutlinedInput
          label=" Instagram handle "
          value={instagram}
          onChange={(e) => setBasicContactInfo({ ...basicContactInfo, instagram: e.target.value })}
        />
      </FormControl>

      <FormControl variant="outlined" className={classes.spacing}>
        <InputLabel htmlFor="component-outlined"> Twitter handle </InputLabel>
        <OutlinedInput
          label="Twitter handle"
          value={twitter}
          onChange={(e) => setBasicContactInfo({ ...basicContactInfo, twitter: e.target.value })}
        />
      </FormControl>

      <FormControl variant="outlined" className={classes.spacing}>
        <InputLabel htmlFor="component-outlined"> Facebook handle </InputLabel>
        <OutlinedInput
          label="Facebook handle"
          value={facebook}
          onChange={(e) => setBasicContactInfo({ ...basicContactInfo, facebook: e.target.value })}
        />
      </FormControl>

      <FormControl variant="outlined" className={classes.spacing}>
        <InputLabel htmlFor="component-outlined">
          Customer contact email address
          </InputLabel>
        <OutlinedInput
          label="Customer contact email address"
          value={adminEmail}
          onChange={(e) => setBasicContactInfo({ ...basicContactInfo, adminEmail: e.target.value })}
        />
      </FormControl>

      <Button
        className={classes.button}
        type='submit'
        variant="contained"
        color="primary"
      >
        Save
        </Button>
    </form>

  )

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
          <Tab label="Company Details" icon={<ExploreSharpIcon />} {...a11yProps(0)} />
          <Tab label="Basic Contact Info" icon={<AddLocationSharpIcon />} {...a11yProps(1)} />
        </Tabs>
      </AppBar>

      {/* tab 1 content */}
      <TabPanel value={value} index={0}>
        <CompanyDetailsEditBeta handleComponentChange={handleComponentChange} />
      </TabPanel>

      {/* tab 2 content */}
      <TabPanel className={classes.formContainer} value={value} index={1}>
        {basicContactForm}
      </TabPanel>

      <Snackbar open={snackBarOpen} autoHideDuration={1000} onClose={closeSnackBar}>
        <Alert onClose={closeSnackBar} severity="success">
          Details updated
        </Alert>
      </Snackbar>


    </div>
  );
}
