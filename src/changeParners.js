import React, {Component} from 'react';
import "./bootstrap.css";
import './App.css';
import Sidebar from "./sidebar";
import {db, store} from "./firebase";
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'

class addPartners extends Component {
    state = {
        project: {
            ru: {
                title: "",

            },
            en: {
                title: "",

            },
            gr: {
                title: "",

            }
        },
        filename: {},
        downloadURLs: [],
        isUploading: false,
        uploadProgress: 0
    };
    componentDidMount() {
        this.fetchProject();
    }

    fetchProject = async () => {
        try {
            const snapshot = await db.collection('partners').doc(this.props.match.params.id).get();
            let project = snapshot.data();
            let images = this.state.images;
            images.push(project.image);
            this.setState({
                person: project,
                images: images
            })
        }
        catch (error) {
            alert(error.message);
        }
    }




    uploadCatalog = async () => {
        const files = this.fileUpload.files;
        const project = this.state.project;
        const images = this.state.images;
        project.images = this.state.images;
        const id = this.props.match.params.id;
        db.collection("partners").doc(this.props.match.params.id).set(project).then(async (docRef) => {
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
                            db.collection("partners").doc(newDirectory).set(project);
                        });

                });
            })
            const options = {
                title: 'Готово!',
                message: 'Хотите вернутся на главную?',
                buttons: [
                    {
                        label: 'Да',
                        onClick: () => { this.props.history.push('/listpartners')}
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
                <div className="main-content px-4 py-5 d-flex flex-column">
                    <div className="form-div d-flex flex-column align-items-center">
                        <h1>ДОБАВЛЕНИЕ СПОНСОРА</h1>
                        <hr className="sep"/>
                        <div className="row mx-0 p-0 w-100">
                            <div className="col-6 mb-4">
                                <h5>Информация на русском языке</h5>
                                <div className="group">
                                    <input onChange={(event) => this.changeValue("ru", "title", event)} value={this.state.project.ru.title} type="text" required="required"/><span className="highlight"></span><span
                                    className="bar"></span>
                                    <label>Название проекта</label>
                                </div>

                            </div>


                            <div className="col-6 mb-4">
                                <h5>Информация на английском языке</h5>
                                <div className="group">
                                    <input onChange={(event) => this.changeValue("en", "title", event)} value={this.state.project.en.title} type="text" required="required"/><span className="highlight"></span><span
                                    className="bar"></span>
                                    <label>Название проекта</label>
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

                            </div>

                            <div className="col-6 mb-4">
                                <h5>Изображения для загрузки </h5>
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

export default addPartners;