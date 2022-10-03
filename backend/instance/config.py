import os


BASE_URL = os.environ["BASE_URL"]

SQLALCHEMY_DATABASE_URI = os.environ["DATABASE_URI"]
SQLALCHEMY_TRACK_MODIFICATIONS = False

JWT_ALGORITHM = os.environ["JWT_ALGORITHM"]
JWT_PRIVATE_KEY = os.environ["JWT_PRIVATE_KEY"]
JWT_PUBLIC_KEY = os.environ["JWT_PUBLIC_KEY"]