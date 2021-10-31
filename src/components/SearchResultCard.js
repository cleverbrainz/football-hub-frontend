import React, {useState} from 'react'
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import { Link } from 'react-router-dom';
import {
  Typography,
  Button,  
} from "@material-ui/core";
import auth from '../lib/auth'
import axios from 'axios'
import CircularProgress from '@material-ui/core/CircularProgress'

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  inline: {
    display: 'inline',
  },
}));

const SearchResultCard = ({ results, companyInfo, setSentInvite }) => {
  
  const classes = useStyles();
  const [isProgress, setIsProgress] = useState(false)

  const handleSendRequest =(request) => {
    setIsProgress(true)
    axios.post(`/user/${request.userId}/request`, { companyId: auth.getUserId(), coachId: request.userId, coachName: request.name, coachEmail: request.email, type: window.location.hostname })
      .then(res => {
        console.log(res.data)
        // setRequestSent(true)
        setSentInvite(true)
        setIsProgress(false)
      })
      .catch(err => console.error(err))
  }

  return (
    <List className={classes.root}>
      {results.map((result, index) => {
        const tagIcon = companyInfo.coaches.some(id => id === result.userId) ? 'Part Of Your Team' : companyInfo.sentRequests.some(id => id === result.userId) ? 'Request Sent' : ''
        return ( 
          <>
            <ListItem alignItems="flex-start" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}} key={index}>
              <Link to={`/${result.userId}/profile`}>
                <ListItemAvatar>
                  {/* <Avatar alt={`photo of ${result.fullName}`} src={result.coachInfo.imageURL} /> */}
                  <Avatar alt={`photo of ${result.fullName}`} src={''} />
                </ListItemAvatar>
                <ListItemText
                  primary={result.name}
                  secondary={
                    <React.Fragment>
                      <Typography
                        component="span"
                        variant="body2"
                        className={classes.inline}
                        color="textPrimary"
                        >
                        {result.email}
                      </Typography>
                    </React.Fragment>
                  }
                />
              </Link>

              <Button
                style={{backgroundColor: '#02a7f0', color: 'white'}}
                onClick={() => handleSendRequest(result)}>
                Invite
                {isProgress ? <CircularProgress size={20} style={{marginLeft: '10px', color: 'white'}} /> : null}
              </Button>
            </ListItem>
            <Typography align="right">{tagIcon}</Typography>
            <Divider component="li" />
          </>
        )
      })
      }
    </List>
  );
}

export default SearchResultCard