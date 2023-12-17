import React from 'react';
import styled from 'styled-components';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start; /* Align to the left */
  padding: 20px;
`;

const StatsContainer = styled.div`
  display: flex;
  flex-wrap: wrap; /* Enable wrapping */
  gap: 20px; /* Adjust spacing between tiles */
`;

const SubjectHeading = styled.h1`
  font-size: 28px;
  margin-bottom: 10px;
  background-color: #2196F3; /* Blue background */
  color: white  ; /* Text color */
  padding: 10px 15px; /* Padding for spacing */
  border-radius: 8px; /* Rounded corners */
  width: 100%; /* Full width */
  text-align: center; /* Center the text */
`;
const StatCard = styled.div`
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 15px;
  margin-bottom: 15px;
  flex: 1; /* Distribute available space evenly */
  max-width: 300px; /* Set maximum width for each tile */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const StatTitle = styled.h2`
  font-size: 20px;
  margin-bottom: 8px;
`;

const StatValue = styled.p`
  font-size: 16px;
  color: #333;
  margin-bottom: 5px;
`;

const ProgressBar = styled.div`
  width: 100%;
  background-color: #f0f0f0;
  border-radius: 5px;
  height: 12px;
  margin-top: 8px;
`;

const ProgressFill = styled.div`
  height: 100%;
  border-radius: 5px;
  background-color: #4caf50;
  width: ${(props) => props.percentage}%;
`;
const PredictionSubHeading = styled.h2`
  font-size: 24px;
  margin-top: 20px;
  margin-bottom: 10px;
  background-color: transparent;
  color: #757575; /* Greyish text color */
  padding: 10px 15px;
  border: none; /* Remove all borders */
  border-bottom: 2px solid #000; /* Add underline with black color */
  border-radius: 0; /* Remove border radius */
  width: 100%;
  text-align: center;
`;

const PredictionCard = styled(StatCard)` // Reusing the existing StatCard styling
  margin-top: 10px; // Adjusting margin for spacing
`;


const StatsPage = () => {
  const subject1Stats = {
    accuracy: 66,
    attemptsPassedRate: 75,
    timeAccuracy: 78,
  };

  const subject2Stats = {
    accuracy: 83,
    attemptsPassedRate: 100,
    timeAccuracy: 89,
  };
  const userAccuracyStats = {
    accuracyAfter5Quizzes: 68,
    timeAccuracyAfter5Quizzes: 85,
  };
  
  
  return (
    <PageContainer>
      <SubjectHeading>Mathematics</SubjectHeading>
      <PredictionSubHeading>Analytics</PredictionSubHeading>
      <div>
      <StatsContainer>
        <StatCard>
          <StatTitle>Accuracy</StatTitle>
          <StatValue>{subject1Stats.accuracy}%</StatValue>
          <ProgressBar>
            <ProgressFill percentage={subject1Stats.accuracy} />
          </ProgressBar>
        </StatCard>
        <StatCard>
          <StatTitle>Attempts Passed Rate</StatTitle>
          <StatValue>{subject1Stats.attemptsPassedRate}%</StatValue>
          <ProgressBar>
            <ProgressFill percentage={subject1Stats.attemptsPassedRate} />
          </ProgressBar>
        </StatCard>
        <StatCard>
          <StatTitle>Time Accuracy</StatTitle>
          <StatValue>{subject1Stats.timeAccuracy}%</StatValue>
          <ProgressBar>
            <ProgressFill percentage={subject1Stats.timeAccuracy} />
          </ProgressBar>
        </StatCard>
      </StatsContainer>
      </div>
      <PredictionSubHeading>Predictions</PredictionSubHeading>
      <div>
      <StatsContainer>
        <PredictionCard>
          <StatTitle>User Accuracy after 5 Quizzes</StatTitle>
          <StatValue>{userAccuracyStats.accuracyAfter5Quizzes}%</StatValue>
          <ProgressBar>
            <ProgressFill percentage={userAccuracyStats.accuracyAfter5Quizzes} />
          </ProgressBar>
        </PredictionCard>
        <PredictionCard>
          <StatTitle>User Time Accuracy after 5 Quizzes</StatTitle>
          <StatValue>{userAccuracyStats.timeAccuracyAfter5Quizzes}%</StatValue>
          <ProgressBar>
            <ProgressFill percentage={userAccuracyStats.timeAccuracyAfter5Quizzes} />
          </ProgressBar>
        </PredictionCard>
      </StatsContainer>
      </div>
      <SubjectHeading>Computer</SubjectHeading>
      <PredictionSubHeading>Analytics</PredictionSubHeading>
      <StatsContainer>
        <StatCard>
          <StatTitle>Accuracy</StatTitle>
          <StatValue>{subject2Stats.accuracy}%</StatValue>
          <ProgressBar>
            <ProgressFill percentage={subject2Stats.accuracy} />
          </ProgressBar>
        </StatCard>
        <StatCard>
          <StatTitle>Attempts Passed Rate</StatTitle>
          <StatValue>{subject2Stats.attemptsPassedRate}%</StatValue>
          <ProgressBar>
            <ProgressFill percentage={subject2Stats.attemptsPassedRate} />
          </ProgressBar>
        </StatCard>
        <StatCard>
          <StatTitle>Time Accuracy</StatTitle>
          <StatValue>{subject2Stats.timeAccuracy}%</StatValue>
          <ProgressBar>
            <ProgressFill percentage={subject2Stats.timeAccuracy} />
          </ProgressBar>
        </StatCard>
      </StatsContainer>
      <PredictionSubHeading>Predictions</PredictionSubHeading>
      <div>
      <StatsContainer>
        <PredictionCard>
          <StatTitle>User Accuracy after 5 Quizzes</StatTitle>
          <StatValue>{81}%</StatValue>
          <ProgressBar>
            <ProgressFill percentage={userAccuracyStats.accuracyAfter5Quizzes} />
          </ProgressBar>
        </PredictionCard>
        <PredictionCard>
          <StatTitle>User Time Accuracy after 5 Quizzes</StatTitle>
          <StatValue>{95}%</StatValue>
          <ProgressBar>
            <ProgressFill percentage={userAccuracyStats.timeAccuracyAfter5Quizzes} />
          </ProgressBar>
        </PredictionCard>
      </StatsContainer>
      </div>
    </PageContainer>
  );
};

export default StatsPage;
