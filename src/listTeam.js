import React, {Component} from "react";
import {db} from "./firebase"
import Sidebar from "./sidebar";
import './App.css';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'



class listTeam extends Component {
    state={
        projects:[]
    }
    componentDidMount(){
        this.fetchProjects();
    }

    fetchProjects = async () => {
        try {
            const snapshots = await db.collection('team').get();
            let problems = [];
            snapshots.forEach(s => {
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
    removeFromList  = (id,index) =>{
        
        try{
            db.collection("team").doc(id).delete().then((docRef) => {
                 delete this.state.projects[index];
                 let ss = this.state.projects;
                console.log(ss);
                this.setState({
                    projects:ss
                })
            })
        }
        catch (error){
            alert(error.message);
            
        }
    }
    alertDelete = (id,index) => {
        const options = {
            title: 'Удалить!',
            message: 'Вы точно хотите удалить?',
            buttons: [
                {
                    label: 'Да',
                    onClick: () => { this.removeFromList(id,index)}
                },
                {
                    label: 'Нет',
                    onClick: () => this.fetchProjects()
                }
            ],
            childrenElement: () => <div />,
            willUnmount: () => { }
        }
        confirmAlert(options)

    }
    render(){
        return(
            <div className="App d-flex">
                <Sidebar isActive="team"/>
                <div className={"main-content p-5 d-flex flex-column"}>
                    <div className="form-div d-flex flex-column w-100">
                        <h1>КОМАНДА</h1>
                        <hr className="sep"/>
                        <div className="d-flex justify-content-around align-items-center mb-4">
                            <h5 className={"mb-0"}>Добавить ПЕРСОНУ</h5>
                            <a className="btn btn-light" href="/addTeam">Добавить</a>
                        </div>
                        <h1 className="mt-5">СПИСОК КОМАНДЫ</h1>
                        <hr className="sep"/>
                        <ul className="list-group">
                            {
                                this.state.projects.map((item,index) =>{
                                    return(
                                        <li className="list-group-item text-light d-flex justify-content-between align-items-center">
                                            <p className={"text-dark mb-0"}>{item.ru.name}</p>
                                            <div>
                                                <a href={"/changeTeam/"+ item.id} className={"btn btn-outline-primary mr-4"}>Изменить</a>
                                                <a onClick={() => this.alertDelete(item.id,index)} className={"btn btn-danger"} >Удалить</a>
                                            
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

export default  listTeam;