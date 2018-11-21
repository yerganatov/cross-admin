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
        const {isActive} = this.props; 
        return(
            <div className="sidebar d-flex flex-column py-4">
                <a className="d-flex justify-content-center align-self-center mb-4" href=""><img src={process.env.PUBLIC_URL + 'logo-mobile.png'} alt="" /></a>
                <a className={isActive=== "catalog" && "active"} href="/listCatalog">Каталоги</a>
                <a className={isActive=== "projects" && "active"} href="/listProjects">Проекты</a>
                <a className={isActive=== "team" && "active"} href="/listTeam">Команда</a>
                <a className={isActive=== "service" && "active"} href="/listService">Услуги</a>
                <a className={isActive=== "partners" && "active"} href="/listPartners">Партнеры</a>
                <a onClick={this.signOut} href="">Выйти</a>
            </div>
        )
    }
}

export default  Sidebar;