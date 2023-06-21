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

// Middleware Function
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
    expiresIn: "50s",
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

  // Generate an Access Token.
  if (user) {
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    tokenRefreshs.push(refreshToken);
    res.json({
      username: user.username,
      isAdmin: user.isAdmin,
      accessToken,
      refreshToken,
    });
  } else {
    res.status(401).json({ error: "Username or Password incorrect!" });
  }
});

let tokenRefreshs = [];

// Refresh Route
app.post("/api/refresh", (req, res) => {
  // * Take the refresh token from the user.
  const tokenRefresh = req.body.token;

  // Send error if there is no token or it's invalid.
  if (!tokenRefresh) {
    return res.status(401).json("You are not authenticated!");
  }
  if (!tokenRefreshs.includes(tokenRefresh)) {
    return res.status(403).json("Refresh token is not valid");
  }

  jwt.verify(tokenRefresh, refreshKey, (err, user) => {
    err && console.log(err);
    tokenRefreshs = tokenRefreshs.filter((token) => token !== tokenRefresh);

    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);
    tokenRefreshs.push(newRefreshToken);
    res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  });

  // If everything is ok, create new access token, refresh token send to the user
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

// Logout Route
app.post("/api/logout", verifyToken, (req, res) => {
  const tokenRefresh = req.body.token;
  tokenRefreshs = tokenRefreshs.filter((token) => token !== tokenRefresh);
  res.status(200).json("You logged out successfully.");
});

// Start the server
app.listen(port, () => {
  console.log(`Backend server is running successfully on port: ${port}`);
});
