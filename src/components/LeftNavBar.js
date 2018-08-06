import React, {Component} from 'react';
import '../FileUpload.css';
import { Route, withRouter } from 'react-router-dom';
import Modal from 'react-modal';
import {Row,Col,ListGroupItem} from 'react-bootstrap';


class LeftNavBar extends Component {

    state = { isModalOpen: false, foldername:'', fileparent:'', isfile:'F' , shareEmail:'', clickSharedFolder:false}


    openModal() {
        this.setState({ isModalOpen: true , fileparent:this.props.parentFile})
    }

    closeModal(data) {
        console.log(data);

        {data!=""?

            ( data.foldername!="" ?(data.shareEmail!=""? this.props.makeSharedFolder(data):this.props.makeFolder(data))
            :''):''}

        this.setState({ isModalOpen: false, clickSharedFolder: false})
    }

    openSharedFolderModal() {
        this.setState({ isModalOpen: true , clickSharedFolder: true})
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


    render(){
        return(
            <div className="col-sm-12 sidenav">

                <button className="btn btn-primary btn-block" type="submit"
                        onClick={() => this.props.history.push("/userdetails")}>User Profile</button>
                <button className="btn btn-primary btn-block" type="submit"
                        onClick={() => this.props.history.push("/userlog")}>
                    User Activity
                </button>

            { this.props.parentFile==""?
                <button className="btn btn-primary btn-block" type="submit"
                        onClick={() => this.openSharedFolderModal()}>
                    New Shared Folder
                </button>:''
            }
            <button className="btn btn-primary btn-block" type="submit"
                    onClick={() => this.openModal()}>
                New Folder
            </button>

            <button className="btn btn-primary btn-block" type="submit"
                    onClick={() => this.props.history.push('/groups')}>
                Groups
            </button>
            <Modal isOpen={this.state.isModalOpen} style={this.style} onClose={() => this.closeModal()}>
                <ListGroupItem>
                    <Row className="show-grid">
                        <Col md={4}>FolderName:</Col>
                        <Col md={8}>
                            <input type="text" className="form-control" required="true" autoFocus
                                   onChange={(event) => {
                                       this.setState({
                                           foldername: event.target.value
                                       });
                                   }}/>
                        </Col>

                    </Row>
                    {this.state.clickSharedFolder==true?

                    <Row className="show-grid">
                        <Col md={4}>Share With Email:</Col>
                        <Col md={8}>
                            <input type="email" className="form-control" required="true" placeholder="Enter (;) seperated emails"
                                   onChange={(event) => {
                                       this.setState({
                                           shareEmail: event.target.value
                                       });
                                   }}/>
                        </Col>
                    </Row>:''}
                </ListGroupItem>
                <div className=" row justify-content-md-center">
                    <div className=" col-md-4">
                <button className="btn " type="submit"
                        onClick={() => this.closeModal(this.state)}>Save</button>
                    </div>
                    <div className=" col-md-4">
                    <button className="btn " type="submit"
                            onClick={() => this.closeModal('')}>Close</button>
                    </div>
                </div>
            </Modal>
            </div>

        )}

}


export default withRouter(LeftNavBar);