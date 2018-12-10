import React, { Component } from 'react';
import "./bootstrap.css";
import './App.css';
import Sidebar from "./sidebar";

import { db, store } from "./firebase";
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'



class addService extends Component {
    state = {
        project: {
            ru: {
                phone: "",
                email: "",
                address: "",
                instagram: "",
                facebook: ""
            },
            en: {
                phone: "",
                email: "",
                address: "",
                instagram: "",
                facebook: ""
            },
            gr: {
                phone: "",
                email: "",
                address: "",
                instagram: "",
                facebook: ""
            }
        },
        filenames: [],
        downloadURLs: [],
        isUploading: false,
        uploadProgress: 0,
        images: []
    };
    componentDidMount() {
        this.fetchTeam();
    }

    fetchTeam = async () => {
        try {
            const snapshot = await db.collection('contacts').doc("fHjNkcn2zz7XE7EyImdh").get();
            let project = snapshot.data();
            console.log(project);
            this.setState({
                project: project,
            })
        }
        catch (error) {
            alert(error.message);
        }
    }


    checkforlist = (object) => {
        let ff = 0;
        for (var key in object) {
            if (object[key] == "") {
                ff = ff + 0;
            }
            else if (object[key].length > 2) {
                ff = ff + 1;
            }

        }
        return ff;
    }




    uploadProject = async () => {
        const project = this.state.project;
        const ruR = {
            phone: project.ru.phone,
            email: project.ru.email,
            address: project.ru.address,
            instagram: project.ru.instagram,
            facebook: project.ru.facebook
        }
        const enR = {
            phone: project.en.phone,
            email: project.en.email,
            address: project.en.address,
            instagram: project.en.instagram,
            facebook: project.en.facebook
        }
        const grR = {
            phone: project.gr.phone,
            email: project.gr.email,
            address: project.gr.address,
            instagram: project.gr.instagram,
            facebook: project.gr.facebook
        }
        if (checkData(ruR) && checkData(enR) && checkData(grR)) {
            alert("Вы не заполнили ни одно поле");
            this.setState({
                uploadingButton: false
            })
            return false;
        }

        if (this.checkforlist(ruR) < 5 && this.checkforlist(ruR) != 0) {
            this.setState({
                uploadingButton: false
            })
            alert("Заполните все ru  поля")

            return false;
        }

        if (this.checkforlist(enR) < 5 && this.checkforlist(enR) != 0) {
            this.setState({
                uploadingButton: false
            })
            alert("Заполните все en  поля")

            return false;
        }

        if (this.checkforlist(grR) < 5 && this.checkforlist(grR) != 0) {
            this.setState({
                uploadingButton: false
            })
            alert("Заполните все gr  поля")

            return false;
        }
        if (this.fileUpload.files.length < 1) {
            alert("Загрузите картинку")
            this.setState({
                uploadingButton: false
            })
            return false;

        }
        db.collection("contacts").doc("fHjNkcn2zz7XE7EyImdh").set(project).then(async (docRef) => {
            const options = {
                title: 'Готово!',
                message: 'Хотите вернутся на главную?',
                buttons: [
                    {
                        label: 'Да',
                        onClick: () => { this.props.history.push('/listCatalog') }
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
                <Sidebar isActive="contacts" />
                <div className="main-content px-4 py-5 d-flex flex-column">
                    <div className="form-div d-flex flex-column align-items-center">
                        <h1>ИЗМЕНЕНИЕ КОНТАКТНЫХ ДАННЫХ</h1>
                        <hr className="sep" />
                        <div className="row mx-0 p-0 w-100">
                            <div className="col-6 mb-4">
                                <h5>Информация на русском языке</h5>
                                <div className="group">
                                    <input className="input-style" onChange={(event) => this.changeValue("ru", "phone", event)} value={this.state.project.ru.phone} type="text" required="required" /><span className="highlight"></span><span
                                        className="bar"></span>
                                    <label>Номер телефона</label>
                                </div>
                                <div className="group">
                                    <input className="input-style" onChange={(event) => this.changeValue("ru", "email", event)} value={this.state.project.ru.email} type="text" required="required" /><span className="highlight"></span><span
                                        className="bar"></span>
                                    <label>Электронная почта</label>
                                </div>
                                <div className="group">
                                    <input className="input-style" onChange={(event) => this.changeValue("ru", "address", event)} value={this.state.project.ru.address} type="text" required="required" /><span className="highlight"></span><span
                                        className="bar"></span>
                                    <label>Адрес</label>
                                </div>
                                <div className="group">
                                    <input className="input-style" onChange={(event) => this.changeValue("ru", "instagram", event)} value={this.state.project.ru.instagram} type="text" required="required" /><span className="highlight"></span><span
                                        className="bar"></span>
                                    <label>Instagram</label>
                                </div>
                                <div className="group">
                                    <input className="input-style" onChange={(event) => this.changeValue("ru", "facebook", event)} value={this.state.project.ru.facebook} type="text" required="required" /><span className="highlight"></span><span
                                        className="bar"></span>
                                    <label>Facebook</label>
                                </div>

                            </div>


                            <div className="col-6 mb-4">
                                <h5>Информация на английском языке</h5>
                                <div className="group">
                                    <input className="input-style" onChange={(event) => this.changeValue("en", "phone", event)} value={this.state.project.en.phone} type="text" required="required" /><span className="highlight"></span><span
                                        className="bar"></span>
                                    <label>Номер телефона</label>
                                </div>
                                <div className="group">
                                    <input className="input-style" onChange={(event) => this.changeValue("en", "email", event)} value={this.state.project.en.email} type="text" required="required" /><span className="highlight"></span><span
                                        className="bar"></span>
                                    <label>Электронная почта</label>
                                </div>
                                <div className="group">
                                    <input className="input-style" onChange={(event) => this.changeValue("en", "address", event)} value={this.state.project.en.address} type="text" required="required" /><span className="highlight"></span><span
                                        className="bar"></span>
                                    <label>Адрес</label>
                                </div>
                                <div className="group">
                                    <input className="input-style" onChange={(event) => this.changeValue("en", "instagram", event)} value={this.state.project.en.instagram} type="text" required="required" /><span className="highlight"></span><span
                                        className="bar"></span>
                                    <label>Instagram</label>
                                </div>
                                <div className="group">
                                    <input className="input-style" onChange={(event) => this.changeValue("en", "facebook", event)} value={this.state.project.en.facebook} type="text" required="required" /><span className="highlight"></span><span
                                        className="bar"></span>
                                    <label>Facebook</label>
                                </div>

                            </div>

                            <div className="col-6 mb-4">
                                <h5>Информация на немецком языке</h5>
                                <div className="group">
                                    <input className="input-style" onChange={(event) => this.changeValue("gr", "phone", event)} value={this.state.project.gr.phone} type="text" required="required" /><span className="highlight"></span><span
                                        className="bar"></span>
                                    <label>Номер телефона</label>
                                </div>
                                <div className="group">
                                    <input className="input-style" onChange={(event) => this.changeValue("gr", "email", event)} value={this.state.project.gr.email} type="text" required="required" /><span className="highlight"></span><span
                                        className="bar"></span>
                                    <label>Электронная почта</label>
                                </div>
                                <div className="group">
                                    <input className="input-style" onChange={(event) => this.changeValue("gr", "address", event)} value={this.state.project.gr.address} type="text" required="required" /><span className="highlight"></span><span
                                        className="bar"></span>
                                    <label>Адрес</label>
                                </div>
                                <div className="group">
                                    <input className="input-style" onChange={(event) => this.changeValue("gr", "instagram", event)} value={this.state.project.gr.instagram} type="text" required="required" /><span className="highlight"></span><span
                                        className="bar"></span>
                                    <label>Instagram</label>
                                </div>
                                <div className="group">
                                    <input className="input-style" onChange={(event) => this.changeValue("gr", "facebook", event)} value={this.state.project.gr.facebook} type="text" required="required" /><span className="highlight"></span><span
                                        className="bar"></span>
                                    <label>Facebook</label>
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
