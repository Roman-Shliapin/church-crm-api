import Member from '../models/Member.js';
import Candidate from '../models/Candidate.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export const register = async (req, res) => {
    const { phone, email, password } = req.body;

    try {
        // Ищем пользователя по номеру телефона в обеих коллекциях
        let user = await Member.findOne({ phone });
        let role = 'user';

        if (!user) {
            user = await Candidate.findOne({ phone });
        };

        if (!user) {
            return res.status(404).json({ message: 'Користувача з таким номером не знайдено' });
        };

        if (user.password) {
            return res.status(400).json({ message: 'Акаунт вже зареєстровано' });
        };

        const hashedPassword = await bcrypt.hash(password, 10)

        user.email = email
        user.password = hashedPassword
        await user.save()

        const token = jwt.sign(
            { id: user._id, role: user.role ?? role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' },
        );

        res.status(201).json({ token, name: user.name, role: user.role ?? role })
    } catch (error) {
        res.status(500).json({ message: 'Помилка сервера', error: err.message });
    }
};



export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = await Member.findOne({ email });
        let role = 'user'

        if (!user) {
            user = await Candidate.findOne({ email });
        };

        if (!user) {
            return res.status(404).json({ message: 'Користувача не знайдено' })
        }

        if (!user.password) {
            return res.status(400).json({ message: 'Акаунт ще не активовано. Пройдіть реєстрацію' })
        };

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Невірний пароль' });
        };

        const token = jwt.sign(
            { id: user._id, role: user.role ?? role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' },
        );

        res.json({ token, name: user.name, role: user.role ?? role });
    } catch (error) {
        res.status(500).json({ message: 'Помилка сервера', error: err.message });
    }
}