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


blueprint = flask.Blueprint("review", __name__)

CREATE_REVIEW_SCHEMA = schema.Schema(
    {
        "recipe_id": schema.And(schema.Use(int), lambda i: i > 0),
        "description": schema.And(str, len),
    }
)


@blueprint.route("/review", methods=["POST"])
@token_required
def create_review_route():
    try:
        request = CREATE_REVIEW_SCHEMA.validate(flask.request.json.copy())
    except schema.SchemaError as error:
        return {"status": "Bad request", "message": str(error)}, 400

    recipe = db.session.query(Recipe, request["recipe_id"])
    if not recipe:
        return {"status": "Not Found"}, 404

    review = Review()
    review.created_at = datetime.now()
    review.recipe_id = request["recipe_id"]
    review.description = request["description"]
    review.user_id = flask.g.token["user_id"]
    db.session.merge(review)
    db.session.commit()

    return flask.jsonify({"message": "success"})


READ_REVIEW_SCHEMA = schema.Schema(
    {
        "recipe_id": schema.And(schema.Use(int), lambda i: i > 0),
    }
)


@blueprint.route("/review", methods=["GET"])
@token_required
def read_review_route():
    try:
        request = READ_REVIEW_SCHEMA.validate(flask.request.args.copy())
    except:
        return {"status": "Bad request"}, 400

    recipe = db.session.query(Recipe, request["recipe_id"])
    if not recipe:
        return {"status": "Not Found"}, 404

    reviews = (
        db.session.query(Review).filter(Review.recipe_id == request["recipe_id"]).all()
    )
    response = [{**m.to_dict()} for m in reviews]
    return flask.jsonify(response)