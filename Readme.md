@Source



const lamDev = "JWT Authentication";

const express = require("express");

const app = express();

const jwt = require("jsonwebtoken");

app.use(express.json());

const port = 5000;

const users = [
{
id: "1",
username: "John",
password: "John0908",
isAdmin: true,
},

{
id: "2",
username: "Jane",
password: "Jane0908",
isAdmin: false,
},
];

// Rest API

app.post("/api/login", (req, res) => {
// res.json("hey its me");
const { username, password } = req.body;
const user = users.find((u) => {
return u.username === username && u.password === password;
});
if (user) {
// res.json(user);

    const accessToken = jwt.sign(
      { id: user.id, isAdmin: user.isAdmin },
      "mySecretKey"
    );
    res.json({
      username: user.username,
      isAdmin: user.isAdmin,
      accessToken,
    });

} else {
res.status(400).json("Username or Password incorrect!");
}
});

// \* How to verify JWT.

const verify = (req, res, next) => {
const authHeader = req.headers.authorization;

    if (authHeader) {
      const token = authHeader.split(" ")[1];

      jwt.verify(token, "mySecretKey", (err, user) => {
        if (err) {
          return res.status(403).json("Token is not valid!");
        }
        req.user = user;
        next();
      });
    } else {
      res.status(401).json("You are not authenicated");
    }

};
});

// Delete Route.
app.delete("/api/users/:userId", verify, (req, res) => {
if (req.user.id === req.params.userId || req.user.isAdmin) {
res.status(200).json("user has been deleted.");
} else {
res.status(403).json("You are not allowed to delete this user!");
}
});

app.listen(5000, () =>
console.log(`Backend server is running Sucessfully on port: ${port}`)
);

.............................................................

// \* 1. Required Modules:

/\*\*

- The code begins by importing the necessary modules: express, jsonwebtoken. These modules are required
- to create the web server and handle JSON Web Tokens (JWTs).
  \*/
  const express = require("express");
  const app = express();
  const jwt = require("jsonwebtoken");

// \* 2. Express Setup:

/\*\*

- Express Setup:
- An instance of the Express application is created by calling express() and assigned to the app variable.
- The application uses express.json() middleware to parse JSON data in the request body.
  \*/

app.use(express.json());

// \* 3. Port Configuration:

/\*\*

- The port number (5000) is assigned to the port variable, indicating the port on which the server will listen.
  \*/
  const port = 5000;

// \* 4 . User Data.

/\*\*

- An array called users is defined, containing two user objects. Each user object has properties like id, username, password, and isAdmin to represent user data.
- These are used for user authentication and authorization.
  \*/

const users = [
{
id: "1",
username: "John",
password: "John0908",
isAdmin: true,
},
{
id: "2",
username: "Jane",
password: "Jane0908",
isAdmin: false,
},
];

// \* 5 . JWT Verification Middleware: Verify is a middle-ware function.

/\*\*

-
- A middleware function called verify is defined. This function is responsible for verifying the JWT included in the request headers.
- The function extracts the JWT from the Authorization header and splits it to retrieve the token.
-
- The jsonwebtoken.verify method is used to verify the token. If the token is valid, the decoded user information is stored in the req.user object, and the next() function is called to pass control to the next middleware or route handler.
- If the token is invalid or missing, appropriate error responses are sent back to the client.} req
-
- @param {\*} res
- @param {_} next
  _/
  const verify = (req, res, next) => {
  const authHeader = req.headers.authorization;

if (authHeader) {
const token = authHeader.split(" ")[1];

    jwt.verify(token, "mySecretKey", (err, user) => {
      if (err) {
        return res.status(403).json({ error: "Token is not valid!" });
      }
      req.user = user;
      next();
    });

} else {
res.status(401).json({ error: "You are not authenticated!" });
}
};

// \* REST API Endpoints:

/\*\*

- Login Route: A POST route at /api/login is defined to handle user login. The route expects a JSON payload with username and password fields in the request body. It checks if the provided username and password match any user in the users array.
- If a matching user is found, a JWT is generated using jsonwebtoken.sign, containing the user's id and isAdmin status. The JWT, along with the user's username and isAdmin status, is returned as a JSON response.
- If the login credentials are invalid, an error response is sent.

- Delete Route: A DELETE route at /api/users/:userId is defined to handle user deletion. The route expects a valid userId parameter in the route URL. The verify middleware is applied to this route, ensuring authentication is required.
- If the authenticated user is either the owner of the user being deleted or an admin, a success message is returned.
- If the user does not have the necessary permissions, an error response is sent.
  \*/

app.post("/api/login", (req, res) => {
const { username, password } = req.body;
const user = users.find(
(u) => u.username === username && u.password === password
);

if (user) {
const accessToken = jwt.sign(
{ id: user.id, isAdmin: user.isAdmin },
"mySecretKey"
);
res.json({
username: user.username,
isAdmin: user.isAdmin,
accessToken,
});
} else {
res.status(400).json({ error: "Username or Password incorrect!" });
}
});

// Delete Route.
app.delete("/api/users/:userId", verify, (req, res) => {
if (req.user.id === req.params.userId || req.user.isAdmin) {
res.status(200).json("User has been deleted.");
} else {
res.status(403).json({ error: "You are not allowed to delete this user!" });
}
});

app.listen(port, () =>
console.log(`Backend server is running successfully on port: ${port}`)
);

---

const express = require("express");
const jwt = require("jsonwebtoken");

const app = express();
const port = 5000;

const users = [
{
id: "1",
username: "John",
password: "John0908",
isAdmin: true,
},
{
id: "2",
username: "Jane",
password: "Jane0908",
isAdmin: false,
},
];

// JWT Secret Key
const secretKey = "mySecretKey";

// JWT Secret Key

const refreshKey = "myRefreshKey";

// Middleware
app.use(express.json());

// Verify JWT
const verifyToken = (req, res, next) => {
const authHeader = req.headers.authorization;

if (authHeader) {
const token = authHeader.split(" ")[1];

    jwt.verify(token, secretKey, (err, user) => {
      if (err) {
        return res.status(403).json({ error: "Token is not valid!" });
      }
      req.user = user;
      next();
    });

} else {
res.status(401).json({ error: "You are not authenticated!" });
}
};

const generateAccessToken = (user) => {
return jwt.sign({ id: user.id, isAdmin: user.isAdmin }, secretKey, {
// expiresIn: "15min",
});
};

const generateRefreshToken = (user) => {
return jwt.sign({ id: user.id, isAdmin: user.isAdmin }, refreshKey, {
expiresIn: "15min",
});
};

// Login Route
app.post("/api/login", (req, res) => {
const { username, password } = req.body;
const user = users.find(
(u) => u.username === username && u.password === password
);

// Genarate an Access Token.
if (user) {
const accessToken = generateAccessToken(user);
const refreshtoken = generateRefreshToken(user);
tokenRefreshs.push(refreshtoken);
res.json({
username: user.username,
isAdmin: user.isAdmin,
accessToken,
refreshtoken,
});
} else {
res.status(401).json({ error: "Username or Password incorrect!" });
}
});

// Delete Route
app.delete("/api/users/:userId", verifyToken, (req, res) => {
const { userId } = req.params;
const { id, isAdmin } = req.user;

if (id === userId || isAdmin) {
res.status(200).json("User has been deleted.");
} else {
res.status(403).json({ error: "You are not allowed to delete this user!" });
}
});

let tokenRefreshs = [];

// Refresh Route
app.post("/api/refresh", (req, res) => {
// \* Take the refresh token from the user.
const tokenRefresh = req.body.token;

// Send error if there is no token or its invalid.
if (!tokenRefresh) return res.status(401).json("You are not authenticated!");
if (!tokenRefreshs.includes(tokenRefresh)) {
return res.status(403).json("Refresh token is not valid");
}

jwt.verify(tokenRefresh, "refreshKey", (err, user) => {
err & console.log(err);
tokenRefreshs = tokenRefreshs.filter((token) => token !== tokenRefresh);

    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);
    tokenRefreshs.push(newRefreshToken);
    res.status(200).json({
      accessToken: newAccessToken,
      refreshtoken: newRefreshToken,
    });

});

// If everything is ok, create new access token, refresh token send to the user
});

// Start the server
app.listen(port, () => {
console.log(`Backend server is running successfully on port: ${port}`);
});
==============================================================

jwt-decode is a small browser library that helps decoding JWTs token which are Base64Url encoded.

IMPORTANT: This library doesn't validate the token, any well formed JWT can be decoded. You should validate the token in your server-side logic by using something like express-jwt, koa-jwt, Owin Bearer JWT, etc.

Axios is a library that serves to create HTTP requests that are present externally. It is evident from the fact that we may sometimes in React applications need to get data from the external source. It is quite difficult to fetch such data so that they can be normally shown on the website.
