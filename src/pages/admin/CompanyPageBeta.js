import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import PeopleAltSharpIcon from '@material-ui/icons/PeopleAltSharp';
import PersonAddSharpIcon from '@material-ui/icons/PersonAddSharp';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import FormPropsTextFields from '../admin/AddCoaches'
import Requests from '../Requests'
import {
  Typography,
  Card,
  CardContent,
} from "@material-ui/core";
import CancelSharpIcon from "@material-ui/icons/CancelSharp";
import Box from '@material-ui/core/Box';
import axios from 'axios'
import auth from '../../lib/auth'
import DeleteComponent from './DeleteComponent'

import CompanyPageBetaTable from '../../components/CompanyPageBetaTable'

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
    margin: '5px 0',
    width: `${(window.innerWidth - 100) / 3}px`
  }
}));




export default function CompanyPageBeta() {
  const classes = useStyles();
  const [value, setValue] = useState(0);
  const [companies, setCompanies] = useState()
  const [newCoachDetail, setNewCoachDetail] = useState()
  const [open, setOpen] = useState(false)
  const [deleteInProgress, setDeleteInProgress] = useState(false)
  const [coachIdToBeDeleted, setCoachIdToBeDeleted] = useState()


  async function getData() {
    let companyArray = []
    let user
    const response = await axios.get(`/users/${auth.getUserId()}`)
    const data = await response.data[0]
    user = data
    console.log(data)
    for (const request of data.companies) {
      const response = await axios.get(`/users/${request}`)
      const data = await response.data[0]
      console.log('data', data)
      companyArray.push(data)
    }
    setCompanies(companyArray)
  }

  // useEffect(() => {
  //   axios
  //     .get(`/users/${auth.getUserId()}`)
  //     .then(res => {
  //       console.log(res.data);
  //       setCoaches(res.data[0].coaches);
  //     })
  //     .catch(e => console.log(e))
  // }, [!deleteInProgress]);

  useEffect(() => {
    getData()
  }, [!deleteInProgress])

  const handleSetCoachId = coachId => {
    setOpen(true)
    setCoachIdToBeDeleted(coachId)
  }

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = () => {
    setDeleteInProgress(true);
    console.log(coachIdToBeDeleted);
    // axios
    //   .delete(`/companies/coaches/${deleteCoachId}`, {
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

  const InternalCoachForm = (
    <FormPropsTextFields classes={classes} />
  )

  const ExternalCoachForm = (
    <h1> bye</h1>
  )



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
          <Tab label="Current Companies" icon={<PeopleAltSharpIcon />} {...a11yProps(0)} />
          <Tab label="New Requests" icon={<PersonAddSharpIcon />} {...a11yProps(1)} />
        </Tabs>
      </AppBar>

      {/* tab 1 content */}
      <TabPanel value={value} index={0}>
        {companies && <CompanyPageBetaTable
          handleSetCoachId={(coachId) => handleSetCoachId(coachId)}
          companies={companies} />}
      </TabPanel>

      {/* tab 2 content */}
      <TabPanel className={classes.formContainer} value={value} index={1}>
        <Requests />
        {/* <form className={classes.form} action="">

          <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel id="demo-simple-select-outlined-label">Who are you adding?</InputLabel>
            <Select
              className={classes.select}
              labelId="demo-simple-select-filled-label"
              id="demo-simple-select-filled"
              label='Who are you adding?'
              value={newCoachDetail}
              onChange={e => setNewCoachDetail(e.target.value)}
            >

              <MenuItem value='myself'>Myself as a coach </MenuItem>
              <MenuItem value='someone'>Someone else as a coach</MenuItem>

            </Select>
          </FormControl>

          {newCoachDetail ? newCoachDetail === 'myself' ? InternalCoachForm : ExternalCoachForm : null}

        </form> */}
      </TabPanel>

      <DeleteComponent
        open={open}
        handleDelete={e => handleDelete(e)}
        handleClose={e => handleClose(e)}
        name='coach' />
    </div>
  );
}



