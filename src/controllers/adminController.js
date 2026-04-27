import {
  findActiveNeeds,
  findArchivedNeeds,
  updateNeedStatus as setNeedStatus,
  replyToNeed as saveNeedReply,
} from '../services/needService.js';
import { listMembers, listCandidates } from '../services/adminService.js';

export const getActiveNeeds = async (req, res) => {
  try {
    const { category } = req.query;
    const needs = await findActiveNeeds(category);
    res.json(needs);
  } catch (error) {
    res.status(500).json({ message: 'Помилка сервера', error: error.message });
  }
};

export const getArchivedNeeds = async (req, res) => {
  try {
    const needs = await findArchivedNeeds();
    res.json(needs);
  } catch (error) {
    res.status(500).json({ message: 'Помилка сервера', error: error.message });
  }
};

export const updateNeedStatus = async (req, res) => {
  const { id } = req.params;
  const { action } = req.body;

  try {
    const result = await setNeedStatus(id, req.user.id, action);
    if (!result.ok) {
      return res.status(result.status).json({ message: result.message });
    }
    res.json(result.need);
  } catch (error) {
    res.status(500).json({ message: 'Помилка сервера', error: error.message });
  }
};

export const replyToNeed = async (req, res) => {
  const { id } = req.params;
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ message: 'Повідомлення є обовʼязковим' });
  }

  try {
    const result = await saveNeedReply(id, req.user.id, message);
    if (!result.ok) {
      return res.status(result.status).json({ message: result.message });
    }
    res.json({ message: 'Відповідь збережено', need: result.need });
  } catch (error) {
    res.status(500).json({ message: 'Помилка сервера', error: error.message });
  }
};

export const getMembers = async (req, res) => {
  try {
    const members = await listMembers();
    res.json(members);
  } catch (error) {
    res.status(500).json({ message: 'Помилка сервера', error: error.message });
  }
};

export const getCandidates = async (req, res) => {
  try {
    const candidates = await listCandidates();
    res.json(candidates);
  } catch (error) {
    res.status(500).json({ message: 'Помилка сервера', error: error.message });
  }
};
