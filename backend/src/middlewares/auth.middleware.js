import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protectRoute = async (req, res, next) => {
    try {
        const token = req.header("Authorization").split(" ")[1];
        console.log("token", token);
    
        if (!token) return res.status(401).json({ message: "Unauthorized" });
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        //find user
        const user = await User.findById(decoded.id).select("-password");
        if (!user) return res.status(401).json({ message: "Unauthorized" });
        req.user = user;
        next();
    } catch (error) {
        console.log("error in protectRoute", error);
        res.status(401).json({ message: "Token is not valid" });
    }
};
