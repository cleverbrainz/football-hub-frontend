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

const SearchResultCard = ({ results }) => {
  const classes = useStyles();

  return (
    <List className={classes.root}>
      { results.map(result => {
        return ( <Link to={`/${result.userId}/profile`}>
        <ListItem alignItems="flex-start">
        <ListItemAvatar>
          <Avatar alt={`photo of ${result.fullName}`} src={result.coachInfo.imageURL} />
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
      </ListItem>
      <Divider variant="inset" component="li" />
      </Link>
      )
    })
      }
    </List>
  );
}


export default SearchResultCard