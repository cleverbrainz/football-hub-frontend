import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button'
import DeleteForeverSharpIcon from '@material-ui/icons/DeleteForeverSharp';
import ClearSharpIcon from '@material-ui/icons/ClearSharp';
import CreateSharpIcon from '@material-ui/icons/CreateSharp';
import Checkbox from '@material-ui/core/Checkbox'
import axios from 'axios'
import auth from '../../lib/auth';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
    overflow: 'scroll'
  },
  icon: {
    "&:hover": {
      cursor: "pointer",
    },
  }
});

export default function ListingsPageTable({
  handleSetListingId,
  listings,
  handleSetCoachId,
  handleSetListingToBeEdited }) {
  const classes = useStyles();
  const [updatedListings, setUpdatedListings] = useState(listings)
  const [reload, setReload] = useState(true)
  const liveState = {}
  updatedListings.forEach(listing => liveState[listing.listingId] = listing.status)
  const [liveListing, setLiveListing] = useState(liveState)

  useEffect(() => {
    setReload(false)
  })
  
  const handleChange = (id, value) => {

    const updated = { ...liveListing }
    for (const listing of Object.keys(updated)) {
      if (listing === id) {
        updated[listing] = value === false ? 'live' : 'saved'
      } else {
        updated[listing] = 'saved'
      }
      console.log(updated)
    }
    const updates = Object.entries(updated)
    axios.patch(`/listings/live`, { updates: updates }, { headers: { Authorization: `Bearer ${auth.getToken()}` }})
      .then(res => {
        setLiveListing(updated)
        console.log('listing updated===>', updated)
      })
      .catch(err => console.log(err))
  };

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Listing ID</TableCell>
            <TableCell align="right">Services</TableCell>
            <TableCell align="right">Camps</TableCell>
            <TableCell align="right">Courses</TableCell>
            <TableCell align="right">Coaches</TableCell>
            <TableCell align="right">Select Your Live Listing</TableCell>
            <TableCell align="right"></TableCell>
            <TableCell align="right"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {listings.map((el, i) => {
            // if (!el) return
            return (
              <TableRow key={i}>
                <TableCell component="th" scope="row">
                  {el.listingId}
                </TableCell>
                <TableCell align="right">{el.services.length}</TableCell>
                <TableCell align="right">{el.camps.length}</TableCell>
                <TableCell align="right">{el.courses.length}</TableCell>
                <TableCell align="right">{el.coaches.length}</TableCell>
                {/* <TableCell align="right"></TableCell> */}
                <TableCell align="right">
                  <Link to={{
                    pathname: `/companies/${auth.getUserId()}/preview/${el.listingId}`,
                  }} target="_blank" ><Button variant="contained" >Preview</Button></Link>
                  <Checkbox
                    checked={liveListing[el.listingId] === 'live'}
                    onChange={() => {
                      handleChange(el.listingId, (liveListing[el.listingId] === 'live'))}}
                  ></Checkbox>
                </TableCell>
                <TableCell align="right">
                  <CreateSharpIcon
                    onClick={() => handleSetListingToBeEdited(el)}
                    className={classes.icon}
                    style={{ color: "green" }}
                  />
                </TableCell>
                <TableCell align="right">
                  <DeleteForeverSharpIcon
                    onClick={() => handleSetListingId(el.listingId)}
                    className={classes.icon} style={{ color: "#EF5B5B" }} />
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
