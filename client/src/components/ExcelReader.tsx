import React, { Component } from 'react'
import XLSX from 'xlsx'
import { Button, Modal, Container } from 'react-bootstrap'
// import styles from '../stylesheets/home.module.css'
import axios from 'axios'
// import { motion } from "framer-motion"
// import { pageTransitions} from "../data/pageTransitions"
// import { pageVariants } from "../data/pageVariants"
import { config } from "../config";;



const SheetJSFT = [
  "xlsx", "xlsb", "xlsm", "xls", "xml", "csv", "txt", "ods", "fods", "uos", "sylk", "dif", "dbf", "prn", "qpw", "123", "wb*", "wq*", "html", "htm"
].map(function (x) { return "." + x; }).join(",");

const make_cols = refstr => {
  let o = [], C = XLSX.utils.decode_range(refstr).e.c + 1;
  for (var i = 0; i < C; ++i) o[i] = { name: XLSX.utils.encode_col(i), key: i }
  return o;
};

class ExcelReader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showHide: false,
      test: "",
      messageData: {
        'message': ""
      },
      file: {},
      data: [],
      cols: []
    }
    this.handleFile = this.handleFile.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.sendData = this.sendData.bind(this);
  }


  sendData(res) {
    return res

  }

  handleModalShowHide() {
    this.setState({ showHide: !this.state.showHide })
  }

  handleChange(e) {
    const files = e.target.files;
    if (files && files[0]) this.setState({ file: files[0] });
  };


  handleFile() {
    /* Boilerplate to set up FileReader */
    const reader = new FileReader();
    const rABS = !!reader.readAsBinaryString;

    reader.onload = (e) => {
      /* Parse data */
      const bstr = e.target.result;
      const wb = XLSX.read(bstr, { type: rABS ? 'binary' : 'array', bookVBA: false, cellDates: true });
      /* Get first worksheet */
      const wsname = wb.SheetNames[0];
    //   check if sheets exist
      console.log(wb)
      /* Convert array of arrays */
      const data2G = XLSX.utils.sheet_to_json(wb.Sheets['Incoherence 2G'], {
        header: 0,
        defval: "",
        raw: false,
        dateNF: 'YYYY-MM-DD'
      }

    //   get all incoherences
    // const unique = [...new Set(data.map(item => item.group))]; // [ 'A', 'B']
    
     
    //   console.log(data2G)

      );
      

      const data3G = XLSX.utils.sheet_to_json(wb.Sheets['Incoherence 3G'], {
        header: 0,
        defval: "",
        raw: false,
        dateNF: 'YYYY-MM-DD'
      })
      const data4G = XLSX.utils.sheet_to_json(wb.Sheets['Incoherence 4G'], {
        header: 0,
        defval: "",
        raw: false,
        dateNF: 'YYYY-MM-DD'
      })
      
         var result = new Object();
        result["_2G"] = data2G.length
        result["_3G"] = data3G.length
        result["_4G"] = data4G.length
        result["data2G"] = data2G
        result["data3G"] = data3G
        result["data4G"] = data4G
        // result.3G:data3G.length, '4G':data4G.length })
      /* Update state */
    //   this.setState({ data: data, cols: make_cols(ws['!ref']) }, () => {
        // this.sendData(this.state.data);
        this.props.getData(result)
        //console.log(JSON.stringify(this.state.data, null, 2));
    //   });

    };

    if (rABS) {
      reader.readAsBinaryString(this.state.file);
    } else {
      reader.readAsArrayBuffer(this.state.file);
    };
  }

  render() {
    return (<div>
      <Modal show={this.props.showModal} className="upload-modal">
        <Modal.Header >
          <Modal.Title>Upload Page</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <input type="file" className="form-control" id="file" accept={SheetJSFT} onChange={this.handleChange} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => this.props.setShowModal()}>
            Close
          </Button>
          <Button variant="primary"
            onClick={() => { this.handleFile(); this.props.setShowModal(); }}
          >
            Confirm
          </Button>
        </Modal.Footer>
      </Modal></div>)
  }
}


export default ExcelReader;
