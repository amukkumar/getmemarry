import React from 'react'
import Home from './views/Home'
import Navbar from './components/global/navbar'
import Landing from './views/Landing'
import Footer from './components/global/footer'
import { Outlet } from 'react-router-dom'
import NavBottom from './components/global/navbottom'
import Loading from './components/global/loading'

const Layout = () => {
    return (
        <>
            <Navbar />
            <NavBottom />
            <Outlet />
            <Footer />
        </>
    )
}

export default Layout