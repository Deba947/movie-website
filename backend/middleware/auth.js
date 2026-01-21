import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  try {
    let token = req.headers.token;

    if (!token && req.headers.authorization) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not Authorized, Login Required"
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid Token"
    });
  }
};

export const adminMiddleware = (req, res, next) => {
  if (req.user?.role === "admin") return next();
  return res.status(403).json({
    success: false,
    message: "Access Denied. Admin Only"
  });
};
