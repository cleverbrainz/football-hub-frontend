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
import MiscPageTable from '../../components/MiscPageTable'
import ContainedButtons from '../../pages/admin/AddServices'
import AddAgeGroup from '../../pages/admin/AddAgeGroup'
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




export default function Misc({ componentTabValue }) {
  const classes = useStyles();
  const [value, setValue] = useState(componentTabValue);
  const [companyServices, setCompanyServices] = useState()
  const [open, setOpen] = useState(false)
  const [miscToBeDeleted, setMiscToBeDeleted] = useState({
    id: '',
    miscType: ''
  })
  const [newMiscDetail, setNewMiscDetail] = useState()
  const [serviceToBeEdited, setServiceToBeEdited] = useState()

  async function getData() {
    const data = await axios.get(`/users/${auth.getUserId()}`)
    const { services } = await data.data[0]

    setCompanyServices(services)
  }

  useEffect(() => {
    getData()
  }, []);

  const handleMiscDeletion = (miscId, miscType) => {
    setOpen(true)
    setMiscToBeDeleted({ id: miscId, miscType })
  }

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = () => {

    const { miscType, id } = miscToBeDeleted

    axios.delete(`/companies/services/${id}`, {
      headers: { Authorization: `Bearer ${auth.getToken()}` }
    })
      .then((res) => {
        getData()
        handleClose();
      })
      .catch((err) => {
        getData()
        handleClose();
      });
  };

  const handleEditService = (service) => {
    setValue(2)
    setServiceToBeEdited(service)
  }


  const handleChange = (event, newValue) => {
    if (newValue !== 2) setServiceToBeEdited(null)
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
          <Tab label="Current Misc" icon={<ExploreSharpIcon />} {...a11yProps(0)} />
          <Tab label="Add New" icon={<AddLocationSharpIcon />} {...a11yProps(1)} />
          {serviceToBeEdited && <Tab label="Edit Existing" icon={<AddLocationSharpIcon />} {...a11yProps(2)} />}
        </Tabs>
      </AppBar>

      {/* tab 1 content */}
      <TabPanel value={value} index={0}>
        <MiscPageTable
          classes={classes}
          handleEditService={e => handleEditService(e)}
          handleMiscDeletion={(miscId, miscType) => handleMiscDeletion(miscId, miscType)}
          services={companyServices} />
      </TabPanel>

      {/* tab 2 content */}
      <TabPanel className={classes.formContainer} value={value} index={1}>
        <FormControl variant="outlined" className={classes.formControl}>
          <InputLabel id="demo-simple-select-outlined-label"> What other company detail are you adding? </InputLabel>
          <Select
            className={classes.select}
            labelId="demo-simple-select-filled-label"
            id="demo-simple-select-filled"
            label='What other company detail are you adding?'
            value={newMiscDetail}
            onChange={e => setNewMiscDetail(e.target.value)}
          >

            <MenuItem value='service'> Company Service </MenuItem>
            {/* <MenuItem value='age'> Age Group </MenuItem> */}

          </Select>
        </FormControl>

        {newMiscDetail && (newMiscDetail === 'service' && <ContainedButtons
          getData={() => getData()}
          handleChange={(e, val) => handleChange(e, val)}

        />)}

      </TabPanel>

      {/* tab 5 content */}
      <TabPanel className={classes.formContainer} value={value} index={2}>

        {serviceToBeEdited && <ContainedButtons
          service={serviceToBeEdited}
          getData={() => getData()}
          handleChange={(e, val) => handleChange(e, val)}
          // handleStateRefresh={() => handleStateRefresh()}
        />}
      </TabPanel>

      <TabPanel className={classes.formContainer} value={value} index={3}>

      </TabPanel>

      <DeleteComponent
        open={open}
        handleDelete={e => handleDelete(e)}
        handleClose={e => handleClose(e)}
        name={miscToBeDeleted.miscType === 'service' ? 'service' : 'age group'} />
    </div>
  );
}



