import React, { useEffect, useState } from 'react';

import { Bar } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';

export const RansharingCharts = (props) => {
    const [dateAxis, setDateAxis] = useState([]);
    const [ranData, setRanData] = useState(null);


    console.log('charts data', props)


useEffect(()=> {
    var data1Input = props.data.map(function (x) { return x.diff1 })
    var data2Input = props.data.map(function (x) { return x.diff2 })
    var percentage1 = props.data.map(function (x) { return (x.diff1/x.totalCells1)*100 })
    var percentage2 = props.data.map(function (x) { return (x.diff2/x.totalCells2)*100 })

    mergeData(data1Input, data2Input, percentage1, percentage2)
    var array = props.data.map(function (x) { return x.week })
    let unique = [...new Set(array)];
    setDateAxis(unique)
},[props])

const mergeData = (data1, data2, percentage1, percentage2, data3GPercentage, data4GPercentage, data2G, data3G, data4G) => {
        
    const lineChartData = {
      data: {
        labels: dateAxis,
        datasets: [
          {
            type: 'bar',
            label: `${props.case} QOS KPI`,
            stack: 'stack1',
            data: data1,
            yAxisID: 'A',
            fill: true,
            xAxisID: 'X',
            barThickness: '40',
            // color: 'rgba(0,156,204,255)',
            // backgroundColor: 'rgba(234,91,15,255)',
            // backgroundColor: "rgba(75,192,19,0.2)",
            borderColor: 'rgba(0,156,204,255)',
            borderWidth: 2,
            datalabels: {
              display: true,
              align: "top",
              anchor: "end",
              formatter: (val, ctx) => {
                return  data1[ctx.dataIndex] + "(" + percentage1[ctx.dataIndex].toFixed(1) + '%)'; ;
              },
              color: '#404040',
              // backgroundColor: '#404040'
            },
          },
          {
            type: 'bar',
            label: `${props.case} AUDIT OMC`,
            data: data2,
            stack: 'stack2',
            color: '#1f77b4',
            yAxisID: 'A',
            fill: false,
            xAxisID: 'X',
            // backgroundColor: 'blue',
            borderColor: 'rgba(234,91,15,255)',
            borderWidth: 2,
            barThickness: '40',
            datalabels: {
              display: true,
              align: "top",
              anchor: "end",
              formatter: (val, ctx) => {
                return data2[ctx.dataIndex] + "(" + percentage2[ctx.dataIndex].toFixed(1) + '%)';
              },
              color: '#404040',
              // backgroundColor: '#404040'
            },
          },
       
          // {
          //   type: 'bar',
          //   label: '4G',
          //   color: 'red',
          //   stack: 'stack2',
          //   data: data4,
          //   yAxisID: 'A',
          //   fill: false,
          //   // backgroundColor: 'green',
          //   borderColor: 'green',
          //   borderWidth: 2,
          //   datalabels: {
          //     color: 'black',
          //     font: 'bold',
          //   align: 'top'6
          //   }

          // },
          // {
          //   type: 'bar',
          //   label: '2G',
          //   stack: 'stack1',
          //   data: firstCat,
          //   yAxisID: 'A',
          //   xAxisID: 'X',
          //   fill: true,
          //   barThickness : '200',
          //   color: 'red',
          //   backgroundColor: 'blue',
          //   backgroundColor: "rgba(75,192,192,0.2)",
          //   borderColor: 'blue',
          //   borderWidth: 2,
          //   datalabels: {
          //     color: 'white',
          //     font: 'bold',
          //     align: "top",
          //     backgroundColor: 'blue',
          //     borderColor: 'rgb(54, 162, 235)',
          //     borderWidth: 2
          //   }

          // },
          // {
          //   type: 'bar',
          //   label: '3G',
          //   data: secondCat,
          //   stack: 'stack1',
          //   color: '#1f77b4',
          //   yAxisID: 'A',
          //   xAxisID: 'X',
          //   fill: false,
          //   barThickness : '200',
          //   backgroundColor: 'red',
          //   borderColor: 'red',
          //   borderWidth: 2,
          //   datalabels: {
          //     color: 'white ',
          //     font: 'bold',
          //     backgroundColor: 'black',
          //     align: "top",
          //   }
          // },
          // {
          //   type: 'bar',
          //   label: '4G',
          //   color: 'red',
          //   stack: 'stack1',
          //   data: thirdCat,
          //   yAxisID: 'A',
          //   xAxisID: 'X',
          //   fill: false,
          //   backgroundColor: 'green',
          //   borderColor: 'green',
          //   barThickness : '200',
          //   borderWidth: 2,
          //   datalabels: {
          //     color: 'black',
          //     font: 'bold',
          //   align: 'top'
          //   }

          // },
          // {
          //   label: "Cellules presentes en BDR ou RR uniquement",
          //   yAxisID: 'B',
          //   backgroundColor: "red",
          //   data: firstCat,
          //   stack: 2
          // },
          // {
          //   label: "Cellules demontees, mais presentes en BDR ou RR",
          //   yAxisID: 'B',
          //   backgroundColor: "orange",
          //   data: secondCat,
          //   stack: 2
          // },
          // {
          //   label: "Cellules normales",
          //   yAxisID: 'B',
          //   backgroundColor: "green",
          //   data: thirdCat,
          //   stack: 2
          // }

        ],
      },

    }
    


    var mergedData = [
      // ...data1,
      // ...data2,
      // ...dataSub4G,
      // ... data2,
      ...lineChartData.data.datasets
    ]
    // console.log(mergedData)
    setRanData(mergedData)
  }


  const lineChartData =
  {
    options: {
      xAxes: [{
        stacked: false,
        offset: true,
        barPercentage: 0.9
      }],
      yAxes: [{
        stacked: false
      }],
      plugins: {
      },
      scales: {
        A: {
          // type: 'linear',
          position: 'left',
          stacked: true,
          // ticks: {
          //   autoSkip: false
          // },
          title: {
            display: true,
            text: 'Nombre de cellules'
          },
        },
        B: {
          type: 'linear',
          position: 'right',
          title: {
            display: true,
            text: '%'
          },
          ticks: {
            // max: 1,
            // min: 1000
          }
        }  
      },
    }
  }
    return (
        <> 
        {ranData ?
        <Bar className='grid-chart'
        data={{ labels: dateAxis, datasets: ranData }}
        // data ={lineChartData}
        options={lineChartData.options}
        plugins={[ChartDataLabels]}
        height={30}
        width={150}
    //  options={}
    /> : null}
        </>
    )
}