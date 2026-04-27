import Candidate from "../models/Candidate.js";
import Member from "../models/Member.js"

export const getProfile = async (req, res) => {
    try {
        let user = await Member.findById(req.user.id).select('-password');
        if (!user) {
            user = await Candidate.findById(req.user.id).select('-password');
        };

        if (!user) {
            return res.status(404).json({ message: 'Користувача не знайдено' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Помилка сервера', error: err.message })
    }
}