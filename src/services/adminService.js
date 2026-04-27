import Member from '../models/Member.js';
import Candidate from '../models/Candidate.js';

export async function listMembers() {
  return Member.find().select('-password -email').sort({ name: 1 });
}

export async function listCandidates() {
  return Candidate.find().select('-password -email').sort({ name: 1 });
}
