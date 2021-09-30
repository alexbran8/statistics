import React, { Component, useState, useCallback, useEffect } from "react";
import { useForm } from 'react-hook-form'
import { Button, Modal, Form } from 'react-bootstrap'
import Table from "react-bootstrap"
import { Bar, Line } from 'react-chartjs-2';
import { gql, useQuery } from '@apollo/client';
import moment from "moment";
import ChartDataLabels from 'chartjs-plugin-datalabels';

import "./Reporting.scss"
import { extendSchemaImpl } from "graphql/utilities/extendSchema";

const GET_REPORTING = gql`
query ($startDate:String!, $endDate:String!) {
  refreshReporting(startDate:$startDate,endDate:$endDate){
    Date
    CATEGORY
    count
    ETAT
    percentage
  }

} 
`;


const Reporting = () => {
    const [endDate, setEndDate] = useState(moment(new Date()).format("YYYY-MM-DD"));
  const currentDate = moment().format("YYYY-MM-DD")
  const [startDate, setStartDate] = useState(moment(new Date(currentDate) - ((24 * 60 * 60 * 1000) * 5)).format("YYYY-MM-DD"));
  const [allCheck, setAllCheck] = useState(false);

  const [dateAxis, setdateAxis] = useState();
  const [firstCat, setFirstCat] = useState([]);
  const [secondCat, setSecondCat] = useState([]);
  const [thirdCat, setThirdCat] = useState();
  const [fourthCat, setFourthCat] = useState();
  const { register, handleSubmit, errors } = useForm();

  const [bdebdrADemonte, setbdebdrADemonte] = useState();
  const [bdrUDemonte, setbdrUDemonte] = useState();
  const [rrDemonte, setrrDemonte] = useState();

  const [bdebdrAExploatation, setbdebdrAExploatation] = useState();
  const [bdebdrNonExploite, setbdebdrNonExploite] = useState()

  const [bdrNonExploatationDemonte, setbdrNonExploatationDemonte] = useState();
  const [bdrUEnExploatation, setbdrUEnExploatation] = useState();
  const [bdrUNonExploatation, setbdrUNonExploatation] = useState();

  const [bdebdrUBlank, setbdebdrUBlank] = useState();
  const [bdrUBlank, setbdrUBlank] = useState();

  const [RRUDemonte, setRRUDemonte] = useState();
  const [RRUEnExploatation, setRRUEnExploatation] = useState();
  const [RRUNonExploatation, setRRUNonExploatation] = useState();
  const [RRUBlank, setRRUBlank] = useState();
  const [maxLeftAxis, setMaxLeftAxis] =useState(90)
  const [minLeftAxis, setMinLeftAxis] =useState(50)

  const [etatData, setEtatData] = useState();

  console.log(typeof maxLeftAxis)


  const {data, loading, error, refetch } = useQuery(GET_REPORTING, {
    variables: { startDate:startDate , endDate:endDate }, onCompleted: (
    ) => {
      console.log(startDate)
      setEtatData(data.refreshReporting)
      console.log('x')
      data && data.refreshReporting ? setFirstCat(getCat(data.refreshReporting)) : null
      console.log(firstCat)
      data && data.refreshReporting ? calcData(data.refreshReporting,getCat(data.refreshReporting)) : null
    }
  }
  );






const lineChartData = {
    data: {
      labels: dateAxis,
      datasets: [
        {
          type: 'line',
          label: 'Taux de fiabilite',
          data: fourthCat,
          yAxisID: 'A',
          fill: false,
          // backgroundColor: 'rgb(255, 99, 132)',
          borderColor: 'rgb(54, 162, 235)',
          borderWidth: 2,
          datalabels: {
            color: 'white',
            font: 'bold',
            backgroundColor: 'black',
            borderColor: 'rgb(54, 162, 235)',
            borderWidth: 2
          }

        },
        {
          label: "Cellules presentes en BDR ou RR uniquement",
          yAxisID: 'B',
          backgroundColor: "red",
          data: firstCat,
          barThickness : '100',
          stack: 2
        },
        {
          label: "Cellules normales",
          yAxisID: 'B',
          backgroundColor: "green",
          data: secondCat,
          barThickness : '100',
          stack: 2
        },
        {
          label: "Cellules démontées, mais encore présentes en BDE",
          yAxisID: 'B',
          backgroundColor: "orange",
          data: thirdCat,
          barThickness : '100',
          stack: 2
        }

      ],
    },
    options: {
      plugins: {
        datalabels: {
          color: 'black',
          font: {
            // weight: 'bold',
            size: 14
          }
        }
      },
      scales: {
        A: {
          type: 'linear',
          position: 'left',
          title: {
            display: true,
            text: '%'
          },
          
            // beginAtZero: true,
            // suggestedMax: 6,   
            // suggestedMin: 20,
            min: minLeftAxis > 0 ? minLeftAxis : 100,
            max: maxLeftAxis > 0 ? maxLeftAxis : 100,
            ticks: {
              min: 50,
              // min: 1000
            }
        },
        B: {
          type: 'linear',
          position: 'right',
          title: {
            display: true,
            text: 'Nombre de cellules'
          },
          ticks: {
            // max: 1,
            // min: 1000
          }
        }
      },
    }
  }

  function calcData(data, secondArray) {
    // set date axis
    var vals = data.map(function (a) { return a.Date; });
    let unique = [...new Set(vals)];
    setdateAxis(unique)

    // cellules demonte => yellow
    var thirdCat = [];
    data.filter(a => a.ETAT == 'Demonte' && a.CATEGORY == 'Cellules normale').reduce(function (res, value) {
      if (!res[value.Date]) {
        res[value.Date] = { Date: value.Date, count: 0 };
        thirdCat.push(res[value.Date])
      }
      res[value.Date].count += parseFloat(value.count);
      return res;
    }, {});
    setThirdCat(thirdCat.map(function (a) { return a.count; }))

    // normal cells => green
    var secondCat = [];
    data.filter(a => (a.ETAT == 'En exploitation' || a.ETAT == 'En exploitation - Gele' || a.ETAT == 'Non exploite') && a.CATEGORY == 'Cellules normale').reduce(function (res, value) {
      if (!res[value.Date]) {
        res[value.Date] = { Date: value.Date, count: 0 };
        secondCat.push(res[value.Date])
      }
      res[value.Date].count += parseFloat(value.count);
      return res;
    }, {});

    let secondCatData = secondCat.map(function (a) { return a.count; })
    setSecondCat(secondCatData)

    var sum = [...secondCat].map((e, i) => ( e.count / (e.count + secondArray[i] + thirdCat[i].count)*100).toFixed(2));
    setFourthCat(sum)


    // calculate table data
    // bde+bdr alignes
    setbdebdrADemonte(data.filter(a => a.Date == endDate && a.ETAT == 'Demonte' && a.CATEGORY == 'Cellules normale').reduce((total, currentValue) => total = total + parseFloat(currentValue.count), 0));
    setbdebdrAExploatation(data.filter(a => a.Date == endDate && (a.ETAT == 'En exploitation' || a.ETAT == 'En exploitation - Gele') && a.CATEGORY == 'Cellules normale').reduce((total, currentValue) => total = total + parseFloat(currentValue.count), 0));
    setbdebdrNonExploite(data.filter(a => a.Date == endDate && a.ETAT == 'Non exploite' && a.CATEGORY == 'Cellules normale').reduce((total, currentValue) => total = total + parseFloat(currentValue.count), 0));
    setbdebdrUBlank(data.filter(a => a.Date == endDate && a.ETAT == null && a.CATEGORY == 'Cellules normale').reduce((total, currentValue) => total = total + parseFloat(currentValue.count), 0));
    //bdr uniqument
    setbdrUDemonte(data.filter(a => a.Date == endDate && a.ETAT == 'Demonte' && a.CATEGORY == 'Cellues presentes en BDR').reduce((total, currentValue) => total = total + parseFloat(currentValue.count), 0));
    setbdrUEnExploatation(data.filter(a => a.Date == endDate && a.ETAT == 'En exploitation' && a.CATEGORY == 'Cellues presentes en BDR').reduce((total, currentValue) => total = total + parseFloat(currentValue.count), 0));
    setbdrUNonExploatation(data.filter(a => a.Date == endDate && a.ETAT == 'Non exploite' && a.CATEGORY == 'Cellues presentes en BDR').reduce((total, currentValue) => total = total + parseFloat(currentValue.count), 0));
    setbdrUBlank(data.filter(a => a.Date == endDate && a.ETAT == null && a.CATEGORY == 'Cellues presentes en BDR').reduce((total, currentValue) => total = total + parseFloat(currentValue.count), 0));
    // RR uniqumente
    setRRUDemonte(data.filter(a => a.Date == endDate && a.ETAT == 'Demonte' && a.CATEGORY == 'Cellues presentes en RR uniquement').reduce((total, currentValue) => total = total + parseFloat(currentValue.count), 0));
    setRRUEnExploatation(data.filter(a => a.Date == endDate && a.ETAT == 'En exploitation' && a.CATEGORY == 'Cellues presentes en RR uniquement').reduce((total, currentValue) => total = total + parseFloat(currentValue.count), 0));
    setRRUNonExploatation(data.filter(a => a.Date == endDate && a.ETAT == 'Non exploite' && a.CATEGORY == 'Cellues presentes en RR uniquement').reduce((total, currentValue) => total = total + parseFloat(currentValue.count), 0));
    setRRUBlank(data.filter(a => a.Date == endDate && a.ETAT == null && a.CATEGORY == 'Cellues presentes en RR uniquement').reduce((total, currentValue) => total = total + parseFloat(currentValue.count), 0));


 
  }



  const getCat = (data) => {
    var firstCatA = [];
    var firstCatB = [];
    // red
    
    data.filter(a => a.CATEGORY == 'Cellues presentes en BDR').reduce(function (res, value) {
      if (!res[value.Date]) {
        res[value.Date] = { Date: value.Date, count: 0 };
        firstCatA.push(res[value.Date])
      }
      res[value.Date].count += parseFloat(value.count);
      return res;
    }, {});
    data.filter(a => a.CATEGORY == 'Cellues presentes en RR uniquement').reduce(function (res, value) {
      if (!res[value.Date]) {
        res[value.Date] = { Date: value.Date, count: 0 };
        firstCatB.push(res[value.Date])
      }
      res[value.Date].count += parseFloat(value.count);
      return res;
    }, {});
    var sum = firstCatA.map(function (num, idx) {
      return num.count + firstCatB[idx].count;
    });
    return sum
  }

  
  const onSubmit = (data) => {
    refetch;
    // apiService.graphql({
    //   query: GET_REPORTING,
    //   variables: { startDate: data.startDate, endDate: data.endDate },
    // })
    //   .then((response) => {
    //     setData(response.data.data.refreshReporting);
    //     let sum = getCat(response.data.data.refreshReporting)
    //     setFirstCat(sum)
    //     calcData(response.data.data.refreshReporting);
    //   }
    //   )
    //   .catch((error) => {
    //     alert("error", error.nessage)
    //   })
  }


    return (
        <div className="reportContainer">
      <h1 className='title'>New Reporting Feature </h1>
      <Form className="reportingForm" onSubmit={handleSubmit(onSubmit)}>
        <Form.Group controlId="new">
          <Form.Label 
          // aria-invalid={errors.date ? "true" : "false"}
          >Start Date
          <Form.Control type="date" name="endDate" dateformat="MM-DD-YY"  defaultValue={startDate} 
        //   ref={register({ required: true })} 
        {...register('startDate')}
        onChange={(e) => { setStartDate(e.target.value) }}
          />
          </Form.Label>
          {/* {errors.date && errors.date.type === "required" && ( */}
            {/* <span role="alert">This is required</span> */}
          {/* )} */}
          {/* <Form.Label aria-invalid={errors.date ? "true" : "false"}>End Date</Form.Label> */}
          <Form.Label 
          // aria-invalid={errors.date ? "true" : "false"}
          >End Date
          <Form.Control type="date" name="startDate" dateformat="DD-MM-YY" defaultValue={currentDate} 
        //   ref={register({ required: true })} 
        {...register('endDate')}
        onChange={(e) => { setEndDate(e.target.value) }} 
          />
          </Form.Label>
          <Form.Label 
          // aria-invalid={errors.date ? "true" : "false"}
          >Min Left Axis
         <Form.Control type="numeric" defaultValue={minLeftAxis} 
        onChange={(e) => { setMinLeftAxis(parseInt(e.target.value)) }} 
          />
          </Form.Label>
          <Form.Label 
          // aria-invalid={errors.date ? "true" : "false"}
          >Max Left Axis
          <Form.Control type="numeric" defaultValue={maxLeftAxis} 
        //   ref={register({ required: true })} 
        // {...register('endDate')}
        onChange={(e) => { setMaxLeftAxis(parseInt(e.target.value)) }} 
          />
          </Form.Label>
          {/* {errors.date && errors.date.type === "required" && (
            <span role="alert">This is required</span>
          )} */}
        </Form.Group>
        {/* <button type="submit" disabled={allCheck} className="centerBtn btn btn-success">Refresh</button> */}
      </Form> 

     <Bar
        data={lineChartData.data}
        options={lineChartData.options}
        plugins={[ChartDataLabels]}
        height={200}
        width={250}
      //  options={} 
      />
      <div>Table with data for the following date: {moment(endDate).format('DD-MM-YYYY')} </div>
      <table id='students'>
        <tbody>
          <tr>
            <td>Categories</td>
            <td>BDE & BDR alignées</td>
            <td>BDR UNIQUEMENT </td>
            <td>RR UNIQUEMENT</td>
          </tr>
          <tr>
            <td>Demonte</td>
            <td id="cell1-0">{bdebdrADemonte}</td>
            <td id="cell1-1">{bdrUDemonte}</td>
            <td id="cell1-2">{RRUDemonte}</td>
          </tr>
          <tr>
            <td>En exploitation (+en exploitation gelé)</td>
            <td id="cell2-0">{bdebdrAExploatation}</td>
            <td id="cell2-1">{bdrUEnExploatation}</td>
            <td id="cell2-2">{RRUEnExploatation}</td>
          </tr>
          <tr>
            <td>Non exploite</td>
            <td id="cell2-0">{bdebdrNonExploite}</td>
            <td id="cell2-1">{bdrUNonExploatation}</td>
            <td id="cell2-2">{RRUNonExploatation}</td>
          </tr>
          <tr>
            <td>(blank)</td>
            <td id="cell2-0">{bdebdrUBlank}</td>
            <td id="cell2-1">{bdrUBlank}</td>
            <td id="cell2-2">{RRUBlank}</td>
          </tr>
        </tbody>
      </table>
    </div>
    )
}

export default Reporting;