import React, { FC, useEffect, useState } from 'react'
import { InputBase, InputAdornment } from '@mui/material'
import { NotesIcon } from '6-shared/ui/Icons'
import { TISOMonth } from '6-shared/types'
import { useAppDispatch, useAppSelector } from 'store'
import { cardStyle } from './shared'
import { TEnvelopeId } from '5-entities/envelope'
import { useDebouncedCallback } from '6-shared/hooks/useDebouncedCallback'
import { useTranslation } from 'react-i18next'
import { monthlyCommentsModel } from '5-entities/envelope/shared/monthlyComments'

export const CommentWidget: FC<{ month: TISOMonth; id: TEnvelopeId }> = ({
  month,
  id,
}) => {
  const { t } = useTranslation('common')
  const dispatch = useAppDispatch()
  const monthlyComments = useAppSelector(monthlyCommentsModel.getData)
  const comment = monthlyComments[month]?.[id] || ''
  const [value, setValue] = useState(comment)

  const applyChanges = useDebouncedCallback(
    value => {
      if (comment !== value) {
        const currentComments = monthlyComments[month] || {}
        dispatch(
          monthlyCommentsModel.setData(
            {
              ...currentComments,
              [id]: value,
            },
            month
          )
        )
      }
    },
    [id, month, dispatch, monthlyComments],
    300
  )

  useEffect(() => {
    setValue(comment)
  }, [comment])

  return (
    <InputBase
      sx={cardStyle}
      placeholder={t('comment')}
      value={value}
      onChange={e => {
        setValue(e.target.value)
        applyChanges(e.target.value)
      }}
      multiline
      startAdornment={
        <InputAdornment position="start" component="label">
          <NotesIcon />
        </InputAdornment>
      }
    />
  )
}
