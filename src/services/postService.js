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