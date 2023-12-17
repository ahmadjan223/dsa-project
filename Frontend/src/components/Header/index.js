import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Button } from 'semantic-ui-react';

const Header = () => {
  const [promptEvent, setPromptEvent] = useState(null);
  const [appAccepted, setAppAccepted] = useState(false);
  const navigate = useNavigate();

  let isAppInstalled = false;

  if (window.matchMedia('(display-mode: standalone)').matches || appAccepted) {
    isAppInstalled = true;
  }

  window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault();
    setPromptEvent(e);
  });

  const installApp = () => {
    promptEvent.prompt();
    promptEvent.userChoice.then(result => {
      if (result.outcome === 'accepted') {
        setAppAccepted(true);
        console.log('User accepted the A2HS prompt');
      } else {
        console.log('User dismissed the A2HS prompt');
      }
    });
  };

  return (
    <Menu stackable inverted>
      <Menu.Item header>
        <h1>QuizApp</h1>
      </Menu.Item>
      {/* Home Button */}
      <Menu.Item>
        <Button color="blue" content="Home" onClick={()=>{navigate("/mainpage")}}/>
      </Menu.Item>

      {/* Stats Button */}
      <Menu.Item>
        <Button color="blue" content="Stats" onClick={()=>{navigate("/stats")}} />
      </Menu.Item>

      {promptEvent && !isAppInstalled && (
        <Menu.Item position="right">
          <Button
            color="teal"
            icon="download"
            labelPosition="left"
            content="Install App"
            onClick={installApp}
          />
        </Menu.Item>
      )}
    </Menu>
  );
};

export default Header;
