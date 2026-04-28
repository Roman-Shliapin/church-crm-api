import { Router } from 'express'
import { getPosts, addPost, removePost, reactToPost } from '../controllers/postController.js'
import { protect, adminOnly } from '../middlewares/auth.js'

const router = Router()

router.get('/', protect, getPosts)
router.post('/', protect, adminOnly, addPost)
router.delete('/:id', protect, adminOnly, removePost)
router.post('/:id/react', protect, reactToPost);

export default router