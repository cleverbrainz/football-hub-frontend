import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function ListingInstructionDialogue({ open, handleClose }) {


  return (
    <div>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">
          LISTING INSTRUCTIONS
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">

            <h5> Before you can publish your first listing you will need to complete some sections. </h5>

            <ul>
              <li>  Locations - Add the locations you run your courses and camps at</li>
              <li>      Age groups - Add the various age groups you coach</li>
              <li>  Coaches - Add all the coaches that work for you including yourself if applicable</li>
              <li>  Services - Add the services you offer; e.g fun coaching, elite development, birthday parties</li>
              <li>   Courses and camps - Add all courses and camps you are currently running</li>
            </ul>

            <p> Once you have added these you can come back and complete your listing by selecting items you have created
              in the categories that you want to show on your listing. Also write a short description about your company
              and the reasons why someone should come and be coached by you. </p>


          </DialogContentText>
        </DialogContent>
      </Dialog>
    </div>
  );
}
