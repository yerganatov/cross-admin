import React, { Component } from 'react';
import "./bootstrap.css";
import './App.css';
import Sidebar from "./sidebar";

import { db, store } from "./firebase";

class addProject extends Component {
    state = {
        project: {
            ru: {
                aboutClient: "",
                done: "",
                goal: "",
                result: "",
                tags: [],
                title: ""
            },
            en: {
                aboutClient: "",
                done: "",
                goal: "",
                result: "",
                tags: [],
                title: ""
            },
            gr: {
                aboutClient: "",
                done: "",
                goal: "",
                result: "",
                tags: [],
                title: ""
            }
        },
        filenames: [],
        downloadURLs: [],
        isUploading: false,
        uploadProgress: 0
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
        console.log(this.state,this.fileUpload.files);
        const files = this.fileUpload.files;
        const giud = this.guid();
        db.collection("projects").add(this.state.project)
            .then(function (docRef) {
                let storage = store;
                let storageRef = storage.ref();
                let newDirectory = docRef.id;
                Object.values(files).map((item) => {
                    let imagesRef = storageRef.child(`images/${newDirectory}/${item.name}`);

                    imagesRef.put(item);
                })
                console.log("Document successfully written!");
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
                <div className="main-content p-5 d-flex flex-column">
                    <h1>Добавление нового проекта</h1>
                    <p>Все поля обязательны к заполнению</p>
                    <div className="row">
                        <div className="col-md-8">
                            <form className="d-flex flex-column h-100" action="">
                                <h3>Информация на русском языке</h3>
                                <input onChange={(event) => this.changeValue("ru", "title", event)} placeholder="title" value={this.state.project.ru.title} type="text" required />
                                <input onChange={(event) => this.changeValue("ru", "done", event)} placeholder="done" value={this.state.project.ru.done} type="text" required />
                                <input onChange={(event) => this.changeValue("ru", "goal", event)} placeholder="goal" value={this.state.project.ru.goal} type="text" required />
                                <input onChange={(event) => this.changeValue("ru", "aboutClient", event)} placeholder="aboutClient" value={this.state.project.ru.aboutClient} type="text" required />
                                <input onChange={(event) => this.changeValue("ru", "result", event)} placeholder="result" value={this.state.project.ru.result} type="text" required />
                                <h3>Информация на английском языке</h3>
                                <input onChange={(event) => this.changeValue("en", "title", event)} placeholder="title" value={this.state.project.en.title} type="text" required />
                                <input onChange={(event) => this.changeValue("en", "done", event)} placeholder="done" value={this.state.project.en.done} type="text" required />
                                <input onChange={(event) => this.changeValue("en", "goal", event)} placeholder="goal" value={this.state.project.en.goal} type="text" required />
                                <input onChange={(event) => this.changeValue("en", "aboutClient", event)} placeholder="aboutClient" value={this.state.project.en.aboutClient} type="text" required />
                                <input onChange={(event) => this.changeValue("en", "result", event)} placeholder="result" value={this.state.project.en.result} type="text" required />
                                <h3>Информация на немецком языке</h3>
                                <input onChange={(event) => this.changeValue("gr", "title", event)} placeholder="title" value={this.state.project.gr.title} type="text" required />
                                <input onChange={(event) => this.changeValue("gr", "done", event)} placeholder="done" value={this.state.project.gr.done} type="text" required />
                                <input onChange={(event) => this.changeValue("gr", "goal", event)} placeholder="goal" value={this.state.project.gr.goal} type="text" required />
                                <input onChange={(event) => this.changeValue("gr", "aboutClient", event)} placeholder="aboutClient" value={this.state.project.gr.aboutClient} type="text" required />
                                <input onChange={(event) => this.changeValue("gr", "result", event)} placeholder="result" value={this.state.project.gr.result} type="text" required />
                                <button onClick={() => this.uploadProject()} type="button" class="btn btn-primary">Добавить</button>
                            </form>

                        </div>
                        <div className="col-md-4">
                            <label htmlFor="">
                                <input ref={instance => {this.fileUpload = instance}} type="file" multiple={true} accept={"image/*"}/>
                                <div>
                                    {this.state.downloadURLs.map((downloadURL, i) => {
                                        return <img key={i} src={downloadURL} />;
                                    })}
                                </div>

                            </label>
                        </div>

                    </div>

                </div>
            </div>
        );
    }
}

export default addProject;
