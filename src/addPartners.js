import React, {Component} from 'react';
import "./bootstrap.css";
import './App.css';
import Sidebar from "./sidebar";
import {db, store} from "./firebase";
import {confirmAlert} from "react-confirm-alert";
import {checkData} from "./utils/index";

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
        uploadProgress: 0,
        uploadingButton: false
    };
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
        const ruR = {
            title: project.ru.title,
        }
        const enR = {
            title: project.en.title,
        }
        const grR = {
            title: project.gr.title,
        }
        if(checkData(ruR) && checkData(enR) && checkData(grR)){
            alert("Вы не заполнили ни одно поле");
            this.setState({
                uploadingButton:false
            })
            return false;
        }
        
        if(this.checkforlist(ruR) ==1 && this.checkforlist(ruR)  != 0){
            this.setState({
                uploadingButton:false
            })
            alert("Заполните все ru  поля")
            
            return false;
        }
        
        if(this.checkforlist(enR) ==1 && this.checkforlist(enR) != 0){
            this.setState({
                uploadingButton:false
            })
            alert("Заполните все en  поля")
            
            return false;
        }
        
        if(this.checkforlist(grR) ==1 && this.checkforlist(grR) != 0){
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
        db.collection("partners").add(this.state.project)
            .then(async (docRef) => {
                const storage = store;
                const storageRef = storage.ref();
                const newDirectory = docRef.id;
                await Object.values(files).map(async (item) => {
                    let imagesRef = storageRef.child(`images/${newDirectory}/${item.name}`);

                    await imagesRef.put(item).then((span) => {
                        store
                            .ref(`images/${newDirectory}/`)
                            .child(item.name)
                            .getDownloadURL().then(url => {
                            project["image"] = url;
                            db.collection("partners").doc(newDirectory).set(project);
                        });
                    });

                });

                const options = {
                    title: 'Готово!',

                    buttons: [
                        {
                            label: 'Вернутся на главную',
                            onClick: () => { this.props.history.push('/listPartners')}
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
        console.log(this.state);
    };


    render() {
        return (
            <div className="App d-flex">
                <Sidebar isActive="partners"/>
                <div className="main-content px-4 py-5 d-flex flex-column">
                    <div className="form-div d-flex flex-column align-items-center">
                        <h1>ДОБАВЛЕНИЕ СПОНСОРА</h1>
                        <hr className="sep"/>
                        <div className="row mx-0 p-0 w-100">
                            <div className="col-6 mb-4">
                                <h5>Обязательно писать в формате <strong>(http://, https://) <br/>
                                Например, https://www.nur.kz/ </strong> </h5>
                                <div className="group">
                                    <input className="input-style" onChange={(event) => this.changeValue("ru", "title", event)} value={this.state.project.ru.title} type="text" required="required"/><span className="highlight"></span><span
                                    className="bar"></span>
                                    <label>Ссылка на сайт партнера</label>
                                </div>

                            </div>


                            <div className="col-6 mb-4">
                                <h5>Изображения для загрузки </h5>
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

export default addPartners;
