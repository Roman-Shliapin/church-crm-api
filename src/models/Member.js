import mongoose from 'mongoose'

const memberSchema = new mongoose.Schema(
  {
    id: { type: Number },         // telegramId
    name: { type: String, required: true },
    baptized: { type: Boolean, default: true },
    baptism: { type: String },    // "24-05-2015"
    birthday: { type: String },   // "19-02-1987"
    phone: { type: String },
    email: { type: String, unique: true, sparse: true },
    password: { type: String },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    expoPushToken: { type: String, default: null },
  },
  { timestamps: true, collection: 'members' }
)

export default mongoose.model('Member', memberSchema)