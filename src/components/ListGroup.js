import React, {Component} from 'react';
import {Row,Col,ListGroupItem} from 'react-bootstrap';
import Modal from 'react-modal';
import '../FileUpload.css';
import { Route, withRouter } from 'react-router-dom';
import {connect} from 'react-redux';
import * as API from '../api/API';
import {deleteGroup} from "../actions/index";

import {getGroups} from "../actions/index";

// Import React Table
import ReactTable from "react-table";
import "react-table/react-table.css";


class ListGroup extends Component {

    state = {message:''}

    componentWillMount(){

        API.getGroups()
            .then((res) => {

            console.log(res)
                if (res.status == 200 || res.success) {
                    this.props.getGroups(res.results.groups);

                    this.setState({ message: res.results.message })


                }else if (res.status == 400 || !res.success || res.status == 500) {

                    this.setState({ message: res.message })
                }
            });
    }

    deleteGroup(index, group){

        API.deleteGroup(group)
            .then((res) => {

                if (res.status == 200 || res.success) {
                    this.props.deleteGroup(index);
                    this.setState({ message: res.results.message })

                }else if (res.status == 400 || !res.success || res.status == 500) {

                    this.props.history.push('/');
                }
            });
    }

    render() {
        return (

            <div className="col-sm-10">

                <table className="table table-striped table-condensed table-hover table-bordered">
                    <thead>
                    <tr className="justify-content-md-left">

                        <th></th>
                        <th>Group Name</th>
                        <th>Members</th>
                        <th>Manager</th>
                        <th>Delete</th>
                    </tr>
                    </thead>

                    <tbody>
                    {this.props.groupdata.groups.map((group, index) => {

                        return (
                            <tr className="justify-content-md-left">

                                <td>
                                    <div className="row justify-content-md-left">
                                        <div className="col-md-1"><i className="fa fa-group" ></i></div>
                                        {/*{/!*<div>&#9734;</div>*!/}*/}


                                    </div>
                                </td>
                                <td>
                                    <a href="#" className="link-title "
                                        onClick={() => this.props.openGroup(group)}>
                                        {group.groupname}
                                    </a>
                                </td>
                                <td>
                                    {group.membercount}
                                </td>
                                <td>
                                    {group.owner}
                                </td>

                                <td>
                                    <button className="btn btn-primary" type="submit"
                                            onClick={() => this.deleteGroup(index, group)}>
                                        Delete
                                    </button>
                                </td>


                            </tr>
                        );
                    })}

                    </tbody>
                </table>

            </div>


        );
    }



}


function mapStateToProps(reducerdata) {
    console.log(reducerdata);
    const groupdata = reducerdata.groupreducer;
console.log(groupdata)
    return {groupdata};
}

function mapDispatchToProps(dispatch) {
    return {

        deleteGroup : (index) => dispatch(deleteGroup(index)),
        getGroups : (data) => dispatch(getGroups(data))
    };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ListGroup));


