import React, {Component} from 'react';
import "./bootstrap.css";
import './App.css';
import Sidebar from "./sidebar";

import {db, store} from "./firebase";

class addService extends Component {
    state = {
        project: {
            ru: {
               title:"",
                description:""
            },
            en: {
                title:"",
                description:""
            },
            gr: {
                title:"",
                description:""
            }
        },
        filenames: [],
        downloadURLs: [],
        isUploading: false,
        uploadProgress: 0,
        images: []
    };
    guid = () => {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }

        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    }


    uploadProject = async () => {
        db.collection("services").add(this.state.project)
            .then(function (docRef) {

            })
            .catch(function (error) {
                console.error("Error writing document: ", error);
            });
    }

    changeValue = async (language, key, event) => {
        const value = event.target.value;
        console.log(value)
        await this.setState(state => {
            state["project"][language][key] = value;
            return state;
        })
        console.log(this.state);
    }


    render() {
        return (
            <div className="App d-flex">
                <Sidebar/>
                <div className="main-content px-4 py-5 d-flex flex-column">
                    <div className="form-div d-flex flex-column align-items-center">
                        <h1>ДОБАВЛЕНИЕ УСЛУГИ</h1>
                        <hr className="sep"/>
                        <div className="row mx-0 p-0 w-100">
                            <div className="col-6 mb-4">
                                <h5>Информация на русском языке</h5>
                                <div className="group">
                                    <input onChange={(event) => this.changeValue("ru", "title", event)} value={this.state.project.ru.title} type="text" required="required"/><span className="highlight"></span><span
                                    className="bar"></span>
                                    <label>Название проекта</label>
                                </div>
                                <div className="group">
                                    <textarea onChange={(event) => this.changeValue("ru", "description", event)} value={this.state.project.ru.description} type="textarea" rows="5" required="required"></textarea><span className="highlight"></span><span
                                    className="bar"></span>
                                    <label>О клиенте</label>
                                </div>

                            </div>


                            <div className="col-6 mb-4">
                                <h5>Информация на английском языке</h5>
                                <div className="group">
                                    <input onChange={(event) => this.changeValue("en", "title", event)} value={this.state.project.en.title} type="text" required="required"/><span className="highlight"></span><span
                                    className="bar"></span>
                                    <label>Название проекта</label>
                                </div>
                                <div className="group">
                                    <textarea onChange={(event) => this.changeValue("en", "description", event)} value={this.state.project.en.description} type="textarea" rows="5" required="required"></textarea><span className="highlight"></span><span
                                    className="bar"></span>
                                    <label>О клиенте</label>
                                </div>

                            </div>

                            <div className="col-6 mb-4">
                                <h5>Информация на немецком языке</h5>
                                <div className="group">
                                    <input onChange={(event) => this.changeValue("gr", "title", event)} value={this.state.project.gr.title} type="text" required="required"/><span className="highlight"></span><span
                                    className="bar"></span>
                                    <label>Название проекта</label>
                                </div>
                                <div className="group">
                                    <textarea onChange={(event) => this.changeValue("gr", "description", event)} value={this.state.project.gr.description} type="textarea" rows="5" required="required"></textarea><span className="highlight"></span><span
                                    className="bar"></span>
                                    <label>О клиенте</label>
                                </div>

                            </div>


                        </div>

                        <div className="btn-box">
                            <button onClick={() => this.uploadProject()} className="btn btn-submit" type="submit">Добавить</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default addService;