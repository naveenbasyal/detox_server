const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.header("Authorization");
  console.log(req.header("Authorization"));
  console.log(req.header("Authorization") === undefined);
  if (!token) {
    const localToken = localStorage.getItem("token");
    if (localToken) {
      try {
        const decoded = jwt.verify(localToken, process.env.JWT_SECRET_KEY);
        req.user = decoded;
        console.log("verified:", decoded);
        next();
      } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
      }
    }

    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const token = req.header("Authorization").split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    req.user = decoded;
    console.log("verified:", decoded);
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = verifyToken;
