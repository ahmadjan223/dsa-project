import React, { useState } from "react";
import PropTypes from "prop-types";

import { shuffle } from "../../utils";

import Offline from "../Offline";

const RandomMain = ({ startQuiz }) => {
  const [countdownTime, setCountdownTime] = useState({
    hours: 0,
    minutes: 120,
    seconds: 0,
  });
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [offline, setOffline] = useState(false);

  const handleTimeChange = (e, { name, value }) => {
    setCountdownTime({ ...countdownTime, [name]: value });
  };

 

  const fetchData = () => {
    setProcessing(true);

    if (error) setError(null);

    const API = `https://opentdb.com/api.php?amount=${15}&category=${'Science: Mathematics'}&difficulty=${'Medium'}&type=${'Multiple Choice'}`;

    fetch(API)
      .then((respone) => respone.json())
      .then((data) =>
        setTimeout(() => {
          const { response_code, results } = data;

          if (response_code === 1) {
            const message = (
              <p>
                The API doesn't have enough questions for your query. (Ex.
                Asking for 50 Questions in a Category that only has 20.)
                <br />
                <br />
                Please change the <strong>No. of Questions</strong>,{" "}
                <strong>Difficulty Level</strong>, or{" "}
                <strong>Type of Questions</strong>.
              </p>
            );

            setProcessing(false);
            setError({ message });

            return;
          }

          results.forEach((element) => {
            element.options = shuffle([
              element.correct_answer,
              ...element.incorrect_answers,
            ]);
          });

          setProcessing(false);
          startQuiz(
            results,
            countdownTime.hours + countdownTime.minutes + countdownTime.seconds
          );
        }, 1000)
      )
      .catch((error) =>
        setTimeout(() => {
          if (!navigator.onLine) {
            setOffline(true);
          } else {
            setProcessing(false);
            setError(error);
          }
        }, 1000)
      );
  };
  if (offline) return <Offline />;
  fetchData();
};
export default RandomMain;
