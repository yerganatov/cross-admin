import React, {Component} from 'react';
import "./bootstrap.css";
import './App.css';
import Sidebar from "./sidebar";
import {db, store} from "./firebase";

class addCatalog extends Component {
    state = {
        project: {
            ru: {
                title: "",
                aboutCatalog: "",
                requestPartners: ""
            },
            en: {
                title: "",
                aboutCatalog: "",
                requestPartners: ""
            },
            gr: {
                title: "",
                aboutCatalog: "",
                requestPartners: ""
            }
        },
        filename: {},
        downloadURLs: [],
        isUploading: false,
        uploadProgress: 0,
        startDate:new Date()
    };
    guid = () => {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }

        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    }


    uploadCatalog = async () => {
        const files = this.fileUpload.files;
        const project = this.state.project;
        project["date"] = this.state.startDate;
        db.collection("catalog").add(this.state.project)
            .then(function (docRef) {
                const storage = store;
                const storageRef = storage.ref();
                const newDirectory = docRef.id;
                Object.values(files).map(async (item) => {
                    let imagesRef = storageRef.child(`images/${newDirectory}/${item.name}`);

                    await imagesRef.put(item).then((span) => {
                        store
                            .ref(`images/${newDirectory}/`)
                            .child(item.name)
                            .getDownloadURL().then(url => {
                            project["image"] = url;
                            db.collection("catalog").doc(newDirectory).set(project);
                        });


                    });

                });
            })
            .catch(function (error) {
                console.error("Error writing document: ", error);
            });
    };

    changeValue = async (language, key, event) => {
        const value = event.target.value;
        console.log(value)
        await this.setState(state => {
            state["project"][language][key] = value;
            return state;
        })
        console.log(this.state);
    };


    render() {
        return (
            <div className="App d-flex">
                <Sidebar isActive="catalog"/>
                <div className="main-content px-4 py-5 d-flex flex-column">
                    <div className="form-div d-flex flex-column align-items-center">
                        <h1>ДОБАВЛЕНИЕ КАТАЛОГА</h1>
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
                                    <textarea onChange={(event) => this.changeValue("ru", "aboutCatalog", event)} value={this.state.project.ru.aboutCatalog} type="textarea" rows="5" required="required"></textarea><span className="highlight"></span><span
                                    className="bar"></span>
                                    <label>О проекте</label>
                                </div>
                                <div className="group">
                                    <textarea onChange={(event) => this.changeValue("ru", "requestPartners", event)} value={this.state.project.ru.requestPartners} type="textarea" rows="3" required="required"></textarea><span className="highlight"></span><span
                                    className="bar"></span>
                                    <label>Требования к партнерам</label>
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
                                    <textarea onChange={(event) => this.changeValue("en", "aboutCatalog", event)} value={this.state.project.en.aboutCatalog} type="textarea" rows="5" required="required"></textarea><span className="highlight"></span><span
                                    className="bar"></span>
                                    <label>О проекте</label>
                                </div>
                                <div className="group">
                                    <textarea onChange={(event) => this.changeValue("en", "requestPartners", event)} value={this.state.project.en.requestPartners} type="textarea" rows="3" required="required"></textarea><span className="highlight"></span><span
                                    className="bar"></span>
                                    <label>Требования к партнерам</label>
                                </div>
                            </div>

                            <div className="col-12">
                                <hr className="sep w-25"/>
                            </div>

                            <div className="col-6 mb-4">
                                <h5>Информация на немецком языке</h5>
                                <div className="group">
                                    <input onChange={(event) => this.changeValue("gr", "title", event)} value={this.state.project.gr.title} type="text" required="required"/><span className="highlight"></span><span
                                    className="bar"></span>
                                    <label>Название проекта</label>
                                </div>
                                <div className="group">
                                    <textarea onChange={(event) => this.changeValue("gr", "aboutCatalog", event)} value={this.state.project.gr.aboutCatalog} type="textarea" rows="5" required="required"></textarea><span className="highlight"></span><span
                                    className="bar"></span>
                                    <label>О проекте</label>
                                </div>
                                <div className="group">
                                    <textarea onChange={(event) => this.changeValue("gr", "requestPartners", event)} value={this.state.project.gr.requestPartners} type="textarea" rows="3" required="required"></textarea><span className="highlight"></span><span
                                    className="bar"></span>
                                    <label>Требования к партнерам</label>
                                </div>
                            </div>

                            <div className="col-6 mb-4">
                                <h5>Изображения для загрузки <br/> (Можно загрузить несколько изображений)</h5>
                                <div>
                                    <input ref={instance => {
                                        this.fileUpload = instance
                                    }} type="file" multiple={false} accept={"image/*"} required/>
                                    <div>
                                        {this.state.downloadURLs.map((downloadURL, i) => {
                                            return <img key={i} src={downloadURL}/>;
                                        })}
                                    </div>
                                </div>
                                <h5 className="mt-5">Дата</h5>
                                <input type="date" onChange={(event) => {
                                    this.setState({startDate: event.target.value})
                                    console.log(this.state.startDate)
                                }} />
                            </div>
                        </div>

                        <div className="btn-box">
                            <button onClick={() => this.uploadCatalog()} className="btn btn-submit" type="submit">Добавить</button>
                        </div>
                    </div>
                </div>

            </div>
        );
    }
}

export default addCatalog;
