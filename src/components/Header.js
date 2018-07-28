import React, {Component} from 'react';
import { Route, withRouter } from 'react-router-dom';
import * as API from '../api/API';
import '../Login.css';
import dropboxtitle from "./Dropbox_Log.png";
import {afterlogin} from "../actions/index";
import {getFiles} from "../actions/index";
import {connect} from 'react-redux';


class Header extends Component {

    logout=() => {

        API.logout()
            .then((status) => {

                if (status == 201) {

                    console.log("logout success")
                    localStorage.setItem("email", "");
                    this.props.history.push("/")
                }else if (status == 401) {


                        console.log("logout issue")

                }
            });

    }

    home=() => {

        API.getState()
            .then((res) => {

                if (res.status == 200 || res.success) {
                    this.props.afterlogin(res.userdetails);
                    this.props.getFiles(res.userdetails.files);
                    this.props.history.push("/files")
                    console.log("Success...")

                }else if (res.status == 400 || !res.success || res.status == 500) {

                    this.props.history.push('/');
                }
            });


    }
    render() {
        return (
            <div>
                <nav className="navbar navbar-inverse">
                    <div className="container-fluid">
                        <div className="navbar-header">
                            <img className="" src={dropboxtitle}
                                 alt="" height="50" onClick={() => this.home()}/>
                        </div>
                        <ul className="nav navbar-nav">
                            <div className="row">

                                <li className="active">Welcome <a href="#" onClick={() => this.props.history.push("/userdetails")}>
                                     {localStorage.getItem("email").split('@')[0]}</a>,</li>
                                <div className="col-md-1" ></div>
                                <li className="active"><a href="#" onClick={() => this.home()}>
                                    Home</a></li>

                                <div className="col-md-1" ></div>
                                <li className="active"><a href="#" onClick={() => this.logout()}>
                                Logout</a></li>
                            </div>
                        </ul>
                    </div>
                </nav>
            </div>

        );

    }
}

function mapDispatchToProps(dispatch) {
    return {

        afterlogin : (data) => dispatch(afterlogin(data)),
        getFiles : (data) => dispatch(getFiles(data))
    };
}


export default withRouter(connect(null, mapDispatchToProps)(Header));