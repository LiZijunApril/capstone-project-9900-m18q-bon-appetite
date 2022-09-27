Bon Appetite

##Docker
### Get start
1. get docker:  https://www.docker.com/

2. for Development:

**Start** the stack:

```sh
   $ docker compose up
```

You should then be able to access the backend from `http://localhost/8000/`.

**Rebuild** the stack:

```sh
   $ docker compose up --build --force-recreate --no-deps
```

**Stop** the stack:

```sh
  $ docker compose stop
```