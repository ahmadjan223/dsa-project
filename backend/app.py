from flask_login import LoginManager, current_user, login_user, UserMixin
from flask import Flask, request, session,jsonify
from sqlalchemy import func
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS, cross_origin

import json
import requests
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
from sqlalchemy import desc,asc
from collections import defaultdict
import os
import uuid
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:admin@127.0.0.1:3306/netquizapp'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


class User(db.Model):
    _tablename_ = 'users'

    uuid = db.Column(db.String(255), primary_key=True)
    firstname = db.Column(db.String(255))
    lastname = db.Column(db.String(255))
    email = db.Column(db.String(255))
    password = db.Column(db.String(255))
    education = db.Column(db.String(255))# ... (previous code remains unchanged)
"""
class QuizQuestion(db.Model):
    _tablename_ = 'quiz_questions'

    id = db.Column(db.Integer, primary_key=True)
    quiz_id = db.Column(db.Integer, db.ForeignKey('quizzes.id'))
    user_uuid = db.Column(db.String(255), db.ForeignKey('users.uuid'))
    question = db.Column(db.String(500))
    option_1 = db.Column(db.String(100))
    option_2 = db.Column(db.String(100))
    option_3 = db.Column(db.String(100))
    option_4 = db.Column(db.String(100))
    correct_answer = db.Column(db.String(100))
    user_chosen_option = db.Column(db.String(100))

    user = db.relationship('User', backref='quiz_questions')
    quiz = db.relationship('Quiz', backref='questions')

# Route to handle the received data after the quiz is completed
@app.route('/quiz-completed', methods=['POST'])
def store_quiz_data():
    data = request.json  # Data sent from the frontend after the quiz

    # Extract necessary data from the received JSON
    quiz_id = data['quizId']
    uuid = data['uuid']
    questions = data['questions']

    # Process each question and store it in the database
    for question in questions:
        new_quiz_data = QuizQuestion(
            quiz_id=quiz_id,
            uuid=uuid,
            question=question['question'],
            option_a=question['options']['a'],
            option_b=question['options']['b'],
            option_c=question['options']['c'],
            option_d=question['options']['d'],
            correct_answer=question['correctAnswer'],
            user_chosen_option=question['userChosenOption']
        )

        db.session.add(new_quiz_data)

    try:
        db.session.commit()
        return jsonify({"message": "Quiz data received and stored successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
        """
def generate_unique_uuid():
    # Generate a version 4 (random) UUID
    return str(uuid.uuid4())

@app.route('/test', methods=['GET'])
def test():
    print("HELLO")
    return "ASDF"


@app.route('/signup', methods=['POST'])
def signup():
    print(request.json)
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
        print(e)
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
if __name__ == '_main_':
    app.run(debug=True)