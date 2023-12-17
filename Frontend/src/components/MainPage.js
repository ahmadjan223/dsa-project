import React, { useState } from 'react';
import { Container, Segment, Item, Dropdown, Divider, Button } from 'semantic-ui-react';

import mindImg from '../images/mind.png';
import { useNavigate, useNavigation } from 'react-router-dom';
const MainPage = () => {
  const [selectedOption, setSelectedOption] = useState(null);
  const navigate = useNavigate();

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  const handleStartQuiz = () => {
    if (selectedOption === 'random') {
      navigate("/home", { state: { random: true } });
      // Navigate to the quiz page with random settings
    } else if (selectedOption === 'customize') {
      navigate("/home", { state: { random: false } });
      // Navigate to the customize quiz page
    }
  };

  return (
    <Container>
      <Segment>
        <Item.Group divided>
          <Item>
            <Item.Image src={mindImg} />
            <Item.Content>
              <Item.Header>
                <h1>Choose your options</h1>
              </Item.Header>
              <Divider />
              <Item.Meta>
                <p>How do you want to start your quiz?</p>
                <Button.Group>
                  <Button
                    color={selectedOption === 'random' ? 'blue' : null}
                    onClick={() => handleOptionSelect('random')}
                  >
                    Start Challenge Quiz
                  </Button>
                  <Button.Or />
                  <Button
                    color={selectedOption === 'customize' ? 'blue' : null}
                    onClick={() => handleOptionSelect('customize')}
                  >
                    Customize Quiz
                  </Button>
                </Button.Group>
              </Item.Meta>
              <Divider />
              <Item.Extra>
                <Button
                  primary
                  size="big"
                  icon="play"
                  labelPosition="left"
                  content="Get Started"
                  onClick={handleStartQuiz}
                  disabled={!selectedOption}
                />
              </Item.Extra>
            </Item.Content>
          </Item>
        </Item.Group>
      </Segment>
      <br />
    </Container>
  );
};

export default MainPage;
