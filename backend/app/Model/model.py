from datetime import datetime
from email.policy import default
import flask_sqlalchemy


db = flask_sqlalchemy.SQLAlchemy()


class Cooked(db.Model):
    __tablename__ = 'cooked'
    user_id = db.Column(db.TEXT, db.ForeignKey('user.user_id'), primary_key=True)
    recipe_id = db.Column(db.BIGINT, db.ForeignKey('recipe.recipe_id'), primary_key=True)
    # timestamp = db.Column(db.TIMESTAMP, default=datetime.now)

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
    cooked = db.relationship('Cooked', foreign_keys=[Cooked.user_id],primaryjoin="Cooked.user_id == User.user_id",backref=db.backref('recipe', lazy='joined'),lazy='dynamic',cascade='all, delete-orphan')

    def to_dict(self):
        return {
            "username": self.username,
            "nickname": self.nickname,
            "email_address": self.email_address,
            "phone": self.phone,
            "user_id": self.user_id,
        }

    def I_cook(self, cooked_recipe):
        f  = Cooked.query.filter_by(user_id=self.user_id, recipe_id=cooked_recipe.recipe_id).first()
        if f == None:
            k = Cooked(user_id=self.user_id, recipe_id=cooked_recipe.recipe_id)
            db.session.add(k)
            db.session.commit()
            return "Add successful"
        if f is not None:
            db.session.delete(f)
            db.session.commit()
            return "Delete successful"        


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
    cooked_by = db.relationship('Cooked', foreign_keys=[Cooked.recipe_id],primaryjoin="Recipe.recipe_id == Cooked.recipe_id", backref=db.backref('user', lazy='joined'), lazy='dynamic', cascade='all, delete-orphan')

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

    def I_cooked(self, current_user):
        if not self.is_cooked(current_user):
            f = Cooked(user_id=current_user, recipe_id=self)
            db.session.add(f)
            db.session.commit()
            return "Add successful!"

        if self.is_cooked(current_user):
            f  = self.cooked_by.filter_by(user_id=current_user.user_id, recipe_id=self.recipe_id).first()
            db.session.delete(f)
            db.session.commit()
            return "Delete successful"

    def uncooked_by(self, current_user):
        f = self.cooked_by.filter_by(user_id=current_user.user_id).first()
        if f:
            db.session.delete(f)

    def is_cooked(self, current_user):
        if current_user.user_id is None:
            return False
        return self.cooked_by.filter_by(user_id=current_user.user_id).first() is not None

    def is_cooked_by(self):
        return self.cooked_by.filter_by().order_by(self.created_at).all()

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