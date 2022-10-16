import flask
import flask_cors

# <<<<<<< Updated upstream
# from . import views
from .Model.model import db
# =======
from app.Controller import *
from app.Model import *
# >>>>>>> Stashed changes


app = flask.Flask(__name__, instance_relative_config=True)
app.config.from_pyfile("config.py")

flask_cors.CORS(app)

db.init_app(app)


@app.before_first_request
def before_first_request():
    db.create_all()
    with open("instance/data.sql", "r") as f:
        db.session.execute(f.read())
        db.session.commit()


# <<<<<<< Updated upstream
# app.register_blueprint(views.blueprint, url_prefix="/api")
# =======
app.register_blueprint(follow.blueprint, url_prefix="/api")
app.register_blueprint(recipe.blueprint, url_prefix="/api")
app.register_blueprint(review.blueprint, url_prefix="/api")
app.register_blueprint(user.blueprint, url_prefix="/api")
# >>>>>>> Stashed changes
