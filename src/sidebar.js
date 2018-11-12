import React,{Component} from "react";
import { auth, isAuthenticated } from './firebase';

class Sidebar extends  Component {
    state = {
        goTo: null,
        isAuthenticated: true,
    };
    signOut = async () => {
        try {
            await auth.signOut();
            this.setState({ isAuthenticated: false });
        } catch (error) {
            alert(error.message);
        }
    };

    render(){
        return(
            <div className="sidebar d-flex flex-column py-4">
                <a className="d-flex justify-content-center align-self-center mb-4" href=""><img src={process.env.PUBLIC_URL + 'logo-mobile.png'} alt="" /></a>
                <a href="/addCatalog">Каталоги</a>
                <a href="/addProject">Проекты</a>
                <a href="/addTeam">Команда</a>
                <a href="">Партнеры</a>
                <a onClick={this.signOut} href="">Выйти</a>
            </div>
        )
    }
}

export default  Sidebar;