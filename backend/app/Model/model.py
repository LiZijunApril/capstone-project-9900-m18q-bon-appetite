import flask_sqlalchemy


db = flask_sqlalchemy.SQLAlchemy()


class User(db.Model):
    followed_list = db.relationship(
        "User",
        secondary="followed_association",
        primaryjoin="User.user_id == FollowedAssociation.user_id",
        secondaryjoin="User.user_id == FollowedAssociation.followed_id",
    )
    username = db.Column(db.TEXT, unique=True)
    nickname = db.Column(db.TEXT)
    email_address = db.Column(db.TEXT, unique=True)
    phone = db.Column(db.TEXT)
    hash = db.Column(db.TEXT)
    user_id = db.Column(db.TEXT, primary_key=True)
    recipes = db.relationship("Recipe", primaryjoin="Recipe.user_id == User.user_id", lazy='dynamic')
    reviews = db.relationship("Review", primaryjoin="Review.user_id == User.user_id",lazy='dynamic')

    def to_dict(self):
        return {
            "username": self.username,
            "nickname": self.nickname,
            "email_address": self.email_address,
            "phone": self.phone,
            "user_id": self.user_id,
        }


class FollowedAssociation(db.Model):
    user_id = db.Column(db.ForeignKey(User.user_id), primary_key=True)
    followed_id = db.Column(db.ForeignKey(User.user_id), primary_key=True)
    def to_dict(self):
        return {
            "followed_id": self.followed_id
        }


class FoodType(db.Model):
    food_type_id = db.Column(db.BIGINT, primary_key=True)
    food_type_name = db.Column(db.TEXT)

    recipe = db.relationship("Recipe")

    def to_dict(self):
        return {
            "food_type_id": self.food_type_id,
            "food_type_name": self.food_type_name,
        }


class Recipe(db.Model):
    recipe_id = db.Column(db.BIGINT, primary_key=True)
    recipe_name = db.Column(db.TEXT, unique=True)
    step = db.Column(db.TEXT)
    recipe_img = db.Column(db.TEXT)
    user_id = db.Column(db.ForeignKey(User.user_id))
    user = db.relationship("User", overlaps="recipes")
    created_at = db.Column(db.TIMESTAMP)
    updated_at = db.Column(db.TIMESTAMP)
    food_type_id = db.Column(db.ForeignKey(FoodType.food_type_id))
    food_type = db.relationship("FoodType")
    ingredients= db.relationship("IngredientAssociation",back_populates="recipe")

    def to_dict(self):
        return {
            "recipe_id": self.recipe_id,
            "recipe_img": self.recipe_img,
            "step": self.step,
            "user_id": self.user_id,
            "username": self.user.username,
            "recipe_name": self.recipe_name,
            "food_type_name": self.food_type.to_dict()['food_type_name'],
            "ingredients": [i.to_dict() for i in self.ingredients],
            "created_at": self.created_at,
            "updated_at": self.updated_at,
        }


class Review(db.Model):
    review_id = db.Column(db.BIGINT, primary_key=True)
    created_at = db.Column(db.TIMESTAMP)
    description = db.Column(db.TEXT)
    recipe_id = db.Column(db.ForeignKey(Recipe.recipe_id))
    recipe = db.relationship("Recipe")
    user_id = db.Column(db.ForeignKey(User.user_id))
    user = db.relationship("User", overlaps="reviews")

    def to_dict(self):
        return {
            "review_id": self.review_id,
            "created_at": self.created_at,
            "description": self.description,
        }


class Ingredient(db.Model):
    ingredient_id = db.Column(db.BIGINT, primary_key=True)
    ingredient_type = db.Column(db.TEXT)

    def to_dict(self):
        return {
            "ingredient_id": self.ingredient_id,
            "ingredient_type": self.ingredient_type,
        }


class IngredientAssociation(db.Model):
    recipe_id = db.Column(db.ForeignKey(Recipe.recipe_id), primary_key=True)
    recipe = db.relationship("Recipe")
    ingredient_id = db.Column(db.ForeignKey(Ingredient.ingredient_id), primary_key=True)
    ingredient = db.relationship("Ingredient")

    def to_dict(self):
        return {
            "ingredient_id":self.ingredient_id,
            "ingredient_type": self.ingredient.to_dict()['ingredient_type'],
        }