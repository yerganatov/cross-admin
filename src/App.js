import React, {Component} from 'react';
import "./bootstrap.css";
import './App.css';
import {db} from "./firebase";

class App extends Component {
    state = {

        ru:{
            aboutClient: "",
            done: "",
            goal: "",
            result: "",
            tags: [],
            title: ""
        },
        en:{
            aboutClient: "",
            done: "",
            goal: "",
            result: "",
            tags: [],
            title: ""
        },
        gr:{
            aboutClient: "",
            done: "",
            goal: "",
            result: "",
            tags: [],
            title: ""
        }
    };

    componentDidMount() {
        this.uploadProject();
    }


    uploadProject = async () => {
        db.collection("projects").doc("2").set(this.state)
            .then(function() {
                console.log("Document successfully written!");
            })
            .catch(function(error) {
                console.error("Error writing document: ", error);
            });
    }

    changeValue = async (language,key,event) =>{
        const value = event.target.value;
        await this.setState(state => {
            state[language][key] = value;
            return state;
        })
    }

    render() {
        return (
            <div className="App d-flex">
                <div className="sidebar d-flex flex-column py-4">
                    <a className="d-flex justify-content-center align-self-center mb-4" href=""><img src={process.env.PUBLIC_URL + 'logo-mobile.png'} alt=""/></a>
                    <a href="">Добавление каталога</a>
                    <a href="">Список каталогов</a>
                    <a href="">Добавление проекта</a>
                    <a href="">Список проектов</a>
                    <a href="">Выйти</a>
                </div>
                <div className="main-content p-5 d-flex flex-column">
                    <h1>Добавление нового каталога</h1>
                    <p>Все поля обязательны к заполнению</p>
                    <form className="d-flex flex-column h-100" action="">
                        <h3>Информация на русском языке</h3>
                        <input onChange={ (event) => this.changeValue("ru","title",event)} placeholder="title" value={this.state.ru.title} type="text" required/>
                        <input onChange={ (event) => this.changeValue("ru","done",event)} placeholder="done" value={this.state.ru.done} type="text" required/>
                        <input onChange={ (event) => this.changeValue("ru","goal",event)} placeholder="goal" value={this.state.ru.goal} type="text" required/>
                        <input onChange={ (event) => this.changeValue("ru","aboutClient",event)} placeholder="aboutClient" value={this.state.ru.aboutClient} type="text" required/>
                        <input onChange={ (event) => this.changeValue("ru","result",event)} placeholder="result" value={this.state.ru.result} type="text" required/>
                        <h3>Информация на английском языке</h3>
                        <input onChange={ (event) => this.changeValue("en","title",event)} placeholder="title" value={this.state.en.title} type="text" required/>
                        <input onChange={ (event) => this.changeValue("en","done",event)} placeholder="done" value={this.state.en.done} type="text" required/>
                        <input onChange={ (event) => this.changeValue("en","goal",event)} placeholder="goal" value={this.state.en.goal} type="text" required/>
                        <input onChange={ (event) => this.changeValue("en","aboutClient",event)} placeholder="aboutClient" value={this.state.en.aboutClient} type="text" required/>
                        <input onChange={ (event) => this.changeValue("en","result",event)} placeholder="result" value={this.state.en.result} type="text" required/>
                        <h3>Информация на немецком языке</h3>
                        <input onChange={ (event) => this.changeValue("gr","title",event)} placeholder="title" value={this.state.gr.title} type="text" required/>
                        <input onChange={ (event) => this.changeValue("gr","done",event)} placeholder="done" value={this.state.gr.done} type="text" required/>
                        <input onChange={ (event) => this.changeValue("gr","goal",event)} placeholder="goal" value={this.state.gr.goal} type="text" required/>
                        <input onChange={ (event) => this.changeValue("gr","aboutClient",event)} placeholder="aboutClient" value={this.state.gr.aboutClient} type="text" required/>
                        <input onChange={ (event) => this.changeValue("gr","result",event)} placeholder="result" value={this.state.gr.result} type="text" required/>
                        <button type="button" class="btn btn-primary">Добавить</button>
                    </form>
                </div>
            </div>
        );
    }
}

export default App;
