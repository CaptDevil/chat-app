import React from 'react';
import io from 'socket.io-client';
import JoinRoom from './Components/JoinRoom';
import ChatRoom from './Components/ChatRoom';

const socket = io(`https://chat-app-dusky.vercel.app/`);

function App() {
  const [details, setDetails] = React.useState({});
  const [changeDetails, setChangeDetails] = React.useState(false);

  return (
    <div>
      <JoinRoom
        getDetails={(room, username) => {
          if (details.room !== room || details.username !== username) {
            setDetails({ room, username });
            // console.log(details)
          }
          setChangeDetails(false);
        }}
        changeDetails={changeDetails}
        socket={socket}
      />
      <ChatRoom
        details={details}
        changeDetails={() => setChangeDetails(true)}
        socket={socket}
      />
    </div>
  );
}

export default App;
