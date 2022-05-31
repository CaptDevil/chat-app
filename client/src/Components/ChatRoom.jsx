import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Popover from '@mui/material/Popover';
import Container from '@mui/material/Container';
import ChatBackground from '../liquid-cheese.svg';

let room = '', username= '';

function MouseOverPopover(props) {
    const [anchorEl, setAnchorEl] = React.useState(null);
  
    const handlePopoverOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };
  
    const handlePopoverClose = () => {
        setAnchorEl(null);
    };
  
    const open = Boolean(anchorEl);
  
    return (
        <div>
            <Typography
                aria-owns={open ? 'mouse-over-popover' : undefined}
                aria-haspopup="true"
                onMouseEnter={handlePopoverOpen}
                onMouseLeave={handlePopoverClose}
            >
                {props.textData}
            </Typography>
            <Popover
                id="mouse-over-popover"
                sx={{
                    pointerEvents: 'none',
                }}
                open={open}
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                onClose={handlePopoverClose}
                disableRestoreFocus
            >
                <Typography variant='subtitle2' sx={{ padding: '0px 10px' }}>Click to Change</Typography>
                <Typography variant='caption' sx={{ padding: '0px 10px' }}>It may Reset the Chat</Typography>
            </Popover>
        </div>
    );
}

function ChatRoom(props) {
    const [message, setMessage] = React.useState('');
    const [incompFieldAlert, setIncompFieldAlert] = React.useState(false);
    const [joinedRoomSuccessAlert, setJoinedRoomSuccessAlert] = React.useState(false);
    const [chats, setChats] = React.useState([]);

    React.useEffect(() => {
        if(Object.keys(props.details).length !== 0 && props.details.room !== room) {
            setJoinedRoomSuccessAlert(true)
            if(room !== '' && username !== '')
                props.socket.emit('leave_room', {room,username})
            room = props.details.room
            username = props.details.username
            setChats([])
        }
    },[props.details, props.socket])

    React.useEffect(() => {
        props.socket.on('receive_message', (data) => {
            setChats((chats) => [...chats, data])
        })
        props.socket.on('user_left', (data) => {
            setChats((chats) => [...chats, data])
        })
    },[props.socket])
    
    return (
        <div>
            <Box sx={{
                width: '60%',
                margin: '10px auto',
                display: 'flex',
                justifyContent: 'space-between'
            }}>
                <Typography variant='h5' gutterBottom component='div'>
                    Room: <Button onClick={() => props.changeDetails()}><MouseOverPopover textData={props.details.room} /></Button>
                </Typography>
                <Typography variant='h5' gutterBottom component='div'>
                    User: <Button onClick={() => props.changeDetails()}><MouseOverPopover textData={props.details.username} /></Button>
                </Typography>
            </Box>
            
            <Box sx={{
                width: '60%',
                height: 440,
                margin: '10px auto',
                borderRadius: 1,
                border: '2px solid black',
                // backgroundColor: '#8bf76a',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column-reverse',
                boxSizing: 'border-box',
                backgroundImage: `url(${ChatBackground})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}>
                <Container maxWidth='md'>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {chats.map((msg, index) => <li key={(index+1)}>
                            { (msg.author !== '') 
                                ? (msg.author === props.details.username) ? 
                                            <div style={{ display: 'flex', justifyContent: 'right' }}>
                                                <div style={{ display: 'inline-block', margin: '5px 0px', padding: '0px 5px', backgroundColor: 'white', width: '15%', borderRadius: 3 }}>
                                                    <Typography variant='body2' style={{ padding: '3px 0px' }}>{msg.body}</Typography>
                                                </div>
                                            </div> : 
                                            <div style={{ display: 'flex', justifyContent: 'left' }}>
                                                <div style={{ display: 'inline-block', margin: '5px 0px', padding: '0px 5px', backgroundColor: 'white', width: '15%', borderRadius: 3 }}>
                                                    <Typography variant='subtitle1'>{msg.author}</Typography>
                                                    <Typography variant='body2' style={{ padding: '3px 0px' }}>{msg.body}</Typography>
                                                </div>
                                            </div>
                                : 
                                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                                        <div style={{ display: 'inline-block', margin: '5px auto', padding: '4px 5px', backgroundColor: '#48d8e8', borderRadius: 3 }}>
                                            <Typography variant='caption'>{msg.body}</Typography>
                                        </div>
                                    </div>
                                }
                            
                        </li>)}
                    </ul>
                </Container>
                
            </Box>

            <Box sx={{
                width: '60%',
                margin: '10px auto',
            }}>
                <form onSubmit={(e) => {
                    e.preventDefault()
                    if(message === '')
                        setIncompFieldAlert(true)
                    else {
                        setChats((chats) => [...chats, {author: props.details.username, body: message}])
                        props.socket.emit('send_message', {room, author: props.details.username, body: message})
                        setMessage('')
                    }
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }}>
                        {(incompFieldAlert) ? 
                            <TextField focused id='outlined-basic' size='small' color='error' fullWidth value={message} placeholder='Hey guys...' onChange={(e) => setMessage(e.target.value)} />
                            :   <TextField focused id='outlined-basic' size='small' color='success' fullWidth value={message} placeholder='Hey guys...' onChange={(e) => setMessage(e.target.value)} />
                        }
                        <Button sx={{ marginLeft: '10px' }} size='small' color='success' type='submit'>
                            <SendIcon />
                        </Button>
                        
                    </div>
                </form>
            </Box>
            <Snackbar open={incompFieldAlert} autoHideDuration={6000} onClose={() => setIncompFieldAlert(false)}>
                <Alert variant='filled' severity='error' onClose={() => setIncompFieldAlert(false)}>
                    Empty Field
                </Alert>
            </Snackbar>
            <Snackbar open={joinedRoomSuccessAlert} autoHideDuration={6000} onClose={() => setJoinedRoomSuccessAlert(false)}>
                <Alert variant='filled' severity='success' onClose={() => setJoinedRoomSuccessAlert(false)}>
                    Joined Room
                </Alert>
            </Snackbar>
        </div>
    );
}

export default ChatRoom;