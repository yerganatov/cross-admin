import React, { Component } from 'react';
import "./bootstrap.css";
import './App.css';
import { db, store } from "./firebase";
import FileUploader from "react-firebase-file-uploader";

class App extends Component {
    state = {
        project: {
            ru: {
                aboutClient: "",
                done: "",
                goal: "",
                result: "",
                tags: [],
                title: ""
            },
            en: {
                aboutClient: "",
                done: "",
                goal: "",
                result: "",
                tags: [],
                title: ""
            },
            gr: {
                aboutClient: "",
                done: "",
                goal: "",
                result: "",
                tags: [],
                title: ""
            }
        },
        filenames: [],
        downloadURLs: [],
        isUploading: false,
        uploadProgress: 0


    };



    uploadProject = async () => {
        console.log(this.state);
        db.collection("projects").add(this.state.project)
            .then(function (docRef) {
                const id = docRef.id;
                var storage = store;
                var storageRef = storage.ref();
                var imagesRef = storageRef.child('images'+ '/' + toString(id));
                console.log("Document successfully written!");
            })
            .catch(function (error) {
                console.error("Error writing document: ", error);
            });
    }

    changeValue = async (language, key, event) => {
        const value = event.target.value;
        console.log(value)
        await this.setState(state => {
            state["project"][language][key] = value;
            return state;
        })
        console.log(this.state);
    }

    customOnChangeHandler = (event) => {
        const { target: { files } } = event;
        const filesToStore = [];

        files.forEach(file => filesToStore.push(file));

        this.setState({ filenames: filesToStore });
    }


    handleUploadError = error => {
        this.setState({
            isUploading: false
            // Todo: handle error
        });
        console.error(error);
    };

    handleUploadSuccess = async filename => {
        const downloadURL = await store
            .ref("images")
            .child(filename)
            .getDownloadURL();

        this.setState(oldState => ({
            filenames: [...oldState.filenames, filename],
            downloadURLs: [...oldState.downloadURLs, downloadURL],
            uploadProgress: 100,
            isUploading: false
        }));
    };


    startUploadManually = () => {
        const { filenames } = this.state;
        filenames.forEach(file => {
            this.fileUploader.startUpload(file)
        });
    }

    render() {
        return (
            <div className="App d-flex">
                <div className="sidebar d-flex flex-column py-4">
                    <a className="d-flex justify-content-center align-self-center mb-4" href=""><img src={process.env.PUBLIC_URL + 'logo-mobile.png'} alt="" /></a>
                    <a href="">Добавление каталога</a>
                    <a href="">Список каталогов</a>
                    <a href="">Добавление проекта</a>
                    <a href="">Список проектов</a>
                    <a href="">Выйти</a>
                </div>
                <div className="main-content p-5 d-flex flex-column">
                    <h1>Добавление нового каталога</h1>
                    <p>Все поля обязательны к заполнению</p>
                    <div className="row">
                        <div className="col-md-8">
                            <form className="d-flex flex-column h-100" action="">
                                <h3>Информация на русском языке</h3>
                                <input onChange={(event) => this.changeValue("ru", "title", event)} placeholder="title" value={this.state.project.ru.title} type="text" required />
                                <input onChange={(event) => this.changeValue("ru", "done", event)} placeholder="done" value={this.state.project.ru.done} type="text" required />
                                <input onChange={(event) => this.changeValue("ru", "goal", event)} placeholder="goal" value={this.state.project.ru.goal} type="text" required />
                                <input onChange={(event) => this.changeValue("ru", "aboutClient", event)} placeholder="aboutClient" value={this.state.project.ru.aboutClient} type="text" required />
                                <input onChange={(event) => this.changeValue("ru", "result", event)} placeholder="result" value={this.state.project.ru.result} type="text" required />
                                <h3>Информация на английском языке</h3>
                                <input onChange={(event) => this.changeValue("en", "title", event)} placeholder="title" value={this.state.project.en.title} type="text" required />
                                <input onChange={(event) => this.changeValue("en", "done", event)} placeholder="done" value={this.state.project.en.done} type="text" required />
                                <input onChange={(event) => this.changeValue("en", "goal", event)} placeholder="goal" value={this.state.project.en.goal} type="text" required />
                                <input onChange={(event) => this.changeValue("en", "aboutClient", event)} placeholder="aboutClient" value={this.state.project.en.aboutClient} type="text" required />
                                <input onChange={(event) => this.changeValue("en", "result", event)} placeholder="result" value={this.state.project.en.result} type="text" required />
                                <h3>Информация на немецком языке</h3>
                                <input onChange={(event) => this.changeValue("gr", "title", event)} placeholder="title" value={this.state.project.gr.title} type="text" required />
                                <input onChange={(event) => this.changeValue("gr", "done", event)} placeholder="done" value={this.state.project.gr.done} type="text" required />
                                <input onChange={(event) => this.changeValue("gr", "goal", event)} placeholder="goal" value={this.state.project.gr.goal} type="text" required />
                                <input onChange={(event) => this.changeValue("gr", "aboutClient", event)} placeholder="aboutClient" value={this.state.project.gr.aboutClient} type="text" required />
                                <input onChange={(event) => this.changeValue("gr", "result", event)} placeholder="result" value={this.state.project.gr.result} type="text" required />
                                <button onClick={() => this.uploadProject()} type="button" class="btn btn-primary">Добавить</button>
                            </form>

                        </div>
                        <div className="col-md-4">
                            <label htmlFor="">
                                <FileUploader
                                    accept="image/*"
                                    name="image-uploader-multiple"
                                    randomizeFilename
                                    storageRef={store.ref().child("images/space")}
                                    ref={instance => { this.fileUploader = instance; } }
                                    onUploadError={this.handleUploadError}
                                    onUploadSuccess={this.handleUploadSuccess}
                                    onProgress={this.handleProgress}
                                    multiple
                                />
                                 <button onClick={this.startUploadManually}>Upload all the things</button>
                                <p>Progress: {this.state.uploadProgress}</p>

                                <p>Filenames: {this.state.filenames.join(", ")}</p>

                                <div>
                                    {this.state.downloadURLs.map((downloadURL, i) => {
                                        return <img key={i} src={downloadURL} />;
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

export default App;
