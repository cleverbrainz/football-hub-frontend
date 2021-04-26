import React from 'react'
import { Avatar, Box, Button, Card, CardActions, CardContent, Divider, Paper, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const SuccessfulCheckout = () => {

const useStyles = makeStyles((theme) => ({
 
}))
  return (
    <div>
      <h1> ftballer</h1>
      <p> Thank you for your booking </p>

      <p> Please click here to return to the <a href={process.env.REACT_APP_WEBSITE_URL}> site </a>  </p>
    </div>
  );
};

export default SuccessfulCheckout;