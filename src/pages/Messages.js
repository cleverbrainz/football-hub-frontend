import React, { useState, useEffect } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import MenuIcon from '@material-ui/icons/Menu';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Box from '@material-ui/core/Box';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import axios from 'axios';
import auth from '../lib/auth'
import moment from 'moment'
import CircularProgress from '@material-ui/core/CircularProgress'

const drawerWidth = 300;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    height: window.innerHeight - 56,
    [theme.breakpoints.up('sm')]: {
      height: window.innerHeight - 80,
    },
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
      zIndex: 1,
      overflow: 'hidden'
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  messageListBox: {
    display: 'flex',
    alignItems: 'center',
    padding: '35px 0',
    position: 'relative'
  },
  avatar: {
    width: theme.spacing(8),
    height: theme.spacing(8),
    margin: '0 20px 0 15px'
  },
  currentUserMessages: {
    marginTop: '10px',
    alignSelf: 'flex-end',
    backgroundColor: '#BFD8EE',
    maxWidth: '80%',
    borderRadius: '13px'
  },
  otherUserMessages: {
    marginTop: '10px',
    borderRadius: '13px',
    maxWidth: '80%',
    alignSelf: 'flex-start',
    backgroundColor: '#E2FADB'
  },
  messagePreview: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    width: '180px',
    alignItems: 'center',
    color: '#4d4d4d',
  },
  messagePreviewTime: {
    position: 'absolute',
    bottom: '5%',
    right: '5%'
  },
  button: {
    position: 'relative'
  },
  progress: {
    position: 'absolute'
  }
}));

const Messages = (props) => {

  const { window } = props;
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState()
  const [selectedMessage, setSelectedMessage] = useState()
  const [typedMessage, setTypedMessage] = useState({
    message: '',
    from: auth.getUserId()
  })

  useEffect(() => {
    axios.get('/enquiries', { headers: { Authorization: `Bearer ${auth.getToken()}` } })
      .then(async res => {

        const orderedMessages = res.data.sort((a, b) => {
          const messageA = a.enquiryInfo.messages[a.enquiryInfo.messages.length - 1]
          const messageB = b.enquiryInfo.messages[b.enquiryInfo.messages.length - 1]
          const dateA = new Date(messageA.createdAt._seconds * 1000 + messageA.createdAt._nanoseconds / 1000000)
          const dateB = new Date(messageB.createdAt._seconds * 1000 + messageB.createdAt._nanoseconds / 1000000)

          return dateB - dateA
        })

        setMessages(orderedMessages)
        if (!selectedMessage) return
        else {
          const filter = res.data.filter(el => el.enquiryId === selectedMessage.enquiryId)
          await setSelectedMessage(filter[0])
          scroll()
        }
      })

  }, [!isLoading])

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  }

  const scroll = () => {
    const div = document.querySelector('.convo-container')
    div.scrollTop = div.scrollHeight
  }

  const handleMessageSelect = async el => {
    await setSelectedMessage(el)
    scroll()
  }

  const handleSendMessage = e => {
    e.preventDefault()
    setIsLoading(true)
    axios.patch(`/enquiries/${selectedMessage.enquiryId}`, typedMessage)
      .then(res => {
        document.querySelector('#component-outlined').value = ''
        setIsLoading(false)
      })
      .catch(err => {
        setIsLoading(false)
        document.querySelector('#component-outlined').value = ''
      })
  }

  const drawer = (
    <div>
      <div  className={classes.toolbar} />
      <Divider />

      <List>
        {messages && messages.map((el, i) => {
          const { company, messages } = el.enquiryInfo
          const latestMessage = messages[messages.length - 1]
          const time = new Date(latestMessage.createdAt._seconds * 1000 + latestMessage.createdAt._nanoseconds / 1000000)
          const sameDay = moment(time).format('DD-MM-YYYY') === moment(new Date()).format('DD-MM-YYYY')
          return (
            <>
              <div
                id='message-box' key={i}
                className={classes.messageListBox}
                onClick={() => handleMessageSelect(el)}>
                <Avatar className={classes.avatar} alt="Remy Sharp" src="https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1650&q=80" />

                <div>
                  <Typography component='div'>
                    <Box
                      fontSize={17} fontWeight="fontWeightRegular" m={0}>
                      {company}
                    </Box>
                  </Typography>

                  <Typography component='div'>
                    <Box
                      className={classes.messagePreview}
                      fontSize={15} fontWeight="fontWeightRegular" m={0}>
                      {latestMessage.message}
                    </Box>
                  </Typography>

                  <small className={classes.messagePreviewTime}>
                    {moment(time).format(sameDay ? 'HH:MM' : 'DD-MM-YYYY')}
                  </small>

                </div>
              </div>

              <Divider />
            </>
          )

        })}
      </List>
    </div>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <div className={classes.root}>
      <CssBaseline />

      <nav 
      className={classes.drawer} aria-label="mailbox folders">

        <Hidden smUp implementation="css">
          <Drawer
            container={container}
            variant="temporary"
            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
            open
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>


      <main id='chat-main-container' className={classes.content}>


        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          className={classes.menuButton}
        >
          <MenuIcon />
        </IconButton>

        <div className="convo-container">
          <div className="position-container">

            {selectedMessage && selectedMessage.enquiryInfo.messages.map((el, i) => {

              const currentUser = el.from === auth.getUserId()
              const time = new Date(el.createdAt._seconds * 1000 + el.createdAt._nanoseconds / 1000000)

              return (
                <Paper className={currentUser ? classes.currentUserMessages : classes.otherUserMessages}
                  elevation={2} key={i} variant="outlined">
                  <Typography paragraph>
                    {el.message}
                    <small style={{ fontSize: '12px', marginLeft: '9px' }}>
                      {moment(time).format('HH:MM')}
                    </small>
                  </Typography>

                </Paper>

              )
            })}
          </div>

        </div>

        <form
          onSubmit={(e) => handleSendMessage(e)}
          onChange={(e) => setTypedMessage({ ...typedMessage, message: e.target.value })}>

          <FormControl style={{ width: '85%' }} variant="outlined">
            <InputLabel htmlFor="component-outlined"> Type your message </InputLabel>
            <OutlinedInput
              type='text'
              autoComplete='off'
              name='message' id="component-outlined" label='Type your message' />
          </FormControl>

          <Button
            className={classes.button} disabled={isLoading}
            variant="contained" type='submit' color="primary">
            Send
            {isLoading && <CircularProgress size={30} className={classes.progress} />}
          </Button>
        </form>




      </main>
    </div>
  );
}

export default Messages;
