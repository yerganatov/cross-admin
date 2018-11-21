import React, {Component} from 'react';
import "./bootstrap.css";
import './App.css';
import InputMask from 'react-input-mask';
import Sidebar from "./sidebar";
import {db, store} from "./firebase";
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'


class changeTeam extends Component {
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
        startDate:new Date(),
        images:[]
    };

    componentDidMount() {
        this.fetchProject();
    }

    fetchProject = async () => {
        try {
            const snapshot = await db.collection('team').doc(this.props.match.params.id).get();
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
        const project = this.state.person;
        const images = this.state.images[0];
        const id = this.props.match.params.id;
        db.collection("team").doc(this.props.match.params.id).set(project).then(async (docRef) => {
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
                            project["image"] = url;
                            db.collection("team").doc(newDirectory).set(project);
                        });

                });
            })

            const options = {
                title: 'Готово!',
                message: 'Хотите вернутся на главную?',
                buttons: [
                    {
                        label: 'Да',
                        onClick: () => { this.props.history.push('/listTeam')}
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
            state["person"][language][key] = value;
            return state;
        })
        console.log(this.state);
    };


    removeImage = (index) => {
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
                <Sidebar isActive="team"/>

                <div className="main-content px-4 py-5 d-flex flex-column">
                    <div className="form-div d-flex flex-column align-items-center">
                        <h1>ИЗМЕНЕНИЕ ПЕРСОНАЛА</h1>
                        <hr className="sep"/>
                        <div className="row mx-0 p-0 w-100">
                            <div className="col-6 mb-4">
                                <h5>Информация на русском языке</h5>
                                <div className="group">
                                    <input onChange={(event) => this.changeValue("ru", "name", event)} value={this.state.person.ru.name} type="text" required="required"/><span className="highlight"></span><span
                                    className="bar"></span>
                                    <label>Имя Фамилия</label>
                                </div>
                                <div className="group">
                                    <input onChange={(event) => this.changeValue("ru", "workType", event)} value={this.state.person.ru.workType} type="text" required="required"/><span className="highlight"></span><span
                                    className="bar"></span>
                                    <label>Должность или позиция</label>
                                </div>
                                <div className="group">
                                    <InputMask onChange={(event) => this.changeValue("ru", "phone", event)} value={this.state.person.ru.phone} mask="+7 (999) 999-99-99" required="required"/>
                                    <span className="highlight"></span><span
                                    className="bar"></span>
                                    <label>Номер телефона</label>
                                </div>
                                <div className="group">
                                    <input onChange={(event) => this.changeValue("ru", "email", event)} value={this.state.person.ru.email} type="email" required="required"/><span className="highlight"></span><span
                                    className="bar"></span>
                                    <label>Электронный адрес</label>
                                </div>
                            </div>


                            <div className="col-6 mb-4">
                                <h5>Информация на английском языке</h5>
                                <div className="group">
                                    <input onChange={(event) => this.changeValue("en", "name", event)} value={this.state.person.en.name} type="text" required="required"/><span className="highlight"></span><span
                                    className="bar"></span>
                                    <label>Имя Фамилия</label>
                                </div>
                                <div className="group">
                                    <input onChange={(event) => this.changeValue("en", "workType", event)} value={this.state.person.en.workType} type="text" required="required"/><span className="highlight"></span><span
                                    className="bar"></span>
                                    <label>Должность или позиция</label>
                                </div>
                                <div className="group">
                                    <InputMask onChange={(event) => this.changeValue("en", "phone", event)} value={this.state.person.en.phone} mask="+7 (999) 999-99-99" required="required"/>
                                    <span className="highlight"></span><span
                                    className="bar"></span>
                                    <label>Номер телефона</label>
                                </div>
                                <div className="group">
                                    <input onChange={(event) => this.changeValue("en", "email", event)} value={this.state.person.en.email} type="email" required="required"/><span className="highlight"></span><span
                                    className="bar"></span>
                                    <label>Электронный адрес</label>
                                </div>
                            </div>

                            <div className="col-12">
                                <hr className="sep w-25"/>
                            </div>

                            <div className="col-6 mb-4">
                                <h5>Информация на немецком языке</h5>
                                <div className="group">
                                    <input onChange={(event) => this.changeValue("gr", "name", event)} value={this.state.person.gr.name} type="text" required="required"/><span className="highlight"></span><span
                                    className="bar"></span>
                                    <label>Имя Фамилия</label>
                                </div>
                                <div className="group">
                                    <input onChange={(event) => this.changeValue("gr", "workType", event)} value={this.state.person.gr.workType} type="text" required="required"/><span className="highlight"></span><span
                                    className="bar"></span>
                                    <label>Должность, позиция</label>
                                </div>
                                <div className="group">
                                    <InputMask onChange={(event) => this.changeValue("gr", "phone", event)} value={this.state.person.gr.phone} mask="+7 (999) 999-99-99" required="required"/>
                                    <span className="highlight"></span><span
                                    className="bar"></span>
                                    <label>Номер телефона</label>
                                </div>
                                <div className="group">
                                    <input onChange={(event) => this.changeValue("gr", "email", event)} value={this.state.person.gr.email} type="email" required="required"/><span className="highlight"></span><span
                                    className="bar"></span>
                                    <label>Электронный адрес</label>
                                </div>
                            </div>

                            <div className="col-6 mb-4">
                                <h5>Изображения для загрузки </h5>
                                <div>
                                    <input  ref={instance => {
                                        this.fileUpload = instance
                                    }} type="file" multiple={false} accept={"image/*"} required="required"/>
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
                            <button onClick={() => this.uploadCatalog()} className="btn btn-submit" type="submit">Изменить</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default changeTeam;
