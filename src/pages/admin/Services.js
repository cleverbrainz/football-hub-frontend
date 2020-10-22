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
import CancelSharpIcon from "@material-ui/icons/CancelSharp";
import axios from "axios";
import auth from "../../lib/auth";
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
    right: "-102px",
    //fontSize: "28px",
    "&:hover": {
      cursor: "pointer",
    },
  },
}));

export default function ContainedButtons() {
  const classes = useStyles();

  const [state, setState] = React.useState();
  const [deleteService, setDeleteService] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [deleteServiceId, setDeleteServiceId] = React.useState();

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
        setState(res.data[0].services);
      })
      .catch((e) => {
        console.log(e);
      });
  }, [!deleteService]);

  const HandleDelete = () => {
    setDeleteService(true);
    axios
      .delete(`/companies/services/${deleteServiceId}`, {
        headers: { Authorization: `Bearer ${auth.getToken()}` },
      })
      .then((res) => {
        console.log(res.data);
        setDeleteService(false);
        handleClose();
      })
      .catch((err) => {
        console.error(err);
        setDeleteService(false);
        handleClose();
      });
  };

  const Delete = (serviceId) => {
    setDeleteServiceId(serviceId);
    handleClickOpen();
  };

  return (
    <Container className={classes.container}>
      <Typography variant="h4"> SERVICES</Typography>

      {state &&
        state.map((data, i) => {
          return (
            <div key={i}>
              <CancelSharpIcon
                id={i}
                className={classes.icons}
                onClick={() => Delete(data.serviceId)}
              />
              <Card className={classes.card}>
                <Link
                  to={{
                    pathname: "/companyDashboard/serviceDetails",
                    state: data,
                  }}
                >
                  <CardContent>
                    <Typography variant="h6">{data.service_name}</Typography>
                  </CardContent>
                </Link>
              </Card>
            </div>
          );
        })}

      <Link to="/companyDashboard/addServices">
        <Button variant="contained" color="primary">
          ADD ANOTHER SERVICE
        </Button>
      </Link>
      <Link to="/companyDashboard">
        <Button className={classes.button} variant="outlined" color="primary">
          Back
        </Button>
      </Link>
      <DeleteComponent
        open={open}
        handleClose={() => handleClose()}
        HandleDelete={() => HandleDelete()}
        name={"service"}
      />
    </Container>
  );
}
