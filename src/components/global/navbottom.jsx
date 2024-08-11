import React from 'react'
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { BackupTable, CardMembership, Favorite, Home, Inbox, Search } from '@mui/icons-material'

const NavBottom = () => {

    const user = useSelector((state) => state.global.user.payload);

    return (
        <>
            <nav className="container-fluid bg-white p-0 w-full fixed bottom-0 z-50 lg:hidden">
                <div className="container p-0 flex justify-between items-center">
                    <NavLink to={"/"} className='text-center px-3 py-1 border flex-1'>
                        {({ isActive }) => (
                            <>
                                <Home className={`${isActive ? "text-primary" : ""}`} />
                                <p className={`text-xs p-0 m-0 ${isActive ? "text-primary" : ""}`}>Home</p>
                            </>
                        )}
                    </NavLink>
                    <NavLink to={"/search"} className='text-center px-3 py-1 border flex-1'>
                        {({ isActive }) => (
                            <>
                                <Search className={`${isActive ? "text-primary" : ""}`} />
                                <p className={`text-xs p-0 m-0 ${isActive ? "text-primary" : ""}`}>Search</p>
                            </>
                        )}
                    </NavLink>
                    {user?.id ?
                        <NavLink to={"/inbox"} className='text-center px-3 py-1 border flex-1'>
                            {({ isActive }) => (
                                <>
                                    <Inbox className={`${isActive ? "text-primary" : ""}`} />
                                    <p className={`text-xs p-0 m-0 ${isActive ? "text-primary" : ""}`}>Inbox</p>
                                </>
                            )}
                        </NavLink> :
                        <NavLink to={"/testimonial"} className='text-center px-3 py-1 border flex-1'>
                            {({ isActive }) => (
                                <>
                                    <Favorite className={`${isActive ? "text-primary" : ""}`} />
                                    <p className={`text-xs p-0 m-0 ${isActive ? "text-primary" : ""}`}>Story</p>
                                </>
                            )}
                        </NavLink>
                    }
                    <NavLink to={"/membership"} className='text-center px-1 py-1 border flex-1'>
                        {({ isActive }) => (
                            <>
                                <CardMembership className={`${isActive ? "text-primary" : ""}`} />
                                <p className={`text-xs p-0 m-0 ${isActive ? "text-primary" : ""}`}>Membership</p>
                            </>
                        )}
                    </NavLink>
                    <NavLink to={"/horoscope"} className='text-center px-2 py-1 border flex-1'>
                        {({ isActive }) => (
                            <>
                                <BackupTable className={`${isActive ? "text-primary" : ""}`} />
                                <p className={`text-xs p-0 m-0 ${isActive ? "text-primary" : ""}`}>Horoscope</p>
                            </>
                        )}
                    </NavLink>
                </div>
            </nav >
        </>
    )
}

export default NavBottom