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

export default function ContainedButtons() {
  const classes = useStyles();

  const [state, setState] = React.useState();
  const [deleteCoach, setDeleteCoach] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [deleteCoachId, setDeleteCoachId] = React.useState();

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
        setState(res.data[0].coaches);
      })
      .catch((e) => {
        console.log(e);
      });
  }, [!deleteCoach]);

  const HandleDelete = () => {
    setDeleteCoach(true);
    console.log(deleteCoachId);
    axios
      .delete(`/companies/coaches/${deleteCoachId}`, {
        headers: { Authorization: `Bearer ${auth.getToken()}` },
      })
      .then((res) => {
        console.log(res.data);
        setDeleteCoach(false);
        handleClose();
      })
      .catch((err) => {
        console.error(err);
        setDeleteCoach(false);
        handleClose();
      });
  };

  const Delete = (coachId) => {
    setDeleteCoachId(coachId);
    handleClickOpen();
  };

  return (
    <Container className={classes.container}>
      <Typography variant="h4"> COACHES</Typography>

      {state &&
        state.map((data, i) => {
          return (
            <div key={i}>
              <CancelSharpIcon
                id={i}
                className={classes.icons}
                onClick={() => Delete(data.coachId)}
              />
              <Card className={classes.card}>
                <Link
                  to={{
                    pathname: "/companyDashboard/coachDetails",
                    state: data,
                  }}
                >
                  <CardContent>
                    <Typography variant="h6">{data.coach_name}</Typography>
                    <div>{data.coaching_level}</div>
                  </CardContent>
                </Link>
              </Card>
            </div>
          );
        })}

      <Link to="/companyDashboard/addCoaches">
        <Button variant="contained" color="primary">
          ADD ANOTHER COACH
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
        HandleDelete={() => HandleDelete()}
        name={"coach"}
      />
      {/* )} */}
    </Container>
  );
}
