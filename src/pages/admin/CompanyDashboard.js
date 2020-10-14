import React from "react";
import { makeStyles, withStyles, useTheme } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { blue } from "@material-ui/core/colors";
import { Link } from "react-router-dom";
import {
  Container,
  Typography,
  MobileStepper,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
} from "@material-ui/core";
import { KeyboardArrowLeft, KeyboardArrowRight } from "@material-ui/icons";
import SwipeableViews from "react-swipeable-views";
import { autoPlay } from "react-swipeable-views-utils";

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

const tutorialSteps = [
  {
    imgPath:
      "https://images.unsplash.com/photo-1504305754058-2f08ccd89a0a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80",
  },
  {
    imgPath:
      "https://images.unsplash.com/photo-1556476874-c98062c7027a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=890&q=80",
  },
  {
    imgPath:
      "https://images.unsplash.com/photo-1506626637585-0802df0d0269?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1267&q=80",
  },
  {
    imgPath:
      "https://images.unsplash.com/photo-1551958219-acbc608c6377?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80",
  },
  {
    imgPath:
      "https://images.unsplash.com/photo-1600250395178-40fe752e5189?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1189&q=80 ",
  },
];
const ColorButton = withStyles((theme) => ({
  root: {
    color: theme.palette.getContrastText(blue[500]),
    backgroundColor: blue[500],
    "&:hover": {
      backgroundColor: blue[700],
    },
  },
}))(Button);

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-evenly",
    height: `${window.innerHeight - 100}px`,
    textAlign: "center",
  },
  list: {
    width: "30%",
    minWidth: "300px",
    display: "flex",
    flexDirection: "column",
    height: "55%",
    justifyContent: "space-around",
  },
  button: {
    position: "relative",
  },
  spacing: {
    margin: "20px",
  },
  root: {
    margin: "40px",
    maxWidth: "100%",
    height: "700px",
    flexGrow: 1,
  },
  img: {
    display: "block",
    minWidth: "100%",
    height: "685px",
    overflow: "hidden",
  },
  cardroot: {
    minWidth: 400,
    margin: "10px 45px",
  },
  cardmedia: {
    height: 140,
  },
  header: {
    marginTop: "1000px",
    fontSize: "400%",
  },
}));

export default function ContainedButtons() {
  const classes = useStyles();

  const theme = useTheme();
  const [activeStep, setActiveStep] = React.useState(0);
  const maxSteps = tutorialSteps.length;

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStepChange = (step) => {
    setActiveStep(step);
  };

  return (
    <Container className={classes.container}>
      <Typography variant="h1" className={classes.header}>
        {" "}
        COMPANY DASHBOARD{" "}
      </Typography>

      <div className={classes.root}>
        <AutoPlaySwipeableViews
          axis={theme.direction === "rtl" ? "x-reverse" : "x"}
          index={activeStep}
          onChangeIndex={handleStepChange}
          enableMouseEvents
        >
          {tutorialSteps.map((step, index) => (
            <div key={step.label}>
              {Math.abs(activeStep - index) <= 2 ? (
                <img
                  className={classes.img}
                  src={step.imgPath}
                  alt={step.label}
                />
              ) : null}
            </div>
          ))}
        </AutoPlaySwipeableViews>
        <MobileStepper
          steps={maxSteps}
          position="static"
          variant="dots"
          activeStep={activeStep}
          nextButton={
            <Button
              size="small"
              onClick={handleNext}
              disabled={activeStep === maxSteps - 1}
            >
              Next
              {theme.direction === "rtl" ? (
                <KeyboardArrowLeft />
              ) : (
                <KeyboardArrowRight />
              )}
            </Button>
          }
          backButton={
            <Button
              size="small"
              onClick={handleBack}
              disabled={activeStep === 0}
            >
              {theme.direction === "rtl" ? (
                <KeyboardArrowRight />
              ) : (
                <KeyboardArrowLeft />
              )}
              Back
            </Button>
          }
        />
      </div>

      <tr>
        <td>
          <Link to="/companyDashboard/companyDetails">
            <Card className={classes.cardroot}>
              <CardActionArea>
                <CardMedia
                  className={classes.cardmedia}
                  image="https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80"
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="h2">
                    Company
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    component="p"
                  >
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                    Obcaecati at quo veritatis magnam alias omnis maiores
                    laborum velit accusamus totam unde nemo, doloribus fugiat
                    autem libero aliquam vitae vel rerum.
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Link>
        </td>
        <td>
          <Link to="/companyDashboard/services">
            <Card className={classes.cardroot}>
              <CardActionArea>
                <CardMedia
                  className={classes.cardmedia}
                  image="https://images.unsplash.com/photo-1568194157720-8bbe7114ebe8?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1189&q=80"
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="h2">
                    Services
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    component="p"
                  >
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                    Obcaecati at quo veritatis magnam alias omnis maiores
                    laborum velit accusamus totam unde nemo, doloribus fugiat
                    autem libero aliquam vitae vel rerum.
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Link>
        </td>

        <td>
          <Link to="/companyDashboard/messages">
            <Card className={classes.cardroot}>
              <CardActionArea>
                <CardMedia
                  className={classes.cardmedia}
                  image="https://images.unsplash.com/photo-1484069560501-87d72b0c3669?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80"
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="h2">
                    Messages & Enquiries
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    component="p"
                  >
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                    Obcaecati at quo veritatis magnam alias omnis maiores
                    laborum velit accusamus totam unde nemo, doloribus fugiat
                    autem libero aliquam vitae vel rerum.
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Link>
        </td>
      </tr>
      <tr>
        <td>
          <Link to="/companyDashboard/courses">
            <Card className={classes.cardroot}>
              <CardActionArea>
                <CardMedia
                  className={classes.cardmedia}
                  image="https://images.unsplash.com/photo-1529267988596-c9e1c9e4670f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80"
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="h2">
                    Courses
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    component="p"
                  >
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                    Obcaecati at quo veritatis magnam alias omnis maiores
                    laborum velit accusamus totam unde nemo, doloribus fugiat
                    autem libero aliquam vitae vel rerum.
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Link>
        </td>
        <td>
          <Link to="/companyDashboard/coaches">
            <Card className={classes.cardroot}>
              <CardActionArea>
                <CardMedia
                  className={classes.cardmedia}
                  image="https://images.unsplash.com/photo-1526232761682-d26e03ac148e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1015&q=80"
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="h2">
                    Coaches
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    component="p"
                  >
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                    Obcaecati at quo veritatis magnam alias omnis maiores
                    laborum velit accusamus totam unde nemo, doloribus fugiat
                    autem libero aliquam vitae vel rerum.
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Link>
        </td>

        <td>
          <Link to="/test">
            <Card className={classes.cardroot}>
              <CardActionArea>
                <CardMedia
                  className={classes.cardmedia}
                  image="https://images.unsplash.com/photo-1526232761682-d26e03ac148e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1015&q=80"
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="h2">
                    Listing
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    component="p"
                  >
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                    Obcaecati at quo veritatis magnam alias omnis maiores
                    laborum velit accusamus totam unde nemo, doloribus fugiat
                    autem libero aliquam vitae vel rerum.
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Link>
        </td>
      </tr>

      <div className={classes.spacing}>
        <Button
          className={classes.button}
          type="submit"
          variant="contained"
          color="primary"
        >
          Submit Details
        </Button>
      </div>
    </Container>
  );
}
