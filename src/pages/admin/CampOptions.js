import "date-fns";
import React from "react";
import { Link } from "react-router-dom";
import {
  Container,
  Typography,
  ListItem,
  ListItemText,
  Divider,
  List,
  Button
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";


const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-evenly",
    height: `${window.innerHeight - 100}px`,
    textAlign: "center",
  },
  form: {
    width: "40%",
    minWidth: "300px",
    display: "flex",
    flexDirection: "column",
    height: "55%",
    justifyContent: "space-around",
    margin: "20px 0",
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: "100px",
    margin: "20px 10px",
  },
  list: {
    width: '30%',
    minWidth: '300px',
    display: 'flex',
    flexDirection: 'column',
    height: '55%',
    justifyContent: 'space-around'
  },
}));

export default function MaterialUIPickers() {
  const classes = useStyles();

 
  return (
<Container className={classes.container}>
             <Typography variant="h4">Camp options</Typography>
             
             <List
        component="nav"
        className={classes.list}
        aria-label="mailbox folders"
      >
          <Typography variant="h6">Multi Day</Typography>
             <Divider light />
        <Link to='/companyDashboard/campMultiDetails'>
          <ListItem button>
            <ListItemText primary="Book as a whole only" />
          </ListItem>
        </Link>
        <Divider />
        <Link to='/companyDashboard/campMultiDetails'><ListItem button>
          <ListItemText primary="Can book one or more days" />
        </ListItem>
        </Link>
        </List>
        <List
        component="nav"
        className={classes.list}
        aria-label="mailbox folders"
      >
        <Divider light />
        <Typography variant="h6">Single Day</Typography>
             <Divider light />
        <Link to='/companyDashboard/campSingleDetails'>
          <ListItem button>
            <ListItemText primary="One date only" />
          </ListItem>
        </Link>
        <Divider />
        <Link to='/companyDashboard/campSingleDetails'><ListItem button>
          <ListItemText primary="More than one date (not consecutive days)" />
        </ListItem>
        </Link>
        <Divider light />
        </List>
        <Link to="/companyDashboard/addCourses">
                <Button className={classes.button} variant="outlined" color="primary">
                    Back
          </Button>
          </Link>
     </Container>
     
  );
}
