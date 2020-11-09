import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
  Container,
  Typography,
  Card,
  CardContent,
} from "@material-ui/core";
import auth from "../../lib/auth";
import CancelSharpIcon from "@material-ui/icons/CancelSharp";
import axios from "axios";
import DeleteComponent from "./DeleteComponent";

const useStyles = makeStyles(() => ({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-evenly",
    height: `${window.innerHeight - 100}px`,
    textAlign: "center",
  },
  card: {
    height: "100px",
    width: "200px",
  },
  icons: {
    position: "relative",
    color: "#EF5B5B",
    top: "5px",
    right: "-106px",
    //fontSize: "28px",
    "&:hover": {
      cursor: "pointer",
    },
  },
}));

export default function Location() {
  const classes = useStyles();

  const [state, setState] = React.useState();
  const [deleteLocation, setDeleteLocation] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [deleteLocationId, setDeleteLocationId] = React.useState();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  useEffect(() => {
    axios
      .get(`/users/${auth.getUserId()}`)
      .then((res) => {
        console.log(res.data);
        setState(res.data[0].locations);
      })
      .catch((e) => {
        console.log(e);
      });
  }, [!deleteLocation]);

  const handleDelete = () => {
    setDeleteLocation(true);
    console.log(deleteLocationId);
    axios
      .delete(`/companies/locations/${deleteLocationId}`, {
        headers: { Authorization: `Bearer ${auth.getToken()}` },
      })
      .then((res) => {
        console.log(res.data);
        setDeleteLocation(false);
        handleClose();
      })
      .catch((err) => {
        console.error(err);
        setDeleteLocation(false);
        handleClose();
      });
  };

  return (
    <Container className={classes.container}>
      <Typography variant="h4">locations</Typography>

      {state &&
        state.map((data, i) => {
          return (
            <div key={i}>
              <CancelSharpIcon
                id={i}
                className={classes.icons}
                onClick={() => {
                  setDeleteLocationId(data.locationId)
                  handleClickOpen()
                }}
              />
              <Card className={classes.card}>
                <Link
                  to={{
                    pathname: "/companyDashboard/editLocation",
                    state: data,
                  }}
                >
                  <CardContent>
                    <Typography variant="h6">{data.venue}</Typography>
                  </CardContent>
                </Link>
              </Card>
            </div>
          );
        })}

      <Link to="/companyDashboard/addLocation">
        <Button variant="contained" color="primary">
          ADD ANOTHER LOCATION
        </Button>
      </Link>
      <Link to="/companyDashboard">
        <Button className={classes.button} variant="outlined" color="primary">
          Back
        </Button>
      </Link>
      {/* {open && ( */}
      <DeleteComponent
        open={open}
        handleClose={() => handleClose()}
        HandleDelete={() => handleDelete()}
        name={"location"}
      />
      {/* )} */}
    </Container>
  );
}
