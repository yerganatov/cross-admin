import React, {Component} from 'react';
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
            <div className="App">
                <h1>ru</h1>
                <input onChange={ (event) => this.changeValue("ru","title",event)} placeholder="title" value={this.state.ru.title} type="text"/>
                <input onChange={ (event) => this.changeValue("ru","done",event)} placeholder="done" value={this.state.ru.done} type="text"/>
                <input onChange={ (event) => this.changeValue("ru","goal",event)} placeholder="goal" value={this.state.ru.goal} type="text"/>
                <input onChange={ (event) => this.changeValue("ru","aboutClient",event)} placeholder="aboutClient" value={this.state.ru.aboutClient} type="text"/>
                <input onChange={ (event) => this.changeValue("ru","result",event)} placeholder="result" value={this.state.ru.result} type="text"/>
                <h1>en</h1>
                <input onChange={ (event) => this.changeValue("en","title",event)} placeholder="title" value={this.state.en.title} type="text"/>
                <input onChange={ (event) => this.changeValue("en","done",event)} placeholder="done" value={this.state.en.done} type="text"/>
                <input onChange={ (event) => this.changeValue("en","goal",event)} placeholder="goal" value={this.state.en.goal} type="text"/>
                <input onChange={ (event) => this.changeValue("en","aboutClient",event)} placeholder="aboutClient" value={this.state.en.aboutClient} type="text"/>
                <input onChange={ (event) => this.changeValue("en","result",event)} placeholder="result" value={this.state.en.result} type="text"/>
                <h1>gr</h1>
                <input onChange={ (event) => this.changeValue("gr","title",event)} placeholder="title" value={this.state.gr.title} type="text"/>
                <input onChange={ (event) => this.changeValue("gr","done",event)} placeholder="done" value={this.state.gr.done} type="text"/>
                <input onChange={ (event) => this.changeValue("gr","goal",event)} placeholder="goal" value={this.state.gr.goal} type="text"/>
                <input onChange={ (event) => this.changeValue("gr","aboutClient",event)} placeholder="aboutClient" value={this.state.gr.aboutClient} type="text"/>
                <input onChange={ (event) => this.changeValue("gr","result",event)} placeholder="result" value={this.state.gr.result} type="text"/>

            </div>
        );
    }
}

export default App;
