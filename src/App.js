import React, { Component } from 'react';
import './App.css';
import { BrowserRouter, Route, Redirect } from 'react-router-dom';
import { auth, storageKey, isAuthenticated } from './firebase';
import Login from './Login';
import addProject from "./addProject";
import addCatalog from "./addCatalog";
import addTeam from "./addTeam";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            uid: null,
        };
    }

    componentDidMount() {
        auth.onAuthStateChanged(async user => {
            if (user) {
                await localStorage.setItem(storageKey, user);
                this.setState({ isAuthenticated: true });
            } else {
                await localStorage.removeItem(storageKey);
                this.setState({ isAuthenticated: false });
            }
        });
    }

    render() {
        const PrivateRoute = ({ component: Component, ...rest }) => (
            <Route
                {...rest}
                render={props =>
                    isAuthenticated() ? <Component {...props} /> : <Redirect to="/" />
                }
            />
        );

        return (
            <BrowserRouter>
                <div>
                    <Route exact path="/" component={Login} />
                    <PrivateRoute path="/addproject" component={addProject} />
                    <PrivateRoute path="/addcatalog" component={addCatalog} />
                    <PrivateRoute path="/addTeam" component={addTeam} />

                </div>
            </BrowserRouter>
        );
    }
}

export default App;
