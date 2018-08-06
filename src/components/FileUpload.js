import React, {Component} from 'react';
import * as API from '../api/API';
import FileGridList from "./FileGridList";
import {Button} from 'react-bootstrap';
import TextField from 'material-ui/TextField';
import Typography from 'material-ui/Typography';
import {connect} from 'react-redux';
import {addFile} from "../actions/index";
import {deleteFile} from "../actions/index";
import RightNavBar from "./RightNavBar";
import LeftNavBar from "./LeftNavBar";
import {afterlogin} from "../actions/index";
import {getFiles} from "../actions/index";
import {sharedCount} from "../actions/index";
import Header from "./Header";
import { Route, withRouter } from 'react-router-dom';
import { browserHistory } from 'react-router';


class FileUpload extends Component {

    state = {
        message: '',
        fileparent:''
    };
    componentWillReceiveProps(nextProps) {
        // alert(nextProps.match.params.filepath)
        if (this.props.match.params != nextProps.match.params) {
            if (nextProps.match.params&& nextProps.match.params.filepath) {
                API.getFileList(nextProps.match.params.filepath)
                    .then((res) => {
                    if (res.status == 200 || res.success) {
                        this.setState({
                             fileparent:res.results.filepath
                         });
                        this.props.getFiles(res.results.files);

                    }else if (res.status == 400 || !res.success || res.status == 500) {


                    }

                });
            }else {
                API.getState()
                    .then((res) => {

                        if (res.status == 200 || res.success) {
                            this.props.afterlogin(res.results);
                            this.props.getFiles(res.results.files);
                            console.log("Success...")

                        }else if (res.status == 400 || !res.success || res.status == 500) {

                            this.props.history.push('/');
                        }
                    });
            }
        }
        
    }

    componentWillMount(){
        // alert(this.props.match.params.filepath)
        //const data=localStorage.getItem("email")
        if (this.props.match.params&& this.props.match.params.filepath) {
            API.getFileList(this.props.match.params.filepath)
                .then((res) => {
                if (res.status == 200 || res.success) {
                    this.setState({
                         fileparent:res.results.filepath
                     });
                    this.props.getFiles(res.results.files);

                }else if (res.status == 400 || !res.success || res.status == 500) {


                }

            });
        }else {
            API.getState()
                .then((res) => {

                    if (res.status == 200 || res.success) {
                        this.props.afterlogin(res.results);
                        this.props.getFiles(res.results.files);
                        console.log("Success...")

                    }else if (res.status == 400 || !res.success || res.status == 500) {

                        this.props.history.push('/');
                    }
                });
        }
    }

    handleFileUpload = (event) => {

        const payload = new FormData();

        payload.append('file', event.target.files[0]);
        payload.append('fileparent', this.state.fileparent);
        payload.append('isfile', 'T');

        API.uploadFile(payload)
        .then((res) => {

            if (res.status == 200 || res.success) {
                console.log(res)
                this.props.addFile(res.results);
                this.setState({

                    message: "File uploaded successfully"
                });
            }else if (res.status == 400 || !res.success || res.status == 500) {
                this.setState({

                    message: "File error"
                });
            }
        });
    };

    deleteFile=(index, file) => {


        API.deleteFile(file)
            .then((res) => {
                console.log(res);
                if (res.status == 200 || res.success) {

                    console.log("Delete success")
                    this.props.deleteFile(index);
                    this.setState({

                        message: res.message
                    });
                }else if (res.status == 400 || !res.success || res.status == 500) {
                    this.setState({

                        message: res.message
                    });
                }

            });

    }

    makeFolder=(folder) => {

        API.makeFolder(folder)
            .then((res) => {

                if (res.status == 200 || res.success) {
                    this.props.addFile(res.results.folderdata);
                    this.setState({

                        message: res.message
                    });

                }else if (res.status == 400 || !res.success || res.status == 500) {
                    this.setState({

                        message: res.message
                    });
                }
            });

    }

    sharefile=(filedata) => {

        this.setState({

            message: ''
        });

        var emailList=filedata.shareEmail.trim().split(';');


        for (var key in emailList) {

            const data = {filedata: filedata.file, shareEmail: emailList[key]}

            API.shareFile(data)
                .then((res) => {

                    if (res.status == 200 || res.success) {

                        this.props.sharedCount(filedata.index, data.filedata.sharedcount+1);
                        this.setState({

                            message: this.state.message+" File Shared with "+data.shareEmail+"!"
                        });
                        console.log("Success...")

                    } else if (res.status == 400 || !res.success || res.status == 500) {

                        this.setState({

                            message: this.state.message+" "+data.shareEmail+" does not exist!"
                        });
                    }
                });
        }



    }

    sharefileingroup=(data) => {

        API.shareFileInGroup(data)
            .then((res) => {

                if (res.status == 200 || res.success) {

                    this.props.sharedCount(data.index, res.sharedcount);
                    this.setState({

                        message: " File Shared with "+data.group+" group!"
                    });
                    console.log("Success...")

                } else if (res.status == 400 || !res.success || res.status == 500) {

                    this.setState({

                        message: this.state.message+" "+data.group+" does not exist!"
                    });
                }
            });




    }

    makeSharedFolder=(data) => {

        API.makeFolder(data)
            .then((res) => {

                console.log(res.folderdata)
                if (res.status == 200 || res.success) {

                    this.props.addFile(res.folderdata);
                    const shareddata={file:res.folderdata, shareEmail:data.shareEmail}
                    this.sharefile(shareddata)
                    this.setState({

                        message: "folder created successfully"
                    });

                }else if (res.status == 400 || !res.success || res.status == 500) {
                    this.setState({

                        message: "Folder error"
                    });
                }
            });

    }


    openFileFolder=(filedata) =>{
        console.log(filedata)
        // window.location.href = "http://localhost:3000/files/"+ filedata._id
        if(filedata.isfile=='F'){

            this.setState({
                 fileparent:filedata.filepath
             });

            API.getFileList(filedata._id)   
                .then((res) => {
                if (res.status == 200 || res.success) {
                        console.log(res.results)
                    this.props.getFiles(res.results.files);
                    this.props.history.push("/files/"+filedata._id)

                }else if (res.status == 400 || !res.success || res.status == 500) {


                }

            });

        }


        else{


            API.getFile(filedata.filepath)
                .then((res) => {
                    console.log("hello");
                console.log(res);


                });
        }


    }

    navigateHome(){

        API.getState()
            .then((res) => {

                if (res.status == 200 || res.success) {

                    this.setState({
                        fileparent:""
                    });
                    this.props.getFiles(res.results.files);
                    console.log("Success...")

                }else if (res.status == 400 || !res.success || res.status == 500) {

                    this.props.history.push('/');
                }
            });

    }

    render() {


        return (

            <div className="container-fluid">
                <Header/>

                { this.state.message===''?'':(
                    <div className="text-danger">
                        {this.state.message}
                    </div>)
                }

            <div className="jumbotron" style={{backgroundColor : 'white'}}>

                <div className="row justify-content-md-center">

                <input
                    ref={input => this.addFile = input}
                    style={{display: 'none'}}
                    type="file"
                    name="mypic"
                    onChange={this.handleFileUpload.bind(this)}
                />
               <Button bsStyle="success" onClick={() => this.addFile.click()}>Add document</Button>
                </div>
                <br/><br/>

                <div className="container-fluid">
                    <div className="row">

                        <div className="col-sm-7 ">
                            <a href="#" className="link-title "
                               onClick={() => this.navigateHome()}>
                                Dropbox
                            </a>
                        </div>
                    </div>

                    <div className="row">
                    <div className="col-sm-2 col">
                        <LeftNavBar  makeFolder={this.makeFolder}
                                     makeSharedFolder={this.makeSharedFolder}
                                     parentFile={this.state.fileparent}/>
                    </div>
                    <FileGridList deleteFile={this.deleteFile}
                      sharefileingroup={this.sharefileingroup}
                      sharefile={this.sharefile}
                      openFileFolder={this.openFileFolder}
                      parentFile={this.state.fileparent}/>
                       
                    </div>
                </div>

            </div>


</div>


        );
    }
}



function mapStateToProps(reducerdata) {
    console.log(reducerdata);

    const filesdata = reducerdata.filesreducer;
    return {filesdata};
}

function mapDispatchToProps(dispatch) {
    return {

        addFile : (data) => dispatch(addFile(data)),
        deleteFile : (index) => dispatch(deleteFile(index)),
        afterlogin : (data) => dispatch(afterlogin(data)),
        getFiles : (data) => dispatch(getFiles(data)),
        sharedCount : (index, data) => dispatch(sharedCount(index, data))
    };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(FileUpload));


