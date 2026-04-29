import { findProfileById, savePushToken } from '../services/userService.js';

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

export const updatePushToken = async (req, res) => {
  const { token } = req.body
  if (!token) return res.status(400).json({ message: 'Токен є обовʼязковим' })

  try {
    const result = await savePushToken(req.user.id, token)
    if (!result.ok) return res.status(result.status).json({ message: result.message })
    res.json({ message: 'Токен збережено' })
  } catch (error) {
    res.status(500).json({ message: 'Помилка сервера', error: error.message })
  }
}