import Member from "../models/Member.js";
import { createPost, deletePost, getAllPosts, togglePin, toggleReaction } from "../services/postService.js";



export const getPosts = async (req, res) => { 
    try {
        const posts = await getAllPosts();
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Помилка сервера', error: error.message })
    };
};

export const addPost = async (req, res) => {
    const { title, content, expireDays } = req.body

    try {
        const author = await Member.findById(req.user.id)
        const authorName = author ? author.name : 'Адмін'

        const result = await createPost(req.user.id, authorName, { title, content, expireDays });
        if (!result.ok) {
            return res.status(result.status).json({ message: result.message })
        };
        await sendPushToAll(title, `${authorName}: ${content.slice(0, 100)}`)

        res.status(201).json(result.post)
    } catch (error) {
        res.status(500).json({ message: 'Помилка сервера', error: error.message })
    };
};

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

export const reactToPost = async (req, res) => {
  const { type } = req.body

  const validTypes = ['pray', 'heart', 'thumbs_up', 'dove', 'star']
  if (!validTypes.includes(type)) {
    return res.status(400).json({ message: 'Невідомий тип реакції' })
  }

  try {
    const result = await toggleReaction(req.params.id, req.user.id, type)
    if (!result.ok) {
      return res.status(result.status).json({ message: result.message })
    }
    res.json(result.post)
  } catch (error) {
    res.status(500).json({ message: 'Помилка сервера', error: error.message })
  }
}

export const pinPost = async (req, res) => {
  try {
    const result = await togglePin(req.params.id)
    if (!result.ok) {
      return res.status(result.status).json({ message: result.message })
    }
    res.json(result.post)
  } catch (error) {
    res.status(500).json({ message: 'Помилка сервера', error: error.message })
  }
}

