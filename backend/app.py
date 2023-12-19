from flask_login import LoginManager, current_user, login_user, UserMixin
from flask import Flask, request, session, jsonify
from sqlalchemy import func
from flask_sqlalchemy import SQLAlchemy
import json
import requests
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
from sqlalchemy import desc, asc
from collections import defaultdict
import os
import uuid
from sqlalchemy import Column, Integer, TIMESTAMP
from uuid import uuid4
from datetime import datetime
import pandas as pd
from sklearn.linear_model import LinearRegression

app = Flask(_name_)
app.secret_key = os.urandom(24)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:FNhn4282#@127.0.0.1/NETquizapp'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)


class User(db.Model):
    tablename = 'user'

    uuid = db.Column(db.String(255), primary_key=True)
    firstname = db.Column(db.String(255))
    lastname = db.Column(db.String(255))
    email = db.Column(db.String(255))
    password = db.Column(db.String(255))
    education = db.Column(db.String(255))
# Define Quiz model


class Quiz(db.Model):
    tablename = 'quiz'

    uuid = db.Column(db.String(255), db.ForeignKey('user.uuid'))
    quizId = db.Column(db.String(255), primary_key=True)
    quizType = db.Column(db.String(255))
    quizSubject = db.Column(db.String(255))
    quizTotalMcqs = db.Column(db.String(255))
    quizExpectedTime = db.Column(db.String(255))
    quizStartTime = Column(TIMESTAMP)


class Mcqs(db.Model):
    tablename = 'Mcqs'

    mcqID = db.Column(db.String(255), primary_key=True)
    mcqSubject = db.Column(db.String(255))
    mcqTitle = db.Column(db.String(255))
    mcqTopic = db.Column(db.String(255))
    opt1 = db.Column(db.String(255))
    opt2 = db.Column(db.String(255))
    opt3 = db.Column(db.String(255))
    opt4 = db.Column(db.String(255))
    solution = db.Column(db.String(255))


class UserAttemptedQuiz(db.Model):
    tablename = 'user_attempted_quiz'

    id = db.Column(db.String(255), primary_key=True)
    user_uuid = db.Column(db.String(255), db.ForeignKey('user.uuid'))
    quiz_id = db.Column(db.String(255))
    quizendtime = db.Column(TIMESTAMP)
    timetaken = db.Column(db.Integer)
    correctOptions = db.Column(db.String(255))
    mcqaccuracy = db.Column(db.Float)
    timeaccuracy = db.Column(db.Float)


def generate_unique_uuid():
    return str(uuid.uuid4())

##################### WORKING #########################


@app.route("/", methods=["GET"])
def home():
    return jsonify({'message': 'Welcome to the Quiz App!'})


# GENERATE MCQ GET REQUEST GENERATES MCQS FOR ONE SUBJECT ONLY
# FOR OTHER SUBJECTS, A SEPARATE API REQUEST CAN BE MADE
# AND THEN ON THE FRONTEND, BOTH THE RESPONSES CAN BE COMBINED
# THIS ONLY GENERATES THE MCQS. THIS WILL GET TO THE FRONTEND
# THEN THE FROTNEND CAN TAKE THIS LIST AND CALL THE GENERATE QUIZ API BY SENDING THE MCQ IDS.
# WHILE THE FRONTEND WILL SHOW THE MCQS FROM THIS LIST.
@app.route("/genquizmcqs", methods=["GET"])
def generate_mcqs():
    if request.method == "GET":
        subject = request.json['subject']
        num_mcqs_per_subject = request.json['num_mcqs_per_subject']
        uuid = request.json["uuid"]
        quizType = request.json["quizType"]
        mcq_list = []
        total_mcqs = 0  # Counter for total MCQs
        mcqs = (
            Mcqs.query.filter_by(mcqSubject=subject,
                                 ).order_by(func.rand())
            .limit(num_mcqs_per_subject)
            .all()
        )

        if not mcqs:
            return jsonify({
                "message": f"No MCQs found for subject '{subject}'."
            }), 404

        mcq_list.extend([
            {
                "mcqID": mcq.mcqID,
                "mcqSubject": mcq.mcqSubject,
                "mcqTitle": mcq.mcqTitle,
                "mcqTopic": mcq.mcqTopic,
                "opt1": mcq.opt1,
                "opt2": mcq.opt2,
                "opt3": mcq.opt3,
                "opt4": mcq.opt4,
                "solution": mcq.solution,
            }
            for mcq in mcqs
        ])
        total_mcqs += len(mcqs)

    # Calculate expected time based on the formula
        expected_time = total_mcqs * 50 / 100

        # ADD THIS QUIZ TO THE DATABASE
        # RIGTH NOW, QUIZZES ARE ONLY FOR 1 SUBJECT
        # THEN WE CAN LATER ADD A LOGIC SUCH THAT IF SUBJECTS ARE MULTIPLE, ADD THE MCQS TO THE SAME QUIZ ID

        quizSubject = subject
        quizTotalMcqs = num_mcqs_per_subject
        quizExpectedTime = expected_time
        quiz_id = generate_unique_uuid()
        quizStartTime = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        print("-----------------------------------------")
        print(quizStartTime)
        # Creating a new Quiz object and adding it to the database
        new_quiz = Quiz(
            uuid=uuid,
            quizId=quiz_id,
            quizType=quizType,
            quizSubject=quizSubject,
            quizTotalMcqs=quizTotalMcqs,
            quizExpectedTime=quizExpectedTime,
            quizStartTime=quizStartTime
        )
        db.session.add(new_quiz)
        db.session.commit()

        # Return the generated MCQs and quiz details without storing in the database
        return jsonify({"mcqs": mcq_list, "total_mcqs": total_mcqs, "expected time in minutes": expected_time, "quiz_id": quiz_id, "user_uuid": uuid, "quizStartTime": quizStartTime})

    else:
        return "Method Not Allowed", 405


@app.route("/submit_answers", methods=["POST"])
def submit_answers():
    quiz_id = request.json["quiz_id"]
    user_uuid = request.json['uuid']
    quiz = Quiz.query.filter_by(quizId=quiz_id).first()
    quiz_start_time = str(quiz.quizStartTime)
    quiztotalmcqs = int(quiz.quizTotalMcqs)
    quiz_end_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    total_time_taken = datetime.strptime(
        quiz_end_time, '%Y-%m-%d %H:%M:%S') - datetime.strptime(quiz_start_time, '%Y-%m-%d %H:%M:%S')
    timetaken = total_time_taken.total_seconds()/60
    correctOptions = request.json['correctOptions']
    mcqaccuracy = correctOptions/quiztotalmcqs * 100
    timeaccuracy = timetaken/float(quiz.quizExpectedTime) * 100

    # Insert the quiz attempt details in the database
    new_quiz_attempt = UserAttemptedQuiz(
        id=generate_unique_uuid(),
        user_uuid=user_uuid,
        quiz_id=quiz_id,
        quizendtime=quiz_end_time,
        correctOptions=correctOptions,
        timetaken=timetaken,
        timeaccuracy=timeaccuracy,
        mcqaccuracy=mcqaccuracy
    )
    db.session.add(new_quiz_attempt)
    db.session.commit()

    # Respond with a success message or further processing if needed
    return jsonify({"message": "Answers submitted successfully"})

from random import sample
# Modify the generate_mcqs_based_on_stats function using the existing data from the database
def generate_mcqs_based_on_stats(user_uuid, num_mcqs, accuracy_threshold, time_accuracy_threshold):
    try:
        # Fetch user's previous quiz attempts from the database
        quiz_attempts = UserAttemptedQuiz.query.filter_by(user_uuid=user_uuid).all()

        # Prepare a list of MCQs attempted by the user with their accuracy and time accuracy
        historical_data = [{
            'accuracy': quiz_attempt.mcqaccuracy,
            'time_accuracy': quiz_attempt.timeaccuracy,
            # Include more details about MCQs from the database if available
            # 'mcq_id': quiz_attempt.quiz_id,
            # 'subject': quiz_attempt.subject,
            # Add more relevant details...
        } for quiz_attempt in quiz_attempts]

        # Implement the statistical method using historical_data
        filtered_data = [mcq for mcq in historical_data if mcq['accuracy'] >= accuracy_threshold and mcq['time_accuracy'] >= time_accuracy_threshold]
        filtered_data.sort(key=lambda x: x['accuracy'] * x['time_accuracy'], reverse=True)
        selected_mcqs = sample(filtered_data, min(num_mcqs, len(filtered_data)))

        return selected_mcqs
    except Exception as e:
        # Handle exceptions or errors gracefully
        print(e)
        return []


@app.route('/getanalytics', methods=["GET"])
def getanalytics():
    try:
        # Fetch accuracy, and time taken in every previous quiz of a user
        uuid = request.json["uuid"]
        quiz_attempts = UserAttemptedQuiz.query.filter_by(user_uuid=uuid).all()
        mcqaccuracy_percentage_list = []
        timeaccuracy_percentage_list = []
        quiztimetaken_percentage_list = []
        for quiz_attempt in quiz_attempts:
            mcqaccuracy_percentage_list.append(quiz_attempt.mcqaccuracy)
            timeaccuracy_percentage_list.append(quiz_attempt.timeaccuracy)
            quiztimetaken_percentage_list.append(quiz_attempt.timetaken)
        # Calculate average accuracy, average time taken, and average quiztimetaken
        average_accuracy = sum(mcqaccuracy_percentage_list) / \
            len(mcqaccuracy_percentage_list)
        average_time_taken = sum(timeaccuracy_percentage_list) / \
            len(timeaccuracy_percentage_list)
        average_quiztimetaken = sum(
            quiztimetaken_percentage_list) / len(quiztimetaken_percentage_list)

        # Prepare data for linear regression
        X = list(zip(timeaccuracy_percentage_list,
                 quiztimetaken_percentage_list))
        y_accuracy = mcqaccuracy_percentage_list

        # Train linear regression model
        model_accuracy = LinearRegression()
        model_accuracy.fit(X, y_accuracy)

        # Predict future accuracy based on the provided average_time_taken and average_quiztimetaken
        future_accuracy_5_quizzes = model_accuracy.predict(
            [[average_time_taken, average_quiztimetaken]])[0]
        future_accuracy_10_quizzes = model_accuracy.predict(
            [[average_time_taken * 2, average_quiztimetaken * 2]])[0]

        # Prepare response
        response = {
            "average_accuracy": average_accuracy,
            "average_time_taken": average_time_taken,
            "average_quiztimetaken": average_quiztimetaken,
            "predicted_accuracy_5_quizzes": future_accuracy_5_quizzes,
            "predicted_accuracy_10_quizzes": future_accuracy_10_quizzes
        }

        return jsonify(response)
    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500


@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    if not all(key in data for key in ['firstName', 'lastName', 'email', 'password', 'education']):
        return jsonify({"error": "Missing data"}), 400
    hashed_password = generate_password_hash(data['password'])
    unique_uuid = generate_unique_uuid()
    new_user = User(
        uuid=unique_uuid,
        firstname=data['firstName'],
        lastname=data['lastName'],
        email=data['email'],
        password=hashed_password,
        education=data['education']
    )

    try:
        db.session.add(new_user)
        db.session.commit()
        return jsonify({"message": "User signed up successfully"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@app.route("/login", methods=["POST"])
def login():
    data = request.json

    if not data or 'username' not in data or 'password' not in data:
        return jsonify({"message": "Missing username or password"}), 400

    email = data['username']
    password = data['password']

    user = User.query.filter_by(email=email).first()

    if not user or not check_password_hash(user.password, password):
        return jsonify({"message": "Invalid username or password"}), 401

    return jsonify({"message": "Logged in successfully"}), 200


if _name_ == '_main_':
    app.run(debug=True)