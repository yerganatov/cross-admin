import React, {Component} from 'react';
import "./bootstrap.css";
import './App.css';
import Sidebar from "./sidebar";

import {db, store} from "./firebase";
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'



class addService extends Component {
    state = {
        project: {
            ru: {
                phone:"",
                email:"",
                address:""
            },
            en: {
                phone:"",
                email:"",
                address:""
            },
            gr: {
                phone:"",
                email:"",
                address:""
            }
        },
        filenames: [],
        downloadURLs: [],
        isUploading: false,
        uploadProgress: 0,
        images: []
    };
    componentDidMount(){
        this.fetchTeam();
    }

    fetchTeam = async ()  =>{
        try {
            const snapshot = await db.collection('services').doc(this.props.match.params.id).get();
            let project = snapshot.data();
            let images = this.state.images;
            images.push(project.image);
            this.setState({
                project: project,
                images: images
            })
        }
        catch (error) {
            alert(error.message);
        }
    }


    uploadProject = async () => {
        const project = this.state.project;
        const id = this.props.match.params.id;
        db.collection("services").doc(this.props.match.params.id).set(project).then(async (docRef) => {
            const options = {
                title: 'Готово!',
                message: 'Хотите вернутся на главную?',
                buttons: [
                    {
                        label: 'Да',
                        onClick: () => { this.props.history.push('/listCatalog')}
                    },
                    {
                        label: 'Нет',
                        onClick: () => this.fetchProject()
                    }
                ],
                childrenElement: () => <div />,
                willUnmount: () => { }
            }

            confirmAlert(options)

        })
    }

    changeValue = async (language, key, event) => {
        const value = event.target.value;
        await this.setState(state => {
            state["project"][language][key] = value;
            return state;
        })
        console.log(this.state);
    }


    render() {
        return (
            <div className="App d-flex">
                <Sidebar isActive="contacts"/>
                <div className="main-content px-4 py-5 d-flex flex-column">
                    <div className="form-div d-flex flex-column align-items-center">
                        <h1>ИЗМЕНЕНИЕ КОНТАКТНЫХ ДАННЫХ</h1>
                        <hr className="sep"/>
                        <div className="row mx-0 p-0 w-100">
                            <div className="col-6 mb-4">
                                <h5>Информация на русском языке</h5>
                                <div className="group">
                                    <input className="input-style" onChange={(event) => this.changeValue("ru", "phone", event)} value={this.state.project.ru.phone} type="text" required="required"/><span className="highlight"></span><span
                                    className="bar"></span>
                                    <label>Номер телефона</label>
                                </div>
                                <div className="group">
                                    <input className="input-style" onChange={(event) => this.changeValue("ru", "email", event)} value={this.state.project.ru.email} type="text" required="required"/><span className="highlight"></span><span
                                    className="bar"></span>
                                    <label>Электронная почта</label>
                                </div>
                                <div className="group">
                                    <input className="input-style" onChange={(event) => this.changeValue("ru", "address", event)} value={this.state.project.ru.address} type="text" required="required"/><span className="highlight"></span><span
                                    className="bar"></span>
                                    <label>Адрес</label>
                                </div>

                            </div>


                            <div className="col-6 mb-4">
                                <h5>Информация на английском языке</h5>
                                <div className="group">
                                    <input className="input-style" onChange={(event) => this.changeValue("en", "phone", event)} value={this.state.project.en.phone} type="text" required="required"/><span className="highlight"></span><span
                                    className="bar"></span>
                                    <label>Номер телефона</label>
                                </div>
                                <div className="group">
                                    <input className="input-style" onChange={(event) => this.changeValue("en", "email", event)} value={this.state.project.en.email} type="text" required="required"/><span className="highlight"></span><span
                                    className="bar"></span>
                                    <label>Электронная почта</label>
                                </div>
                                <div className="group">
                                    <input className="input-style" onChange={(event) => this.changeValue("en", "address", event)} value={this.state.project.en.address} type="text" required="required"/><span className="highlight"></span><span
                                    className="bar"></span>
                                    <label>Адрес</label>
                                </div>

                            </div>

                            <div className="col-6 mb-4">
                                <h5>Информация на немецком языке</h5>
                                <div className="group">
                                    <input className="input-style" onChange={(event) => this.changeValue("gr", "phone", event)} value={this.state.project.gr.phone} type="text" required="required"/><span className="highlight"></span><span
                                    className="bar"></span>
                                    <label>Номер телефона</label>
                                </div>
                                <div className="group">
                                    <input className="input-style" onChange={(event) => this.changeValue("gr", "email", event)} value={this.state.project.gr.email} type="text" required="required"/><span className="highlight"></span><span
                                    className="bar"></span>
                                    <label>Электронная почта</label>
                                </div>
                                <div className="group">
                                    <input className="input-style" onChange={(event) => this.changeValue("gr", "address", event)} value={this.state.project.gr.address} type="text" required="required"/><span className="highlight"></span><span
                                    className="bar"></span>
                                    <label>Адрес</label>
                                </div>

                            </div>


                        </div>

                        <div className="btn-box">
                            <button onClick={() => this.uploadProject()} className="btn btn-submit" type="submit">Изменить</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default addService;
