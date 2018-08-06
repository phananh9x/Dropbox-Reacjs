import React, {Component} from 'react';
import {Row,Col,ListGroupItem , Table} from 'react-bootstrap';
import Modal from 'react-modal';

import '../FileUpload.css';
import * as API from '../api/API';
import { Route, withRouter } from 'react-router-dom';
import {markStar} from "../actions/index";
import {connect} from 'react-redux';
// Import React Table
import ReactTable from "react-table";
import "react-table/react-table.css";
import index from "../reducers/index";

class FileGridList extends Component {
static propTypes = {
    location: React.PropTypes.object.isRequired
  }


    state = { index:'', isModalOpen: false, shareEmail:'', file:'' , group:'', downloadLink:''}

    openModal(index, file, downloadLink) {
        this.setState({ index:index, isModalOpen: true , file: file, downloadLink:downloadLink, showLink:false})
    }

    closeModal(data) {

        if(data!=""){

            if(data.shareEmail!=""){

                this.props.sharefile(data)
            }

            if(data.group!=""){

                this.props.sharefileingroup(data)
            }
        }

        this.setState({ isModalOpen: false, showLink: true })
    }

    generateLink(){
        this.setState({ showLink: true })
    }

    markStar(index, filepath, starred){

        const data={filepath:filepath, starred:starred}

        API.markStar(data)
            .then((res) => {

                if (res.status == 200 || res.success) {
                    console.log(res);

                    this.props.markStar(index, res.starred);

                }else if (res.status == 400 || !res.success || res.status == 500) {

                    this.setState({ message: res.message })
                }
            });
    }


    style = {
        content : {
            top                   : '50%',
            left                  : '50%',
            right                 : 'auto',
            bottom                : 'auto',
            marginRight           : '-50%',
            transform             : 'translate(-50%, -50%)'
        }
    };


  
  // onBackButtonEvent = (e) => {
  //     e.preventDefault();
  //       this.props.history.goBack();
  //   }

  //   componentDidMount = () => {
  //     window.onpopstate = this.onBackButtonEvent;
  //   }

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
        console.log(this.props.location)
        // let arr = this.props.location.pathname.split("/")
        // if (arr.length == 2) {
        //     let folderId = arr[1];
        //     API.getFileList(folderId)
        //         .then((res) => {
        //         if (res.status == 200 || res.success) {
        //                 console.log(res.results)
        //             this.props.getFiles(res.results.files);
        //             this.props.history.push("/files/"+folderId)

        //         }else if (res.status == 400 || !res.success || res.status == 500) {


        //         }

        //     });
        // }
    }
  }
    render(){
    return (

        <div className="col-sm-10">
            <Table bordered condensed>
                    <thead>
                    <tr>
                        <th>Type</th>
                        <th>Name</th>
                        <th>Members</th>
                        <th>Delete</th>
                        <th>Share</th>

                    </tr>
                    </thead>

                    <tbody>

                    {this.props.filedata.files && this.props.filedata.files.map((file, index) => {
                      //  if(file.fileparent==this.props.parentFile || (file.isfile=='T' && file.owner!= this.props.userEmail )) {
                            if (file && file.isfile=='T') {
                                var filepath = file.filepath.split("/")
                                filepath.shift()
                                filepath.shift()
                                var downloadlink= 'https://dropbox-server.herokuapp.com/'+filepath.join("/")
                            }
                            return (
                           
                                <tr >

                                    <td>
                                        <div className="row">

                                            <div className="col-md-1">
                                                {file.starred==true?
                                                    <a href="#" className="link-title "
                                                       onClick={() => this.markStar(index, file.filepath, false)}>

                                                    <span className="fa fa-star" ></span>

                                                    </a>
                                                :
                                                    <a href="#" className="link-title "
                                                       onClick={() => this.markStar(index, file.filepath, true)}>

                                                    <span className="fa fa-star-o" onClick={() => this.markStar(index, file)}></span>
                                                    </a>}
                                            </div>
                                            <div className="col-md-1">
                                                {file.isfile=='T'?
                                                <span className="fa fa-file"></span>:
                                                <span className="fa fa-folder"></span>
                                                }
                                            </div>

                                        </div>
                                    </td>
                                    <td>
                                        {file.isfile=='F'?
                                        <a className="link-title "
                                                onClick={() => this.props.openFileFolder(file)}
                                               >
                                                {file.filename}
                                        </a>
                                        :
                                        <a href={downloadlink} className="link-title "
                                          >
                                            {file.filename}
                                        </a>
                                        }

                                    </td>
                                    <td>
                                        {file.sharedcount===0?
                                            <div>Only You</div>:
                                        <div className="row">
                                            <div className="col-md-1">{file.sharedcount}</div>
                                            <div>members</div>
                                        </div>
                                            }

                                    </td>

                                    <td>
                                        <button className="btn btn-danger" type="submit"
                                                onClick={() => this.props.deleteFile(index, file)}>
                                            Delete
                                        </button>
                                    </td>
                                    <td>
                                        <button className="btn btn-info" type="submit"
                                                onClick={() => this.openModal(index, file, downloadlink)}>
                                            Share
                                        </button>

                                    </td>

                                </tr>
                            );
                     //   }
                    })}
                    {!this.props.filedata.files.length && <tr> <td colSpan="5" style={{    textAlign: 'center'}}>No data.</td></tr> }
                    </tbody>
                </Table>
                <Modal isOpen={this.state.isModalOpen} style={this.style} onClose={() => this.closeModal()}>
                    <ListGroupItem>

                        <Row className="show-grid">
                            <Col md={3}>Email:</Col>

                            <Col md={9}>
                                <input type="text" className="form-control" required="true" autoFocus placeholder="Enter semi-colon separated emails"
                                       onChange={(event) => {
                                           this.setState({
                                               shareEmail: event.target.value
                                           });
                                       }}/>
                            </Col>

                        </Row>
                        <br/>
                        <Row className="show-grid">
                            <Col md={3}>Group:</Col>

                            <Col md={9}>
                                <input type="text" className="form-control" required="true" autoFocus placeholder="Enter Group"
                                       onChange={(event) => {
                                           this.setState({
                                               group: event.target.value
                                           });
                                       }}/>
                            </Col>

                        </Row>
                        <Row className="show-grid">
                            <Col md={7}>

                            </Col>

                            <Col md={5}>

                                <a href="#" className="link-title "
                                   onClick={() => this.generateLink()}>
                                    Generate Link
                                </a>
                            </Col>

                        </Row>

                        <Row className="show-grid">

                                {
                                    this.state.showLink==true?
                                        <h6><small>{this.state.downloadLink}</small></h6>
                                        :''
                                }


                        </Row>

                    </ListGroupItem>
                    <br/>
                    <div className=" row justify-content-md-center">
                        <div className=" col-md-4">
                            <button className="btn btn-primary" type="submit"
                                    onClick={() => this.closeModal(this.state)}>Save</button>
                        </div>
                        <div className=" col-md-4">
                            <button className="btn btn-primary" type="submit"
                                    onClick={() => this.closeModal('')}>Close</button>
                        </div>

                    </div>



                </Modal>


        </div>


        );
    }


}



function mapStateToProps(reducerdata) {

    const filedata = reducerdata.filesreducer;

    return {filedata};
}


function mapDispatchToProps(dispatch) {
    return {

        markStar : (index, data) => dispatch(markStar(index, data))
    };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(FileGridList));


