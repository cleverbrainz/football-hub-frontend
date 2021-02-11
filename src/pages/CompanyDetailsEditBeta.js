import React, { useEffect, useRef, useState } from "react";
import { Link, withRouter } from "react-router-dom";
import {
  Checkbox,
  Button,
  FormControl,
  FormControlLabel,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  OutlinedInput,
  Container,
  Snackbar
} from "@material-ui/core";
import MuiAlert from '@material-ui/lab/Alert';
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from '@material-ui/core/CircularProgress'
import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import { storage } from "../lib/firebase";
import axios from "axios";
import auth from '../lib/auth'
import Avatar from '@material-ui/core/Avatar';
import BackupIcon from "@material-ui/icons/Backup";
const useStyles = makeStyles((theme) => ({
  spacing: {
    margin: "10px 0",
    textAlign: "center",
    width: '100%'
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 300,
  },
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-evenly",
    textAlign: "center",
  },
  form: {
    width: "90%",
    minWidth: "300px",
    display: "flex",
    // flexDirection: "column",
    height: "55%",
    justifyContent: "space-between",
  },
  subforms: {
    width: '50%',
    display: 'flex',
    flexDirection: 'column'
  },
  button: {
    position: "relative",
    margin: "10px 0",
    minWidth: '100px',
    minHeight: '50px'
  },
  upload: {
    margin: "20px auto",
  },
  center: {
    margin: "0 auto",
  },
  avatar: {
    // [theme.breakpoints.up('sm')]: {
    //   width: theme.spacing(38),
    //   height: theme.spacing(38),
    // },
    width: theme.spacing(30),
    height: theme.spacing(30),
    margin: '0 auto',
    '&:hover': {
      cursor: 'pointer',
      filter: 'grayscale(50%)'
    },
    // boxShadow: '1px 1px 2px 2px grey'
  },
  wrapper: {
    margin: theme.spacing(1),
    position: 'relative',
  },
  buttonProgress: {
    color: 'green',
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
  buttonProgressWhite: {
    color: 'white',
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
}));
function CompanyDetailsEdit({ handleComponentChange }) {
  const classes = useStyles();
  const userId = auth.getUserId()
  const [image, setImage] = React.useState(null);
  const [url, setUrl] = React.useState("");
  const [dataChange, setDataChange] = useState({ public_liability_insurance: false, public_indemnity_insurance: false });
  const [saved, setSaved] = useState('unsaved')
  const [imageUpload, setImageUpload] = useState(false)
  const [companyInfo, setCompanyInfo] = useState(null)
  const [uploadedDocs, setUploadedDocs] = useState([])
  const [snackBarOpen, setSnackBarOpen] = useState(false)
  useEffect(() => {
    // (console.log('usefect'))
    axios.get(`/users/${auth.getUserId()}`)
      .then(res => {
        console.log(res.data[0])
        setCompanyInfo(res.data[0])
      })
  }, [!dataChange])

  const input = {
    public_liability_insurance: useRef(),
    professional_indemnity_insurance: useRef()
  }

  // const public_liability_insuranceInput = useRef();
  // const 
  const [state, setState] = React.useState({
    checked: false,
    details: null,
  });
  const handleSubmit = (e) => {
    setSaved('saving')
    e.preventDefault();

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
        console.log(res.data);
        setSaved('saved')
        setSnackBarOpen(true)
      })
      .catch((error) => {
        console.log(error.message)
      });
  };
  const handleDocumentUpload = (e) => {
    console.log("hellooo", e.target.name);
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
        console.log(res.data);
        console.log(res.data.data.documents)
        // setDocuments(res.data.documents)
        setCompanyInfo({ ...companyInfo, documents: res.data.data.documents, verificationId: res.data.data.verificationId })
        setDataChange({ ...dataChange, [target]: false });
      })
      .catch((err) => {
        console.error(err);
        setDataChange({ ...dataChange, [target]: false });
      });
  };

  function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

  const closeSnackBar = (event, reason) => {
    if (reason === 'clickaway') return;
    handleComponentChange('Summary', 0)
  };

  if (!companyInfo) return null
  return (
    <Container className={classes.container}>
      <form className={classes.form} autoComplete="off" >
        <div className={classes.subforms}>
          <FormControl variant="outlined" className={classes.spacing}>
            <InputLabel htmlFor="component-outlined"> Company Name </InputLabel>
            <OutlinedInput
              label="Company Name"
              value={companyInfo.name}
              onChange={(e) => setCompanyInfo({ ...companyInfo, name: e.target.value })}
            ></OutlinedInput>
          </FormControl>
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
          {/* <FormControl variant="outlined" className={classes.spacing}>
            <InputLabel htmlFor="component-outlined"> Company Registration Number </InputLabel>
            <OutlinedInput
              label="Company Registration Number"
              value={companyInfo.company_registration_number}
              onChange={(e) => setCompanyInfo({ ...companyInfo, company_registration_number: e.target.value })}
            />
          </FormControl> */}
          <FormControl variant="outlined" className={classes.spacing}>
            <InputLabel htmlFor="component-outlined"> VAT Number (Optional)</InputLabel>
            <OutlinedInput
              label="Vat Number (Optional)"
              value={companyInfo.vat_number}
              onChange={(e) => setCompanyInfo({ ...companyInfo, vat_number: e.target.value })}
            />
          </FormControl>
        </div>
        <div className={classes.subforms}>
          <FormControl className={classes.spacing} variant="outlined">
            <InputLabel htmlFor="component-outlined" id="level">
              Type Of Company
                  </InputLabel>
            <Select
              label='Type Of Company'
              id="select-level"
              value={companyInfo.companyType}
              onChange={(e) => setCompanyInfo({ ...companyInfo, companyType: e.target.value })}
            >
              <MenuItem value='Sole Trader'>Sole Trader</MenuItem>
              <MenuItem value='Limited Company'>Limited Company</MenuItem>
              <MenuItem value='LLP'>Limited Liability Partnership</MenuItem>
              <MenuItem value='Partnership'>Partnership</MenuItem>
            </Select>
          </FormControl>
          {companyInfo.companyType !== 'Sole Trader' && <FormControl variant="outlined" className={classes.spacing}>
            <InputLabel htmlFor="component-outlined"> Company Registration Number </InputLabel>
            <OutlinedInput
              label="Company Registration Number"
              value={companyInfo.company_registration_number}
              onChange={(e) => setCompanyInfo({ ...companyInfo, company_registration_number: e.target.value })}
            />
          </FormControl>}
          {['public_liability_insurance', 'professional_indemnity_insurance'].map(item => {
            const sentence = item.split('_').map(word => word[0].toUpperCase() + word.slice(1)).join(' ')
            return (
              <Container >
                <FormControl className={classes.spacing} variant="outlined">
                  <InputLabel htmlFor="component-outlined" id="level">
                    {sentence}
                  </InputLabel>
                  <Select
                    label={sentence}
                    id="select-level"
                    value={companyInfo[item]}
                    onChange={(e) => setCompanyInfo({ ...companyInfo, [item]: e.target.value })}
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
                  name={item}
                  // ref={eval(`${item}Input`)} -- BAD EVAL
                  ref={input[item]}
                  style={{ display: "none" }}
                  onChange={(e) => handleDocumentUpload(e)}
                  type="file"
                />
                <div>
                  {companyInfo.documents && companyInfo.documents[item] ?
                    <div className={classes.wrapper}>
                      <a target="_blank" rel="noopener noreferrer" href={companyInfo.documents[item]}><Button variant='outlined'
                        color="primary" disabled={dataChange[item]}> View current uploaded certificate</Button></a>
                      {dataChange[item] && <CircularProgress size={24} className={classes.buttonProgress} />}
                    </div> :
                    <p>no document uploaded</p>
                  }
                  <Button
                    variant="contained"
                    color="secondary"
                    // onClick={() => eval(`${item}Input`).current.click()} -- BAD EVAL
                    onClick={() => input[item].current.click()}
                  >
                    <BackupIcon />
                    UPLOAD {sentence.toUpperCase()} CERTIFICATE
                </Button>
                </div>

              </Container>
            )
          })}

        </div>


      </form>
      <Container style={{ alignItems: 'center', display: 'flex', justifyContent: 'center', minWidth: '60px' }}>
        <Button
          className={classes.button}
          onClick={handleSubmit}
          // onClick={() => handleComponentChange('Summary', 0)}
          variant="contained"
          color="primary"
        >
          {saved === 'saving' ? <span> <CircularProgress size={24} className={classes.buttonProgressWhite} /></span> : saved === 'saved' ? <CheckCircleIcon fontSize='large' /> : 'Save'}
        </Button>

      </Container>
      <Snackbar open={snackBarOpen} autoHideDuration={1000} onClose={closeSnackBar}>
        <Alert onClose={closeSnackBar} severity="success">
          Details updated
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default CompanyDetailsEdit