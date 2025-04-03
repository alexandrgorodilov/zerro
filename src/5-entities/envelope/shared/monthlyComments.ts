import { TEnvelopeId } from './envelopeId'
import { ByMonth } from '6-shared/types'
import { makeMonthlyHiddenStore } from '5-entities/shared/hidden-store'
import { HiddenDataType } from '5-entities/shared/hidden-store'

export type TMonthlyComments = ByMonth<Record<TEnvelopeId, string>>

export const monthlyCommentsStore = makeMonthlyHiddenStore<TMonthlyComments>(
  HiddenDataType.MonthlyComments
)

export const monthlyCommentsModel = {
  getData: monthlyCommentsStore.getData,
  setData: monthlyCommentsStore.setData,
  resetMonth: monthlyCommentsStore.resetMonth,
}
