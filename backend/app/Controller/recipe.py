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


blueprint = flask.Blueprint("recipe", __name__)


READ_RECIPES_SCHEMA = schema.Schema(
    {
        schema.Optional("keywords"): schema.And(str, schema.Use(str.split)),
        "page_index": schema.And(schema.Use(int), lambda i: i > 0),
        "page_size": schema.And(schema.Use(int), lambda i: i > 0)
    }
)


@blueprint.route("/recipes", methods=["GET"])
@token_required
def read_recipes_route():
    try:
        request = READ_RECIPES_SCHEMA.validate(flask.request.args.copy())
    except:
        return {"status": "Bad request"}, 400

    page_index = request["page_index"]
    page_size = request["page_size"]
    keywords = request["keywords"] if "keywords" in request else None
    recipes = db.session.query(Recipe)

    if keywords:
        filters = [
            db.func.lower(Recipe.recipe_name).like("%" + k.lower() + "%")
            for k in keywords
        ]
        recipes = recipes.filter(db.and_(*filters))
    recipes = recipes.paginate(int(page_index), int(page_size),False).items
    response = [{**m.to_dict()} for m in recipes]
    return flask.jsonify(response)


@blueprint.route("/recipe/<recipe_id>", methods=["GET"])
@token_required
def read_recipe_route(recipe_id):
    recipe = db.session.get(Recipe, recipe_id)
    if not recipe:
        return {"status": "Not Found"}, 404

    return flask.jsonify(recipe.to_dict())


UPDATE_RECIPE_SCHEMA = schema.Schema(
    {
        "recipe_name": schema.And(str, len),
        "step": schema.And(str, len),
        "recipe_img": schema.And(str, len),
        "food_type_id": schema.And(schema.Use(int), lambda i: i > 0),
        "ingredients": schema.And(str, len),
    }
)


@blueprint.route("/recipe/<recipe_id>", methods=["PUT"])
@token_required
def update_recipe_route(recipe_id):
    try:
        request = UPDATE_RECIPE_SCHEMA.validate(flask.request.json.copy())
    except schema.SchemaError as error:
        return {"status": "Bad request", "message": str(error)}, 400

    current_user_id = flask.g.token["user_id"]
    recipe = db.session.get(Recipe, recipe_id)
    if not recipe:
        return {"status": "Not Found"}, 404
    if recipe.user_id != current_user_id:
        return {"status": "Permission denied"}, 401

    for k in request:
        if k == "recipe_name":
            recipe.recipe_name = request["recipe_name"]
        elif k == "food_type_id":
            recipe.food_type_id = request["food_type_id"]
        elif k == "ingredients":
            db.session.query(IngredientAssociation).filter(IngredientAssociation.recipe_id == recipe_id ).delete()
            db.session.commit()
            ingredients = json.loads(request["ingredients"])
            ingredients = [IngredientAssociation(ingredient_id=l,recipe_id=recipe_id) for l in ingredients]
            db.session.add_all(ingredients)
            db.session.commit()

        elif k == "recipe_img":
            recipe.recipe_img = request["recipe_img"]
        elif k == "step":
            recipe.step = request["step"]

    recipe.updated_at = datetime.now()

    db.session.merge(recipe)
    db.session.commit()

    return flask.jsonify(recipe.to_dict())


CREATE_RECIPE_SCHEMA = schema.Schema(
    {
        "recipe_name": schema.And(str, len),
        "step": schema.And(str, len),
        "recipe_img": schema.And(str, len),
        "food_type_id": schema.And(schema.Use(int), lambda i: i > 0),
        "ingredients": schema.And(str, len),
    }
)


@blueprint.route("/recipe", methods=["POST"])
@token_required
def create_recipe_route():
    try:
        request = CREATE_RECIPE_SCHEMA.validate(flask.request.json.copy())
    except schema.SchemaError as error:
        return {"status": "Bad request", "message": str(error)}, 400

    if (
        db.session.query(Recipe)
        .filter(Recipe.recipe_name == request["recipe_name"])
        .first()
    ):
        return {"status": "Conflict"}, 409

    recipe = Recipe()

    recipe.created_at = datetime.now()
    recipe.recipe_name = request["recipe_name"]
    recipe.recipe_img = request["recipe_img"]
    recipe.step = request["step"]
    recipe.food_type_id = request["food_type_id"]
    recipe.user_id = flask.g.token["user_id"]
    db.session.merge(recipe)
    db.session.commit()

    addRecipe = (
        db.session.query(Recipe)
        .filter(Recipe.recipe_name == request["recipe_name"])
        .first()
    )
    ingredients = json.loads(request["ingredients"])
    recipe_id = addRecipe.recipe_id
    ingredients = [IngredientAssociation(ingredient_id=l,recipe_id=recipe_id) for l in ingredients]
    db.session.add_all(ingredients)
    db.session.commit()

    return flask.jsonify(addRecipe.to_dict())


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


@blueprint.route("/foodtypes", methods=["GET"])
@token_required
def read_foodtypes_route():
    food_types = db.session.query(FoodType)
    response = [{**m.to_dict()} for m in food_types]
    return flask.jsonify(response)




READ_INGREDIENTS_SCHEMA = schema.Schema(
    {
        "page_index": schema.And(schema.Use(int), lambda i: i > 0),
        "page_size": schema.And(schema.Use(int), lambda i: i > 0)
    }
)

@blueprint.route("/ingredients", methods=["GET"])
@token_required
def read_ingredients_route():
    try:
        request = READ_INGREDIENTS_SCHEMA.validate(flask.request.args.copy())
    except schema.SchemaError as error:
        return {"status": "Bad request", "message": str(error)}, 400
    page_index = request["page_index"]
    page_size = request["page_size"]
    ingredients = db.session.query(Ingredient).paginate(int(page_index), int(page_size),False).items
    response = [{**m.to_dict()} for m in ingredients]
    return flask.jsonify(response)