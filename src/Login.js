import React,{ Component } from "react";

class Login extends Component{
    state={
        login:"",
        password:""
    };

    render(){
        return(
            <div>
                <h1>Login</h1>
                <input value={this.state.login} onChange={(event) => this.setState({login:event.target.value})} type="text" required={true}/>
                <input value={this.state.password} onChange={(event) => this.setState({password:event.target.value})} type="password" required={true}/>
                    <input onClick={() => console.log(this.state)} type="submit"/>
            </div>
        )
    }
}

export  default Login;