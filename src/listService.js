import React, {Component} from "react";
import {db} from "./firebase"
import Sidebar from "./sidebar";
import './App.css';



class listService extends Component {
    state={
        projects:[]
    }
    componentDidMount(){
        this.fetchProjects();
    }

    fetchProjects = async () => {
        try {
            const snapshots = await db.collection('services').get();
            let problems = [];
            snapshots.forEach(s => {
                console.log(s);
                const data = s.data();
                data["id"] = s.id;
                problems.push(data);
            });
            let projects = problems;
            await this.setState({projects: [...projects]});
        } catch (error) {
            alert(error.message);
        }
    };
    render(){
        return(
            <div className="App d-flex">
                <Sidebar/>
                <div className={"main-content p-5 d-flex flex-column"}>
                    <div className="form-div d-flex flex-column w-100">
                        <h1>Услуги</h1>
                        <hr className="sep"/>
                        <div className="d-flex justify-content-around align-items-center mb-4">
                            <h5 className={"mb-0"}>Добавить новую услугу</h5>
                            <a className="btn btn-light" href="/addService">Добавить</a>
                        </div>
                        <h1 className="mt-5">СПИСОК Услуг</h1>
                        <hr className="sep"/>
                        <ul className="list-group">
                            {
                                this.state.projects.map((item) =>{
                                    return(
                                        <li className="list-group-item text-light d-flex justify-content-between align-items-center">
                                            <p className={"text-dark mb-0"}>{item.ru.title}</p>
                                            <div>
                                                <a href={"/changeService/"+ item.id} className={"btn btn-outline-primary mr-4"}>Изменить</a>
                                                <a className={"btn btn-danger"} href="">Удалить</a>
                                            </div>
                                        </li>
                                    )
                                })
                            }
                        </ul>
                </div>
                </div>
            </div>

        )
    }
}

export default  listService;