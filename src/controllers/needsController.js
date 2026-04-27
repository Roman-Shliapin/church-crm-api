import Member from "../models/Member.js";
import Candidate from "../models/Candidate.js";
import Need from "../models/Need.js";


const getUser = async (id) => {
    const member = await Member.findById(id);
    if (member) return member;
    return await Candidate.findById(id)
};


export const getMyNeeds = async (req, res) => {
    try {
        const user = await getUser(req.user.id);
        if (!user) return res.status(404).json({ message: 'Користувача не знайдено' })
        
        const needs = await Need.find({ userId: user.id, archived: false });
        res.json(needs);
    } catch (error) {
        res.status(500).json({ message: 'Помилка сервера', error: error.message })
    }
};

export const createNeed = async (req, res) => {
    const { description, type } = req.body;

    if (!description) {
    return res.status(400).json({ message: 'Опис є обовʼязковим' })
    }

    try {
        const user = await getUser(req.user.id);
        if (!user) return res.status(404).json({ message: 'Користувача не знайдено' })
        
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
        })

        res.status(201).json(need);
    } catch (error) {
        res.status(500).json({ message: 'Помилка сервера', error: error.message });
    }
}