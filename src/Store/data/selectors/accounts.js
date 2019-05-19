import createSelector from 'selectorator'
import { getInstrumentsById } from './instruments'
import { getUsersById } from './users'

export const normalize = ({ instruments, users }, raw) => ({
  id: raw.id,
  user: users[raw.user],
  instrument: instruments[raw.instrument],
  type: raw.type,
  role: raw.role,
  private: raw.private,
  savings: raw.savings,
  title: raw.title,
  inBalance: raw.inBalance,
  creditLimit: raw.creditLimit,
  startBalance: raw.startBalance,
  balance: raw.balance,
  // "company": 4902,
  archive: raw.archive,
  enableCorrection: raw.enableCorrection,
  // startDate: null,
  // capitalization: null,
  // percent: null,
  changed: raw.changed * 1000
  // syncID: ['3314', '8603', '9622'],
  // enableSMS: false,
  // endDateOffset: null,
  // endDateOffsetInterval: null,
  // payoffStep: null,
  // payoffInterval: null
})

export const getAccountsById = createSelector(
  [getInstrumentsById, getUsersById, 'data.account'],
  (instruments, users, accounts) => {
    const result = {}
    for (const id in accounts) {
      result[id] = normalize({ instruments, users }, accounts[id])
    }
    return result
  }
)

export const getAccount = (state, id) => getAccountsById(state)[id]
