from functools import wraps
from time import time as now
import re
import flask
import jwt


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