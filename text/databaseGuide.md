# When inserting into database
    db.session.execute(text("INSERT INTO Users (name, item) VALUES ('Ojars', 'dators')"))
    db.session.commit()

# When getting from database
    result = db.session.execute(text("SELECT * FROM Users"))
    user_list = result.fetchall()