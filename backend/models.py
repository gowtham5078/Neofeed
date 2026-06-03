from database import db


# ============================================
# USERS TABLE
# ============================================
class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)

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


# ============================================
# INFANT VITALS TABLE
# ============================================
class InfantVitals(db.Model):
    __tablename__ = "infant_vitals"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    neonate_id = db.Column(
        db.String(100),
        nullable=False
    )

    heart_rate = db.Column(
        db.Float,
        nullable=False
    )

    spo2 = db.Column(
        db.Float,
        nullable=False
    )

    suction_pressure = db.Column(
        db.Float,
        nullable=False
    )

    tongue_motion = db.Column(
        db.Float,
        nullable=False
    )

    lip_compression = db.Column(
        db.Float,
        nullable=False
    )

    timestamp = db.Column(
        db.DateTime,
        server_default=db.func.now()
    )


# ============================================
# PREDICTIONS TABLE
# ============================================
class Prediction(db.Model):
    __tablename__ = "predictions"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    neonate_id = db.Column(
        db.String(100),
        nullable=False
    )

    prediction = db.Column(
        db.String(100),
        nullable=False
    )

    confidence = db.Column(
        db.Float
    )

    timestamp = db.Column(
        db.DateTime,
        server_default=db.func.now()
    )


# ============================================
# ALERTS TABLE
# ============================================
class Alert(db.Model):
    __tablename__ = "alerts"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    neonate_id = db.Column(
        db.String(100),
        nullable=False
    )

    alert_type = db.Column(
        db.String(100),
        nullable=False
    )

    message = db.Column(
        db.Text,
        nullable=False
    )

    severity = db.Column(
        db.String(50),
        nullable=False
    )

    timestamp = db.Column(
        db.DateTime,
        server_default=db.func.now()
    )