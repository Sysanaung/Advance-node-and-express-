# Advanced Node and Express

## Express Session
- Allow us to save session ID as cookie in client.
- Can access session data with that ID on the server.
- Keeps personal account info out of client (cookie).
- Server will verify if user is authenticated.

#### Serialization
- Convert object contents into a *key*.
- Can be deserialized back into the object.
- Tells us who's communicated with the server without sending original data with each request for new page.