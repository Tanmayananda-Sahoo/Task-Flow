import jwt from "jsonwebtoken";
import { User } from "../models/user.models.js";
const authorizeUser = async (req, res, next) => {
  const token = req.cookies.Token || "";
  if (token == "") {
    return res.status(401).json({
      message: "User is not authenticated",
    });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
    if (!decodedToken) {
      return res.status(401).json({
        message: "There is an issue with decoding the token.",
      });
    }
    const user = await User.findById(decodedToken.userId);
    if (!user) {
      return res.status(401).json({
        message: "User not found with the given token.",
      });
    }
    req.user = user;
    next();
  } catch (error) {
    console.log("Error faced while authenticating the user: ", error);
    return res.status(500).json({
      message: "Internal server error while authenticating the user.",
    });
  }
};

export default authorizeUser;