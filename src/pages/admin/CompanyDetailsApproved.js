import React, { useEffect } from "react";
import { firebaselooper } from "../../lib/tools";
import { Container, Typography, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import EditIcon from "@material-ui/icons/Edit";
import { companyCollection } from "../../lib/firebase";
import firebase from "firebase";
import axios from "axios";
import auth from "../../lib/auth";

const useStyles = makeStyles(() => ({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-evenly",
    height: `${window.innerHeight - 100}px`,
    textAlign: "center",
  },
  heading: {
    color: "blue",
  },
}));

export default function CompanyDetailsApproved() {
  const classes = useStyles();

  const [state, setState] = React.useState();

  useEffect(() => {
    axios
      .get(`/users/${auth.getUserId()}`)
      //  axios.get('/users/7DK37g0zVmNowHax6cEJ')
      .then((res) => {
        console.log(res.data);
        setState(res.data[0]);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  return (
    <Container className={classes.container}>
      <Typography variant="h6" className={classes.heading}>
        Company Name
      </Typography>
      {state && (
        <>
          <div>{state.name}</div>
          <Typography variant="h6" className={classes.heading}>
            VAT Number{" "}
          </Typography>
          <div>{state.vat_number}</div>
          <Typography variant="h6" className={classes.heading}>
            Company Registration Number{" "}
          </Typography>
          <div>{state.company_registration_number}</div>
          <Typography variant="h6" className={classes.heading}>
            Main Contact Number
          </Typography>
          <div>{state.main_contact_number}</div>
          <Typography variant="h6" className={classes.heading}>
            Main Email{" "}
          </Typography>
          <div>{state.main_email}</div>
          <Typography variant="h6" className={classes.heading}>
            Company Email{" "}
          </Typography>
          <div>{state.company_email}</div>
          <Typography variant="h6" className={classes.heading}>
            Accounts Contact Number
          </Typography>
          <div>{state.accounts_contact_number}</div>
          <Typography variant="h6" className={classes.heading}>
            Liability Insurance{" "}
          </Typography>
          <div>{state.public_liability_insurance}</div>
          <Typography variant="h6" className={classes.heading}>
            Professional Idemnity Insurance{" "}
          </Typography>
          <div>{state.professional_indemnity_insurance}</div>
        </>
      )}

      <Link
        to={{
          pathname: "/companyDashboard/CompanyDetails",
          state: state,
        }}
      >
        <Button className={classes.button} variant="contained" color="primary">
          Make Changes
          <EditIcon />
        </Button>
      </Link>
      <Link to="/companyDashboard">
        <Button className={classes.button} variant="outlined" color="primary">
          Back
        </Button>
      </Link>
      <div>
        Please note if you update your company number, vat number or insurance
        documents you account will need to be re-verified
      </div>
    </Container>
  );
}
