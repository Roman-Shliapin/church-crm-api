import mongoose from 'mongoose'

const candidateSchema = new mongoose.Schema(
  {
    id: { type: Number },
    name: { type: String, required: true },
    baptized: { type: Boolean, default: false },
    baptism: { type: String },
    birthday: { type: String },
    phone: { type: String },
    email: { type: String, unique: true, sparse: true },
    password: { type: String },
    expoPushToken: { type: String, default: null },
  },
  { timestamps: true, collection: 'candidates' }
)

export default mongoose.model('Candidate', candidateSchema)