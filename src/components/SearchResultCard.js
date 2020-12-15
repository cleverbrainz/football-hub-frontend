import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    minWidth: '80ch'
  },
  inline: {
    display: 'inline',
  },
}));

const SearchResultCard = ({ results, companyInfo }) => {
  console.log({results})
  const classes = useStyles();

  return (
    <List className={classes.root}>
      { results.map(result => {
        const tagIcon = companyInfo.coaches.some(id => id === result.userId) ? 'Part Of Your Team' : companyInfo.sentRequests.some(id => id === result.userId) ? 'Request Sent' : ''
        return ( 
        <>
        <ListItem alignItems="flex-start">
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
                {result.bio}
              </Typography>
            </React.Fragment>
          }
          />
          </Link>
      </ListItem>
          <Typography align="right">{tagIcon}</Typography>
      <Divider variant="inset" component="li" />
      </>
      )
    })
      }
    </List>
  );
}


export default SearchResultCard