# When inserting into database
    db.session.execute(text("INSERT INTO Users (name, item) VALUES ('Ojars', 'dators')"))
    db.session.commit()

# When getting from database
    result = db.session.execute(text("SELECT * FROM Users"))
    If you need the row
    user_list = result.fetchall()
    If you need a single value
    user_value = result.scalar() 