import { useRoute } from '@react-navigation/native'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { ScrollView, View } from 'react-native'
import { LineChart } from 'react-native-chart-kit'
import { useTheme } from 'react-native-paper'
import api from '~/api'
import Header from '~/components/header'
import { widthScale } from '~/theme'

const SensorData = () => {
  const theme = useTheme()
  const [datasets, setDatasets] = useState([])
  const temp = {}
  const route = useRoute()
  const sensorId = route.params?.sensorId
  const deviceId = route.params.deviceId

  const [data, setData] = useState([])

  const fetchSensorData = () => {
    api.devices.getDeviceSensorsData(deviceId, sensorId).then((res) => {
      if (res.data?.data?.[sensorId]?.length) {
        setData(res.data.data[sensorId])
      }
    })
  }

  const allColors = [theme.colors.red, theme.colors.yellow, theme.colors.aqua]

  useEffect(() => {
    fetchSensorData()
  }, [])

  useEffect(() => {
    if (data.length === 0) {
      return
    }
    console.log(data)
    Object.keys(data[0].value).forEach((key) => {
      temp[key] = []
    })

    data.map((item) => {
      Object.keys(item.value).forEach((key) => {
        temp[key].push(item.value[key])
      })
    })

    const tempDataset = []

    Object.keys(temp).forEach((key) => {
      tempDataset.push({
        data: temp[key],
        strokeWidth: 2,
        color: (opacity) => theme.colors.red,
        withDots: true,
      })
    })
    setDatasets(tempDataset)
  }, [data?.length])

  return (
    <View>
      <Header center={{ render: 'Sensor data' }} />
      <ScrollView horizontal>
        {datasets.length > 0 && (
          <LineChart
            data={{
              labels: data.map(
                (item) =>
                  moment(item.time).hour() +
                  ':' +
                  moment(item.time).minute() +
                  ':' +
                  moment(item.time).second()
              ),
              datasets: datasets,
              legend: Object.keys(temp),
            }}
            width={widthScale(300)} // from react-native
            height={widthScale(100)}
            yAxisInterval={1} // optional, defaults to 1
            chartConfig={{
              decimalPlaces: 1, // optional, defaults to 2dp
              color: () => theme.colors.blue,
              labelColor: (opacity = 1) => theme.colors.generateBlack(opacity),
              style: {
                borderRadius: 16,
              },
              propsForBackgroundLines: {
                strokeWidth: 1,
                opacity: 0.2,
              },
              propsForDots: {
                r: '4',
                strokeWidth: '2',
              },
              fillShadowGradientFrom: theme.colors.blue,
              fillShadowGradientTo: theme.colors.blue,
              strokeWidth: 1,
            }}
            // bezier
            getDotColor={() => theme.colors.blue}
            withScrollableDot={false}
            transparent
          />
        )}
      </ScrollView>
    </View>
  )
}

export default SensorData
