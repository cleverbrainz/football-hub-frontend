import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import ExploreSharpIcon from '@material-ui/icons/ExploreSharp';
import AddLocationSharpIcon from '@material-ui/icons/AddLocationSharp';
import {
  Typography,
  Select,
  InputLabel,
  FormControl,
  Tab,
  AppBar,
  Tabs,
  MenuItem,
  Box,
  TextField,
  Container
} from "@material-ui/core";
import axios from 'axios'
import auth from '../../lib/auth'
import DeleteComponent from '../../Dashboards/dashboardComponents/DeleteComponent'
import MiscPageTable from '../../components/MiscPageTable'
import ContainedButtons from '../../pages/admin/AddServices'
import CircularProgress from '@material-ui/core/CircularProgress'
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
  spacing: {
    marginTop: '60px',
    marginBottom: '10px'
  },
  typeSelect: {
    [theme.breakpoints.up("sm")]: {
      width: '30%'
    },
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
  },
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
  const [isLoading, setIsLoading] = useState(true)
  const [isEmptyService, setIsEmptyService] =  useState(true)
  const [service, setService] = useState({companyId: auth.getUserId()})
  const [dialogOpen, setDialogOpen] = useState(false)

  async function getData() {
    // const data = await axios.get(`/users/${auth.getUserId()}`)
    axios.get(`/users/${auth.getUserId()}`, { headers: { Authorization: `Bearer ${auth.getToken()}` }})
      .then(res => {
        const { services } =  res.data[0]
        if (services.length !== 0 && !dialogOpen) {
          setIsEmptyService(false)
        }
        setCompanyServices(services)
        setIsLoading(false)
      })
      .catch(err => {
        setIsLoading(false)
        console.log(err)
      })
    // const { services } = await data.data[0]
    // setCompanyServices(services)
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

  const handleDialogClose = () => {
    setDialogOpen(false)
    setIsEmptyService(false)
  }

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

  const handleSave = () => {
    // if (service) {
    //   return axios
    //     .patch("/companies/array/services", { ...form, serviceId: service.serviceId },
    //       { headers: { Authorization: `Bearer ${auth.getToken()}` } })
    //     .then((res) => {
    //       getData()
    //       handleChange(e,0)
    //     })
    //     .catch((error) => {
    //       getData()
    //       handleChange(e,0)
    //     });

    // } else {
      
      axios
        .post("/companies/services", service, { headers: { Authorization: `Bearer ${auth.getToken()}` }})
        .then((res) => {
          // getData()
          setDialogOpen(true)
        })
        .catch((error) => {
          // getData()
          console.log(error)
        });
    // }
  }

  const handleEditService = (service) => {
    setValue(2)
    setServiceToBeEdited(service)
  }


  const handleChange = (event, newValue) => {
    if (newValue !== 2) setServiceToBeEdited(null)
    setValue(newValue);
  };

  const handleAddAnother = () => {
    setService({companyId: auth.getUserId()})
    setNewMiscDetail('')
    setDialogOpen(false)
  }

  return (
    <div className={classes.root}>
      {isLoading && <div>
        <CircularProgress style= {{position: 'absolute', left: 'calc(50% - 50px)', top: 'calc(50% - 50px)', width: '100px', height: '100px', margin: 'auto'}}/>
      </div>}

      {(!isLoading && isEmptyService) && <Container className={classes.container}>
        <form className={classes.addForm}>
          <FormControl variant="outlined" style={{marginTop: '50px'}}>
            <InputLabel id="service-type-outlined-label"> Service Type </InputLabel>
            <Select
              labelId="service-type-label"
              id="service_type"
              label='Service Type'
              value={newMiscDetail ? newMiscDetail : ''}
              onChange={e => setNewMiscDetail(e.target.value)}
            >
              <MenuItem value='service'> Company Service </MenuItem>
            </Select>
          </FormControl>

          <TextField
            className={classes.spacing}
            id="outlined-service-name"
            label="Service Name"
            variant="outlined"
            name='name'
            value={service.name ? service.name : ''}
            onChange={(e) => setService({...service, name: e.target.value})}
          />

          <TextField
            id="outlined-service-description"
            label="Service Description"
            name='description'
            multiline
            rows={8}
            variant="outlined"
            value={service.description ? service.description : ''}
            onChange={(e) => setService({...service, description: e.target.value})}
          />          
        </form>
        <Button style={{backgroundColor: '#02a7f0', color: 'white', minWidth: '300px', marginTop: '50px'}}
          onClick={() => handleSave()}>Save</Button>
        <Dialog
          open={dialogOpen}
          onClose={handleDialogClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="add-service-dialog-title">
            {"Do you want to add another service?"}
          </DialogTitle>
          <DialogActions>
            <Button onClick={handleAddAnother}>Yes</Button>
            <Button onClick={handleDialogClose}>No</Button>
          </DialogActions>
        </Dialog>
      </Container>}

      {(!isLoading && !isEmptyService) && <div>
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
      </div>}
    </div>
  );
}



