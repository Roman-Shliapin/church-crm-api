import Member from '../models/Member.js';
import Candidate from '../models/Candidate.js';

export async function findUserById(id) {
  const member = await Member.findById(id)
  if (member) return member
  return Candidate.findById(id)
}

export async function findProfileById(id) {
  let user = await Member.findById(id).select('-password');
  if (!user) {
    user = await Candidate.findById(id).select('-password');
  }
  return user;
}
