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
import DeleteComponent from "./DeleteComponent";
import CancelSharpIcon from "@material-ui/icons/CancelSharp";
import axios from "axios";
import auth from "../../lib/auth";

const useStyles = makeStyles((theme) => ({
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
  const [deleteCourse, setDeleteCourse] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [deleteCourseId, setDeleteCourseId] = React.useState();

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
        setState(res.data[0].courses);
      })
      .catch((e) => {
        console.log(e);
      });
  }, [!deleteCourse]);

  const HandleDelete = () => {
    setDeleteCourse(true);
    axios
      .delete(`/companies/courses/${deleteCourseId}`, {
        headers: { Authorization: `Bearer ${auth.getToken()}` },
      })
      .then((res) => {
        console.log(res.data);
        setDeleteCourse(false);
        handleClose();
      })
      .catch((err) => {
        console.error(err);
        setDeleteCourse(false);
        handleClose();
      });
  };

  const Delete = (courseId) => {
    setDeleteCourseId(courseId);
    handleClickOpen();
  };

  return (
    <Container className={classes.container}>
      <Typography variant="h4">COURSES</Typography>

      {state &&
        state.map((data, i) => {
          // const { startDate, endDate } = data.courseDetails
          const { courseType } = data.courseDetails 
          let path = "";
          if (courseType === "Camp") {
            path = "/companyDashboard/courseDetails";
          } else if (courseType === "Weekly") {
            path = "/companyDashboard/weeklyDetails";
          } else {
            path = "/companyDashboard/singleCampDetails";
          }
          return (
            <div key={i}>
              <CancelSharpIcon
                id={i}
                className={classes.icons}
                onClick={() => Delete(data.courseId)}
              />
              <Card className={classes.card}>
                <Link
                  to={{
                    pathname: path,
                    state: data,
                  }}
                >
                  <CardContent>
                    {/* <Typography variant="h6">{age}</Typography> */}
                    <div>Course {i + 1}</div>
                    <div>{data.courseDetails.courseType}</div>
                    <div></div>
                  </CardContent>
                </Link>
              </Card>
            </div>
          );
        })}

      <Link to="/companyDashboard/addCourses">
        <Button variant="contained" color="primary">
          ADD NEW COURSE
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
        name={"course"}
      />
    </Container>
  );
}
