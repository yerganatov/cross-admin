import React, {Component} from 'react';
import "./bootstrap.css";
import './App.css';
import Sidebar from "./sidebar";
import {db, store} from "./firebase";
import { confirmAlert } from 'react-confirm-alert'; // Import

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
            },
            image:""
        },
        filename: {},
        downloadURLs: [],
        isUploading: false,
        uploadProgress: 0,
        images:[]
    };
    componentDidMount() {
        this.fetchPartner();
    }

    fetchPartner = async () => {
        try {
            const snapshot = await db.collection('partners').doc(this.props.match.params.id).get();
            let project = snapshot.data();
            let images = this.state.images;
            images.push(project.image)
            this.setState({
                project: project,
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
                            project["image"] = url;
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
                        onClick: () => { this.props.history.push('/listPartners')}
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
        await this.setState(state => {
            state["project"][language][key] = value;
            return state;
        })
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
                                <h5>Изображения для загрузки <br /> (Можно загрузить несколько изображений)</h5>
                                <div>
                                    <input className="input-style" ref={instance => {
                                        this.fileUpload = instance
                                    }} type="file" multiple={true} accept={"image/*"} required />
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

export default addPartners;
