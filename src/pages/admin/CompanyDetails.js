import React from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";
import {
  TextField,
  FormControl,
  InputLabel,
  Container,
  Typography,
  MenuItem,
  Select,
  Card,
  CardContent,
} from "@material-ui/core";
import axios from "axios";
import auth from "../../lib/auth";

const useStyles = makeStyles((theme) => ({
  container: {
    margin: "0 400px",
    alignItems: "center",
  },
  card: {
    height: "1200px",
    width: "40%",
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    textAlign: "center",
  },
  body: {
    margin: "0",
    padding: "0",
  },
  box: {
    border: "1px solid black",
    width: "100%",
    height: "55%",
  },
  img: {
    backgroundImage:
      "url(" +
      "https://images.unsplash.com/photo-1599580667765-e395656b5921?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=667&q=80" +
      ")",
    height: "200%",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 300,
  },
  form: {
    width: "40%",
    minWidth: "300px",
    display: "flex",
    flexDirection: "column",
    height: "55%",
    justifyContent: "space-around",
    opacity: "0.8",
    textAlign: "center",
    padding: "20px",
    position: "relative",
    top: "60px",
  },
  button: {
    position: "relative",
    margin: "15px 0",
  },
  spacing: {
    margin: "20px 0",
  },
  upload: {
    margin: "20px auto",
  },
}));

export default function ContainedButtons({ location, history }) {
  const classes = useStyles();
  const [image, setImage] = React.useState(null);
  const [url, setUrl] = React.useState("");

  const {
    name,
    vat_number,
    company_registration_number,
    main_contact_number,
    main_email,
    accounts_email,
    accounts_contact_number,
    public_liability_insurance,
    professional_indemnity_insurance,
  } = location.state;
  console.log(location.state);
  const [companyDetails, setCompanyDetails] = React.useState({
    name,
    vat_number,
    company_registration_number,
    main_contact_number,
    main_email,
    accounts_email,
    accounts_contact_number,
    public_liability_insurance,
    professional_indemnity_insurance,
  });

  const handleUpload = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  function updateOtherCompanyInfo(event) {
    const { name, value } = event.target;
    setCompanyDetails({ ...companyDetails, [name]: value });
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(companyDetails);

    axios
      .post(`/user/${auth.getUserId()}`, companyDetails, {
        headers: { Authorization: `Bearer ${auth.getToken()}` },
      })
      .then((res) => {
        console.log(res.data);
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  return (
    <div className={classes.img}>
      <Container className={classes.container}>
        <form noValidate autoComplete="off" onSubmit={handleSubmit}>
          <Card className={classes.form}>
            <Typography variant="h3"> COMPANY DETAILS </Typography>
            <TextField
              className={classes.spacing}
              id="outlined-basic"
              label="Company name"
              variant="outlined"
              name="name"
              value={companyDetails.name}
              onChange={(e) => updateOtherCompanyInfo(e)}
            />
            <TextField
              className={classes.spacing}
              id="outlined-basic"
              label="VAT number (optional)"
              variant="outlined"
              value={companyDetails.vat_number}
              name="vat_number"
              onChange={(e) => updateOtherCompanyInfo(e)}
            />
            <TextField
              className={classes.spacing}
              id="outlined-basic"
              label="Company registration number"
              variant="outlined"
              name="company_registration_number"
              value={companyDetails.company_registration_number}
              onChange={(e) => updateOtherCompanyInfo(e)}
            />
            <TextField
              className={classes.spacing}
              id="outlined-basic"
              label="Main contact number"
              variant="outlined"
              name="main_contact_number"
              value={companyDetails.main_contact_number}
              onChange={(e) => updateOtherCompanyInfo(e)}
            />
            <TextField
              className={classes.spacing}
              id="outlined-basic"
              label="Main email"
              variant="outlined"
              name="main_email"
              value={companyDetails.main_email}
              onChange={(e) => updateOtherCompanyInfo(e)}
            />
            <TextField
              className={classes.spacing}
              id="outlined-basic"
              label="Accounts contact number"
              variant="outlined"
              name="accounts_contact_number"
              value={companyDetails.accounts_contact_number}
              onChange={(e) => updateOtherCompanyInfo(e)}
            />
            <TextField
              className={classes.spacing}
              id="outlined-basic"
              label="Accounts email"
              variant="outlined"
              name="accounts_email"
              value={companyDetails.accounts_email}
              onChange={(e) => updateOtherCompanyInfo(e)}
            />

            <FormControl variant="outlined" className={classes.spacing}>
              <InputLabel>Public Liability insurance</InputLabel>
              <Select
                label="Public Liability insurance"
                value={companyDetails.public_liability_insurance}
                name="public_liability_insurance"
                onChange={(e) => updateOtherCompanyInfo(e)}
              >
                <MenuItem value={"Select cover amount"}>
                  Select cover amount
                </MenuItem>
                <MenuItem value={"I don't have any insurance"}>
                  I don't have any insurance
                </MenuItem>
                <MenuItem value={"£250,000"}>£250,000</MenuItem>
                <MenuItem value={"£500,000"}>£500,000</MenuItem>
                <MenuItem value={"£1,000,000"}>£1,000,000</MenuItem>
                <MenuItem value={"£2,000,000"}>£2,000,000</MenuItem>
                <MenuItem value={"£5,000,000"}>£5,000,000</MenuItem>
                <MenuItem value={"£10,000,000"}>£10,000,000</MenuItem>
                <MenuItem value={"Other"}>Other</MenuItem>
              </Select>
            </FormControl>

            <FormControl variant="outlined" className={classes.spacing}>
              <InputLabel>Professional idemnity insurance</InputLabel>
              <Select
                label="Professional idemnity insurance"
                name="professional_indemnity_insurance"
                value={companyDetails.professional_indemnity_insurance}
                onChange={(e) => updateOtherCompanyInfo(e)}
              >
                <MenuItem value={"Select cover amount"}>
                  Select cover amount
                </MenuItem>
                <MenuItem value={"I don't have any insurance"}>
                  I don't have any insurance
                </MenuItem>
                <MenuItem value={"£250,000"}>£250,000</MenuItem>
                <MenuItem value={"£500,000"}>£500,000</MenuItem>
                <MenuItem value={"£1,000,000"}>£1,000,000</MenuItem>
                <MenuItem value={"£2,000,000"}>£2,000,000</MenuItem>
                <MenuItem value={"£5,000,000"}>£5,000,000</MenuItem>
                <MenuItem value={"£10,000,000"}>£10,000,000</MenuItem>
                <MenuItem value={"Other"}>Other</MenuItem>
              </Select>
            </FormControl>

            <input
              id="upload-photo"
              className={classes.upload}
              type="file"
              onChange={handleUpload}
            />

            <Button
              className={classes.button}
              type="submit"
              variant="contained"
              color="primary"
            >
              SUBMIT
            </Button>

            <Link to="/companyDashboard/companyDetailsApproved">
              <Button
                className={classes.button}
                variant="outlined"
                color="primary"
              >
                Back
              </Button>
            </Link>
          </Card>
        </form>
      </Container>
    </div>
  );
}
