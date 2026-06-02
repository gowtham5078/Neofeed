from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from database import db
from models import User
import bcrypt

auth_bp = Blueprint("auth", __name__)


# ---------------------------
# REGISTER
# ---------------------------
@auth_bp.route("/api/register", methods=["POST"])
def register():
    data = request.json
    username = data.get("username")
    password = data.get("password")
    role     = data.get("role", "parent")       # parent | nurse | doctor | admin
    ward     = data.get("ward")
    infant_id = data.get("infantId")

    if not username or not password:
        return jsonify({"success": False, "message": "Username and password required"}), 400

    if User.query.filter_by(username=username).first():
        return jsonify({"success": False, "message": "Username already exists"}), 409

    hashed = bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()

    user = User(
        username=username,
        password=hashed,
        role=role,
        ward=ward,
        infant_id=infant_id
    )
    db.session.add(user)
    db.session.commit()

    return jsonify({"success": True, "message": "User registered successfully"}), 201


# ---------------------------
# LOGIN
# ---------------------------
@auth_bp.route("/api/login", methods=["POST"])
def login():
    data     = request.json
    username = data.get("userId") or data.get("username")
    password = data.get("password")

    if not username or not password:
        return jsonify({"success": False, "message": "Username and password required"}), 400

    user = User.query.filter_by(username=username).first()

    if not user or not bcrypt.checkpw(password.encode(), user.password.encode()):
        return jsonify({"success": False, "message": "Invalid credentials"}), 401

    token = create_access_token(identity={
        "username": user.username,
        "role":     user.role,
        "infantId": user.infant_id,
        "ward":     user.ward
    })

    return jsonify({
        "success":   True,
        "token":     token,
        "role":      user.role,
        "neonateId": user.infant_id,
        "username":  user.username
    })
