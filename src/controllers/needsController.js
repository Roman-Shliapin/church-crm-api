import {
  findNeedByIdForUser,
  findMyNeedsForUser,
  createNeedForUser,
} from '../services/needService.js';

export const getMyNeeds = async (req, res) => {
  try {
    const result = await findMyNeedsForUser(req.user.id);
    if (!result.ok) {
      return res.status(result.status).json({ message: result.message });
    }
    res.json(result.needs);
  } catch (error) {
    res.status(500).json({ message: 'Помилка сервера', error: error.message });
  }
};

export const createNeed = async (req, res) => {
  const { description, type } = req.body;

  if (!description) {
    return res.status(400).json({ message: 'Опис є обовʼязковим' });
  }

  try {
    const result = await createNeedForUser(req.user.id, { description, type });
    if (!result.ok) {
      return res.status(result.status).json({ message: result.message });
    }
    await sendPushToAdmins(
      '🆘 Нова заявка',
      `${result.need.name}: ${description.slice(0, 80)}`
    );
    res.status(201).json(result.need);
  } catch (error) {
    res.status(500).json({ message: 'Помилка сервера', error: error.message });
  }
};

export const getNeedById = async (req, res) => {
  const result = await findNeedByIdForUser(req.params.id, req.user.id);
  if (!result.ok) {
    return res.status(result.status).json({ message: result.message })
  }
  res.json(result.need);
}