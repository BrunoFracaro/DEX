import * as React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import { Box, Typography } from '@mui/material'

const historical = require('../chainLink_historical.json')

export default function SimpleAreaChart({ dimensions }) {
  const [dataX, setDataX] = React.useState([])
  const [dataY, setDataY] = React.useState([])

  React.useEffect(() => {
    let xs = []
    let ys = []
    historical.map((item, index) => {
      const format = Date.parse('23 Jan 2023 10:00:00 GMT')
      console.log('format', format)
      const date = new Date(format)
      console.log('date', date)
      date.setDate(date.getDate() + index)
      console.log('date', date)
      const xLabel = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
      xs.push(xLabel)
      ys.push(item.usdPrice)
      return null
    })
    console.log({ xs })
    setDataX(xs)
    setDataY(ys)
  }, [])

  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
      <Typography>USD</Typography>
      <LineChart
        width={dimensions[0]*2}
        height={300}
        series={[{ data: dataY, area: true, showMark: false }]}
        xAxis={[{ scaleType: 'point', data: dataX }]}
        sx={{
          '.MuiLineElement-root': {
            display: 'none',
          },
          "& .MuiChartsAxis-left .MuiChartsAxis-tickLabel": {
            strokeWidth: "0.4",
            fill: "#fafafa"
          },
          "& .MuiChartsAxis-bottom .MuiChartsAxis-tickLabel": {
            strokeWidth: "0.5",
            fill: "#fafafa",
          },
        }}
      />
    </Box>
  );
}