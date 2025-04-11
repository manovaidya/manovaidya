
import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },  // Author's Name or Blog Name
  blogTitle: { type: String, required: true, trim: true },  // Blog Title
  description: { type: String, required: true },  // Blog description (could be HTML)
  blogImage: { type: String, required: true },  // Image URL or File Path
  date: { type: Date, default: Date.now },  // Date of the blog post
  additionalDetails: { type: String, trim: true },  // Additional details about the blog
  isActive: { type: Boolean, default: false },
  tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag', trim: true }],
  views: { type: Number, default: 0, trim: true }
}, { timestamps: true });

const Blog = mongoose.model('Blog', blogSchema);

export default Blog;
