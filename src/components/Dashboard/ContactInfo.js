import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import ExploreSharpIcon from '@material-ui/icons/ExploreSharp';
import AddLocationSharpIcon from '@material-ui/icons/AddLocationSharp';
import MenuItem from '@material-ui/core/MenuItem';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import { TextareaAutosize } from '@material-ui/core';
import {
  Typography,
  Button,
  OutlinedInput,
  Snackbar,
  Container,
  Select,
  Grid,
  Paper
} from "@material-ui/core";
import CheckIcon from '@material-ui/icons/Check';
import CrossIcon from '@material-ui/icons/Clear'
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';
import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import ChevronLeftIcon  from '@material-ui/icons/ChevronLeft'
import CircularProgress from '@material-ui/core/CircularProgress'
import BackupIcon from "@material-ui/icons/Backup";
import MuiAlert from '@material-ui/lab/Alert';
import Box from '@material-ui/core/Box';
import axios from 'axios'
import auth from '../../lib/auth'
import InsertPhotoOutlined from '@material-ui/icons/InsertPhotoOutlined';
import CloseIcon  from '@material-ui/icons/Close';
import CompanyDetailsEdit from '../../pages/CompanyDetailsEdit'
import CompanyDetailsEditBeta from '../../pages/CompanyDetailsEditBeta'
import { types } from '@babel/core';
import { set } from 'date-fns';


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
    width: '90%',
    display: 'flex',
    // flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'start'
  },
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    textAlign: "center",
  },
  spacing: {
    width: '60%',
    margin: '10px 0'
  },
  subforms: {
    width: '50%',
    display: 'flex',
    flexDirection: 'column'
  },
  stepContainer: {
    display: 'grid',
    alignItems: 'center',
    justifyContent: 'center'
  },
  wrapper: {
    margin: theme.spacing(1),
    position: 'relative',
  },
  verify: {
    display: 'inline-flex',
    flexDirection: 'row',
    alignItems: 'baseline',
    textAlign: 'center'
  },
  companyButton: {
    margin: '20px',
    borderWidth: '1px',
    borderColor: 'black',
    borderStyle: 'solid',
  },
  buttonProgressWhite: {
    color: 'white',
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
  button: {
    position: "relative",
    margin: "10px 0",
    minWidth: '170px',
    minHeight: '40px'
  },
  buttonContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  DetailItem: {
    borderColor: '#02a7f0',
    border: 'solid',
    borderWidth: '2px',
    borderRadius: '8px',
    minHeight: '100px'
  },
  DetailButton: {
    width: '100%',
    height: '100%',
    minHeight: '100px'
  },
  DetailContainer: {
    marginTop: '30px',
    [theme.breakpoints.up("sm")]: {
      display: 'flex'
    },
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.primary,
    minHeight: '150px'
  },
  linkbox: {
    cursor: 'pointer'
  },
  titleBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: '20.5px'
  },
  roundBox: {
    width: '30px',
    height: '30px',
    textAlign: 'center',
    lineHeight: '30px',
    fontSize: "20px",
    fontWeight: "600"
  },
  complete: {
    color: 'white',
    backgroundColor: 'green'
  },
  outstanding: {
    color: 'white',
    backgroundColor: 'red'
  },
  pending: {
    color: 'white',
    backgroundColor: 'orange'
  },
  detailTitle: {
    fontSize: '18px',
    marginTop: '10px',
    fontWeight: 'bold'
  },
  detailText: {
    fontSize: '16px',
    marginTop: '5px'
  },
  companyDetailContainer: {
    [theme.breakpoints.up("sm")]: {
      display: 'flex'
    },
  },
  contactSpacing: {
    width: '100%',
    margin: '10px 0'
  },
}));

function getSteps() {
  // return ['Registration details', 'Basic information', 'User profile setup', 'Registration Completed'];
  return ['', '', '', '', ''];
}


export default function ContactInfo({ componentTabValue, handleComponentChange }) {
  const classes = useStyles();
  const [value, setValue] = useState(componentTabValue);
  const [stateRefreshInProgress, setStateRefreshInProgress] = useState(false)
  const  [newInfo, setNewInfo] = useState(true)
  const [companyInfo, setCompanyInfo] = useState({})

  const [basicContactInfo, setBasicContactInfo] = useState({
    website: '',
    instagram: '',
    twitter: '',
    facebook: '',
    adminEmail: '',
    terms: '',
    companyId: auth.getUserId()
  })

  const [snackBarOpen, setSnackBarOpen] = useState(false)
  const { website, instagram, twitter, facebook, adminEmail, terms } = basicContactInfo
  const [isCompanyDetails, setIsCompanyDetails] = useState(false)
  const [activeStep, setActiveStep] = useState(0);
  const [dataChange, setDataChange] = useState({ public_liability_insurance: false, public_indemnity_insurance: false });
  const [pending, setPending] = useState(false)
  const steps = getSteps();
  const userId = auth.getUserId()
  const [saved, setSaved] = useState('unsaved')
  const [isLoading, setIsLoading] = useState(true)
  const [currentView, setCurrentView] = useState('profile')
  const [isEditable, setIsEditable] = useState('disabled')
  const [socialComplete, setSocialComplete] = useState(false)
  const [contactComplete, setContactComplete] = useState(false)
  const [buttonColors, setButtonColors] = useState(['black', 'black', 'black', 'black', 'black'])
  // const [checkState, setCheckState] = useState(null)

  useEffect(() => {  
    axios
      .get(`/users/${auth.getUserId()}`, { headers: { Authorization: `Bearer ${auth.getToken()}` }})
      .then(res => {
        if (res.data[0].hasOwnProperty('isCompanyDetails')) {
          setIsCompanyDetails(true)
        }
        if (res.data[0].hasOwnProperty('contactInformation')) {
          setNewInfo(false)
          setBasicContactInfo({ ...res.data[0].contactInformation })          
        }
        setCompanyInfo(res.data[0])
        setIsLoading(false)
      })
      .catch(e => {
        setIsLoading(false)
        console.log(e)})
  }, []);

  useEffect(() => {  
    if (website !== '' && instagram !== '' && twitter !== '' && facebook !== '') {
      setSocialComplete(true)    
    }
  }, [basicContactInfo]);

  useEffect(() => {  
    if (!isCompanyDetails && companyInfo.isCompanyDetails) {
      handleSave()      
    }
    if (companyInfo.main_contact && companyInfo.main_email && companyInfo.account_contact && companyInfo.accounts_email && companyInfo.customer_email) {
      setContactComplete(true)
    }
  }, [companyInfo]);

  const input = {
    public_liability_insurance: useRef(),
    professional_indemnity_insurance: useRef()
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (newInfo) {
      axios.post("/companies/contact", basicContactInfo, { headers: { Authorization: `Bearer ${auth.getToken()}` }})
      .then(() => {
        handleStateRefresh()
        // setSnackBarOpen(true)
      })
      .catch((err) => console.log(err))
    } else {
      axios.patch("/companies/array/contact", basicContactInfo,  { headers: { Authorization: `Bearer ${auth.getToken()}` } })
      // .then(() => setSnackBarOpen(true))
      .then(() => handleStateRefresh())
      .catch((err) => console.log(err))
    }
  }

  const closeSnackBar = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackBarOpen(false);
  };

  const handleStateRefresh = async () => {
    await setSnackBarOpen(true)
    await setStateRefreshInProgress(!stateRefreshInProgress)
    setTimeout(() => {
      handleComponentChange('Summary', 0)
    }, 1000)
   
  }

  function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleNext = () => {    
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  }

  const handleBack = () => {    
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  }

  const handleDocumentUpload = (e) => {
    const target = e.target.name
    const image = e.target.files;
    const document = new FormData();
    document.append("owner", auth.getUserId());
    document.append("document", image[0], image[0].name);
    setDataChange({ ...dataChange, [target]: true })

    axios
      .patch(`/companies/${userId}/document/${target}`, document, {
        headers: { Authorization: `Bearer ${auth.getToken()}` },
      })
      .then((res) => {
        // setDocuments(res.data.documents)
        setPending(true)
        setCompanyInfo({ ...companyInfo, documents: res.data.data.documents, verificationId: res.data.data.verificationId, verification: res.data.data.verification })
        setDataChange({ ...dataChange, [target]: false });
      })
      .catch((err) => {
        console.error(err);
        setDataChange({ ...dataChange, [target]: false });
      });
  };

  const handleCompanyType = (company) => {
    switch (company) {
      case 'Sole Trader': 
        setButtonColors(['#02a7f0', 'black', 'black', 'black', 'black'])
        break;
      case 'Private Company (Ltd)':
        setButtonColors(['black', '#02a7f0', 'black', 'black', 'black'])
        break;
      case 'Limited Liability Company':
        setButtonColors(['black', 'black', '#02a7f0', 'black', 'black'])
        break;
      case 'Partnership':
        setButtonColors(['black', 'black', 'black', '#02a7f0', 'black'])
        break;
      case 'Public Company (Plc)':
        setButtonColors(['black', 'black', 'black', 'black', '#02a7f0'])
        break;
      default:
        console.log(company)
        break;
    }
    setCompanyInfo({ ...companyInfo, companyType: company })    
  };

  const handleSave = () => {    
    setSaved('saving')
    
    // e.preventDefault();

    axios.patch(`/users/${userId}`,
      {
        userId,
        updates: companyInfo,
        type: 'companyInfo'
      },
      {
        headers: { Authorization: `Bearer ${auth.getToken()}` },
      })
      .then((res) => {
        setIsEditable('disabled')
        setSaved('saved')
        setSnackBarOpen(true)
        setIsCompanyDetails(true)
        handleComponentChange('Summary', 0)
      })
      .catch((error) => {
        console.log(error.message)
        setSaved('saved')
      });
  };

  const handleSocialSave = () => {
    if (newInfo) {
      axios.post("/companies/contact", basicContactInfo)
      .then(() => {
        setIsEditable('disabled')
        // setSnackBarOpen(true)
      })
      .catch((err) => console.log(err))
    } else {
      axios.patch("/companies/array/contact", basicContactInfo,  { headers: { Authorization: `Bearer ${auth.getToken()}` } })
      // .then(() => setSnackBarOpen(true))
      .then(() => setIsEditable('disabled'))
      .catch((err) => console.log(err))
    }
  }
  
  const handleChangeDetails = (selectedPage) => {
    setCurrentView(selectedPage)
  }

  const basicContactForm = (
    <Container className={classes.container}>
      <form className={classes.form} autoComplete="off" >
        <div className={classes.subforms}>
          <FormControl variant="outlined" className={classes.spacing}>
            <InputLabel htmlFor="component-outlined"> Main Email </InputLabel>
            <OutlinedInput
              label="Company Email"
              value={!companyInfo.main_email ? companyInfo.email : companyInfo.main_email }
              onChange={(e) => setCompanyInfo({ ...companyInfo, main_email: e.target.value })}
            />
          </FormControl>
          <FormControl variant="outlined" className={classes.spacing}>
            <InputLabel htmlFor="component-outlined">
              {" "}
              Main Contact Number{" "}
            </InputLabel>
            <OutlinedInput
              label="Main Contact Number"
              value={companyInfo.main_contact_number}
              onChange={(e) => setCompanyInfo({ ...companyInfo, main_contact_number: e.target.value })}
            />
          </FormControl>
          <FormControl variant="outlined" className={classes.spacing}>
            <InputLabel htmlFor="component-outlined"> Accounts Email </InputLabel>
            <OutlinedInput
              label="Accounts email (Optional)"
              value={companyInfo.accounts_email}
              onChange={(e) => setCompanyInfo({ ...companyInfo, accounts_email: e.target.value })}
            />
          </FormControl>
          <FormControl variant="outlined" className={classes.spacing}>
            <InputLabel htmlFor="component-outlined"> Accounts Contact Number </InputLabel>
            <OutlinedInput
              label="Accounts Contact Number (Optional)"
              value={companyInfo.accounts_contact_number}
              onChange={(e) => setCompanyInfo({ ...companyInfo, accounts_contact_number: e.target.value })}
            />
          </FormControl>
        </div>
        
        <div className={classes.subforms}>
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
        </div>        
      </form>

      <Button
          className={classes.button}
          type='submit'
          variant="contained"
          color="primary"
          onClick={(e) => handleSubmit(e)}
        >
          Save
      </Button>
    </Container>
  )

  const nameStep = (
    <>
      <FormControl variant="outlined" style={{margin: '20px'}}>
        <InputLabel htmlFor="first_name"> First Name </InputLabel>
        <OutlinedInput
          id="first_name"
          name="first_name"
          label="First Name"
          value={companyInfo.first_name ? companyInfo.first_name : ''}
          onChange={(e) => {
            setCompanyInfo({ ...companyInfo, first_name: e.target.value })}}
        ></OutlinedInput>
      </FormControl>

      <FormControl variant="outlined" style={{margin: '20px'}}>
        <InputLabel htmlFor="surname"> Surname </InputLabel>
        <OutlinedInput
          id="surname"
          name="surname"
          label="Surname"
          value={companyInfo.surname ? companyInfo.surname : ''}
          onChange={(e) => {
            setCompanyInfo({ ...companyInfo, surname: e.target.value })}}
        ></OutlinedInput>
      </FormControl> 

      <Button
        className={classes.button}
        style={{margin: '50px 20px'}}
        onClick={handleNext}
        variant="contained"
        color="primary"
      >
        Next
      </Button>     
    </>
  )

  const vatStep = (
    <>
      <FormControl variant="outlined" style={{margin: '20px'}}>
        <InputLabel htmlFor="vat_number"> VAT Number (Optional) </InputLabel>
        <OutlinedInput
          id="vat_number"
          name="vat_number"
          label="VAT Number (Optional)"
          autoComplete
          value={companyInfo.vat_number ? companyInfo.vat_number : ''}
          onChange={(e) => {            
            setCompanyInfo({ ...companyInfo, vat_number: e.target.value })}}
        ></OutlinedInput>
      </FormControl> 

      <div style={{margin: '50px 20px'}} className={classes.buttonContainer}>
        <Button
          className={classes.button}
          style={{marginRight: '5px'}}           
          onClick={handleBack}
          variant="contained"
          color="secondary"
        >
          Back
        </Button>
        <Button
          className={classes.button}
          style={{marginLeft: '5px'}} 
          onClick={handleNext}
          variant="contained"
          color="primary"
        >
          Next
        </Button>
      </div>           
    </>
  )

  const companyType = (
    <>
      <Typography variant='h6' style={{marginLeft: '20px'}}> Type of Company </Typography> 
      <Button
        className={classes.companyButton}
        style={{borderColor: buttonColors[0], color: buttonColors[0]}}
        onClick={(e) => handleCompanyType('Sole Trader')}
      >
        Sole Trader
      </Button>
      <Button
        className={classes.companyButton}
        style={{borderColor: buttonColors[1], color: buttonColors[1]}}
        onClick={(e) => handleCompanyType('Private Company (Ltd)')}
      >
        Private Company (Ltd)
      </Button>
      <Button
        className={classes.companyButton}
        style={{borderColor: buttonColors[2], color: buttonColors[2]}}
        onClick={(e) => handleCompanyType('Limited Liability Company')}
      >
        Limited Liability Company
      </Button>
      <Button
        className={classes.companyButton}
        style={{borderColor: buttonColors[3], color: buttonColors[3]}}
        onClick={(e) => handleCompanyType('Partnership')}
      >
        Partnership
      </Button>
      <Button
        className={classes.companyButton}
        style={{borderColor: buttonColors[4], color: buttonColors[4]}}
        onClick={(e) => handleCompanyType('Public Company (Plc)')}
      >
        Public Company (Plc)
      </Button>

      {(companyInfo.companyType && companyInfo.companyType !== 'Sole Trader') && <>   
        <Typography variant='h6' style={{marginTop: '50px', marginLeft: '20px'}}> Company Registration Number </Typography>   
        <FormControl variant="outlined" style={{margin: '20px'}}>
          <InputLabel htmlFor="component-outlined"> Company Registration Number </InputLabel>
          <OutlinedInput
            label="Company Registration Number"
            value={companyInfo.company_registration_number ? companyInfo.company_registration_number: ''}
            onChange={(e) => setCompanyInfo({ ...companyInfo, company_registration_number: e.target.value })}
          />
        </FormControl>
      </>}

      <div style={{margin: '50px 20px'}} className={classes.buttonContainer}>
        <Button
          className={classes.button}  
          style={{marginRight: '5px'}}         
          onClick={handleBack}
          variant="contained"
          color="secondary"
        >
          Back
        </Button>
        <Button
          className={classes.button}
          style={{marginLeft: '5px'}} 
          onClick={handleNext}
          variant="contained"
          color="primary"
        >
          Next
        </Button>
      </div>        
    </>
  )

  const pulicInsurance = (
    <>
      <Typography variant='h6'> Add Public Liability Details </Typography>
      <FormControl style={{margin: '20px'}} variant="outlined">
        <InputLabel htmlFor="component-outlined" id="level">
          Public Liability Insurance
        </InputLabel>
        <Select
          label='Public Liability Insurance'
          id="select-level"
          value={companyInfo['public_liability_insurance'] ? companyInfo['public_liability_insurance'] : ''}
          onChange={(e) => setCompanyInfo({ ...companyInfo, public_liability_insurance: e.target.value })}
        >
          <MenuItem value='No insurance'>I don't have any insurance</MenuItem>
          <MenuItem value='£250,000'>£250,000</MenuItem>
          <MenuItem value='£500,000'>£500,000</MenuItem>
          <MenuItem value='£1,000,000'>£1,000,000</MenuItem>
          <MenuItem value='£2,000,000'>£2,000,000</MenuItem>
          <MenuItem value='£5,000,000'>£5,000,000</MenuItem>
          <MenuItem value='£10,000,000'>£10,000,000</MenuItem>
          <MenuItem value='Other'>Other</MenuItem>
        </Select>
      </FormControl>

      <input
        name='public_liability_insurance'
        // ref={eval(`${item}Input`)} -- BAD EVAL
        ref={input['public_liability_insurance']}
        style={{ display: "none" }}
        onChange={(e) => handleDocumentUpload(e)}
        type="file"
      />
      <div style={{margin:'20px'}}>
        {companyInfo.documents && companyInfo.documents['public_liability_insurance'] ?
          <div className={classes.wrapper}>
            <a target="_blank" rel="noopener noreferrer" href={companyInfo.documents['public_liability_insurance']}><Button variant='outlined'
              color="primary" disabled={dataChange['public_liability_insurance']}> View current uploaded certificate</Button></a>
              { companyInfo.verification['indemnityDocumentCheck'] ? <div className={classes.verify}><CheckIcon /><p>Verified</p></div> : companyInfo.verificationId?.companyInfo || pending ? <div className={classes.verify}><HourglassEmptyIcon /><p>Pending</p></div> : <div className={classes.verify}><CrossIcon /><p>Rejected</p></div> }
            {dataChange['public_liability_insurance'] && <CircularProgress size={24} className={classes.buttonProgress} />}
          </div> :
          <p>no document uploaded</p>
        }
        <div style={{alignItems: 'center', justifyContent: 'center', display: 'flex'}}>
          <Button 
            onClick={() => input['public_liability_insurance'].current.click()}>
            <BackupIcon style={{height: '50px', width: '50px'}} />
          </Button>
        </div>
      </div>

      <div style={{margin: '50px 20px'}} className={classes.buttonContainer}>
        <Button
          className={classes.button}  
          style={{marginRight: '5px'}}         
          onClick={handleBack}
          variant="contained"
          color="secondary"
        >
          Back
        </Button>
        <Button
          className={classes.button}
          style={{marginLeft: '5px'}} 
          onClick={handleNext}
          variant="contained"
          color="primary"
        >
          Next
        </Button>
      </div>     
    </>
  )

  const indemnityInsurance = (
    <>
      <Typography variant='h6'> Add Professional Indemnity Details </Typography>
      <FormControl style={{margin: '20px'}} variant="outlined">
        <InputLabel htmlFor="component-outlined" id="level">
          Professional Indemnity Insurance
        </InputLabel>
        <Select
          label='Professional Indemnity Insurance'
          id="select-level"
          value={companyInfo['professional_indemnity_insurance'] ? companyInfo['professional_indemnity_insurance'] : ''}
          onChange={(e) => setCompanyInfo({ ...companyInfo, professional_indemnity_insurance: e.target.value })}
        >
          <MenuItem value='No insurance'>I don't have any insurance</MenuItem>
          <MenuItem value='£250,000'>£250,000</MenuItem>
          <MenuItem value='£500,000'>£500,000</MenuItem>
          <MenuItem value='£1,000,000'>£1,000,000</MenuItem>
          <MenuItem value='£2,000,000'>£2,000,000</MenuItem>
          <MenuItem value='£5,000,000'>£5,000,000</MenuItem>
          <MenuItem value='£10,000,000'>£10,000,000</MenuItem>
          <MenuItem value='Other'>Other</MenuItem>
        </Select>
      </FormControl>

      <input
        name='professional_indemnity_insurance'
        // ref={eval(`${item}Input`)} -- BAD EVAL
        ref={input['professional_indemnity_insurance']}
        style={{ display: "none" }}
        onChange={(e) => handleDocumentUpload(e)}
        type="file"
      />
      <div style={{margin:'20px'}}>
        {companyInfo.documents && companyInfo.documents['professional_indemnity_insurance'] ?
          <div className={classes.wrapper}>
            <a target="_blank" rel="noopener noreferrer" href={companyInfo.documents['professional_indemnity_insurance']}><Button variant='outlined'
              color="primary" disabled={dataChange['professional_indemnity_insurance']}> View current uploaded certificate</Button></a>
              { companyInfo.verification['indemnityDocumentCheck'] ? <div className={classes.verify}><CheckIcon /><p>Verified</p></div> : companyInfo.verificationId?.companyInfo || pending ? <div className={classes.verify}><HourglassEmptyIcon /><p>Pending</p></div> : <div className={classes.verify}><CrossIcon /><p>Rejected</p></div> }
            {dataChange['public_liability_insurance'] && <CircularProgress size={24} className={classes.buttonProgress} />}
          </div> :
          <p>no document uploaded</p>
        }
        <div style={{alignItems: 'center', justifyContent: 'center', display: 'flex'}}>
          <Button 
            onClick={() => input['professional_indemnity_insurance'].current.click()}>
            <BackupIcon style={{height: '50px', width: '50px'}} />
          </Button>
        </div>
      </div>

      <div style={{margin: '50px 20px', minHeight: '40px'}} className={classes.buttonContainer}>
        <Button
          className={classes.button}
          style={{marginRight: '5px'}}          
          onClick={handleBack}
          variant="contained"
          color="secondary"
        >
          Back
        </Button>
        <Button
          className={classes.button}
          style={{marginLeft: '5px'}} 
          onClick={(e) => {
            setCompanyInfo({ ...companyInfo, isCompanyDetails: true })}}
          variant="contained"
          color="primary"
        >
          {saved === 'saving' ? <span> <CircularProgress size={20} className={classes.buttonProgressWhite} /></span> : saved === 'saved' ? <CheckCircleIcon fontSize='large' /> : 'Save'}
        </Button> 
      </div>    
    </>
  )


  function getStepContent(stepIndex) {
    switch (stepIndex) {
      case 0:
        return nameStep;
      case 1:
        return vatStep;
      case 2:
        return companyType;
      case 3:
        return pulicInsurance;
      case 4: 
        return indemnityInsurance;
      default:
        return 'Unknown stepIndex';
    }
  }

  return (
    <div className={classes.root}>
      {isLoading && <div>
        <CircularProgress style= {{position: 'absolute', left: 'calc(50% - 50px)', top: 'calc(50% - 50px)', width: '100px', height: '100px', margin: 'auto'}}/>
      </div>} 
      {(!isCompanyDetails && !isLoading) && 
      <div className={classes.stepContainer}>      
        <Typography style={{ textAlign: "center", marginTop: '50px', marginBottom: '80px', padding: '0 50px'}} variant='h5'> Provide your company details </Typography>
        <>
          {/* <form
            autoComplete='off'
            // onChange={(e) => handleFormChange(e)}
            // onSubmit={(e) => handleFormSubmit(e)}
            className={classes.form}> */}
            {getStepContent(activeStep)}
          {/* </form> */}
        </>

        <Stepper style={{ width: '100%', backgroundColor: 'transparent' }} activeStep={activeStep} alternativeLabel>
          {steps.map((label, index) => (
            <Step key={index}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>    
      </div>}
      
      {(isCompanyDetails && !isLoading) && <div style={{padding: '20px'}}>
        {currentView === 'profile' && <div>
          <Typography style={{fontSize: '26px', fontWeight: 'bold', marginTop: '20px'}}>Your Details</Typography>
          <Typography style={{fontSize: '16px'}}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. </Typography>
          
          <Grid container
            spacing={3} className={classes.DetailContainer}>  

            <Grid item sm={4} xs={12}>
              <Paper variant="outlined" className={`${classes.paper} ${classes.linkbox}`} onClick={() => handleChangeDetails('company')}>
                <div className={classes.titleBox}>
                  <div></div>
                  <Box className={`${classes.roundBox} ${classes.complete}`} border={1} borderRadius="50%">✓</Box>
                </div>
                <Typography variant="p" style={{marginTop: '30px'}}>COMPANY DETAILS</Typography>
              </Paper>
            </Grid>

            <Grid item sm={4} xs={12}>
              <Paper variant="outlined" className={`${classes.paper} ${classes.linkbox}`} onClick={() => handleChangeDetails('contact')}>
                <div className={classes.titleBox}>
                  <div></div>
                  {contactComplete ? <Box className={`${classes.roundBox} ${classes.complete}`} border={1} borderRadius="50%">✓</Box> : <Box className={`${classes.roundBox} ${classes.outstanding}`} border={1} borderRadius="50%">!</Box>}
                </div>
                <Typography variant="p">CONTACT DETAILS</Typography>
              </Paper>
            </Grid>

            <Grid item sm={4} xs={12}>
              <Paper variant="outlined" className={`${classes.paper} ${classes.linkbox}`} onClick={() => handleChangeDetails('social')}>
                <div className={classes.titleBox}>
                  <div></div>
                  {socialComplete ? <Box className={`${classes.roundBox} ${classes.complete}`} border={1} borderRadius="50%">✓</Box> : <Box className={`${classes.roundBox} ${classes.outstanding}`} border={1} borderRadius="50%">!</Box>}
                </div>
                <Typography variant="p">WEB AND SOCIAL DETAILS</Typography>
              </Paper>
            </Grid>     
          </Grid>
        </div>}

        {currentView === "company" && <div>
          <Button
            style={{marginLeft: '-24px'}}
            onClick={() => {
              setIsEditable('disabled')
              setCurrentView('profile')}}><ChevronLeftIcon/>
          </Button>
          <Typography style={{fontSize: '26px', fontWeight: 'bold', marginTop: '20px'}}>Company Details</Typography>
          <Typography style={{fontSize: '16px'}}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. </Typography>
          <div style={{display: 'flex', justifyContent: 'space-between'}}><div></div><Button><u>Edit</u></Button></div>

          <Grid container
            spacing={3} className={classes.companyDetailContainer}>  

            <Grid item sm={4} xs={12}>
              <div>
                <Typography className={classes.detailTitle}>Company Name</Typography>
                <Typography className={classes.detailText}>{companyInfo.name}</Typography>
              </div>
            </Grid>

            <Grid item sm={4} xs={12}>
              <div>
                <Typography className={classes.detailTitle}>VAT Number</Typography>
                <Typography className={classes.detailText}>{companyInfo.vat_number}</Typography>
              </div>
            </Grid>

            <Grid item sm={4} xs={12}>
              <div>
                <Typography className={classes.detailTitle}>Company Type</Typography>
                <Typography className={classes.detailText}>{companyInfo.companyType}</Typography>
              </div>
            </Grid>

            {companyInfo.company_registration_number && <Grid item sm={4} xs={12}>
              <div>
                <Typography className={classes.detailTitle}>Company Registration Number</Typography>
                <Typography className={classes.detailText}>{companyInfo.company_registration_number}</Typography>
              </div>
            </Grid>}

            <Grid item sm={4} xs={12}>
              <div>
                <Typography className={classes.detailTitle}>Public Liability Insurance</Typography>
                <Typography className={classes.detailText}>{companyInfo.public_liability_insurance}</Typography>
              </div>
              <div style={{display: 'flex', alignItems: 'center'}}>
                <InsertPhotoOutlined style={{fontSize: '30px'}}/>
                <Typography className={classes.detailText} style={{paddingLeft: '10px', paddingRight: '10px'}}>{companyInfo.verification['liabilityDocumentCheck'] ? "Certification Certified" : companyInfo.verificationId?.companyInfo ? "Pending" : "Rejected"}</Typography>
                {companyInfo.verification['liabilityDocumentCheck'] ? <CheckIcon style={{fontSize: '30px'}}/> : companyInfo.verificationId?.companyInfo ? <Box className={`${classes.roundBox} ${classes.pending}`} border={1} borderRadius="50%"><span role="img" aria-label="hourglass emoji">⌛</span></Box> : <CloseIcon style={{fontSize: '30px'}}/>}
              </div>
            </Grid>     

            <Grid item sm={4} xs={12}>
              <div>
                <Typography className={classes.detailTitle}>Professional Indemnity Insurance</Typography>
                <Typography className={classes.detailText}>{companyInfo.professional_indemnity_insurance}</Typography>
              </div>
              <div style={{display: 'flex', alignItems: 'center'}}>
                <InsertPhotoOutlined style={{fontSize: '30px'}}/>
                <Typography className={classes.detailText} style={{paddingLeft: '10px', paddingRight: '10px'}}>{companyInfo.verification['indemnityDocumentCheck'] ? "Certification Certified" : companyInfo.verificationId?.companyInfo ? "Pending" : "Rejected"}</Typography>
                {companyInfo.verification['indemnityDocumentCheck'] ? <CheckIcon style={{fontSize: '30px'}}/> : companyInfo.verificationId?.companyInfo ? <Box className={`${classes.roundBox} ${classes.pending}`} border={1} borderRadius="50%"><span role="img" aria-label="hourglass emoji">⌛</span></Box> : <CloseIcon style={{fontSize: '30px'}}/>}
              </div>
            </Grid> 
          </Grid>
        </div>}

        {currentView === "contact" && <div>
          <Button
            style={{marginLeft: '-24px'}}
            onClick={() => {
              setIsEditable('disabled')
              setCurrentView('profile')}}><ChevronLeftIcon/>
          </Button>
          <Typography style={{fontSize: '26px', fontWeight: 'bold', marginTop: '20px'}}>Contact Details</Typography>
          <Typography style={{fontSize: '16px'}}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. </Typography>
          <div style={{display: 'flex', justifyContent: 'space-between'}}><div></div><Button onClick={() => setIsEditable('')}><u>Edit</u></Button></div>

          <Grid container
            spacing={3} className={classes.companyDetailContainer}>  

            <Grid item sm={4} xs={12}>
              <FormControl variant="outlined" className={classes.contactSpacing}>
                <InputLabel htmlFor="component-outlined"> Main Contact </InputLabel>
                <OutlinedInput
                  label="Main Contact"
                  disabled={isEditable}
                  value={companyInfo.main_contact ? companyInfo.main_contact : ''}
                  onChange={(e) => setCompanyInfo({ ...companyInfo, main_contact: e.target.value })}
                />
              </FormControl>
            </Grid> 

            <Grid item sm={4} xs={12}>
              <FormControl variant="outlined" className={classes.contactSpacing}>
                <InputLabel htmlFor="component-outlined"> Main Contact Email </InputLabel>
                <OutlinedInput
                  label="Company Contact Email"
                  disabled={isEditable}
                  value={companyInfo.main_email ? companyInfo.main_email : ''}
                  onChange={(e) => setCompanyInfo({ ...companyInfo, main_email: e.target.value })}
                />
              </FormControl>
            </Grid>

            <Grid item sm={4} xs={12}>
              <FormControl variant="outlined" className={classes.contactSpacing}>
                <InputLabel htmlFor="component-outlined"> Accounts Contact </InputLabel>
                <OutlinedInput
                  label="Accounts Contact"
                  disabled={isEditable}
                  value={!companyInfo.account_contact ? "" : companyInfo.account_contact }
                  onChange={(e) => setCompanyInfo({ ...companyInfo, account_contact: e.target.value })}
                />
              </FormControl>
            </Grid>


            <Grid item sm={4} xs={12}>
              <FormControl variant="outlined" className={classes.contactSpacing}>
                <InputLabel htmlFor="component-outlined"> Accounts Contact Email </InputLabel>
                <OutlinedInput
                  label="Accounts Contact Email"
                  disabled={isEditable}
                  value={!companyInfo.accounts_email ? '' : companyInfo.accounts_email }
                  onChange={(e) => setCompanyInfo({ ...companyInfo, accounts_email: e.target.value })}
                />
              </FormControl>
            </Grid>


            <Grid item sm={4} xs={12}>
              <FormControl variant="outlined" className={classes.contactSpacing}>
                <InputLabel htmlFor="component-outlined"> Customer Contact Email </InputLabel>
                <OutlinedInput
                  label="Customer Contact Email"
                  disabled={isEditable}
                  value={!companyInfo.customer_email ? '' : companyInfo.customer_email }
                  onChange={(e) => setCompanyInfo({ ...companyInfo, customer_email: e.target.value })}
                />
              </FormControl>
            </Grid>            
          </Grid>

          {isEditable === '' && <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px'}}>
            <Button style={{backgroundColor: '#02a7f0', color: 'white', minWidth: '300px'}}
              onClick={() => handleSave()}>Save</Button>
          </div>}
        </div>}

        {currentView === "social" && <div>
          <Button
            style={{marginLeft: '-24px'}}
            onClick={() => {
              setIsEditable('disabled')
              setCurrentView('profile')}}><ChevronLeftIcon/>
          </Button>
          <Typography style={{fontSize: '26px', fontWeight: 'bold', marginTop: '20px'}}>Social Details</Typography>
          <Typography style={{fontSize: '16px'}}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. </Typography>
          <div style={{display: 'flex', justifyContent: 'space-between'}}><div></div><Button onClick={() => setIsEditable('')}><u>Edit</u></Button></div>

          <Grid container
            spacing={3} className={classes.companyDetailContainer}>  

            <Grid item sm={4} xs={12}>
              <FormControl variant="outlined" className={classes.contactSpacing}>
                <InputLabel htmlFor="component-outlined"> Website link </InputLabel>
                <OutlinedInput
                  label="Website link"
                  disabled={isEditable}
                  value={website}
                  onChange={(e) => setBasicContactInfo({ ...basicContactInfo, website: e.target.value })}
                ></OutlinedInput>
              </FormControl>
            </Grid> 

            <Grid item sm={4} xs={12}>
              <FormControl variant="outlined" className={classes.contactSpacing}>
                <InputLabel htmlFor="component-outlined"> Instagram handle </InputLabel>
                <OutlinedInput
                  label=" Instagram handle "
                  disabled={isEditable}
                  value={instagram}
                  onChange={(e) => setBasicContactInfo({ ...basicContactInfo, instagram: e.target.value })}
                />
              </FormControl>
            </Grid>

            <Grid item sm={4} xs={12}>
              <FormControl variant="outlined" className={classes.contactSpacing}>
                <InputLabel htmlFor="component-outlined"> Twitter handle </InputLabel>
                <OutlinedInput
                  label="Twitter handle"
                  disabled={isEditable}
                  value={twitter}
                  onChange={(e) => setBasicContactInfo({ ...basicContactInfo, twitter: e.target.value })}
                />
              </FormControl>
            </Grid>


            <Grid item sm={4} xs={12}>
              <FormControl variant="outlined" className={classes.contactSpacing}>
                <InputLabel htmlFor="component-outlined"> Facebook handle </InputLabel>
                <OutlinedInput
                  label="Facebook handle"
                  disabled={isEditable}
                  value={facebook}
                  onChange={(e) => setBasicContactInfo({ ...basicContactInfo, facebook: e.target.value })}
                />
              </FormControl>
            </Grid>           
          </Grid>

          {isEditable === '' && <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px'}}>
            <Button style={{backgroundColor: '#02a7f0', color: 'white', minWidth: '300px'}}
              onClick={() => handleSocialSave()}>Save</Button>
          </div>}
        </div>}
        

        <Snackbar open={snackBarOpen} autoHideDuration={1000} onClose={closeSnackBar}>
          <Alert onClose={closeSnackBar} severity="success">
            Details updated
          </Alert>
        </Snackbar>
      </div>
      }
    </div>
  );
}

{/* <AppBar position="static" color="default">
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
            <Tab label="Your Terms And Conditions" icon={<AddLocationSharpIcon />} {...a11yProps(1)} />
          </Tabs>
        </AppBar>

       
        <TabPanel value={value} index={0}>
          <CompanyDetailsEditBeta handleComponentChange={handleComponentChange} />
        </TabPanel>

      
        <TabPanel className={classes.formContainer} value={value} index={1}>
          {basicContactForm}
        </TabPanel>

        <TabPanel className={classes.formContainer} value={value} index={2}>
          <Container className={classes.form}>
          <Typography>Please enter the Terms & Conditions you wish to be agreed when a customer books onto one of your courses.</Typography>
          <TextareaAutosize 
            onChange={(e) => setBasicContactInfo({ ...basicContactInfo, terms: e.target.value })} 
            defaultValue={terms} 
            style={{ width: '100%', marginBottom: '10px'}} 
            rowsMin={20}
            />
          <Button
          className={classes.button}
          type='submit'
          variant="contained"
          color="primary"
          onClick={(e) => handleSubmit(e)}
          >
          Save
          </Button>
          </Container>
        </TabPanel> */}
