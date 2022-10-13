from functools import wraps
from time import time as now
import uuid
import re
import json
import flask
import schema
import bcrypt
import jwt
from datetime import datetime
from app.Model import *
from app.Utils import *

blueprint = flask.Blueprint("users", __name__)

EMAIL_REGEX = r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b"


def is_email(email_address):
    return re.fullmatch(EMAIL_REGEX, email_address)


REGISTER_SCHEMA = schema.Schema(
    {
        "email_address": schema.And(str, len, is_email),
        "username": schema.And(str, len),
        "nickname": schema.And(str, len),
        "phone": schema.And(str, len),
        "password": schema.And(str, len),
    }
)


@blueprint.route("/register", methods=["POST"])
def register_route():
    if not isinstance(flask.request.json, dict):
        return {"status": "Bad request"}, 400
    try:
        request = REGISTER_SCHEMA.validate(flask.request.json.copy())
    except schema.SchemaError as error:
        return {"status": "Bad request", "message": str(error)}, 400

    email_address = request["email_address"]
    username = request["username"]
    nickname = request["nickname"]
    phone = request["phone"]

    password = request["password"]

    if db.session.query(User).filter(User.email_address == email_address).first():
        return {"status": "Conflict"}, 409

    user = User()
    user.user_id = str(uuid.uuid4())
    user.email_address = email_address
    user.username = username
    user.nickname = nickname
    user.phone = phone
    user.hash = bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()
    db.session.merge(user)
    db.session.commit()

    user = db.session.get(User, user.user_id)
    return flask.jsonify({"token": create_token(**user.to_dict())})


EXIST_EMAIL_SCHEMA = schema.Schema({"email_address": schema.And(str, len, is_email)})


@blueprint.route("/existemail", methods=["POST"])
def exist_email_route():
    if not isinstance(flask.request.json, dict):
        return {"status": "Bad request"}, 400
    try:
        request = EXIST_EMAIL_SCHEMA.validate(flask.request.json.copy())
    except schema.SchemaError as error:
        return {"status": "Bad request", "message": str(error)}, 400

    email_address = request["email_address"]
    if db.session.query(User).filter(User.email_address == email_address).first():
        return flask.jsonify({"is_exist": 1})

    return flask.jsonify({"is_exist": 0})


EXIST_USERNAME_SCHEMA = schema.Schema({"username": schema.And(str, len)})


@blueprint.route("/existusername", methods=["POST"])
def exist_username_route():
    if not isinstance(flask.request.json, dict):
        return {"status": "Bad request"}, 400
    try:
        request = EXIST_USERNAME_SCHEMA.validate(flask.request.json.copy())
    except schema.SchemaError as error:
        return {"status": "Bad request", "message": str(error)}, 400

    username = request["username"]
    if db.session.query(User).filter(User.username == username).first():
        return flask.jsonify({"is_exist": 1})

    return flask.jsonify({"is_exist": 0})


TOKEN_SCHEMA = schema.Schema(
    {"username": schema.And(str, len), "password": schema.And(str, len)}
)


@blueprint.route("/login", methods=["POST"])
def login_route():
    if not isinstance(flask.request.json, dict):
        return {"status": "Bad request"}, 400
    try:
        request = TOKEN_SCHEMA.validate(flask.request.json.copy())
    except schema.SchemaError as error:
        return {"status": "Bad request", "message": str(error)}, 400

    username = request["username"]
    password = request["password"]

    user = db.session.query(User).filter(User.username == username).first()
    if user is None:
        return {"status": "Unauthorized"}, 401
    if not bcrypt.checkpw(password.encode(), user.hash.encode()):
        return {"status": "Unauthorized"}, 401
    return flask.jsonify({"token": create_token(**user.to_dict())})





@blueprint.route("/currentuser", methods=["GET"])
@token_required
def read_current_user_route():
    current_user_id = flask.g.token["user_id"]
    current_user = db.session.get(User, current_user_id)
    recipes = current_user.recipes

    return flask.jsonify({**current_user.to_dict(),"recipes":[{**recipe.to_dict()} for recipe in recipes]})


@blueprint.route("/user/<user_id>", methods=["GET"])
@token_required
def read__user_route(user_id):

    current_user_id = flask.g.token["user_id"]
    current_user_followed_list = db.session.query(FollowedAssociation).filter(User.user_id == current_user_id)
    if user_id == current_user_id:
        return read_current_user_route()

    user = db.session.query(User).filter(User.user_id == user_id).first()
    if not user:
        return {"status": "Not Found"}, 404

    recipes = user.recipes
    is_followed = 1 if (any(f.followed_id == user.user_id for f in current_user_followed_list) ) else 0

    return flask.jsonify({**user.to_dict(),"recipes":[{**recipe.to_dict()} for recipe in recipes],"is_followed":is_followed })