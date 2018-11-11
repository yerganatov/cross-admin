import React, {Component} from 'react';
import "./bootstrap.css";
import './App.css';
import Sidebar from "./sidebar";
import {db, store} from "./firebase";

class addTeam extends Component {
    state = {
        person: {
            ru: {
                name: "",
                workType: "",
                phone: "",
                email:""
            },
            en: {
                name: "",
                workType: "",
                phone: "",
                email:""
            },
            gr: {
                name: "",
                workType: "",
                phone: "",
                email:""
            }
        },
        filename: {},
        downloadURLs: [],
        isUploading: false,
        uploadProgress: 0,
        startDate:new Date()
    };



    uploadCatalog = async () => {
        const files = this.fileUpload.files;
        const person = this.state.person;

        db.collection("team").add(this.state.person)
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
                            person["image"] = url;
                            db.collection("catalog").doc(newDirectory).set(person);
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
            state["person"][language][key] = value;
            return state;
        })
        console.log(this.state);
    };


    render() {
        return (
            <div className="App d-flex">
                <Sidebar/>
                <div className="main-content p-5 d-flex flex-column">
                    <h1>Добавление нового персонала </h1>
                    <p>Все поля обязательны к заполнению</p>
                    <div className="row">
                        <div className="col-md-8">
                            <form className="d-flex flex-column h-100" action="">

                                <h3>Информация на русском языке</h3>
                                <input onChange={(event) => this.changeValue("ru", "name", event)} placeholder="title"
                                       value={this.state.person.ru.name} type="text" required/>
                                <input onChange={(event) => this.changeValue("ru", "workType", event)} placeholder="title"
                                       value={this.state.person.ru.workType} type="text" required/>
                                <input onChange={(event) => this.changeValue("ru", "phone", event)} placeholder="title"
                                       value={this.state.person.ru.phone} type="text" required/>
                                <input onChange={(event) => this.changeValue("ru", "email", event)} placeholder="title"
                                       value={this.state.person.ru.email} type="text" required/>

                                <h3>Информация на английском языке</h3>
                                <input onChange={(event) => this.changeValue("en", "name", event)} placeholder="title"
                                       value={this.state.person.en.name} type="text" required/>
                                <input onChange={(event) => this.changeValue("en", "workType", event)} placeholder="title"
                                       value={this.state.person.en.workType} type="text" required/>
                                <input onChange={(event) => this.changeValue("en", "phone", event)} placeholder="title"
                                       value={this.state.person.en.phone} type="text" required/>
                                <input onChange={(event) => this.changeValue("en", "email", event)} placeholder="title"
                                       value={this.state.person.en.email} type="text" required/>
                                <h3>Информация на немецком языке</h3>
                                <input onChange={(event) => this.changeValue("gr", "name", event)} placeholder="title"
                                       value={this.state.person.gr.name} type="text" required/>
                                <input onChange={(event) => this.changeValue("gr", "workType", event)} placeholder="title"
                                       value={this.state.person.gr.workType} type="text" required/>
                                <input onChange={(event) => this.changeValue("gr", "phone", event)} placeholder="title"
                                       value={this.state.person.gr.phone} type="text" required/>
                                <input onChange={(event) => this.changeValue("gr", "email", event)} placeholder="title"
                                       value={this.state.person.gr.email} type="text" required/>
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

export default addTeam;
