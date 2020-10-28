import React from 'react';
import { Link } from 'react-router-dom'
import { Typography, Box, Divider, Button } from '@material-ui/core'

const AdminHome = () => {
  return (
    <div>
      <Typography style={{ margin: '50px 0', textAlign: 'center' }} component='div' >
        <Box
          fontSize={30} fontWeight="fontWeightBold" m={0}>
          Indulge Admin Panel
        </Box>
      </Typography>

      <div style={{display: 'flex', width: '100%', justifyContent: 'space-evenly'}}>
        <Link to='/admin/home'>
          <Button
            // className={classes.button}
            variant="contained" color="primary">
            Home page Edit
        </Button>
        </Link>


        <Link to='/admin/join'>
          <Button
            // className={classes.button}
            variant="contained" color="primary">
            Join us Edit
        </Button>
        </Link>
      </div>

    </div>
  );
};

export default AdminHome;