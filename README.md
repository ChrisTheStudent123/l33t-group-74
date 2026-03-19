# l33t-group-74

To start app:
```bun run server.ts```


Routes:
/games
/...
/...
/...


# /games
Attributes:
id 				[number]  : entry id
title 			[string]  : game title
release_year	[number]  : game release year
developer		[string]  : developer of game
company			[string]  : company of system game is released on
system 			[string]  : system game belongs to
genre 			[string]  : game genre
rating 			[number]  : game rating (0.0 - 10.0)

## GET /games

example:
```/games```
```/games?q=mario&sort=platform```
```/games?year=2018&cmp=gt&page2&limit=5```

Description:
Returns a list of games from the game collection

Optional Parameters:
q 		[string] : a search query to search matching titles (can be partial)
year 	[number] : a year to limit results by
		{required} cmp [string]: "gt" | "lt" comparison operator for greater than and less than			  the year chosen (ignored if omitted)
sort 	[string] : Column to sort results by. Must match an attribute (except id, default is 				   id)
order 	[string] : "asc" | "desc"

page 	[number] : Pagination
limit 	[number] : Limit of results per page.


## GET /games/{id}

Description:
Returns matching game's data

Required Parameters:
id 		[number] : the game id to delete

example:
```/games/5```


## POST /games

Description:
Adds a game to the collection

example
```/games```

Ex Payload:
{
  "title": "Test Game",
  "company": "Nintendo",
  "system": "Switch",
  "genre": "RPG",
  "release_year": 2026,
  "developer": "Test Dev",
  "rating": 6
}


## DEL /games/{id}

example
```/games/28```

Description:
Deletes a game entry (and linked rating) by matching id


## PUT /games/{id}

example
```/games/28```

Description:
Updates an entry by matching id, requires all matching attributes

Ex Payload:
{
  "title": "Test Game Edited",
  "company": "Nintendo",
  "system": "Switch",
  "genre": "RPG",
  "release_year": 2000,
  "developer": "Test Dev Edited",
  "rating": 6
}