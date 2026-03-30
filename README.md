# Game Collection - Mock API

*l33t-group-74*

To start app:
```bun start```


To start without rate limiter:
```bun testing```


Routes:
/games
/...
/...
/...

# /games
Attributes:
|field|type|description|
|---|---|---|
|id|[number]|entry id|
|title|[string]|game title|
|release_year|[number]|game release year|
|developer|[string]|developer of game|
|company|[string]|company of system game is released on|
|system|[string]|system game belongs to|
|genre|[string]|game genre|
|rating|[number]|game rating (0.0 - 10.0)|

## $${\color{green}GET}$$ ```/games```

example:
```/games```
```/games?q=mario&sort=platform```
```/games?year=2018&cmp=gt&page2&limit=5```
```/games?year=2022&cmp=lt&order=asc&page=2&limit=4&sort=system```

Description:
Returns a list of games from the game collection

Optional Parameters:
|parameter|type|description|
|---|---|---|
|q|[string]|a search query to search matching titles (can be partial)|
|year|[number]|a year to limit results by {requires cmp}|
|cmp|[string]|{required} to use with year - "gt"/"lt" comparison operator for greater than and less than|
|sort|[string]|Column to sort results by. Must match an attribute (except id, default is id)|
|order|[string]|"asc"/"desc"|
|page|[number]| Pagination|
|limit|[number]|Limit of results per page.|


## $${\color{green}GET}$$ ```/games/{id}```

example:
```/games/5```

Description:
Returns matching game's data

Required Parameters:
|parameter|type|description|
|---|---|---|
|id|[number]|the game id to retrieve|


## $${\color{yellow}POST}$$ ```/games```

example
```/games```

Description:
Adds a game to the collection using payload, requires all matching attributes.

Ex Payload:
```
json
{
  "title": "Test Game",
  "company": "Nintendo",
  "system": "Switch",
  "genre": "RPG",
  "release_year": 2026,
  "developer": "Test Dev",
  "rating": 6
}
```


## $${\color{blue}PUT}$$  ```/games/{id}```

example
```/games/28```

Description:
Updates an entry by matching id, requires all matching attributes

Required Parameters:
|parameter|type|description|
|---|---|---|
|id|[number]|the game id to update|

Ex Payload:
```
json
{
  "title": "Test Game Edited",
  "company": "Nintendo",
  "system": "Switch",
  "genre": "RPG",
  "release_year": 2000,
  "developer": "Test Dev Edited",
  "rating": 6
}
```



## $${\color{red}DEL}$$ ```/games/{id}```
example
```/games/28```

Description:
Deletes a game entry (and linked rating) by matching id

Required Parameters:
|parameter|type|description|
|---|---|---|
|id|[number]|the game id to delete|
