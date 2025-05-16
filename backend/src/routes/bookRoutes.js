import express from "express";
import Book from "../models/Book.js"; 
import cloudinary from "../lib/cloudinary.js";  
import { protectRoute } from "../middlewares/auth.middleware.js";
const router = express.Router();

router.post("/", protectRoute, async (req, res) => {
    try {
        const { title, caption, image, rating } = req.body;
        if (!title || !caption || !image || !rating) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const uploadedResponse = await cloudinary.uploader.upload(image, {
            folder: "books",
        });

        const imageUrl = uploadedResponse.secure_url;
        const newBook = new Book({ title, caption, image: imageUrl, rating, user: req.user.id });
        await newBook.save();
        res.status(201).json(newBook);
    } catch (error) {
        console.log("error in / book route", error);
        res.status(500).json({ message: error.message });
    }   
});

// get recommended books by the logged in user
router.get("/user", protectRoute, async (req, res) => {
    try {
    const books = await Book.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(books);
    } catch (error) {
    console.error("Get user books error:", error.message);
        res.status(500).json({ message: "Server error" });
    }
});

//pagination
router.get("/", async (req, res) => {
    try {
        const { page = 1, limit = 5 } = req.query;
        const books = await Book.find()
        .skip((page - 1) * limit)
        .limit(limit)
        .populate("user", "username profileImage");
        const total = await Book.countDocuments();
        const totalPages = Math.ceil(total / limit);
        res.status(200).json({ books, currentPage: page, totalPages, totalBooks: total });
    } catch (error) {
        console.log("error in / book route", error);
        res.status(500).json({ message: error.message });
    }
});

//delete
router.delete('/:id', protectRoute, async (req, res) => {
    try {
      const { id } = req.params;
      const book = await Book.findById(id);
  
      if (!book) {
        return res.status(404).json({ message: 'Book not found' });
      }
  
      if (book.user.toString() !== req.user.id) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
  

      if (book.image) {
        try {
          // https://res.cloudinary.com/your_cloud_name/image/upload/v1234567890/public_id.jpg
          const urlParts = book.image.split('/');
          const fileName = urlParts[urlParts.length - 1]; // Get the last part (e.g., public_id.jpg)
          const publicId = fileName.split('.')[0]; // Remove the extension (e.g., public_id)
  
          if (publicId) {
            await cloudinary.uploader.destroy(publicId);
          }
        } catch (error) {
          console.error('Error deleting image from Cloudinary:', error);
        }
      }
  
      await Book.findByIdAndDelete(id);
      res.status(200).json({ message: 'Book deleted successfully' });
    } catch (error) {
      console.error('Error in /book route:', error);
      res.status(500).json({ message: 'Failed to delete book' });
    }
  });

export default router;