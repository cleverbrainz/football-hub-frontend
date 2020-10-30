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
}));

export default function MaterialUIPickers() {
  const [state, setState] = React.useState();
  const [deleteCourse, setDeleteCourse] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [deleteCourseId, setDeleteCourseId] = React.useState();
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
  }, []);
  const classes = useStyles();
  return (
    <Container className={classes.container}>
      <Typography variant="h4">COURSES</Typography>

      {state &&
        state.map((data, i) => {
          let path = "";
          if (data.courseDetails.courseType === "Camp")
            path = "/companyDashboard/courseDetails";

          return (
            <div key={i}>
              <CancelSharpIcon
                id={i}
                className={classes.icons}
                //onClick={() => Delete(data.courseId)}
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
    </Container>
  );
}
