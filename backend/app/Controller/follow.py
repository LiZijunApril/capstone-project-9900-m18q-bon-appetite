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



blueprint = flask.Blueprint("follow", __name__)



@blueprint.route("/follow/<followed_id>", methods=["POST"])
@token_required
def create_follow_route(followed_id):
    followed_user = db.session.get(User, followed_id)
    if not followed_user:
        return {"status": "Not Found"}, 404

    current_user_id = flask.g.token["user_id"]
    current_user = db.session.get(User, current_user_id)
    if any(u.user_id == followed_id for u in current_user.followed_list):
        return {"status": "Conflict"}, 409

    current_user.followed_list = [followed_user, *current_user.followed_list]
    db.session.merge(current_user)
    db.session.commit()

    return flask.jsonify({"message": "success"})


@blueprint.route("/follow/<followed_id>", methods=["DELETE"])
@token_required
def delete_follow_route(followed_id):
    followed_user = db.session.get(User, followed_id)
    if not followed_user:
        return {"status": "Not Found"}, 404

    current_user_id = flask.g.token["user_id"]
    current_user = db.session.get(User, current_user_id)
    if not any(u.user_id == followed_id for u in current_user.followed_list):
        return {"status": "Conflict"}, 409

    current_user.followed_list = [
        u for u in current_user.followed_list if u.user_id != followed_id
    ]
    db.session.merge(current_user)
    db.session.commit()

    return flask.jsonify({"message": "success"})


@blueprint.route("/followedlist", methods=["GET"])
@token_required
def read_followed_list_route():
    current_user_id = flask.g.token["user_id"]
    followed_list = db.session.query(FollowedAssociation).filter(FollowedAssociation.user_id == current_user_id)
    response = [{**m.to_dict()} for m in followed_list]

    return flask.jsonify(response)