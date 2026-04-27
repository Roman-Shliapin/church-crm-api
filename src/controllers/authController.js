import { registerWithPhone, loginWithEmail } from '../services/authService.js';

export const register = async (req, res) => {
  const { phone, email, password } = req.body;

  try {
    const result = await registerWithPhone({ phone, email, password });
    if (!result.ok) {
      return res.status(result.status).json({ message: result.message });
    }
    const { ok, ...data } = result;
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Помилка сервера', error: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await loginWithEmail({ email, password });
    if (!result.ok) {
      return res.status(result.status).json({ message: result.message });
    }
    const { ok, ...data } = result;
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Помилка сервера', error: error.message });
  }
};
