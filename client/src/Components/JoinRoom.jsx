import React from 'react';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import { Howl } from 'howler';
import Wow from '../wow.mp3';

const sounds = {
    wow: new Howl({ src: Wow }),
}

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    borderRadius: '3px',
    boxShadow: 24,
    p: 4,
    width: '55%'
};

function JoinRoom(props) {
    const [joinButton, setJoinButton] = React.useState(true)
    const [room, setRoom] = React.useState('');
    const [username, setUsername] = React.useState('');
    const [showAlert, setShowAlert] = React.useState(false);

    React.useEffect(() => {
        if(props.changeDetails === true)
            setJoinButton(true)
        else {

        }
    }, [props.changeDetails])

    return (
        <div>
            <Modal
            open={joinButton}
            onClose={() => {
                    if(props.changeDetails === true && username !== '' && room !== '') {
                        setJoinButton(false)
                        props.getDetails(room,username)
                    }
                }}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography variant='h5' gutterBottom component='div'>
                        Join A Chat Room
                    </Typography>
                    {(showAlert ? <Alert severity='error'>Please fill all the details...</Alert> : '')}
                    <form onSubmit={(e) => {
                        e.preventDefault()
                        if (room !== '' && username !== '') {
                            props.getDetails(room,username)
                            props.socket.emit('join_room', {room,username})
                            setJoinButton(false)
                            sounds.wow.play()
                        }
                        else
                            setShowAlert(true)
                        
                    }}>
                        
                            {props.changeDetails ? 
                                <div onClick={() => setShowAlert(false)} style={{ display: 'inline', marginTop: '30px' }}>
                                    <TextField focused value={room} fullWidth sx={{ margin: '10px 0px' }} id='outlined-basic' size='small' label='Room ID' onChange={(e) => setRoom(e.target.value)} />
                                    <TextField focused value={username} fullWidth sx={{ margin: '10px 0px' }} id='outlined-basic' size='small' label='Username' onChange={(e) => setUsername(e.target.value)} />
                                </div>
                            :
                                <div onClick={() => setShowAlert(false)} style={{ display: 'inline', marginTop: '30px' }}>
                                    <TextField value={room} fullWidth sx={{ margin: '10px 0px' }} id='outlined-basic' size='small' label='Room ID' onChange={(e) => setRoom(e.target.value)} />
                                    <TextField value={username} fullWidth sx={{ margin: '10px 0px' }} id='outlined-basic' size='small' label='Username' onChange={(e) => setUsername(e.target.value)} />
                                </div>
                            }
                        
                        
                        <div style={{ display: 'flex', justifyContent: 'right', margin: '10px 0px' }}>
                            <Button variant='contained' size='medium' style={{ width: '20%' }} type='submit' >Join</Button>
                        </div>
                    </form>
                </Box>
            </Modal>
        </div>
    );
}

export default JoinRoom;
