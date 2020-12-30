import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
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
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from '@material-ui/core/CircularProgress';
import { storage } from "../lib/firebase";
import axios from "axios";
import auth from '../lib/auth'
import Avatar from '@material-ui/core/Avatar';
import BackupIcon from "@material-ui/icons/Backup";

const useStyles = makeStyles((theme) => ({
  spacing: {
    margin: "10px 0",
    textAlign: "center",
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 300,
  },
  container: {
    margin: "100px auto",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-evenly",
    height: `${window.innerHeight - 100}px`,
    textAlign: "center",
  },
  form: {
    width: "60%",
    minWidth: "300px",
    display: "flex",
    flexDirection: "column",
    height: "55%",
    justifyContent: "space-around",
  },
  button: {
    position: "relative",
    margin: "10px 0",
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
}));

export default function CompanyDetailsEdit({history}) {
  const classes = useStyles();

  console.log()

  // const { userId, imageURL, category } = 
  const userId = auth.getUserId()
  const [image, setImage] = React.useState(null);
  const [url, setUrl] = React.useState("");
  const [dataChange, setDataChange] = useState({ public_liability_insurance: false, public_indemnity_insurance: false });
  // const [avatarImage, setAvatarImage] = useState(imageURL)
  // const [name, setName] = React.useState();
  // const [level, setLevel] = React.useState(coachInfo.coaching_level);
  // const [documents, setDocuments] = React.useState(coachInfo.documents);
  // const [verified, setVerified] = React.useState(verified);
  const [imageUpload, setImageUpload] = useState(false)
  // const [dataChange, setDataChange] = useState(false)
  const [companyInfo, setCompanyInfo] = useState(null)
  const [uploadedDocs, setUploadedDocs] = useState([])
    // name: location.state.name,
    // main_email: location.state.email,
    // main_contact_number: location.state.main_contact_number,
    // accounts_email:location.state.accounts_email,
    // accounts_contact_number: location.state.accounts_contact_number,
    // company_registration_number: location.state.company_registration_number,
    // vat_number: location.state.vat_number,
    // professional_indemnity_insurance: location.state.professional_indemnity_insurance,
    // public_liability_insurance: location.state.public_liability_insurance,

  useEffect(() => {
    (console.log('usefect'))
    axios.get(`/users/${auth.getUserId()}`)
      .then(res => {
        console.log(res.data[0])
        setCompanyInfo(res.data[0])
      })
  },[!dataChange])


  const public_liability_insuranceInput = useRef();
  const professional_indemnity_insuranceInput = useRef();
  // const imageInput = useRef();

  const [state, setState] = React.useState({
    checked: false,
    details: null,
  });

  const handleSubmit = (e) => {
    // const updates = category === 'company' ?  {
    //     'coachInfo.imageURL': avatarImage,
    //     'coachInfo.name': name,
    //     email: email,
    //     main_contact_number: phone,
    //     'coachInfo.coaching_level': level,
    //     'coachInfo.documents': documents
    //   } :
    //   {
    //     'coachInfo.imageURL': avatarImage,
    //     'coachInfo.name': name,
    //     name: name,
    //     email: email,
    //     main_contact_number: phone,
    //     'coachInfo.coaching_level': level,
    //     'coachInfo.documents': documents
    //   }
    e.preventDefault();
    // console.log(imageURL)
    axios
      .patch(
        `/users/${userId}`,
        { userId,
          updates: companyInfo
        },
        { headers: { Authorization: `Bearer ${auth.getToken()}` } }
      )
      .then((res) => {
        console.log(res.data);
        history.push("/tester")
        
      })
      .catch((error) => {
        alert(error.message);
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
        // setDocuments(res.data.documents)
        setCompanyInfo({...companyInfo, documents: res.data.documents})
        
        setDataChange({ ...dataChange, [target]: false });
      })
      .catch((err) => {
        console.error(err);
        setDataChange({ ...dataChange, [target]: false });
      });
  };

  // const handleChange = (event) => {
  //   setState({ ...state, [event.target.name]: event.target.checked });
  // };

  // const handleMediaChange = (e) => {
  //   setImageUpload(true)
  //   const image = e.target.files
  //   const picture = new FormData()
  //   picture.append('owner', auth.getUserId())
  //   picture.append('picture', image[0], image[0].name)

  //   axios.post(`/coaches/image/${userId}`, picture, { headers: { Authorization: `Bearer ${auth.getToken()}` } })
  //     .then(res => {
  //       console.log(res.data)
  //       setImageUpload(false)
  //       // setAvatarImage(res.data.message)
  //     })
  //     .catch(err => console.error(err))
  // }

  
  if (!companyInfo) return null
  return (
    <Container className={classes.container}>
      <form className={classes.form} autoComplete="off" onSubmit={handleSubmit}>
        <Typography variant="h4"> Edit Company Information </Typography>

        {/* <input
          ref={imageInput}
          style={{ display: "none" }}
          onChange={(e) => handleMediaChange(e)}
          type="file"
        />

        <Avatar
            onClick={(e) => imageInput.current.click()}
            className={classes.avatar} 
            // src={avatarImage}
          /> */}

        <FormControl variant="outlined" className={classes.spacing}>
          <InputLabel htmlFor="component-outlined"> Company Name </InputLabel>
          <OutlinedInput
            label="Company Name"
            value={companyInfo.name}
            onChange={(e) => setCompanyInfo({...companyInfo, name: e.target.value})}
          ></OutlinedInput>
        </FormControl>

        <FormControl variant="outlined" className={classes.spacing}>
          <InputLabel htmlFor="component-outlined"> Main Email </InputLabel>
          <OutlinedInput
            label="Company Email"
            value={companyInfo.main_email}
            onChange={(e) => setCompanyInfo({...companyInfo, main_email: e.target.value})}
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
            onChange={(e) => setCompanyInfo({...companyInfo, main_contact_number: e.target.value})}
          />
        </FormControl>

        <FormControl variant="outlined" className={classes.spacing}>
          <InputLabel htmlFor="component-outlined"> Accounts Email </InputLabel>
          <OutlinedInput
            label="Accounts email"
            value={companyInfo.accounts_email}
            onChange={(e) => setCompanyInfo({...companyInfo, accounts_email: e.target.value})}
          />
        </FormControl>

        <FormControl variant="outlined" className={classes.spacing}>
          <InputLabel htmlFor="component-outlined"> Accounts Contact Number </InputLabel>
          <OutlinedInput
            label="Accounts Contact Number"
            value={companyInfo.accounts_contact_number}
            onChange={(e) => setCompanyInfo({...companyInfo, accounts_contact_number: e.target.value})}
          />
        </FormControl>

        <FormControl variant="outlined" className={classes.spacing}>
          <InputLabel htmlFor="component-outlined"> Company Registration Number </InputLabel>
          <OutlinedInput
            label="Company Registration Number"
            value={companyInfo.company_registration_number}
            onChange={(e) => setCompanyInfo({...companyInfo, company_registration_number: e.target.value})}
          />
        </FormControl>

        <FormControl variant="outlined" className={classes.spacing}>
          <InputLabel htmlFor="component-outlined"> VAT Number </InputLabel>
          <OutlinedInput
            label="Vat Number"
            value={companyInfo.vat_number}
            onChange={(e) => setCompanyInfo({...companyInfo, vat_number: e.target.value})}
          />
        </FormControl>


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
          ref={eval(`${item}Input`)}
          style={{ display: "none" }}
          onChange={(e) => handleDocumentUpload(e)}
          type="file"
        />
        <div>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => eval(`${item}Input`).current.click()}
          
        >
          <BackupIcon />
          UPLOAD {sentence.toUpperCase()} CERTIFICATE
        </Button>
        {companyInfo.documents && companyInfo.documents[item] ?
        <div className={classes.wrapper}>
        <a target="_blank" rel="noopener noreferrer" href={companyInfo.documents[item]}><Button variant="contained"
        color="primary" disabled={dataChange[item]}>Uploaded Document</Button></a>
        {dataChange[item] && <CircularProgress size={24} className={classes.buttonProgress} />}
        </div> :
        <p>no document uploaded</p>
        }
        </div>


        </Container>
        )})}

        

        {/* <input
          name="dbsCertificate"
          ref={dbsInput}
          style={{ display: "none" }}
          onChange={(e) => handleDocumentUpload(e)}
          type="file"
        />
        <Button
          variant="contained"
          color="secondary"
          onClick={() => dbsInput.current.click()}
        >
          <BackupIcon />
          UPLOAD DBS CERTIFICATE
        </Button>*/}

        <Button
          className={classes.button}
          type="submit"
          variant="contained"
          color="primary"
        >
          Save
        </Button>

        <Link
          to={{
            pathname: "/tester",
            // state: location.state,
          }}
        >
          <Button className={classes.button} variant="outlined" color="primary">
            Back
          </Button>
        </Link>
      </form>
    </Container>
  );
}
