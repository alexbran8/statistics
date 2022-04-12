import React, {useState} from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';

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
    palette: {
        //   primary: blue,
        secondary: "#ff7961",
    },

}));

export const CaseFilter = (props) => {
    const classes = useStyles();



    return (
            <>
                <Autocomplete
                    id="status"
                    options={[{ status: 'BYT-FRM' }, { status: 'BYT-ORF' }, { status: 'BYT-SFR' }]}
                    getOptionLabel={(option) => option.status}
                    style={{ width: 300 }}
                    className={classes.textField}
                    onInputChange={(event, newInputValue, reason) => {
                        if (reason === 'clear') {
                           props.refetchFunction('')
                            return
                        } else {
                            props.refetchFunction(newInputValue)
                        }
                    }}
                    // onChange={(e, v) => { setStatus(v.status);alert(v.status); refetch() }}
                    renderInput={(params) => <TextField {...params} label="select status" variant="outlined" />}
                />
            </>
    )
}