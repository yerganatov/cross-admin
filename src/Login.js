import React,{ Component } from "react";
import { Redirect } from 'react-router-dom';

import { auth,isAuthenticated } from './firebase';

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
            <div>
                <h1>Login</h1>
                <input value={this.state.login} onChange={(event) => this.setState({login:event.target.value})} type="text" required={true}/>
                <input value={this.state.password} onChange={(event) => this.setState({password:event.target.value})} type="password" required={true}/>
                    <input onClick={() => this.onSignIn()} type="submit"/>
            </div>
        )
    }
}

export  default Login;