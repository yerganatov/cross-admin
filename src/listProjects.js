import React, {Component} from "react";
import {db} from "./firebase"
import Sidebar from "./sidebar";
import './App.css';



class listProjects extends Component {
    state={
        projects:[]
    }
    componentDidMount(){
        this.fetchProjects();
    }

    fetchProjects = async () => {
        try {
            const snapshots = await db.collection('projects').get();
            let problems = [];
            snapshots.forEach(s => {
                console.log(s);
                const data = s.data();
                data["id"] = s.id;
                problems.push(data);
            });
            console.log(problems);
            let projects = problems;
            console.log("projects", projects);
            await this.setState({projects: [...projects]});
            console.log(this.state.projects);
        } catch (error) {
            alert(error.message);
        }
    };
    render(){
        return(
            <div className="App d-flex">
                <Sidebar/>
                <div className={"main-content p-5 d-flex flex-column"}>
                    {
                        this.state.projects.map((item) =>{
                            return(
                                <a href="">{item.ru.title}</a>
                            )
                        })
                    }
                </div>
            </div>

        )
    }
}

export default  listProjects;