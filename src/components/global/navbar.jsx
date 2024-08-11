import React, { useState, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import logo from '../../assets/logo/getmemarrylogo.png';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu";
import { setName, setPartner, setToken, setUser } from '../../store/globalSlice';
import { AddIcCallOutlined, List, LockOpenOutlined, LogoutOutlined, PersonOutline, SettingsOutlined } from '@mui/icons-material';
import useLoading from '../../hook/loading';
import Loading from './loading';


const Navbar = () => {

    const apiUrl = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();
    const { loading, startLoading, stopLoading } = useLoading();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.global.user.payload);
    const [profileImg, setProfileImg] = useState("");

    const fetchProfileImg = async () => {
        startLoading();
        try {
            const response = await axios.get(apiUrl + 'image_api/getsnap_amuk.php', {
                params: {
                    id: user?.id,
                    typ: "pic"
                }
            });
            setProfileImg(response.data)
        } catch (error) {
            console.error('Error fetching captcha:', error);
        }
        stopLoading();
    };

    const logout = () => {
        startLoading();
        axios.get(apiUrl + 'logout.php', {
            params: {
                token: user.token,
            }
        })
            .then(function (response) {
                if (response.data.success) {
                    dispatch(setToken(null));
                    dispatch(setUser(null));
                    dispatch(setName(null));
                    dispatch(setPartner(null));
                    navigate('/')
                }
            })
            .catch(function (error) {
                console.log(error);
            })
            .finally(function () {
                stopLoading();
                dispatch(setToken(null));
                dispatch(setUser(null));
                dispatch(setName(null));
                dispatch(setPartner(null));
                navigate('/');
            });
    }

    useEffect(() => {
        if (user?.id > 0)
            fetchProfileImg();
    }, [user?.id])
    return (
        <>
            <Loading loading={loading} />
            <nav className="container-fluid shadow bg-white p-3 md:px-10 sticky top-0 z-20">
                <div className="container p-0 flex justify-between items-center">
                    <div>
                        <NavLink to={"/"}>
                            <img src={logo} style={{ height: "40px" }} />
                        </NavLink>
                    </div>
                    <div className='flex gap-3 md:gap-5 items-center'>
                        <div className="hidden lg:flex gap-10 mr-5">
                            <NavLink to={"/"}>
                                {({ isActive }) => (
                                    <div className={`font-semibold ${isActive ? "text-primary" : ""}`}>Home</div>
                                )}
                            </NavLink>
                            <NavLink to={"/search"}>
                                {({ isActive }) => (
                                    <div className={`font-semibold ${isActive ? "text-primary" : ""}`}>Search</div>
                                )}
                            </NavLink>
                            {user?.id ?
                                <NavLink to="/inbox">
                                    {({ isActive }) => (
                                        <div className={`font-semibold ${isActive ? "text-primary" : ""}`} onClick={() => navigate('/inbox/received')}>Inbox</div>
                                    )}
                                </NavLink> : ""
                            }
                            <NavLink to={"/membership"}>
                                {({ isActive }) => (
                                    <div className={`font-semibold ${isActive ? "text-primary" : ""}`}>Membership</div>
                                )}
                            </NavLink>
                            <NavLink to={"/horoscope"}>
                                {({ isActive }) => (
                                    <div className={`font-semibold ${isActive ? "text-primary" : ""}`}>Horoscope</div>
                                )}
                            </NavLink>
                            {!user?.id ?
                                <NavLink to={"/testimonial"}>
                                    {({ isActive }) => (
                                        <div className={`font-semibold ${isActive ? "text-primary" : ""}`}>Success Story</div>
                                    )}
                                </NavLink> : ""
                            }
                            <NavLink to={"/contact-us"}>
                                {({ isActive }) => (
                                    <div className={`font-semibold ${isActive ? "text-primary" : ""}`}>Contact</div>
                                )}
                            </NavLink>

                        </div>
                        {user?.id ?
                            <DropdownMenu>
                                <DropdownMenuTrigger>
                                    <div className='flex items-center gap-3 font-semibold text-md text-primary'>
                                        <h3 className='hidden sm:block'>Hi ! {user.firstname}</h3>
                                        <Avatar>
                                            <AvatarImage src={profileImg?.image} />
                                            <AvatarFallback>GM</AvatarFallback>
                                        </Avatar>
                                    </div>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-48 mr-5 mt-2">
                                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => navigate('/profile/' + user?.username)}>
                                        <PersonOutline fontSize='small' className='mr-4 text-primary' />View Profile
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => navigate('/me')}>
                                        <SettingsOutlined fontSize='small' className='mr-4 text-primary' />Profile Settings
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => navigate('/me/sortlist')}>
                                        <List fontSize='small' className='mr-4 text-primary' />View Sortlist
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => navigate('/privacy-policy')}>
                                        <LockOpenOutlined fontSize='small' className='mr-4 text-primary' />Privacy Policy</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => navigate('/contact-us')}>
                                        <AddIcCallOutlined fontSize='small' className='mr-4 text-primary' />Contact Us</DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => logout()}>
                                        <LogoutOutlined fontSize='small' className='mr-4 text-primary' />Log out
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu> :
                            <>
                                <Button className='p-2 lg:p-3 h-8 lg:h-9' onClick={() => navigate('/login')} >Login</Button>
                                <Button className='p-2 lg:p-3 h-8 lg:h-9' onClick={() => navigate('/register')}>Register</Button>
                            </>
                        }
                    </div>
                </div>
            </nav>
        </>
    )
}

export default Navbar