# Auth

## `POST` `/api/register`

Registers new users to the system, returns token.

### Request

- `email_address` (required)
- `display_name` (required)
- `password` (required)

e.g.

```
{
  "email_address": "test@gmail.com",
  "display_name": "test",
  "password": "testpassword"
}
```

### Response(s)

- `400` (on bad request, i.e. bad params)
- `409` (conflict, user already exists)
- `200` +  token maps


## `POST` `/api/login`

Creates new token for user.

### Request

- `email_address` (required)
- `password` (required)

e.g.

```
{
  "email_address": "test@gmail.com",
  "password": "testpassword"
}
```

### Response(s)

- `400` (on bad request, i.e. bad params)
- `401` (on bad credentials, no distinction is made for unknown `email_address` and bad `password`)
- `200` +  token maps



# Recipe

## `GET` `/api/recipes`

Get recipes by keywords

### Request(s)

Requires a token passed via HTTP header

```
Authorization: Bearer <token>
```

- `keywords` (optional)
- `display_name` (optional)

###　Response

Example:

`GET` `/api/recipes?limit=10&keywords=the`

```
[
    {
        "created_at": "Sun, 02 Oct 2022 09:11:02 GMT",
        "food_type_name": "Healthy",
        "ingredients": "['prepared pizza crust', 'sausage patty', 'eggs', 'milk', 'salt and pepper', 'cheese']",
        "nutrition": "[173.4, 18.0, 0.0, 17.0, 22.0, 35.0, 1.0]",
        "recipe_id": 2,
        "recipe_name": "all in the kitchen  chili",
        "updated_at": null,
        "user_id": "5627c307-2175-4b8c-a796-001710ed414c"
    }
]

```


## `GET` `/recipe/<recipe_id>`

Get recipes by id

### Request(s)

Requires a token passed via HTTP header

```
Authorization: Bearer <token>
```

###　Response

- `404` , recipe cannot be found

Example:

```
{
    "created_at": "Wed, 21 Sep 2022 16:58:23 GMT",
    "food_type_name": "Veg",
    "ingredients": "['prepared pizza crust', 'sausage patty', 'eggs', 'milk', 'salt and pepper', 'cheese']",
    "nutrition": "[173.4, 18.0, 0.0, 17.0, 22.0, 35.0, 1.0]",
    "recipe_id": 1,
    "recipe_name": "a bit different  breakfast pizza",
    "updated_at": null,
    "user_id": "5627c307-2175-4b8c-a796-001710ed414c"
}

```


## `POST` `/recipe`

Add recipe.

### Request(s)

Requires a token passed via HTTP header

```
Authorization: Bearer <token>
```

- `recipe_name` 
- `food_type_id` 
- `ingredients` 
- `nutrition` 

e.g.

```
{
    "recipe_name":"all in the kitchen  chili",
    "food_type_id":1,
    "ingredients":"['prepared pizza crust', 'sausage patty', 'eggs', 'milk', 'salt and pepper', 'cheese']",
    "nutrition":"[173.4, 18.0, 0.0, 17.0, 22.0, 35.0, 1.0]"
}

```

###　Response

- `400` , Parameter error
- `409` , recipe name is exist
- `200` , success
e.g.

```
{
    "message": "success"
}

```


## `DELETE` `/recipe/<recipe_id>`

delete recipe by id

### Request(s)

Requires a token passed via HTTP header

```
Authorization: Bearer <token>
```

###　Response

- `404` , recipe cannot be found
- `401` , Permission denied(the recipe does not belong to the current user)
- `200` , success

e.g.

```
{
    "message": "success"
}

```


# Follow

## `GET` `/follow/<followed_id>`

folow other user by user id

### Request(s)

Requires a token passed via HTTP header

```
Authorization: Bearer <token>
```

###　Response

- `404` , followed user cannot be found
- `409` , already followed
- `200` , success

e.g.

```
{
    "message": "success"
}

```


## `GET` `/follow/<followed_id>`

unfolow other user by user id

### Request(s)

Requires a token passed via HTTP header

```
Authorization: Bearer <token>
```

###　Response

- `404` , unfollowed user cannot be found
- `409` , not followed the user before
- `200` , success 

e.g.

```
{
    "message": "success"
}

```