import React, { useEffect } from "react";
import { firebaselooper } from "../../lib/tools";
import { Container, Typography, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from "react-router-dom";
import EditIcon from '@material-ui/icons/Edit';
import { companyCollection } from "../../lib/firebase";
import firebase from "firebase";

const useStyles = makeStyles(() => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    height: `${window.innerHeight - 100}px`,
    textAlign: 'center'
  },
  heading: {
    color: "blue"
  },
}));

export default function CompanyDetailsApproved() {

  const classes = useStyles();

  const [state, setState] = React.useState({
    details: null,
  });

  useEffect(() => {
    companyCollection
      .where(
        firebase.firestore.FieldPath.documentId(),
        "==",
        "weCmZPEJY9vh8ApacEy0"
      )
      .get()
      .then((snapshot) => {
        const details = firebaselooper(snapshot);
        console.log(details);
        setState({
          details,
        });
      })
      .catch((e) => {
        console.log(e);
      });
  }, [])

  const handleCompanyData = (details) => {
    return details.map((data, i) => {
      return (
        <div key={i}>
          <Container className={classes.container}>
            <Typography variant="h6" className={classes.heading}>Company Name </Typography>
            <div>{data.company_name}</div>
            <Typography variant="h6" className={classes.heading}>VAT Number </Typography>
            <div>{data.vat_number}</div>
            <Typography variant="h6" className={classes.heading}>Company Registration Number </Typography>
            <div>{data.company_registration_number}</div>
            <Typography variant="h6" className={classes.heading}>Main Contact Number</Typography>
            <div>{data.main_contact_number}</div>
            <Typography variant="h6" className={classes.heading}>Main Email </Typography>
            <div>{data.main_email}</div>
            <Typography variant="h6" className={classes.heading}>Company Email </Typography>
            <div>{data.company_email}</div>
            <Typography variant="h6" className={classes.heading}>Accounts Contact Number</Typography>
            <div>{data.accounts_contact_number}</div>
            <Typography variant="h6" className={classes.heading}>Liability Insurance </Typography>
            <div>{data.liability_insurance}</div>
            <Typography variant="h6" className={classes.heading}>Professional Idemnity Insurance </Typography>
            <div>{data.professional_idemnity_insurance}</div>
            < Link to={{
              pathname: "/editCompany",
              state: state.details
            }
            }>
              <Button className={classes.button} variant="contained" color="primary">
                Make Changes
    <EditIcon />
              </Button>
            </Link >

            <div>Please note if you update your company number, 
              vat number or insurance documents you account will need to be re-verified</div>
          </Container>
        </div>

      );

    });

  };
  return (
    <div>{state.details && handleCompanyData(state.details)}</div>
  );
}