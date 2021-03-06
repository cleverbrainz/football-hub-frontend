import React, { useState, useEffect, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import NewReleasesSharpIcon from "@material-ui/icons/NewReleasesSharp";
import Fab from "@material-ui/core/Fab";
import Divider from "@material-ui/core/Divider";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Tooltip from "@material-ui/core/Tooltip";
import ForumSharpIcon from "@material-ui/icons/ForumSharp";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import TextField from "@material-ui/core/TextField";
import axios from "axios";
import SearchBar from "./HomeSearch";
import ExploreIcon from "@material-ui/icons/Explore";
import CheckIcon from '@material-ui/icons/Check';
import {Link } from 'react-router-dom'
import Footer from '../components/Footer'
import { askForPermissioToReceiveNotifications } from '../notifications/push-notifications';

import { useStripe } from "@stripe/react-stripe-js";
import auth from '../lib/auth'

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles((theme) => ({
  jumbotron: {
    position: "relative",
    // height: "100vh",
  },
  image: {
    filter: "blur(0.7px) brightness(75%)",
    zIndex: -1,
    objectFit: "none",
    height: "100vh",
    width: "100vw",
    position: "relative",
  },
  root: {
    minWidth: 320,
    maxWidth: 450,
    margin: "10px 35px",

    boxShadow:
      "0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.1), 0px 1px 10px 0px rgba(0,0,0,0.12)",
  },
  media: {
    height: 200,
  },
  section: {
    display: "flex",
    [theme.breakpoints.up("md")]: {
      justifyContent: "space-evenly",
    },
    overflow: "scroll",
  },
  featureRoot: {
    [theme.breakpoints.up("sm")]: {
      maxWidth: "40%",
    },
    maxWidth: 320,
    margin: "0 auto",
    boxShadow:
      "0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.1), 0px 1px 10px 0px rgba(0,0,0,0.12)",
  },
  subRoot: {
    flexDirection: "column",
    [theme.breakpoints.up("md")]: {
      flexDirection: "row",
    },
    display: "flex",
  },
  featureMedia: {
    height: "400px",
    [theme.breakpoints.up("md")]: {
      minWidth: 700,
    },
    width: "100%",
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  accordionRoot: {
    width: "100%",
    marginTop: 30,
  },
  tooltip: {
    position: "fixed",
    bottom: "4%",
    right: "2%",
    zIndex: 1000,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    justifyContent: "space-evenly",
    height: "375px",
  },
  textField: {
    margin: "10px",
    width: "200px",
  },
  textContainer: {
    marginTop: '40px',
    marginBottom: '40px',
    [theme.breakpoints.up("md")]: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row'
    },  
  },
  registerButton: {
    padding: '10px 40px',
    fontSize: '14pt',
    backgroundColor: '#02a7f0',
    borderRadius: '10px',
    color: 'white',
    "&:hover": {
      backgroundColor: '#02a7f0',
    },
  },
  buttonContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
}));

const Home = () => {
  const stripe = useStripe();
  const classes = useStyles();

  const [open, setOpen] = useState(false);
  //const [locCard, setLocCard] = useState(false);
  const [message, setMessage] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [homeDetails, setHomeDetails] = useState()

  useEffect(() => {
    axios.get('/admin/RwlT9uMWhORyHNNQOell')
      .then(res => {
        setHomeDetails(res.data);
      })
      .catch(err => console.log(err))
  }, [])

  const handleClickOpen = () => {
    setOpen(true);
  };


  const handleClose = () => {
    setOpen(false);
  };

  const handleMessage = () => {
    axios.post("/preSignUpEnquiry", message, { headers: { Authorization: `Bearer ${auth.getToken()}` }})
      .then((res) => {
        console.log(res.data);
      })
      .catch(err => console.log(err));
  };

  return (
    <>
      <Tooltip
        title="Message us!"
        onClick={handleClickOpen}
        className={classes.tooltip}
        aria-label="Message us!"
      >
        <Fab color="secondary">
          <ForumSharpIcon />
        </Fab>
      </Tooltip>

      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">
          Have a question? Send us a message!
        </DialogTitle>

        <DialogContent>
          <form
            className={classes.form}
            onChange={(e) =>
              setMessage({ ...message, [e.target.name]: e.target.value })
            }
            noValidate
            autoComplete="off"
          >
            <TextField
              id="outlined-basic"
              label="Name"
              name="name"
              variant="outlined"
            />
            <TextField
              id="outlined-basic"
              name="email"
              label="Email"
              variant="outlined"
            />
            <TextField
              id="outlined-basic"
              name="message"
              label="Message"
              multiline
              rows={9}
              variant="outlined"
            />
          </form>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleMessage} color="primary">
            Send
          </Button>
        </DialogActions>
      </Dialog>

      <div className={classes.jumbotron}>
        <img
          className={classes.image}
          src="https://images.unsplash.com/photo-1556476870-36fde88f47d0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMjF9&auto=format&fit=crop&w=2090&q=80"
          alt=""
        />
        <SearchBar classes={classes} />
      </div>
      
      <section>
        <Typography style={{ textAlign: 'center', margin: '40px 0' }} variant='h5' > Popular courses in Epsom </Typography>
        <section id='home-scroll-section' className={classes.section}>
          {['Elite Coaches', 'Clever Coaches', 'ABC Coaches'].map((el, i) => {
            let text
            if (homeDetails) {
              switch (i) {
                case 0:
                  text = homeDetails.pathwayBox
                  break;
                case 1:
                  text = homeDetails.adviceBox
                  break;
                case 2:
                  text = homeDetails.lookingForBox
                  break;
                default:
                  break;
              }
            }

            return (
              <Card key={i} className={classes.root}>
                <CardActionArea>
                  <CardMedia
                    className={classes.media}
                    image="https://images.unsplash.com/photo-1510566337590-2fc1f21d0faa?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80"
                  />
                  <CardContent>
                    <Typography style={{ textAlign: 'center'}} >
                      {el}
                    </Typography>

                    {/* <Typography variant="body2" color="textSecondary" component="p">
                      {text}
                    </Typography> */}

                  </CardContent>
                </CardActionArea>
                {/* <CardActions>
                  <Button size="small" color="primary">
                    Learn More
                  </Button>
                </CardActions> */}
              </Card>
            );
          })}
        </section>
      </section>

      <Divider style={{ margin: "70px 0" }} />

      <section>
        {/* <Fab style={{ margin: "0 95px 70px 95px" }} variant="extended">
          <NewReleasesSharpIcon style={{ marginRight: "10px" }} />
          NEW FEATURE
        </Fab> */}

        <Typography style={{ textAlign: 'center', margin: '40px 0' }} variant='h5' > Summer Camp of the Week </Typography>

        <Card className={classes.featureRoot}>
          <CardActionArea className={classes.subRoot}>
            <CardMedia
              className={classes.featureMedia}
              image="https://images.unsplash.com/photo-1510566337590-2fc1f21d0faa?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80"
            />
            {/* <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                NEW FEATURED COMPANY
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
                congue faucibus felis, vel semper tellus eleifend eu. Vestibulum
                ullamcorper ultrices efficitur.
              </Typography>
              <div className={classes.accordionRoot}>
                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <Typography className={classes.heading}>
                      Who are we
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Suspendisse malesuada lacus ex, sit amet blandit leo
                      lobortis eget.
                    </Typography>
                  </AccordionDetails>
                </Accordion>
                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel2a-content"
                    id="panel2a-header"
                  >
                    <Typography className={classes.heading}>
                      Coaching Staff
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Suspendisse malesuada lacus ex, sit amet blandit leo
                      lobortis eget.
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              </div>
            </CardContent> */}
          </CardActionArea>
        </Card>
        <Typography style={{ textAlign: 'center', marginTop: '20px'}}> JD Summer Camps </Typography>
      </section>

      <section style={{backgroundColor: '#f2f2f2', padding: '30px 0'}}>
        <Typography style={{ textAlign: 'center'}} variant='h5' > Want your company listed? </Typography>
        <div className={classes.textContainer}>
          {['Attract new players to your courses and camps',
            'Manage your existing players with our CRM', 
            'Take registers and assign coaches'].map((el, index) => { 
              return (
                <div key={index} style={{display: 'flex', alignItems: 'center', flexDirection: 'row', marginLeft: '20px'}}>
                  <CheckIcon style={{fontSize: 'large'}}></CheckIcon>
                  <p>{el}</p>
                </div>
              );
          })}    
        </div>  
        <div className={classes.buttonContainer}>
          <Button className={classes.registerButton}>
            <Link style={{ color: 'white' }} to='/loginregister'> SIGN UP TODAY </Link>         
          </Button>
        </div>              
      </section>

      {/* <Divider style={{ marginTop: "70px" }} /> */}
      <Footer />
    </>
  );
};

export default Home;