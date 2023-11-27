from flask import Flask, jsonify, render_template, request
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import text

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://sql8664727:hirtvT9St9@sql8.freesqldatabase.com:3306/sql8664727'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

@app.route('/')
def index():
    #db.session.execute(text("INSERT INTO Users (name, item) VALUES ('Ojars', 'dators')"))
    #db.session.commit()

    result = db.session.execute(text("SELECT * FROM Users"))
    user_list = result.fetchall()
    
    print(user_list)
    return render_template("welcome.html")

# Adds new user to database
@app.route('/newuser', methods = ['POST'])
def newuser():
    name = request.get_data(as_text=True)

    db.session.execute(text("INSERT INTO Users (name) VALUES (:name)"), {"name": name})
    id = db.session.execute(text("SELECT LAST_INSERT_ID()")).scalar()
    items = db.session.execute(text("SELECT item FROM Users WHERE user_id = :id"), {"id": id}).scalar()
    db.session.commit()

    return jsonify({"id": id, "items": items})

# Returns info about items in users inventory
@app.route('/items', methods = ['POST'])
def items():
    id = request.get_data(as_text=True)
    items = db.session.execute(text("SELECT item FROM Users WHERE user_id = :id"), {"id": id}).scalar()
    return jsonify({"items": items})

# Checks if it is run directly and then runs it in debug mode
if __name__ == '__main__':
    app.run(debug=True)