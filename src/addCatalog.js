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
                <Sidebar/>
                <div className="main-content p-5 d-flex flex-column">
                    <h1>Добавление нового каталога</h1>
                    <p>Все поля обязательны к заполнению</p>
                    <div className="row">
                        <div className="col-md-8">
                            <form className="d-flex flex-column h-100" action="">
                                <input type="date" onChange={(event) => {
                                    this.setState({startDate: event.target.value})
                                    console.log(this.state.startDate)
                                }} />
                                <h3>Информация на русском языке</h3>
                                <input onChange={(event) => this.changeValue("ru", "title", event)} placeholder="title"
                                       value={this.state.project.ru.title} type="text" required/>
                                <input onChange={(event) => this.changeValue("ru", "aboutCatalog", event)}
                                       placeholder="aboutCatalog" value={this.state.project.ru.aboutCatalog} type="text"
                                       required/>
                                <input onChange={(event) => this.changeValue("ru", "requestPartners", event)}
                                       placeholder="requestPartners" value={this.state.project.ru.requestPartners}
                                       type="text" required/>

                                <h3>Информация на английском языке</h3>
                                <input onChange={(event) => this.changeValue("en", "title", event)} placeholder="title"
                                       value={this.state.project.en.title} type="text" required/>
                                <input onChange={(event) => this.changeValue("en", "aboutCatalog", event)}
                                       placeholder="aboutCatalog" value={this.state.project.en.aboutCatalog} type="text"
                                       required/>
                                <input onChange={(event) => this.changeValue("en", "requestPartners", event)}
                                       placeholder="requestPartners" value={this.state.project.en.requestPartners}
                                       type="text" required/>
                                <h3>Информация на немецком языке</h3>
                                <input onChange={(event) => this.changeValue("gr", "title", event)} placeholder="title"
                                       value={this.state.project.gr.title} type="text" required/>
                                <input onChange={(event) => this.changeValue("gr", "aboutCatalog", event)}
                                       placeholder="aboutCatalog" value={this.state.project.gr.aboutCatalog} type="text"
                                       required/>
                                <input onChange={(event) => this.changeValue("gr", "requestPartners", event)}
                                       placeholder="requestPartners" value={this.state.project.gr.requestPartners}
                                       type="text" required/>
                                <button onClick={() => this.uploadCatalog()} type="button" className="btn btn-primary">
                                    Добавить
                                </button>
                            </form>

                        </div>
                        <div className="col-md-4">
                            <label htmlFor="">
                                <input ref={instance => {
                                    this.fileUpload = instance
                                }} type="file" multiple={true} accept={"image/*"}/>
                                <div>
                                    {this.state.downloadURLs.map((downloadURL, i) => {
                                        return <img key={i} src={downloadURL}/>;
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

export default addCatalog;
