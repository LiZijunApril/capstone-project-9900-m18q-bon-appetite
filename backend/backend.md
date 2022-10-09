# Auth

## `POST` `/api/register`

Registers new users to the system, returns token.

### Request

- `username` (required)
- `password` (required)
- `nickname` (required)
- `phone` (required)
- `email_address` (required)

e.g.

```
{
    "username": "testu",
    "password": "123456",
    "nickname": "Jack",
    "phone": "18525436598",
    "email_address":"test@gmail.com"
}
```

### Response(s)

- `400` (on bad request, i.e. bad params)
- `409` (conflict, user already exists)
- `200` +  token maps


## `POST` `/api/login`

Creates new token for user.

### Request

- `username` (required)
- `password` (required)

e.g.

```
{
  "username": "testu",
  "password": "123456"
}
```

### Response(s)

- `400` (on bad request, i.e. bad params)
- `401` (on bad credentials, no distinction is made for unknown `email_address` and bad `password`)
- `200` +  token maps


## `POST` `/api/existemail`

check if the email address exists

### Request

- `email_address` (required)

### Response(s)

- `400` (on bad request, i.e. bad params)
- `200` +   1:exsit  0:not exsit

e.g.

```
{
    "is_exist": 0
}


```


## `POST` `/api/existusername`

check if the username exists

### Request

- `username` (required)

### Response(s)

- `400` (on bad request, i.e. bad params)
- `200` +   1:exsit  0:not exsit

e.g.

```
{
    "is_exist": 0
}


```




# Recipe

## `GET` `/api/recipes`

Get recipes by keywords

### Request(s)

Requires a token passed via HTTP header

```
Authorization: Bearer <token>
```

Params

- `keywords` (optional)
- `display_name` (optional)

###　Response

Example:

`GET` `/api/recipes?limit=10&keywords=the`

```
[
       {
        "created_at": "Wed, 21 Sep 2022 16:58:23 GMT",
        "food_type_name": "Veg",
        "ingredients": "[''prepared pizza crust'', ''sausage patty'', ''eggs'', ''milk'', ''salt and pepper'', ''cheese'']",
        "nutrition": "[173.4, 18.0, 0.0, 17.0, 22.0, 35.0, 1.0]",
        "recipe_id": 1,
        "recipe_img": "data:image/png;base64,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",
        "recipe_name": "a bit different  breakfast pizza",
        "updated_at": null,
        "user_id": "5627c307-2175-4b8c-a796-001710ed414c"
    }
]

```


## `GET` `/api/recipe/<recipe_id>`

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
        "ingredients": "[''prepared pizza crust'', ''sausage patty'', ''eggs'', ''milk'', ''salt and pepper'', ''cheese'']",
        "nutrition": "[173.4, 18.0, 0.0, 17.0, 22.0, 35.0, 1.0]",
        "recipe_id": 1,
        "recipe_img": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAABR1BMVEX////lQzU0o1NCgO/2twQ9fu9rl/FynvPt8v0xee72tADlQTMwolDkPS7kOyv2uADkNCL98O8ln0kpoEwanUPkNibkMR3nVEjp9ez3zMntioPrenL+9vX++vr74uD73Zj3+v7f7+P519T2xMHwmZP40c7ukYroYFXnUUXzsq3xpaDkOzb98dj/+/HA0vn74auRsvX868VVjPDM2/rK5dGDw5NjtXmn1LJXsG/B4MlMrGZCfffi8eX1u7fsgXrpaF/jKA7re3PyqZXqb2XujDvyoiv1syHpYz3sf0D3wDTwlzPnVT350XTrc0H63Z7nWTD4y1z++ej3w0mnwvf4zm2auPbe5/yFtFzJvUyeul5psF3WvUGVyqKuulXjvTSz0J2ixd1TnrRKo4xMjdtPl79Jn5lGpnFJiORhs3ZKkslJm6Y+pGd8quAEW6SpAAAHw0lEQVR4nO2b2X/bRBCAZUVJG12WddnO4cZOYjtp0yP1FZPELYVCIUAPChTcQjlKKPz/z8i3LUurlbUrrf2b76V9SKX9MrMzu2OX4wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADAk0yhlM/v7+fzh4XMbtKLIcpO4eL4siLZDlof5y+PlOz2wUUpk/TaopPZL3ckW7MUSUrNIEmKatlKZ+uikPQaI1A6qEiaqrjcZjwVVVOz5VLSK12IUtlZvDtynpaS84NLJ5k5ztoqht3YUrWzx0u0KUuXihVCbyhpKZdLsiUPO1aY8E0H0tpegmQtdWxUaQlwVB5tMx7HwratLKo3QNG2GN6PuweqGs2vF0dLOkpaxI98NXx98XTUKkym6s6WTcSvh2IzGMbDrEXKL9UL4zZru/FYi1hh3KgpphrHzhONWIaOkB4xlKmFavQS6oFdTlpsxKFCOENHaNtsXJT3yWfoCPtx0nI9jsg1CTdqZSdpO46uYGfVBVc+glkWysz+qkewRK+KqhUWTm2ZFDVBpcpCBHcroRu9NCTo59QsC4LcVqjLhKJamnP/r2az2api25aK+PWwkaLchY1tJ6ma3SkfHWYyO30ymcOjcsXWfAZWSpYJwQxuGXX0UuW8R+XfyW9JmsfUio09yHGYm1DSUluIi17+8dxklZE96Nx48fyqRwHrLbimV4ykKFfAmTlJlnSBcS7JlKcmkEqVDUGug5GjinqA+bRCZ3R0YGUP4tRRSeuEGAkeDS7RrKQotxt8mJHs41CPLFRUhlKUOw7s9YoUelL2RFNSrAhmAo9dCx1KyswIcp8GhdB6stBzmRE8SX92GxlEi5ER2cLcEtOfVxGK1nbSK4yKIAjpp1/c9t2DnaQXGJV7Yk9R+NInUxUmxiuReCb0SX/lqSipTH70F4Y7ojBUfPr1fKZK2n7SC4zM1cjQydRv5hStraTXF5kTYUJ6rm1IqaXfhNwDUZh2dLUN+zDp9UXnasbQ1TZUJj4qikhamCWdnrSNFaij7iR1tQ2Vmc9sI3Br3nDcNlYihKN271IctA31MunVEeDEI4TjtmGvQgg9tuG4bSjZpFdHgm/9DJ3N+N1F0qsjwXNfQ2czniS9OhJ4Fpohz/EecXMjIjdoCr5w9/spxFuYhpvr0Vjbo2h4xz9JBfEOruFaNNZvUjT0LaU9MLdhZMPNHygaep1oRrzEfEZ0w7sUDa/8DcWr2AxfUTT8HmF4Ly7D9fsUDRHtUHwQmyHNdvHSfxvillLGDRENX3wRm+EGPcETlCHumS264ekeGC5u6C8oiLgPYduQiRiugWEUmKilVA3Z6Ic0DZ8jDOM709A0ZONcSrHjs3G3oGrIxP2Q6rmUiTs+1dsTE3OazdcUDcnM2qIa0rzjE5mXRjZ8SNMQdclP421EvHkpypDmrA1RTEXhxzM8w40bGKCCSHNe6l9MxXdt45rce276+62fknuNBz6fHwriT7zMmzli73nov1mptkPOp9SIwhvewagTe81rf0OqzYLz3ojis5/5PjKxIG74lxq6pdRzI4q/8EP0LqG3oDrKJtVCw81/n0YQ3/JjSAXxFapnknmFP64LlNMkJoLEdiLCj+qptM9smjpNgp/GLJJ4x11UktL85KnPyXSaOk1iFpkn8Y5TxJFmc4/EG5BMp+kb3g2JYoMKIdXr75Bxmo6bxKxiLeoL9pAhpHqxGPLM3SRm8zRyPb2PKqTUe0WP4beG3noKOoqtaI9HHNjiSVKu//8tZpuEK08bUR6+h/CLKUl7JzfxnVM1/RWjdEXEeW2N8jdNJpwI7iZBTvEGcgJA+14x5lcdbbi4IrLK0L7eT5ELEFx4L6IjSPvyO003KIi8wYc/v+1tBAyp6J/YJqAKzQBZb4Z85sM1ZJGJNYQcd2YGJipv1kP1/t8+CRCMNYQcd20EKxo8fhhrbfN9gGKsIeS4cwxDp+C08U6pxYYp8+bvqANp3CHkuGZgsekhm63gKWqtrvd/X/q/f3yCCGE8B7YpWoHFZujYbqL2Y67Z0kf5IMt/+ivG1gsnS8MoNoN163qr6d07io6ePvWbks2//ArqJvXpxTw49XQsafL1Zi03DmYuVzzrNmRTdyeC+eFvz6ZI9cN7X+pYW3Ekaeimybdb141Gq9XmdVM3PNPc4P/xylTaU1If2lgFdcZzCOpH9I/zbSOJHO2RCz7aLIL54dSVqTG3wimKYfIUH6PtahsxXQu9CFFtwiAb76cVE9qEA5p0FJ0DzqRtxDS6iFtxcsBJqspQVxwdcDbjmlwkoGh+XF9nQdApN3MnE0LozgGHBUHncoBs4REwjP+SdhtyHv50g4UZdhJCkQaFzSibeN/QiYkm8c24yLiOKrU22SOc3iD39RxS1E1yYZRZ2oITajypMOrt86RlfOgaJIqqITMZwAHnjcipKoccJcdO7TqSo2w2GCuhHtSu9UVz1dCvI3/TIRaKdXmB9uj8mzr78RuRa7bNcIE0AkbHDFLsyqb3xNAjeqbcXZ7wTVHstnifuehYTjZM3m8mvhTkzurXvKl7eMr9IXG70a0tWXJ60Bvh11u82UfXB38ajltzBeRmyBWLtdrZWa1WO18xMwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAQ/wNhUPDo3tE+ZAAAAABJRU5ErkJggg==",
        "recipe_name": "a bit different  breakfast pizza",
        "updated_at": null,
        "user_id": "5627c307-2175-4b8c-a796-001710ed414c"
    }

```


## `POST` `/api/recipe`

Add recipe.

### Request(s)

Requires a token passed via HTTP header

```
Authorization: Bearer <token>
```

- `recipe_name` 
- `recipe_img` 
- `food_type_id` 
- `ingredients` 
- `nutrition` 
- `step`

e.g.

```
{
	"recipe_name":"all in the kitchen  chili",
	"food_type_id":1,
	"ingredients":"['prepared pizza crust', 'sausage patty', 'eggs', 'milk', 'salt and pepper', 'cheese']",
	"nutrition":"[173.4, 18.0, 0.0, 17.0, 22.0, 35.0, 1.0]",
	"recipe_img":"data:image/png;base64,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",
    "step" : "[{describe: '1111', imageFile: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAfQA…AgYg7AAhE3AFAIOIOAAL9L5nCR5mfJ4GsAAAAAElFTkSuQmCC'},{describe: '2222', imageFile: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAfQA…AgYg7AAhE3AFAIOIOAAL9L5nCR5mfJ4GsAAAAAElFTkSuQmCC'}]"
	
}

```

###　Response

- `400` , Parameter error
- `409` , recipe name is exist
- `200` , success
e.g.

```
{
    "created_at": "Mon, 10 Oct 2022 00:35:24 GMT",
    "food_type_name": "Healthy",
    "ingredients": "['prepared pizza crust', 'sausage patty', 'eggs', 'milk', 'salt and pepper', 'cheese']",
    "nutrition": "[173.4, 18.0, 0.0, 17.0, 22.0, 35.0, 1.0]",
    "recipe_id": 3,
    "recipe_img": "data:image/png;base64,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",
    "recipe_name": "all in the kitchen  chili",
    "step": "[{describe: '1111', imageFile: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAfQA…AgYg7AAhE3AFAIOIOAAL9L5nCR5mfJ4GsAAAAAElFTkSuQmCC'},{describe: '2222', imageFile: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAfQA…AgYg7AAhE3AFAIOIOAAL9L5nCR5mfJ4GsAAAAAElFTkSuQmCC'}]",
    "updated_at": null,
    "user_id": "c87b37be-77ec-41f5-92e2-740150f75a7f",
    "username": "testu"
}

```


## `DELETE` `/api/recipe/<recipe_id>`

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

## `PUT` `/api/recipe/<recipe_id>`

update recipe by id

### Request(s)

Requires a token passed via HTTP header

```
Authorization: Bearer <token>
```

- `recipe_name` 
- `recipe_img` 
- `food_type_id` 
- `ingredients` 
- `nutrition` 
- `step`

e.g.

```
{
	"recipe_name":"all in the kitchen  chilis",
	"food_type_id":1,
	"ingredients":"['prepared pizza crust', 'sausage patty', 'eggs', 'milk', 'salt and pepper', 'cheese']",
	"nutrition":"[173.4, 18.0, 0.0, 17.0, 22.0, 35.0, 1.0]",
	"recipe_img":"data:image/png;base64,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",
    "step" : "[{describe: '1111', imageFile: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAfQA…AgYg7AAhE3AFAIOIOAAL9L5nCR5mfJ4GsAAAAAElFTkSuQmCC'},{describe: '2222', imageFile: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAfQA…AgYg7AAhE3AFAIOIOAAL9L5nCR5mfJ4GsAAAAAElFTkSuQmCC'}]"
	
}

```

###　Response

- `404` , recipe cannot be found
- `401` , Permission denied(the recipe does not belong to the current user)
- `200` , success

e.g.

```
{
    "created_at": "Mon, 10 Oct 2022 00:35:24 GMT",
    "food_type_name": "Healthy",
    "ingredients": "['prepared pizza crust', 'sausage patty', 'eggs', 'milk', 'salt and pepper', 'cheese']",
    "nutrition": "[173.4, 18.0, 0.0, 17.0, 22.0, 35.0, 1.0]",
    "recipe_id": 3,
    "recipe_img": "data:image/png;base64,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",
    "recipe_name": "all in the kitchen  chilis",
    "step": "[{describe: '1111', imageFile: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAfQA…AgYg7AAhE3AFAIOIOAAL9L5nCR5mfJ4GsAAAAAElFTkSuQmCC'},{describe: '2222', imageFile: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAfQA…AgYg7AAhE3AFAIOIOAAL9L5nCR5mfJ4GsAAAAAElFTkSuQmCC'}]",
    "updated_at": "Mon, 10 Oct 2022 00:37:10 GMT",
    "user_id": "c87b37be-77ec-41f5-92e2-740150f75a7f",
    "username": "testu"
}

```


## `GET` `/api/foodtypes`

get all food types

### Request(s)

Requires a token passed via HTTP header

```
Authorization: Bearer <token>

```

###　Response

Example:

```
[
    {
        "food_type_id": 1,
        "food_type_name": "Healthy"
    },
    {
        "food_type_id": 2,
        "food_type_name": "Veg"
    },
    {
        "food_type_id": 3,
        "food_type_name": "Non-veg"
    },
    {
        "food_type_id": 4,
        "food_type_name": "Veg dessert"
    },
    {
        "food_type_id": 5,
        "food_type_name": "Non-Veg dessert"
    }
]

```





# Follow

## `POST` `/api/follow/<followed_id>`

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


## `DELETE` `/api/follow/<followed_id>`

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

# Review

## `GET` `/api/review`

Get recipe reviews

### Request(s)

Requires a token passed via HTTP header

```
Authorization: Bearer <token>
```

Params

- `recipe_id` (recipe_id)

Example:

`GET` `/api/review?recipe_id=2`


###　Response

- `400` , Parameter error
- `404` , recipe cannot be found
- `200` , success 

e.g.

```
{
    "message": "success"
}
```


## `POST` `/api/review`

Add recipe review

### Request(s)

Requires a token passed via HTTP header

```
Authorization: Bearer <token>
```

- `recipe_id` (recipe_id)
- `description` (recipe_id)

e.g.

```
{
  "recipe_id": 2,
  "description": "fuck it!"
}
```

###　Response

- `400` , Parameter error
- `404` , recipe cannot be found
- `200` , success 

e.g.

```
{
    "message": "success"
}
```

# User

## `GET` `/api/currentuser`

get current logged user

### Request(s)

Requires a token passed via HTTP header

```
Authorization: Bearer <token>
```
###　Response

Example:

```
{
    "email_address": "test@gmail.com",
    "nickname": "Jack",
    "phone": "18525436598",
    "user_id": "c87b37be-77ec-41f5-92e2-740150f75a7f",
    "username": "testu"
}

```


