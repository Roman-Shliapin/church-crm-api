import Need from '../models/Need.js';
import { findUserById } from './userService.js';

const PRODUCTS_KEYWORDS = ['продукт', 'харч', 'їж', 'круп', 'макарон', 'консерв', 'олія', 'масло', 'борошн', 'цукор', 'Продукти']
const CHEMISTRY_KEYWORDS = ['хім', 'побутова', 'порош', 'миюч', 'мило', 'шампун', 'зубн', 'паста', 'папір', 'серветк', 'Хімія']

export function classifyNeeds(need) {
  if (need?.type === 'other') return 'other';

  const desc = (need?.description || '').toLowerCase().trim();

  if (need?.type === 'humanitarian') {
    if (PRODUCTS_KEYWORDS.some(k => desc.includes(k.toLowerCase()))) return 'products'
    if (CHEMISTRY_KEYWORDS.some(k => desc.includes(k.toLowerCase()))) return 'chemistry'
    return 'other'
  };

  return 'other';
};

export async function findActiveNeeds(category) {
  const needs = await Need.find({ archived: false }).sort({ createdAt: -1 })

  if (!category) return needs

  return needs.filter(n => classifyNeed(n) === category)
}

export async function findActiveNeeds() {
  return Need.find({ archived: false }).sort({ createdAt: -1 });
}

export async function findArchivedNeeds() {
  return Need.find({ archived: true }).sort({ doneAt: -1 });
}

export async function updateNeedStatus(id, actorId, action) {
  const need = await Need.findById(id);
  if (!need) {
    return { ok: false, status: 404, message: 'Заявку не знайдено' };
  }

  const now = new Date();

  if (action === 'in_progress') {
    need.status = 'в очікуванні';
    need.inProgressAt = now;
    need.inProgressBy = actorId;
    need.waitingAt = now;
    need.waitingBy = actorId;
    need.lastAction = 'in_progress';
    need.lastActionAt = now;
    need.lastActionBy = actorId;
  } else if (action === 'done') {
    need.status = 'виконано';
    need.archived = true;
    need.doneAt = now;
    need.doneBy = actorId;
    need.lastAction = 'done';
    need.lastActionAt = now;
    need.lastActionBy = actorId;
  } else {
    return {
      ok: false,
      status: 400,
      message: 'Невідома дія. Використовуйте: in_progress, done',
    };
  }

  await need.save();
  return { ok: true, need };
}

export async function replyToNeed(id, actorId, message) {
  const need = await Need.findById(id);
  if (!need) {
    return { ok: false, status: 404, message: 'Заявку не знайдено' };
  }

  const now = new Date();
  need.repliedAt = now;
  need.repliedBy = actorId;
  need.replyMessage = message;
  need.lastAction = 'replied';
  need.lastActionAt = now;
  need.lastActionBy = actorId;

  await need.save();
  return { ok: true, need };
}

export async function findMyNeedsForUser(authUserId) {
  const user = await findUserById(authUserId);
  if (!user) {
    return { ok: false, status: 404, message: 'Користувача не знайдено' };
  }
  const needs = await Need.find({ userId: user.id, archived: false });
  return { ok: true, needs };
}

export async function createNeedForUser(userId, { description, type }) {
  const user = await findUserById(userId);
  if (!user) {
    return { ok: false, status: 404, message: 'Користувача не знайдено' };
  }

  if (type === "humanitarian") {
    if (!['Продукти', 'Хімія'].includes(description)) {
      return {
        ok: false,
        status: 400,
        message: 'Для гуманітарної допомоги оберіть: Продукти або Хімія',
      }
    };
  };

  if (type === "other" && (!description || description.trim().length < 5)) {
    return {
      ok: false,
      status: 400,
      message: 'Опис має містити щонайменше 5 символів',
    }
  }

  const now = new Date();
  const date = now.toLocaleString('uk-UA');

  const need = await Need.create({
    userId: user.id,
    name: user.name,
    baptism: user.baptism,
    birthday: user.birthday,
    phone: user.phone,
    description,
    type: type || 'other',
    date,
    status: 'нова',
    archived: false,
  });

  return { ok: true, need };
}


export default async function findNeedByIdForUser(needId, authUserId) {
  const user = await findUserById(authUserId);
  if (!user) {
    return { ok: false, status: 404, message: 'Користувача не знайдено' };
  };
  const need = await Need.findById(needId);
  if (!need) {
    return { ok: false, status: 404, message: 'Заявку не знайдено' }
  };


  if (need.userId !== user.id) {
    return { ok: false, status: 403, message: 'Доступ заборонено' }
  };

  return { ok: true, need };
};