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
    inProgressBy: { type: String },
    waitingAt: { type: Date },
    waitingBy: { type: String },
    lastAction: { type: String },
    lastActionAt: { type: Date },
    lastActionBy: { type: String },
    repliedAt: { type: Date },
    repliedBy: { type: String },
    replyMessage: { type: String },
    archived: { type: Boolean, default: false },
    doneAt: { type: Date },
    doneBy: { type: String },
    doneMessage: { type: String },
  },
  { timestamps: true, collection: 'needs' }
)

export default mongoose.model('Need', needSchema)