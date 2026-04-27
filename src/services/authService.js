import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Member from '../models/Member.js';
import Candidate from '../models/Candidate.js';

const DEFAULT_ROLE = 'user';

function signToken(user) {
  const role = user.role ?? DEFAULT_ROLE;
  const token = jwt.sign({ id: user._id, role }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
  return { token, name: user.name, role };
}

export async function registerWithPhone({ phone, email, password }) {
  let user = await Member.findOne({ phone });
  if (!user) {
    user = await Candidate.findOne({ phone });
  }

  if (!user) {
    return { ok: false, status: 404, message: 'Користувача з таким номером не знайдено' };
  }

  if (user.password) {
    return { ok: false, status: 400, message: 'Акаунт вже зареєстровано' };
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  user.email = email;
  user.password = hashedPassword;
  await user.save();

  return { ok: true, ...signToken(user) };
}

export async function loginWithEmail({ email, password }) {
  let user = await Member.findOne({ email });
  if (!user) {
    user = await Candidate.findOne({ email });
  }

  if (!user) {
    return { ok: false, status: 404, message: 'Користувача не знайдено' };
  }

  if (!user.password) {
    return {
      ok: false,
      status: 400,
      message: 'Акаунт ще не активовано. Пройдіть реєстрацію',
    };
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return { ok: false, status: 401, message: 'Невірний пароль' };
  }

  return { ok: true, ...signToken(user) };
}
