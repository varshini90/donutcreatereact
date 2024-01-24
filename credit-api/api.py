from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
from mysql.connector import Error
from datetime import datetime

app = Flask(__name__)
CORS(app)


def create_connection():
    """Create a database connection to the MySQL database"""
    connection = None
    try:
        connection = mysql.connector.connect(
            host='localhost',       # or your host, e.g., '127.0.0.1'
            database='credit_db',  # your database name
            user='root',    # your database username
            password='Vyshnavi_9' # your database password
        )
    except Error as e:
        print(f"Error: '{e}'")

    return connection
def find_user_by_username(username):
    """
    Find a user by username
    :param username: The username to search for
    :return: User record or None
    """
    connection = create_connection()
    if connection is None:
        return None

    try:
        cursor = connection.cursor(dictionary=True)
        query = "SELECT * FROM user_info WHERE email = %s"
        cursor.execute(query, (username,))
        return cursor.fetchone()
    finally:
        cursor.close()
        connection.close()
@app.route('/users', methods=['GET'])
def get_users():
    connection = create_connection()
    if connection is None:
        return jsonify({"error": "Database connection failed"}), 500

    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT email, dateofbirth, firstname, lastname, lastupdatedtimestamp, created_date FROM user_info")
    users = cursor.fetchall()
    cursor.close()
    connection.close()
    return jsonify(users)

@app.route('/users/<email>', methods=['GET'])
def get_iterations():
    connection = create_connection()
    if connection is None:
        return jsonify({"error": "Database connection failed"}), 500

    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT user_id, annual_income, occupation, country_cd, loan, created_date FROM credit_analysis_info")
    users = cursor.fetchall()
    cursor.close()
    connection.close()
    return jsonify(users)

@app.route('/user/additeration', methods=['POST'])
def create_iteration():
    data = request.json
    connection = create_connection()
    if connection is None:
        return jsonify({"error": "Database connection failed"}), 500

    cursor = connection.cursor()
    cursor.execute("INSERT INTO credit_analysis_info (user_id, annual_income, occupation, country_cd, loan, created_date ) VALUES (%s, %s, %s, %s, %s, %s)", 
                   (data['email'], data['annual_income'], data['occupation'], data['country_cd'], data['loan'], datetime.now()))
    connection.commit()
    cursor.close()
    connection.close()
    return jsonify({"message": "Iteration created successfully"}), 201

@app.route('/user', methods=['POST'])
def create_user():
    data = request.json
    connection = create_connection()
    if connection is None:
        return jsonify({"error": "Database connection failed"}), 500

    cursor = connection.cursor()
    cursor.execute("INSERT INTO user_info (email, dob, first_name, last_name, pass, created_date, lastupdatedts) VALUES (%s, %s, %s, %s, %s, %s, %s)", 
                   (data['email'], data['dob'], data['first_name'], data['last_name'], data['password'], datetime.now(), datetime.now()))
    connection.commit()
    cursor.close()
    connection.close()
    return jsonify({"message": "User created successfully"}), 201

@app.route('/user/<email>', methods=['PUT'])
def update_user(email):
    data = request.json
    connection = create_connection()
    if connection is None:
        return jsonify({"error": "Database connection failed"}), 500

    cursor = connection.cursor()
    cursor.execute("UPDATE user_info SET first_name = %s, last_name = %s, dob = %s, lastupdatedts = %s WHERE email = %s", 
                   (data['first_name'], data['last_name'], data['dob'], datetime.now(), email))
    connection.commit()
    cursor.close()
    connection.close()
    return jsonify({"message": "User updated successfully"}), 200

@app.route('/user/<email>', methods=['DELETE'])
def delete_user(email):
    connection = create_connection()
    if connection is None:
        return jsonify({"error": "Database connection failed"}), 500

    cursor = connection.cursor()
    cursor.execute("DELETE FROM user_info WHERE email = %s", (email,))
    connection.commit()
    cursor.close()
    connection.close()
    return jsonify({"message": "User deleted successfully"}), 200

@app.route('/login', methods=['POST'])
def login():
    username = request.json['username']
    password = request.json['password']
    print(username)
    user = find_user_by_username(username)
    if user and user['pass'] == password:
        return jsonify({"message": "Login successful"}), 200
    else:
        return jsonify({"message": "Invalid username or password"}), 401

if __name__ == '__main__':
    app.run(port=8000,debug=True)