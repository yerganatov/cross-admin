import React, { Component } from 'react';
import "./bootstrap.css";
import './App.css';
import Sidebar from "./sidebar";
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'

import { db, store } from "./firebase";

class changeProject extends Component {
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
            },
            images: []
        },
        filenames: [],
        downloadURLs: [],
        isUploading: false,
        uploadProgress: 0,
        images: []
    };
    componentDidMount() {
        this.fetchProject();
    }

    fetchProject = async () => {
        try {
            const snapshot = await db.collection('projects').doc(this.props.match.params.id).get();
            let project = snapshot.data();
            console.log(project);
            this.setState({
                project: project,
                images: project.images
            })
        }
        catch (error) {
            alert(error.message);
        }
    }
    uploadProject = async () => {
        const files = this.fileUpload.files;
        const project = this.state.project;
        const images = this.state.images;
        project.images = this.state.images;
        const id = this.props.match.params.id;
        db.collection("projects").doc(this.props.match.params.id).set(project).then(async (docRef) => {
            const storage = store;
            const storageRef = storage.ref();
            const newDirectory = id;
            await Object.values(files).map(async (item) => {
                let imagesRef = storageRef.child(`images/${newDirectory}/${item.name}`);
                await imagesRef.put(item).then((span) => {
                    store
                        .ref(`images/${newDirectory}/`)
                        .child(item.name)
                        .getDownloadURL().then(url => {
                            images.push(url);
                            project["images"] = images;
                            db.collection("projects").doc(newDirectory).set(project);
                        });

                });
            })
            const options = {
                title: 'Готово!',
                message: 'Хотите вернутся на главную?',
                buttons: [
                    {
                        label: 'Да',
                        onClick: () => { this.props.history.push('/listprojects')}
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
        console.log(value)
        await this.setState(state => {
            state["project"][language][key] = value;
            return state;
        })
        console.log(this.state);
    }

    removeImage = (index) => {
        console.log(index);
        let imageList = this.state.images;
        imageList.splice(index, 1);
        this.setState({
            images: imageList
        })
        console.log(this.state.images);
    }


    render() {
        return (
            <div className="App d-flex">
                <Sidebar isActive="projects"/>
                <div className="main-content px-4 py-5 d-flex flex-column">
                    <div className="form-div d-flex flex-column align-items-center">
                        <h1>ИЗМЕНЕНИЕ ПРОЕКТА</h1>
                        <hr className="sep" />
                        <div className="row mx-0 p-0 w-100">
                            <div className="col-6 mb-4">
                                <h5>Информация на русском языке</h5>
                                <div className="group">
                                    <input onChange={(event) => this.changeValue("ru", "title", event)} value={this.state.project.ru.title} type="text" required="required" /><span className="highlight"></span><span
                                        className="bar"></span>
                                    <label>Название проекта</label>
                                </div>
                                <div className="group">
                                    <textarea onChange={(event) => this.changeValue("ru", "aboutClient", event)} value={this.state.project.ru.aboutClient} type="textarea" rows="5" required="required"></textarea><span className="highlight"></span><span
                                        className="bar"></span>
                                    <label>О клиенте</label>
                                </div>
                                <div className="group">
                                    <textarea onChange={(event) => this.changeValue("ru", "goal", event)} value={this.state.project.ru.goal} type="textarea" rows="3" required="required"></textarea><span className="highlight"></span><span
                                        className="bar"></span>
                                    <label>Задача</label>
                                </div>
                                <div className="group">
                                    <textarea onChange={(event) => this.changeValue("ru", "done", event)} value={this.state.project.ru.done} type="textarea" rows="3" required="required"></textarea><span className="highlight"></span><span
                                        className="bar"></span>
                                    <label>Проделанная работа</label>
                                </div>
                                <div className="group">
                                    <textarea onChange={(event) => this.changeValue("ru", "result", event)} value={this.state.project.ru.result} type="textarea" rows="3" required="required"></textarea><span
                                        className="highlight"></span><span className="bar"></span>
                                    <label>Результаты</label>
                                </div>
                                <div className="group">
                                    <textarea onChange={(event) => this.changeValue("en", "tags", event)} value={this.state.project.en.tags} type="textarea" rows="3" required="required"></textarea><span
                                    className="highlight"></span><span className="bar"></span>
                                    <label>Теги(Через запятую)</label>
                                </div>
                            </div>


                            <div className="col-6 mb-4">
                                <h5>Информация на английском языке</h5>
                                <div className="group">
                                    <input onChange={(event) => this.changeValue("en", "title", event)} value={this.state.project.en.title} type="text" required="required" /><span className="highlight"></span><span
                                        className="bar"></span>
                                    <label>Название проекта</label>
                                </div>
                                <div className="group">
                                    <textarea onChange={(event) => this.changeValue("en", "aboutClient", event)} value={this.state.project.en.aboutClient} type="textarea" rows="5" required="required"></textarea><span className="highlight"></span><span
                                        className="bar"></span>
                                    <label>О клиенте</label>
                                </div>
                                <div className="group">
                                    <textarea onChange={(event) => this.changeValue("en", "goal", event)} value={this.state.project.en.goal} type="textarea" rows="3" required="required"></textarea><span className="highlight"></span><span
                                        className="bar"></span>
                                    <label>Задача</label>
                                </div>
                                <div className="group">
                                    <textarea onChange={(event) => this.changeValue("en", "done", event)} value={this.state.project.en.done} type="textarea" rows="3" required="required"></textarea><span className="highlight"></span><span
                                        className="bar"></span>
                                    <label>Проделанная работа</label>
                                </div>
                                <div className="group">
                                    <textarea onChange={(event) => this.changeValue("en", "result", event)} value={this.state.project.en.result} type="textarea" rows="3" required="required"></textarea><span
                                        className="highlight"></span><span className="bar"></span>
                                    <label>Результаты</label>
                                </div>
                                <div className="group">
                                    <textarea onChange={(event) => this.changeValue("en", "tags", event)} value={this.state.project.en.tags} type="textarea" rows="3" required="required"></textarea><span
                                    className="highlight"></span><span className="bar"></span>
                                    <label>Теги(Через запятую)</label>
                                </div>
                            </div>

                            <div className="col-6 mb-4">
                                <h5>Информация на немецком языке</h5>
                                <div className="group">
                                    <input onChange={(event) => this.changeValue("gr", "title", event)} value={this.state.project.gr.title} type="text" required="required" /><span className="highlight"></span><span
                                        className="bar"></span>
                                    <label>Название проекта</label>
                                </div>
                                <div className="group">
                                    <textarea onChange={(event) => this.changeValue("gr", "aboutClient", event)} value={this.state.project.gr.aboutClient} type="textarea" rows="5" required="required"></textarea><span className="highlight"></span><span
                                        className="bar"></span>
                                    <label>О клиенте</label>
                                </div>
                                <div className="group">
                                    <textarea onChange={(event) => this.changeValue("gr", "goal", event)} value={this.state.project.gr.goal} type="textarea" rows="3" required="required"></textarea><span className="highlight"></span><span
                                        className="bar"></span>
                                    <label>Задача</label>
                                </div>
                                <div className="group">
                                    <textarea onChange={(event) => this.changeValue("gr", "done", event)} value={this.state.project.gr.done} type="textarea" rows="3" required="required"></textarea><span className="highlight"></span><span
                                        className="bar"></span>
                                    <label>Проделанная работа</label>
                                </div>
                                <div className="group">
                                    <textarea onChange={(event) => this.changeValue("gr", "result", event)} value={this.state.project.gr.result} type="textarea" rows="3" required="required"></textarea><span
                                        className="highlight"></span><span className="bar"></span>
                                    <label>Результаты</label>
                                </div>
                                <div className="group">
                                    <textarea onChange={(event) => this.changeValue("gr", "tags", event)} value={this.state.project.gr.tags} type="textarea" rows="3" required="required"></textarea><span
                                    className="highlight"></span><span className="bar"></span>
                                    <label>Теги(Через запятую)</label>
                                </div>
                            </div>

                            <div className="col-6 mb-4">
                                <h5>Изображения для загрузки <br /> (Можно загрузить несколько изображений)</h5>
                                <div>
                                    <input ref={instance => {
                                        this.fileUpload = instance
                                    }} type="file" multiple={true} accept={"image/*"} required />
                                    <div className="container">
                                        <div className="row">
                                            {this.state.images.map((item, i) => {
                                                return (
                                                    <div key={i} className="col-6 disp-wrap">
                                                        <button onClick={() => this.removeImage(i)}>
                                                            ✕
                                                        </button>
                                                        <img className="disp-img" key={i} src={item} />
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

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

export default changeProject;
