import React, {Component} from 'react';
import "./bootstrap.css";
import './App.css';
import Sidebar from "./sidebar";
import {db, store} from "./firebase";
import {confirmAlert} from "react-confirm-alert";
import {checkData,consistsOfLetters} from "./utils"

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
        startDate:new Date(),
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



    uploadCatalog = async () => {
        this.setState({
            uploadingButton:true
        })
        const files = this.fileUpload.files;
        const project = this.state.project;
        project["date"] = this.state.startDate;
        const ruR = {
            title: project.ru.title,
            aboutCatalog: project.ru.aboutCatalog,
            requestPartners: project.ru.requestPartners
        }
        const enR = {
            title: project.en.title,
            aboutCatalog: project.en.aboutCatalog,
            requestPartners: project.en.requestPartners
        }
        const grR = {
            title: project.gr.title,
            aboutCatalog: project.gr.aboutCatalog,
            requestPartners: project.gr.requestPartners
        }
        if(checkData(ruR) && checkData(enR) && checkData(grR)){
            alert("Вы не заполнили ни одно поле");
            this.setState({
                uploadingButton:false
            })
            return false;
        }
        console.log(this.checkforlist(ruR))
        
        if(this.checkforlist(ruR) < 3 && this.checkforlist(ruR)  != 0){
            this.setState({
                uploadingButton:false
            })
            alert("Заполните все ru  поля")
            
            return false;
        }
        console.log(this.checkforlist(enR))
        
        if(this.checkforlist(enR) < 3 && this.checkforlist(enR) != 0){
            this.setState({
                uploadingButton:false
            })
            alert("Заполните все en  поля")
            
            return false;
        }
        console.log(this.checkforlist(grR))
        
        if(this.checkforlist(grR) < 3 && this.checkforlist(grR) != 0){
            this.setState({
                uploadingButton:false
            })
            alert("Заполните все gr  поля")
            
            return false;
        }
        if(this.fileUpload.files.length < 1){
            alert("Загрузите картинку")
            this.setState({
                uploadingButton:false
            })
            return false;
            
        }
     
        db.collection("catalog").add(this.state.project)
            .then( async (docRef) => {
                const storage = store;
                const storageRef = storage.ref();
                const newDirectory = docRef.id;
                await  Object.values(files).map(async (item) => {
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
                const options = {
                    title: 'Готово!',

                    buttons: [
                        {
                            label: 'Вернутся на главную',
                            onClick: () => { this.props.history.push('/listCatalog')}
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
    };

    changeValue = async (language, key, event) => {
        const value = event.target.value;
        await this.setState(state => {
            state["project"][language][key] = value;
            return state;
        })
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
                                    <input className="input-style" onChange={(event) => this.changeValue("ru", "title", event)} value={this.state.project.ru.title} type="text" required="required"/><span className="highlight"></span><span
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
                                    <input className="input-style" onChange={(event) => this.changeValue("en", "title", event)} value={this.state.project.en.title} type="text" required="required"/><span className="highlight"></span><span
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
                                    <input className="input-style" onChange={(event) => this.changeValue("gr", "title", event)} value={this.state.project.gr.title} type="text" required="required"/><span className="highlight"></span><span
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
                                    <input className="input-style" ref={instance => {
                                        this.fileUpload = instance
                                    }} type="file" multiple={false} accept={"image/*"} required/>
                                    <div>
                                        {this.state.downloadURLs.map((downloadURL, i) => {
                                            return <img key={i} src={downloadURL}/>;
                                        })}
                                    </div>
                                </div>
                                <h5 className="mt-5">Дата</h5>
                                <input className="input-style" type="date" onChange={(event) => {
                                    this.setState({startDate: event.target.value})
                                }} />
                            </div>
                        </div>

                        <div className="btn-box">
                            <button disabled={this.state.uploadingButton?true:false} onClick={() => this.uploadCatalog()} className="btn btn-submit" type="submit">Добавить</button>
                        </div>
                    </div>
                </div>

            </div>
        );
    }
}

export default addCatalog;
