const jwt = require('jsonwebtoken');

const SECRET_KEY = 'eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTcxNTg2MTcwOSwiaWF0IjoxNzE1ODYxNzA5fQ.x60H7eRK0D6ZvfSgFl8rSTF_3c5gYj_h5kHSPCDIFuo';

const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ msg: "You need a token to access this endpoint" });
  }

  try {
    const user = jwt.verify(token,SECRET_KEY);
    req.user = user;
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin); //.-.
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ msg: "The token is not valid or has expired already" });
  }
};

module.exports = authenticateJWT;
