import * as React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import { Box } from '@mui/material'

const historical = require('../chainLink_historical.json')
// const historicalUSDC = require('../usdc_historical200.json')

export default function SimpleAreaChart({ dimensions }) {
  const [dataX, setDataX] = React.useState([])
  const [dataY, setDataY] = React.useState([])

  React.useEffect(() => {
    let xs = []
    let ys = []
    historical.map((item, index) => {
      const format = Date.parse('23 Jan 2023 10:00:00 GMT')
      const date = new Date(format)
      date.setDate(date.getDate() + index)
      xs.push(date)
      ys.push(item.usdPrice)
      return null
    })
    setDataX(xs)
    setDataY(ys)
  }, [])

  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
      <LineChart
        width={dimensions[0]*0.9}
        height={300}
        series={[{ data: dataY, area: true, showMark: false, label: 'ChainLink to USD' }]}
        xAxis={[{ scaleType: 'time', data: dataX }]}
        sx={{
          '.MuiLineElement-root': {
            display: 'none',
          },
          "& .MuiChartsAxis-left .MuiChartsAxis-tickLabel": {
            strokeWidth: "0.4",
            fill: "#fafafa",
          },
          "& .MuiChartsAxis-bottom .MuiChartsAxis-tickLabel": {
            strokeWidth: "0.5",
            fill: "#fafafa",
          },
        }}
        leftAxis={null}
        slotProps={{
          legend: {
            position: {
              vertical: 'top',
              horizontal: 'left',
            },
            labelStyle: {
              fontSize: 14,
              fontWeight: 500,
              fill: '#fafafa',
            },
            itemMarkWidth: 20,
            itemMarkHeight: 5,
            markGap: 5,
            itemGap: 10,
          }
        }}
        lineStyle={{ strokeDasharray: '10 5' }}
      />
    </Box>
  );
}