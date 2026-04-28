import Member from "../models/Member.js";
import { createPost, deletePost, getAllPosts } from "../services/postService.js";



export const getPosts = async (req, res) => { 
    try {
        const posts = await getAllPosts();
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Помилка сервера', error: error.message })
    };
};

export const addPost = async (req, res) => {
  const { title, content } = req.body

  try {
    const author = await Member.findById(req.user.id)
    const authorName = author ? author.name : 'Адмін'

    const result = await createPost(req.user.id, authorName, { title, content })
    if (!result.ok) {
      return res.status(result.status).json({ message: result.message })
    }
    res.status(201).json(result.post)
  } catch (error) {
    res.status(500).json({ message: 'Помилка сервера', error: error.message })
  }
}

export const removePost = async (req, res) => {
    try {
        const result = await deletePost(req.params.id);
        if (!result.ok) {
            return res.status(result.status).json({ message: result.message })
        }
        res.json({ message: 'Пост видалено' })
    } catch (error) {
        res.status(500).json({ message: 'Помилка сервера', error: error.message })
    };
};