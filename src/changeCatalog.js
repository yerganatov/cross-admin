import React, {Component} from 'react';
import "./bootstrap.css";
import './App.css';
import Sidebar from "./sidebar";
import {db, store} from "./firebase";
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'

class changeCatalog extends Component {
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
        image:"",

    };
    componentDidMount() {
        this.fetchProject();
    }

    fetchProject = async () => {
        try {
            const snapshot = await db.collection('catalog').doc(this.props.match.params.id).get();
            let project = snapshot.data();
            this.setState({
                project: project,
                image:project.image,
                startDate:project.date
            })
        }
        catch (error) {
            alert(error.message);
        }
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
        const files = this.fileUpload.files;
        const project = this.state.project;
        const images = this.state.images;
        project.image = this.state.image;
        const id = this.props.match.params.id;
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
        
        if(this.checkforlist(ruR) <3 && this.checkforlist(ruR)  != 0){
            this.setState({
                uploadingButton:false
            })
            alert("Заполните все ru  поля")
            
            return false;
        }
        
        if(this.checkforlist(enR) <3 && this.checkforlist(enR) != 0){
            this.setState({
                uploadingButton:false
            })
            alert("Заполните все en  поля")
            
            return false;
        }
        
        if(this.checkforlist(grR) <3 && this.checkforlist(grR) != 0){
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
     
        db.collection("catalog").doc(this.props.match.params.id).set(project).then(async (docRef) => {
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
                            db.collection("catalog").doc(newDirectory).set(project);
                        });

                });
            })
            const options = {
                title: 'Готово!',
                message: 'Хотите вернутся на главную?',
                buttons: [
                    {
                        label: 'Да',
                        onClick: () => { this.props.history.push('/listcatalog')}
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
    };
    removeImage = async () => {
        const image = this.state.image;
        this.setState({
            image: ""
        })
    }


    render() {
        return (
            <div className="App d-flex">
                <Sidebar isActive="catalog"/>
                <div className="main-content px-4 py-5 d-flex flex-column">
                    <div className="form-div d-flex flex-column align-items-center">
                        <h1>ИЗМЕНЕНИЕ КАТАЛОГА</h1>
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
                                <div className="row">
                                    <input className="input-style" ref={instance => {
                                        this.fileUpload = instance
                                    }} type="file" multiple={false} accept={"image/*"} required/>
                                    <div className="disp-wrap">
                                        
                                        <button onClick={() => this.removeImage()}>✕</button>
                                        <img className="disp-img"  src={this.state.image}/>
                                    </div>
                                </div>
                                <h5 className="mt-5">Дата</h5>
                                <input className="input-style" type="date" onChange={(event) => {
                                    this.setState({startDate: event.target.value})
                                    console.log(this.state.startDate)
                                }} value={this.state.startDate} />
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

export default changeCatalog;
