import mongoose from 'mongoose'

const needSchema = new mongoose.Schema(
  {
    id: { type: Number },
    userId: { type: Number },
    name: { type: String },
    baptism: { type: String },
    birthday: { type: String },
    phone: { type: String },
    description: { type: String, required: true },
    type: { type: String, enum: ['humanitarian', 'other'], default: 'other' },
    date: { type: String },
    status: { type: String, default: 'нова' },
    inProgressAt: { type: Date },
    inProgressBy: { type: Number },
    waitingAt: { type: Date },
    waitingBy: { type: Number },
    lastAction: { type: String },
    lastActionAt: { type: Date },
    lastActionBy: { type: Number },
    repliedAt: { type: Date },
    repliedBy: { type: Number },
    replyMessage: { type: String },
    archived: { type: Boolean, default: false },
    doneAt: { type: Date },
    doneBy: { type: Number },
    doneMessage: { type: String },
  },
  { timestamps: true, collection: 'needs' }
)

export default mongoose.model('Need', needSchema)