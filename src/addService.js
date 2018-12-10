import React, {Component} from 'react';
import "./bootstrap.css";
import './App.css';
import Sidebar from "./sidebar";

import {db, store} from "./firebase";
import {confirmAlert} from "react-confirm-alert";
import {checkData,consistsOfLetters} from "./utils"


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
        images: [],
        uploadingButton: false
    };
    guid = () => {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }

        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    }

    checkforlist = (object) =>{
        let ff = 0;
        for(var key in object){
            if(object[key] == ""){                            
                ff = ff+0;
            }
            else if(object[key].length > 2){
                ff = ff +1;
            }
            
        }
        return ff ;
    } 



    uploadProject = async () => {
        const project = this.state.project
        this.setState({
            uploadingButton:true
        })
        const ruR = {
            title: project.ru.title,
            description:project.ru.description
        }
        const enR = {
            title: project.en.title,
            description:project.en.description
            
        }
        const grR = {
            title: project.gr.title,
            description:project.gr.description
            
        }
        if(checkData(ruR) && checkData(enR) && checkData(grR)){
            alert("Вы не заполнили ни одно поле");
            this.setState({
                uploadingButton:false
            })
            return false;
        }
        
        if(this.checkforlist(ruR) <2 && this.checkforlist(ruR)  != 0){
            this.setState({
                uploadingButton:false
            })
            alert("Заполните все ru  поля")
            
            return false;
        }
        
        if(this.checkforlist(enR) <2 && this.checkforlist(enR) != 0){
            this.setState({
                uploadingButton:false
            })
            alert("Заполните все en  поля")
            
            return false;
        }
        
        if(this.checkforlist(grR) <2 && this.checkforlist(grR) != 0){
            this.setState({
                uploadingButton:false
            })
            alert("Заполните все gr  поля")
            
            return false;
        }
        db.collection("services").add(this.state.project)
            .then( (docRef) => {
                const options = {
                    title: 'Готово!',

                    buttons: [
                        {
                            label: 'Вернутся на главную',
                            onClick: () => { this.props.history.push('/listService')}
                        }
                    ],
                    childrenElement: () => <div />,
                    willUnmount: () => { }
                }

                confirmAlert(options)
            })
            .catch(function (error) {
                console.error("Error writing document: ", error);
            });
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
                <Sidebar isActive="service"/>
                <div className="main-content px-4 py-5 d-flex flex-column">
                    <div className="form-div d-flex flex-column align-items-center">
                        <h1>ДОБАВЛЕНИЕ УСЛУГИ</h1>
                        <hr className="sep"/>
                        <div className="row mx-0 p-0 w-100">
                            <div className="col-6 mb-4">
                                <h5>Информация на русском языке</h5>
                                <div className="group">
                                    <input className="input-style" onChange={(event) => this.changeValue("ru", "title", event)} value={this.state.project.ru.title} type="text" required="required"/><span className="highlight"></span><span
                                    className="bar"></span>
                                    <label>Заголовок услуги</label>
                                </div>
                                <div className="group">
                                    <textarea onChange={(event) => this.changeValue("ru", "description", event)} value={this.state.project.ru.description} type="textarea" rows="5" required="required"></textarea><span className="highlight"></span><span
                                    className="bar"></span>
                                    <label>Описание услуги</label>
                                </div>

                            </div>


                            <div className="col-6 mb-4">
                                <h5>Информация на английском языке</h5>
                                <div className="group">
                                    <input className="input-style" onChange={(event) => this.changeValue("en", "title", event)} value={this.state.project.en.title} type="text" required="required"/><span className="highlight"></span><span
                                    className="bar"></span>
                                    <label>Заголовок услуги</label>
                                </div>
                                <div className="group">
                                    <textarea onChange={(event) => this.changeValue("en", "description", event)} value={this.state.project.en.description} type="textarea" rows="5" required="required"></textarea><span className="highlight"></span><span
                                    className="bar"></span>
                                    <label>Описание услуги</label>
                                </div>

                            </div>

                            <div className="col-6 mb-4">
                                <h5>Информация на немецком языке</h5>
                                <div className="group">
                                    <input className="input-style" onChange={(event) => this.changeValue("gr", "title", event)} value={this.state.project.gr.title} type="text" required="required"/><span className="highlight"></span><span
                                    className="bar"></span>
                                    <label>Заголовок услуги</label>
                                </div>
                                <div className="group">
                                    <textarea onChange={(event) => this.changeValue("gr", "description", event)} value={this.state.project.gr.description} type="textarea" rows="5" required="required"></textarea><span className="highlight"></span><span
                                    className="bar"></span>
                                    <label>Описание услуги</label>
                                </div>

                            </div>


                        </div>

                        <div className="btn-box">
                            <button disabled={this.state.uploadingButton?true:false} onClick={() => this.uploadProject()} className="btn btn-submit" type="submit">Добавить</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default addService;
