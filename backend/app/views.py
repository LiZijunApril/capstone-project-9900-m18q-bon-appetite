from functools import wraps
from time import time as now
import uuid
import re

import flask
import schema
import bcrypt
import jwt
from datetime import datetime
from .models import Recipe, db, User


blueprint = flask.Blueprint("views", __name__)


SECOND = 1
MINUTE = 60 * SECOND
HOUR = 60 * MINUTE


def create_token(expires_in=1 * HOUR, **kwargs):
    private_key = flask.current_app.config["JWT_PRIVATE_KEY"]
    algorithm = flask.current_app.config["JWT_ALGORITHM"]
    return jwt.encode(
        {"iat": now(), "exp": now() + expires_in, **kwargs},
        private_key,
        algorithm=algorithm,
    )


def token_required(f):
    @wraps(f)
    def inner(*args, **kwargs):
        if "Authorization" not in flask.request.headers:
            return {"status": "Forbidden"}, 403
        header = flask.request.headers["Authorization"]
        parse = re.match(r"Bearer (.*)", header)
        if not parse:
            return {"status": "Forbidden"}, 403
        (token,) = parse.groups()
        try:
            public_key = flask.current_app.config["JWT_PUBLIC_KEY"]
            algorithm = flask.current_app.config["JWT_ALGORITHM"]
            claims = jwt.decode(token, public_key, algorithms=[algorithm])
        except:
            return {"status": "Forbidden"}, 403
        flask.g.token = claims
        return f(*args, **kwargs)

    return inner


EMAIL_REGEX = r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b"


def is_email(email_address):
    return re.fullmatch(EMAIL_REGEX, email_address)


REGISTER_SCHEMA = schema.Schema(
    {
        "email_address": schema.And(str, len, is_email),
        "display_name": schema.And(str, len),
        "password": schema.And(str, len),
    }
)


@blueprint.route("/register", methods=["POST"])
def register_route():
    if not isinstance(flask.request.json, dict):
        return {"status": "Bad request"}, 400
    try:
        request = REGISTER_SCHEMA.validate(flask.request.json.copy())
    except:
        return {"status": "Bad request"}, 400

    email_address = request["email_address"]
    display_name = request["display_name"]
    password = request["password"]

    if db.session.query(User).filter(User.email_address == email_address).first():
        return {"status": "Conflict"}, 409

    user = User()
    user.user_id = str(uuid.uuid4())
    user.email_address = email_address
    user.display_name = display_name
    user.hash = bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()
    db.session.merge(user)
    db.session.commit()

    user = db.session.get(User, user.user_id)
    return flask.jsonify({"token": create_token(**user.to_dict())})


TOKEN_SCHEMA = schema.Schema(
    {"email_address": schema.And(str, len, is_email), "password": schema.And(str, len)}
)


@blueprint.route("/login", methods=["POST"])
def login_route():
    if not isinstance(flask.request.json, dict):
        return {"status": "Bad request"}, 400
    try:
        request = TOKEN_SCHEMA.validate(flask.request.json.copy())
    except:
        return {"status": "Bad request"}, 400

    email_address = request["email_address"]
    password = request["password"]

    user = db.session.query(User).filter(User.email_address == email_address).first()
    if user is None:
        return {"status": "Unauthorized"}, 401
    if not bcrypt.checkpw(password.encode(), user.hash.encode()):
        return {"status": "Unauthorized"}, 401
    return flask.jsonify({"token": create_token(**user.to_dict())})


READ_RECIPES_SCHEMA = schema.Schema(
    {
        schema.Optional("keywords"): schema.And(str, schema.Use(str.split)),
        schema.Optional("limit", default=100): schema.And(
            schema.Use(int), lambda i: i > 0
        ),
    }
)


@blueprint.route("/recipes", methods=["GET"])
@token_required
def read_recipes_route():
    try:
        request = READ_RECIPES_SCHEMA.validate(flask.request.args.copy())
    except:
        return {"status": "Bad request"}, 400

    limit = request["limit"]
    keywords = request["keywords"] if "keywords" in request else None
    recipes = db.session.query(Recipe)

    if keywords:
        filters = [
            db.func.lower(Recipe.recipe_name).like("%" + k.lower() + "%")
            for k in keywords
        ]
        recipes = recipes.filter(db.and_(*filters))

    response = [{**m.to_dict()} for m in recipes.limit(limit).all()]
    return flask.jsonify(response)


@blueprint.route("/recipe/<recipe_id>", methods=["GET"])
@token_required
def read_recipe_route(recipe_id):
    recipe = db.session.get(Recipe, recipe_id)
    if not recipe:
        return {"status": "Not Found"}, 404

    response = {**recipe.to_dict()}
    return flask.jsonify(response)


CREATE_RECIPE_SCHEMA = schema.Schema(
    {
        "recipe_name": schema.And(str, len),
        "food_type_id": schema.And(schema.Use(int), lambda i: i > 0),
        "ingredients": schema.And(str, len),
        "nutrition": schema.And(str, len),
    }
)


@blueprint.route("/recipe", methods=["POST"])
@token_required
def create_recipe_route():
    try:
        request = CREATE_RECIPE_SCHEMA.validate(flask.request.json.copy())
    except:
        return {"status": "Bad request"}, 400

    if (
        db.session.query(Recipe)
        .filter(Recipe.recipe_name == request["recipe_name"])
        .first()
    ):
        return {"status": "Conflict"}, 409

    recipe = Recipe()

    recipe.created_at = datetime.now()
    recipe.recipe_name = request["recipe_name"]
    recipe.food_type_id = request["food_type_id"]
    recipe.ingredients = request["ingredients"]
    recipe.nutrition = request["nutrition"]
    recipe.user_id = flask.g.token["user_id"]
    db.session.merge(recipe)
    db.session.commit()

    return flask.jsonify({"message": "success"})


@blueprint.route("/recipe/<recipe_id>", methods=["DELETE"])
@token_required
def delete_recipe_route(recipe_id):
    the_recipe = db.session.get(Recipe, recipe_id)
    if not the_recipe:
        return {"status": "Not Found"}, 404
        
    current_user_id = flask.g.token["user_id"]
    if the_recipe.user_id != current_user_id:
        return {"status": "Permission denied"}, 401

    db.session.delete(the_recipe)
    db.session.commit()
    return flask.jsonify({"message": "success"})



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

    return  flask.jsonify({"message": "success"})


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

    return  flask.jsonify({"message": "success"})
