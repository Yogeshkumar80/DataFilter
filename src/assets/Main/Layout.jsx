import Navbar from "../Navbar/Navbar";
import {Outlet} from "react-router-dom"
import "./Layout.css"
export default function Layout(){
    return(
        <div className="site-wrapper">
            <Navbar/>
            <main>
                <Outlet/>
            </main>
        </div>
    )
}