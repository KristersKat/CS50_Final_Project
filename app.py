from flask import Flask, render_template
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import text

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://sql8664727:hirtvT9St9@sql8.freesqldatabase.com:3306/sql8664727'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Defined the user that is used in the table (If the table is modified, this has to be modified as well)
class User(db.Model):
    user_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    item = db.Column(db.String(120), nullable=False)

@app.route('/')
def index():
    db.session.execute(text("INSERT INTO Users (name, item) VALUES ('Ojars', 'dators')"))
    db.session.commit()

    result = db.session.execute(text("SELECT * FROM Users"))
    user_list = result.fetchall()
    
    print(user_list)
    return render_template("karte.html")

# Checks if it is run directly and then runs it in debug mode
if __name__ == '__main__':
    app.run(debug=True)