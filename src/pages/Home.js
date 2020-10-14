import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import NewReleasesSharpIcon from '@material-ui/icons/NewReleasesSharp';
import Fab from '@material-ui/core/Fab'
import Divider from '@material-ui/core/Divider'
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const useStyles = makeStyles((theme) => ({
  jumbotron: {
    position: 'relative'
  },
  image: {
    filter: 'blur(0.7px) brightness(75%)',
    zIndex: -1,
    objectFit: 'none',
    height: '100vh',
    width: '100vw',
    position: 'relative'
  },
  root: {
    minWidth: 320,
    maxWidth: 450,
    margin: '10px 35px',

    boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.1), 0px 1px 10px 0px rgba(0,0,0,0.12)',
  },
  media: {
    height: 200,
  },
  section: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      justifyContent: 'space-evenly',
    },
    overflow: 'scroll'
  },
  featureRoot: {
    [theme.breakpoints.up('sm')]: {
      maxWidth: 1200,
    },
    maxWidth: 320,
    margin: '0 auto',
    boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.1), 0px 1px 10px 0px rgba(0,0,0,0.12)',
  },
  subRoot: {
    flexDirection: 'column',
    [theme.breakpoints.up('md')]: {
      flexDirection: 'row',
    },
    display: 'flex',
  },
  featureMedia: {
    height: '400px',
    [theme.breakpoints.up('md')]: {
      minWidth: 700,
    },
    width: '100%'
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  accordionRoot: {
    width: '100%',
    marginTop: 30
  }

}));


const Home = () => {

  const classes = useStyles()

  

  return (
    <>
      <div className={classes.jumbotron}>
        <img className={classes.image} src="https://images.unsplash.com/photo-1556476870-36fde88f47d0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMjF9&auto=format&fit=crop&w=2090&q=80" alt="" />
      <Button style={{ position: 'absolute', bottom: '15%', left: '10%', zIndex: '5' }} variant="contained" color="default">
          <Link to='/companies'> Find a coach </Link> 
          </Button> 
      </div>
      <section>
        <Typography style={{ textAlign: 'center', margin: '40px 0' }} variant='h5' > Pathway to greatness </Typography>
        <section id='home-scroll-section' className={classes.section}>
          {['Your pathway', 'Get advice', 'What to look for'].map((el, i) => {
            return (
              <Card key={i} className={classes.root}>
                <CardActionArea>
                  <CardMedia
                    className={classes.media}
                    image="https://images.unsplash.com/photo-1510566337590-2fc1f21d0faa?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80"
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                      {el}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec congue faucibus felis,
                      vel semper tellus eleifend eu. Vestibulum ullamcorper ultrices efficitur.
                </Typography>
                  </CardContent>
                </CardActionArea>
                <CardActions>
                  <Button size="small" color="primary">
                    Learn More
              </Button>
                </CardActions>
              </Card>
            )
          })}
        </section>
      </section>

      <Divider style={{ margin: '70px 0' }} />

      <section>
        <Fab style={{ margin: '0 95px 70px 95px' }} variant="extended">
          <NewReleasesSharpIcon style={{ marginRight: '10px' }} />
          NEW FEATURE
        </Fab>

        <Card className={classes.featureRoot}>
          <CardActionArea className={classes.subRoot}>
            <CardMedia
              className={classes.featureMedia}
              image="https://images.unsplash.com/photo-1510566337590-2fc1f21d0faa?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                NEW FEATURED COMPANY
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec congue faucibus felis,
                vel semper tellus eleifend eu. Vestibulum ullamcorper ultrices efficitur.
                </Typography>
              <div className={classes.accordionRoot}>
                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <Typography className={classes.heading}>Who are we</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
                      sit amet blandit leo lobortis eget.
          </Typography>
                  </AccordionDetails>
                </Accordion>
                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel2a-content"
                    id="panel2a-header"
                  >
                    <Typography className={classes.heading}>Coaching Staff</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
                      sit amet blandit leo lobortis eget.
          </Typography>
                  </AccordionDetails>
                </Accordion>
              </div>
            </CardContent>

          </CardActionArea>

        </Card>
      </section>



      <Divider style={{ margin: '70px 0' }} />


    </>
  )
}

export default Home