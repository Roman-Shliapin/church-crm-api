import { findProfileById } from '../services/userService.js';

export const getProfile = async (req, res) => {
  try {
    const user = await findProfileById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'Користувача не знайдено' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Помилка сервера', error: error.message });
  }
};
