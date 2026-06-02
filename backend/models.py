from database import db

class User(db.Model):
    __tablename__ = "users"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    username = db.Column(
        db.String(100),
        unique=True,
        nullable=False
    )

    password = db.Column(
        db.String(300),
        nullable=False
    )

    role = db.Column(
        db.String(20),
        nullable=False
    )

    ward = db.Column(
        db.String(50)
    )

    infant_id = db.Column(
        db.String(50)
    )