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

#### Authentication Strategies
A way of authenticating a user.
- Local strategy: based on locally saved information (if you have them register first) 
- Google or Github
- [Passport](http://www.passportjs.org/) also has a number of strategies
