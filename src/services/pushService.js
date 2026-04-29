import { Expo } from 'expo-server-sdk'
import Member from '../models/Member.js'
import Candidate from '../models/Candidate.js'

const expo = new Expo()

export async function sendPushToAll(title, body) {
  const members = await Member.find({ expoPushToken: { $ne: null } })
  const candidates = await Candidate.find({ expoPushToken: { $ne: null } })
  const users = [...members, ...candidates]

  const messages = users
    .filter(u => Expo.isExpoPushToken(u.expoPushToken))
    .map(u => ({
      to: u.expoPushToken,
      sound: 'default',
      title,
      body,
    }))

  if (messages.length === 0) return

  const chunks = expo.chunkPushNotifications(messages)
  for (const chunk of chunks) {
    try {
      await expo.sendPushNotificationsAsync(chunk)
    } catch (error) {
      console.error('Помилка відправки push:', error)
    }
  }
};

export async function sendPushToAdmins(title, body) {
  const admins = await Member.find({ 
    role: 'admin', 
    expoPushToken: { $ne: null } 
  })

  const messages = admins
    .filter(a => Expo.isExpoPushToken(a.expoPushToken))
    .map(a => ({
      to: a.expoPushToken,
      sound: 'default',
      title,
      body,
    }))

  if (messages.length === 0) return

  const chunks = expo.chunkPushNotifications(messages)
  for (const chunk of chunks) {
    try {
      await expo.sendPushNotificationsAsync(chunk)
    } catch (error) {
      console.error('Помилка відправки push адмінам:', error)
    }
  }
};

export async function sendPushToUser(telegramId, title, body) {
  const user = await Member.findOne({ id: telegramId, expoPushToken: { $ne: null } })
    || await Candidate.findOne({ id: telegramId, expoPushToken: { $ne: null } })

  if (!user || !Expo.isExpoPushToken(user.expoPushToken)) return

  try {
    await expo.sendPushNotificationsAsync([{
      to: user.expoPushToken,
      sound: 'default',
      title,
      body,
    }])
  } catch (error) {
    console.error('Помилка відправки push користувачу:', error)
  }
};