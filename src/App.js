import React, { Component } from 'react';
import './App.css';
import { BrowserRouter, Route, Redirect } from 'react-router-dom';
import { auth, storageKey, isAuthenticated } from './firebase';
import Login from './Login';
import addProject from "./addProject";
import addCatalog from "./addCatalog";
import addTeam from "./addTeam";
import listProjects from "./listProjects";
import listCatalog from "./listCatalog";
import addService from "./addService";
import addPartners from "./addPartners";
import changeProject from "./changeProjects";
import changeCatalog from './changeCatalog';
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
                    <PrivateRoute path="/listProjects" component={listProjects} />
                    <PrivateRoute path="/listCatalog" component={listCatalog} />
                    
                    <PrivateRoute path="/addService" component={addService} />
                    <PrivateRoute path="/addPartners" component={addPartners} />
                    <PrivateRoute path="/changeproject/:id" component={changeProject} />
                    <PrivateRoute path="/changecatalog/:id" component={changeCatalog} />


                </div>
            </BrowserRouter>
        );
    }
}

export default App;
