import Post from "../models/Post.js";



export async function getAllPosts() {
    return Post.find().sort({ createdAt: -1 });
};

export async function createPost(authorId, authorName, { title, content }) {
    if (!title || !content) {
        return { ok: false, status: 400, message: 'Заголовок і текст є обовʼязковими' }
    };

    const post = await Post.create({ title, content, authorId, authorName });
    return { ok: true, post };
};

export async function deletePost(postId) {
    const post = await Post.findByIdAndDelete(postId);
    if (!post) {
    return { ok: false, status: 404, message: 'Пост не знайдено' }
  }
    return { ok: true };
};

export async function toggleReaction(postId, userId, type) {
  const post = await Post.findById(postId)
  if (!post) {
    return { ok: false, status: 404, message: 'Пост не знайдено' }
  }

  const existingIndex = post.reactions.findIndex(
    r => r.userId === userId && r.type === type
  )

  if (existingIndex !== -1) {
    // Прибрати реакцію якщо вже є
    post.reactions.splice(existingIndex, 1)
  } else {
    // Додати реакцію
    post.reactions.push({ userId, type })
  }

  await post.save()
  return { ok: true, post }
}