import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import axios from 'axios'
import auth from '../../lib/auth'

const useStyles = makeStyles((theme) => ({
  root: {
    margin: 'auto',
  },
  paper: {
    width: 200,
    height: 230,
    overflow: 'auto',
  },
  button: {
    margin: theme.spacing(0.5, 0),
  },
}));





const TransferListComponent = ({ classes,
  checked,
  left,
  right,
  handleToggle,
  handleAllLeft,
  handleAllRight,
  handleCheckedRight,
  handleCheckedLeft,
  listItems }) => {


  const customList = (items) => (
    <Paper className={classes.paper}>
      <List dense component="div" role="list">
        {items ? items.map((el) => {

          let value
          const labelId = `transfer-list-item-${value}-label`;

          // console.log(el)

          switch (listItems) {
            case 'camps':
              value = el.courseDetails.location + ' Camp'
              break;

            case 'services':
              value = el.service_name
              break;

            case 'coaches':
              value = el.coach_name
              break;

            case 'courses':
              value = 'Weekly ' + el.courseDetails.age
              break;

            default:
              break;
          }

          return (
            // <h1> hello </h1>
            <ListItem key={value} role="listitem" button
              onClick={handleToggle(el, listItems)}
            >
              <ListItemIcon>
                <Checkbox
                  checked={checked.includes(el)}
                  // checked={checked.indexOf(value)}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ 'aria-labelledby': labelId }}
                />
              </ListItemIcon>
             <ListItemText id={labelId} primary={value} />
            </ListItem>
          );
        }) : <p> You currently have no added {listItems} </p>}
        <ListItem />
      </List>
    </Paper>
  );

  return (
    <Grid container spacing={2} justify="center" alignItems="center" className={classes.root}>
      <Grid item>
        <h1> {listItems} Not Included on Listing </h1>

        {customList(left)}

      </Grid>
      <Grid item>
        <Grid container direction="column" alignItems="center">
          <Button
            variant="outlined"
            size="small"
            className={classes.button}
            onClick={() => handleAllRight(listItems)}
            // disabled={left && left.length === 0}
            aria-label="move all right"
          >
            ≫
        </Button>
          <Button
            variant="outlined"
            size="small"
            className={classes.button}
            onClick={() => handleCheckedRight(listItems)}
            // disabled={leftChecked && leftChecked.length === 0}
            aria-label="move selected right"
          >
            &gt;
        </Button>
          <Button
            variant="outlined"
            size="small"
            className={classes.button}
            onClick={() => handleCheckedLeft(listItems)}
            // disabled={rightChecked && rightChecked.length === 0} /
            aria-label="move selected left"
          >
            &lt;
        </Button>
          <Button
            variant="outlined"
            size="small"
            className={classes.button}
            onClick={() => handleAllLeft(listItems)}
            // disabled={right && right.length === 0}
            aria-label="move all left"
          >
            ≪
        </Button>
        </Grid>
      </Grid>
      <Grid item>
        <h1> {listItems} Included on Listing </h1>
        {customList(right)}
      </Grid>
    </Grid>
  );
};

export default TransferListComponent;