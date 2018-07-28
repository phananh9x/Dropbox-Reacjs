import React, {Component} from 'react';
import { Route, withRouter } from 'react-router-dom';
import * as API from '../api/API';
import '../Login.css';
import SignUp from "./SignUp";
import Login from "./Login";
import {afterlogin} from "../actions/index";


class Container extends Component {

    state = {
        login: "SI",
        message: ''
    };

    login = (userdata) =>{

        API.doLogin(userdata)
            .then((res)  => {
                console.log(res)
                if (res.success) {
                    localStorage.setItem("email", res.results.email )
                    localStorage.setItem("token", res.results.token)
                    this.props.history.push("/files");

                } else {
                    this.setState({

                        message: "Wrong username or password. Try again..!!"
                    });
                }
            });
    };

    loginOrSignup = (data) => {

        console.log(data);
        this.setState({
            message:'',
            login:data
        });
    };

    signUp = (userdata) =>{

        API.createUser(userdata)
            .then((status)  => {
                if (status === 200) {

                    this.setState({
                        login: "SI",
                        message: "User details saved successfully!"
                    });
                } else {
                    this.setState({
                        message: "Email already exists!"
                    });
                }
            });
    };

    render() {
        return (
            <div className="container-fluid">
                { this.state.message===''?'':(
                    <div className="text-danger">
                        {this.state.message}
                    </div>)
                }


                <h1 className="text-center login-title"></h1>
                <div className="account-wall">
                    <div className="col-md-12">

                        {this.state.login === "SU" ?
                            <SignUp signUp={this.signUp} loginOrSignup={this.loginOrSignup}/>
                            :
                            <Login login={this.login} loginOrSignup={this.loginOrSignup}/>
                        }


                    </div>
                </div>
            </div>

    );


    }
}


export default withRouter(Container);