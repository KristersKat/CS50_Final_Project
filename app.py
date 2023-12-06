from flask import Flask, jsonify, render_template, request
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import text

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://sql8664727:hirtvT9St9@sql8.freesqldatabase.com:3306/sql8664727'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

@app.route('/')
def index():
    return render_template("karte.html")

@app.route('/avatar')
def avatar():
    return render_template("avatar.html")

@app.route('/game')
def game():
    return render_template("game.html")

@app.route('/hes')
def hes():
    return render_template("hes.html")

@app.route('/koknese')
def koknese():
    return render_template("koknese.html")

@app.route('/liktendarzs')
def liktendarzs():
    return render_template("liktendarzs.html")

@app.route('/pils')
def pils():
    return render_template("pils.html")

@app.route('/vietas')
def vietas():
    return render_template("vietas.html")

@app.route('/welcome')
def welcome():
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