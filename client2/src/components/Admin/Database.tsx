import React, { useState } from "react";
import { useMutation, useQuery, gql } from "@apollo/client";
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from "react-redux";
import { Table, Container, Row, Col, Checkbox, CardGroup, FormGroup } from 'react-bootstrap'
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import "./Database.scss"
import { useEffect } from "react";

const GET_ALL = gql`
  query ($date: String, $responsible_entity:String, $site: String, $week:String, $no_itv: String, $status: String) { 
    getAll(first:50, date:$date, responsible_entity:$responsible_entity, week:$week, site:$site, no_itv:$no_itv, status:$status)  {
        id
        week
        date
        NORM
        responsible_entity 
        no_incident 
        no_itv
        status
        site_constructor
        TT_creator_short
        OMC_engineer
        site
        region
        comment_tac
        
    }
  }
`;

const DELETE_ITEMS = gql`
mutation ($data: [idArray]) {
    deleteItems (data:$data){
        success
        message
      }
    }

`;

const GET_DISTINCT = gql`
query {
    getDistinctWeeks {
        week
    }
}
`;

const useStyles = makeStyles((theme) => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 200,
    },
}));



const Database = () => {
    const user = useSelector((state) => ({ auth: state.auth }));
    const classes = useStyles();
    const [checked, setChecked] = useState([])
    const [items, setItems] = useState([])
    const [selected, setSelected] = useState(0)
    const [weekList, setuWeeksList] = useState([]);
    const [itvList, setuitvList] = useState([]);
    const [status, setStatus] = useState();
    const [itv, setItv] = useState();
    const [site, setSite] = useState();
    const [date, setDate] = useState();
    const [responsible, setResponsible] = useState();
    const [week, setWeek] = useState();
    const { data, loading, error, refetch } = useQuery(GET_ALL, {
        variables: { status: status, week: week, date: date }, onCompleted: (
        ) => {
            setItems(data)

        }
    });


    useEffect(() => {
        getMembers(user.auth.token)
    },[])

    const [deleteItemsMutation] = useMutation(DELETE_ITEMS, {
        onCompleted: (dataRes) => {
            alert(dataRes.deleteItems.message);
            console.log(items.getAll.length)
            checked.forEach(x => {
                console.log(items.getAll.findIndex(function (i) {
                    return i.id === parseInt(x.id);
                }))
                items.getAll.splice(items.getAll.findIndex(function (i) {
                    return parseInt(i.id) === parseInt(x.id);
                }), 1);
            })
            setChecked([])
            console.log(items.getAll.length)

        },
        onError: (error) => { console.error("Error creating a post", error); alert("Error creating a post request " + error.message) },
    });

    const deleteItems = () => {


        if (checked.length > 0) {
            if (
                window.confirm(`Are you sure you want to delete ${selected} items?
              `)
            ) {
                deleteItemsMutation({
                    variables: {
                        data: checked
                    }
                }
                )
            }
        }
        else { alert("please select some tasks...") }
    }



    const newDate = new Date()

    const { data: data2, loading: loading2, error: error2 } = useQuery(GET_DISTINCT, {
        onCompleted: () => {
            setuWeeksList(data2.getDistinctWeeks);
        }
    });

    const change = (event, values) => {
        console.log(event.target, values.status)
    }

    const getMembers = (token) => {
        console.log(token)
        fetch("https://graph.microsoft.com/v1.0/groups/9b185325-8378-450a-86cb-f2765b74a1c5/members", {
          method: "GET",
          // credentials: "include",
          headers: {
            Authorization: token,
          }
        })
          .then(response => {
            if (response.status === 200) return response;
            throw new Error("failed to authenticate user");
          })
          .then(response => console.log(response))
        //   .then(blob => setPic(URL.createObjectURL(blob)))
          .catch(error => {
            setState({
              // authenticated: false,
              error: "Failed to authenticate user"
            });
            console.log(error)
          });
      }

    const createArr = (id, item) => {
        if (checked.find((y) => y.id == item.id)) {
            console.log(id, item.id)
            // checked.find((y) => checked.splice(y, 1))
            checked.splice(checked.findIndex(function (i) {
                return i.id === parseInt(id);
            }), 1);
            setSelected(checked.length)
            console.log(checked)
        } else {

            checked.push({
                id: parseInt(id)
            })
            setSelected(checked.length)
            console.log(checked)
        }
    }


    // const onSaveInformation = (id, name) => updateUser({ variables: { id, name })

    return (<div>
        <div className="filterContainer">

            <>
                <Autocomplete
                    id="combo-box-demo"
                    options={weekList}
                    getOptionLabel={(option) => option.week}
                    style={{ width: 300 }}
                    onChange={(e, v) => { setWeek(v); refetch() }}
                    className={classes.textField}
                    renderInput={(params) => <TextField {...params} label="select week" variant="outlined" />}
                />
            </>
            <>
                <Autocomplete
                    id="combo-box-demo"
                    options={itvList}
                    getOptionLabel={(option) => option}
                    style={{ width: 300 }}
                    className={classes.textField}
                    onChange={(e, v) => setItv(v)}
                    renderInput={(params) => <TextField {...params} label="select ITV" variant="outlined" />}
                />
            </>
            <>
                <TextField
                    id="date"
                    type="date"
                    defaultValue={newDate.getDate()}
                    variant="outlined"
                    className={classes.textField}
                    onChange={(e, v) => { setDate(e.target.value); console.log(e.target.value); refetch() }}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                <>
                    <Autocomplete
                        id="combo-box-demo"
                        options={[{ status: 'null', labeL: "" }, { status: 'Problème résolu' }, { status: 'Problème résolu avec réserve' }, { status: 'Problème pas identifié' }, { status: 'Problème identifié' }]}
                        getOptionLabel={(option) => option.status}
                        style={{ width: 300 }}
                        className={classes.textField}
                        onChange={(e, v) => { setStatus(v.status); refetch() }}
                        renderInput={(params) => <TextField {...params} label="select status" variant="outlined" />}
                    />
                </>
                <>
                    <Autocomplete
                        id="combo-box-demo"
                        options={weekList}
                        getOptionLabel={(option) => option}
                        style={{ width: 300 }}
                        className={classes.textField}
                        onChange={(e, v) => setStite(v)}
                        renderInput={(params) => <TextField {...params} label="select site" variant="outlined" />}
                    />
                </>
                <>
                    <Autocomplete
                        id="combo-box-demo"
                        options={weekList}
                        getOptionLabel={(option) => option}
                        style={{ width: 300 }}
                        className={classes.textField}
                        onChange={(e, v) => { setResponsible(v.responsible_entity); refetch() }}
                        renderInput={(params) => <TextField {...params} label="select responsible" variant="outlined" />}
                    />
                </>
            </>

            {/* </form> */}
        </div>
        {user.auth.role === 'L3' ?
            <div className='buttonContainer'>
                <Button variant="contained" color="secondary" onClick={deleteItems}>Delete {selected}</Button>
                <Button variant="contained" color="primary" disabled={true} onClick={deleteItems}>Upload</Button>
                <Button variant="contained" color="primary" disabled={true} onClick={deleteItems}>Notify</Button>
                <Button variant="contained" color="primary" disabled={true} onClick={deleteItems}>AddItem</Button>
            </div>
            : null}
        <Table striped bordered hover responsive="xl" className="dash-table">
            <thead >
                <tr>
                    <th>Select</th>
                    <th>
                        WEEK
                    </th>
                    <th>
                        DATE
                    </th>
                    <th>
                        TYPE
                    </th>
                    <th>
                        RESPONSIBLE
                    </th>
                    <th >
                        TT GIR
                    </th>
                    <th >
                        ITV
                    </th>
                    <th>
                        STATUS
                    </th>

                    <th>
                        CONSTRUCTOR
                    </th>

                    <th>
                        INTERVENANT
                    </th>
                    <th>
                        CREATEUR
                    </th>
                    <th>
                        SITE
                    </th>
                    <th>
                        REGION
                    </th>
                    <th>
                        CR TAC
                    </th>
                    {/* <th>
                    </th> */}
                </tr>
            </thead>
            <tbody>
                {items && items.getAll && items.getAll.map(item => {
                    return <tr key={item.id}>
                        <td> <input
                            type="checkbox"
                            checked={checked.find((y) => y.id == item.id) ? true : false}
                            onChange={(e) => createArr(item.id, item)}
                        /></td>
                        <td>{item.week}</td>
                        <td>{item.date}</td>
                        <td>{item.NORM}</td>
                        <td>{item.responsible_entity}</td>
                        <td>{item.no_incident}</td>
                        <td>{item.no_itv}</td>
                        <td className={item.status == 'Problème résolu' ? 'green' : item.status == 'Problème résolu avec réserve' ? 'orange' : item.status == 'Problème pas identifié' ? 'red' : null}>{item.status}</td>
                        <td>{item.site_constructor}</td>
                        <td>{item.OMC_engineer}</td>
                        <td>{item.TT_creator_short}</td>
                        <td>{item.site}</td>
                        <td>{item.region}</td>
                        <td><span title={item.comment_tac}>{item.comment_tac ? item.comment_tac.substring(0, 25) : null}</span></td>

                    </tr>
                })}
            </tbody>
        </Table>

    </div>)
}

export default Database