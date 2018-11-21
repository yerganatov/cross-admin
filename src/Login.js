import React,{ Component } from "react";
import { Redirect } from 'react-router-dom';

import { auth,isAuthenticated } from './firebase';
import InputMask from "react-input-mask";

class Login extends Component{
    state={
        login:"",
        password:""
    };


    onSignIn = async () => {
        try {
            await auth.signInWithEmailAndPassword(this.state.login, this.state.password);
        } catch (error) {
            alert(error.message);
        }
    };


    render(){
        if (isAuthenticated()) {
            return <Redirect to="/addProject" />;
        }
        return(
            <div className="main-content w-100 px-4 py-5 d-flex flex-column ml-0">

                <div className="form-div w-100 d-flex flex-column align-items-center">
                    <h1>CROSS AGENCY</h1>
                    <hr className="sep"/>
                    <div className="d-flex flex-column">
                        <h5>Пожалуйста, введите ваш логин и пароль</h5>
                        <div className="group">
                            <input className="input-style" value={this.state.login} onChange={(event) => this.setState({login:event.target.value})} type="text" required="required"/><span className="highlight"></span><span
                            className="bar"></span>
                            <label>Логин</label>
                        </div>
                        <div className="group">
                            <input className="input-style" value={this.state.password} onChange={(event) => this.setState({password:event.target.value})} type="password" required="required"/><span className="highlight"></span><span
                            className="bar"></span>
                            <label>Пароль</label>
                        </div>

                        <div className="btn-box">
                            <button onClick={() => this.onSignIn()} className="btn btn-submit" type="submit">Войти</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export  default Login;