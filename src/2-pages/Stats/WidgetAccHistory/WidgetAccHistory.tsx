import React, { FC, useState } from 'react'
import { Box, Typography, Paper } from '@mui/material'
import { AreaChart, Area, ResponsiveContainer, YAxis } from 'recharts'
import { useAppTheme } from '6-shared/ui/theme'
import { formatDate } from '6-shared/helpers/date'
import { TAccountId, TISODate } from '6-shared/types'
import { Amount } from '6-shared/ui/Amount'

import { accountModel } from '5-entities/account'
import { Period } from '../shared/period'
import { useAccountHistory } from './model'

type AccTrendProps = {
  period: Period
  id: TAccountId
  onClick: (id: TAccountId, date: TISODate) => void
}

export const WidgetAccHistory: FC<AccTrendProps> = ({
  id,
  period,
  onClick,
}) => {
  const theme = useAppTheme()
  const acc = accountModel.usePopulatedAccounts()[id]
  const data = useAccountHistory(id, period)
  const dataMax = Math.max(...data.map(i => i.balance))
  const dataMin = Math.min(...data.map(i => i.balance))
  const yAxisMin = Math.min(0, dataMin)

  const [hoverIdx, setHoverIdx] = useState<number | null>(null)

  const isHovering = !!hoverIdx || hoverIdx === 0
  const balance = isHovering ? data[hoverIdx].balance : acc.balance
  const hoverDate = isHovering ? data[hoverIdx].date : null

  const gradientOffset = () => {
    if (dataMax <= 0) return 0
    if (dataMin >= 0) return 1
    return dataMax / (dataMax - dataMin)
  }

  const offset = gradientOffset()
  const colorId = 'gradient' + acc.id

  return (
    <Paper style={{ overflow: 'hidden', position: 'relative' }}>
      <Box p={2} minWidth={160}>
        <Typography variant="body2" onClick={() => console.log(acc)}>
          <span
            style={{ textDecoration: acc.archive ? 'line-through' : 'none' }}
          >
            {acc.title}
          </span>{' '}
          {isHovering && hoverDate && formatDate(hoverDate)}
        </Typography>
        <Typography variant="h6">
          <Amount value={balance} currency={acc.fxCode} decMode="ifAny" />
        </Typography>
      </Box>

      <div
        style={{
          width: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      >
        <ResponsiveContainer>
          <AreaChart
            data={data}
            margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
            onClick={e => {
              if (!e || !e.activeLabel) return
              const date = data[+e.activeLabel].date
              onClick(id, date)
            }}
            onMouseMove={e => {
              if (!e || !e.activeLabel) {
                setHoverIdx(null)
                return
              }
              setHoverIdx(+e.activeLabel)
            }}
            onMouseLeave={() => setHoverIdx(null)}
          >
            <defs>
              <linearGradient id={colorId} x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset={offset}
                  stopColor={theme.palette.primary.main}
                  stopOpacity={0.2}
                />
                <stop
                  offset={offset}
                  stopColor={theme.palette.error.main}
                  stopOpacity={0.3}
                />
              </linearGradient>
            </defs>

            <YAxis domain={[yAxisMin, 'dataMax']} hide />

            <Area
              type="monotone"
              stroke="none"
              fill={`url(#${colorId})`}
              fillOpacity={1}
              dataKey="balance"
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Paper>
  )
}
