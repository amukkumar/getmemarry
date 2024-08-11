import React, { useEffect, useState } from 'react'
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import AppShortcutOutlinedIcon from '@mui/icons-material/AppShortcutOutlined';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast"
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import { Add, AddAPhoto, Telegram } from '@mui/icons-material';
import Error404 from '../components/global/error404';
import Loading from '../components/global/loading';
import useLoading from '../hook/loading';
import ViewContact from '../components/global/viewcontact';
import CancelProfile from '../components/global/cancelprofile';

const Profile = () => {

    const apiUrl = import.meta.env.VITE_API_URL;
    const user = useSelector((state) => state.global.user.payload);
    const { loading, startLoading, stopLoading } = useLoading();
    const { toast } = useToast();
    const { id } = useParams();
    const navigate = useNavigate();
    const [profile, setProfile] = useState({});
    const [image, setImage] = useState([]);
    const [fullScreen, setFullScreen] = useState(false);

    const getProfile = () => {
        startLoading();
        axios.get(apiUrl + 'profile_username.php', {
            params: {
                username: id,
            }
        })
            .then(function (response) {
                if (response.status == 200) {
                    setProfile(response.data);
                    for (let i = 1; i <= 5; i++) {
                        fetchProfileImg(response.data.data.id, i);
                    }
                }
                else {
                    toast({
                        variant: "destructive",
                        description: response.data.message,
                    })
                    setProfile(null);
                }
            })
            .catch(function (error) {
                console.log(error);
                setProfile(null);
            })
            .finally(function () {
                stopLoading();
            })
    }

    const fetchProfileImg = async (id, index) => {
        startLoading();
        try {
            const response = await axios.get(apiUrl + 'image_api/getsnap_amuk.php', {
                params: {
                    id: id,
                    typ: "full",
                    picid: index
                }
            });
            setImage(prevImages => [{ original: response.data.image }, ...prevImages]);
        } catch (error) {
            console.error('Error fetching captcha:', error);
        }
        stopLoading();
    };

    const renderItem = (item) => {
        return (
            <div className={`flex justify-center items-center w-full ${fullScreen ? "h-screen" : "h-full"}`}>
                <img
                    src={item.original}
                    alt={item.originalAlt}
                    style={{ maxHeight: !fullScreen ? "450px" : "calc(100vh - 80px)", minHeight: "450px", width: "auto" }}
                />
            </div>
        );
    };

    const sendIntrest = () => {
        if (!user) {
            navigate('/login');
            return;
        }
        startLoading();
        axios.get(apiUrl + 'expInterest.php', {
            params: {
                token: user.token,
                act: "save",
                ref_id: profile?.data?.id,
            }
        })
            .then(function (response) {
                if (response.status == 200) {
                    toast({
                        variant: "success",
                        description: response.data.message,
                    })
                }
                else {
                    toast({
                        variant: "destructive",
                        description: response.data.message,
                    })
                }
            })
            .catch(function (error) {
                toast({
                    variant: "destructive",
                    description: error.response.data.message,
                })
            })
            .finally(function () {
                stopLoading();
            });
    }

    const photoRequest = () => {
        if (!user) {
            navigate('/login');
            return;
        }
        startLoading();
        axios.get(apiUrl + 'photorequest.php', {
            params: {
                token: user.token,
                ref_id: profile?.data?.id,
            }
        })
            .then(function (response) {
                if (response.status == 200) {
                    toast({
                        variant: "success",
                        description: response.data.message,
                    })
                }
                else {
                    toast({
                        variant: "destructive",
                        description: response.data.message,
                    })
                }
            })
            .catch(function (error) {
                toast({
                    variant: "destructive",
                    description: error.response.data.message,
                })
            })
            .finally(function () {
                stopLoading();
            });
    }

    const addSortlist = () => {
        if (!user) {
            navigate('/login');
            return;
        }
        startLoading();
        axios.get(apiUrl + 'watchedprofiles.php', {
            params: {
                token: user?.token,
                act: "save",
                ref_id: profile?.data?.id
            }
        })
            .then(function (response) {
                if (response.data.success) {
                    toast({
                        variant: "success",
                        description: response.data.message,
                    })
                }
                else {
                    toast({
                        variant: "destructive",
                        description: response.data.message,
                    })
                }
            })
            .catch(function (error) {
                console.log(error);
            })
            .finally(function () {
                stopLoading();
            });
    }

    useEffect(() => {
        getProfile();
    }, [])

    return (
        <div className='bg'>
            <Loading loading={loading} />
            {profile?.data?.id > 0 && <>
                {profile?.success == true ?
                    <div className='container p-3'>
                        <div className='flex flex-col md:flex-row gap-2 mb-2'>
                            <div className="flex-1 flex flex-col items-center gap-0">
                                <div className='w-full text-white bg-primary rounded-t-md p-1 px-3 flex justify-between gap-2'>
                                    <p className='text-sm font-bold'>ID: {profile?.data?.username}</p>
                                    <AppShortcutOutlinedIcon fontSize='small' />
                                </div>
                                <ImageGallery
                                    renderItem={renderItem}
                                    showFullscreenButton={true}
                                    showPlayButton={true}
                                    showThumbnails={false}
                                    onScreenChange={(val) => {
                                        setFullScreen(val);
                                    }}
                                    items={image} />
                            </div>
                            <div className='flex-1 border w-full flex flex-col rounded-t-md'>
                                {profile?.data?.id !== user?.id ?
                                    <div className='flex w-full flex-wrap gap-2'>
                                        <Button className='flex-1 text-sm' size="sm" onClick={sendIntrest}>Send Intrest<Telegram sx={{ fontSize: "20px", marginLeft: "5px" }} /></Button>
                                        <Button className='flex-1 text-sm' size="sm" onClick={photoRequest}>Photo Request<AddAPhoto sx={{ fontSize: "20px", marginLeft: "5px" }} /></Button>
                                        <ViewContact id={profile?.data?.id} />
                                        <Button className='flex-1 text-sm' size="sm" onClick={addSortlist}>Add Shortlist<Add sx={{ fontSize: "20px", marginLeft: "5px" }} /></Button>
                                    </div> :
                                    <div className='flex w-full flex-wrap gap-2'>
                                        <Button className='flex-1 text-sm' size="sm">Horoscope<Telegram sx={{ fontSize: "20px", marginLeft: "5px" }} /></Button>
                                        <CancelProfile />
                                    </div>
                                }
                                <Table>
                                    <TableBody>
                                        <TableRow className="odd:bg-white even:bg-slate-50 col-span-2">
                                            <TableCell colSpan={2} className="font-sm p-1 pl-5 font-bold text-primary">Personal Details [Last Login: {profile?.data?.lastvisit}]</TableCell>
                                        </TableRow>
                                        <TableRow className="odd:bg-white even:bg-slate-50">
                                            <TableCell className="font-sm p-1 pl-5 w-[200px] font-semibold">Created by:</TableCell>
                                            <TableCell className="font-sm p-1">{profile?.data?.profile_created}</TableCell>
                                        </TableRow>
                                        <TableRow className="odd:bg-white even:bg-slate-50">
                                            <TableCell className="font-sm p-1 pl-5 w-[200px] font-semibold">First Name:</TableCell>
                                            <TableCell className="font-sm p-1">{profile?.data?.firstname}</TableCell>
                                        </TableRow>
                                        <TableRow className="odd:bg-white even:bg-slate-50">
                                            <TableCell className="font-sm p-1 pl-5 w-[200px] font-semibold">Last Name:</TableCell>
                                            <TableCell className="font-sm p-1">{profile?.data?.lastname}</TableCell>
                                        </TableRow>
                                        <TableRow className="odd:bg-white even:bg-slate-50">
                                            <TableCell className="font-sm p-1 pl-5 w-[200px] font-semibold">Birth date / Age:</TableCell>
                                            <TableCell className="font-sm p-1">{`${dayjs(profile.data?.birth_date).format('DD-MMM-YYYY')} / ${dayjs().diff(profile.data?.birth_date, 'year')}`}</TableCell>
                                        </TableRow>
                                        <TableRow className="odd:bg-white even:bg-slate-50">
                                            <TableCell className="font-sm p-1 pl-5 w-[200px] font-semibold">Gender:</TableCell>
                                            <TableCell className="font-sm p-1">{profile.data?.gender == 'f' ? "Female" : "Male"}</TableCell>
                                        </TableRow>
                                        <TableRow className="odd:bg-white even:bg-slate-50">
                                            <TableCell className="font-sm p-1 pl-5 w-[200px] font-semibold">Marital Status:</TableCell>
                                            <TableCell className="font-sm p-1">{profile.data?.maritalstatus}</TableCell>
                                        </TableRow>
                                        <TableRow className="odd:bg-white even:bg-slate-50">
                                            <TableCell className="font-sm p-1 pl-5 w-[200px] font-semibold">Height:</TableCell>
                                            <TableCell className="font-sm p-1">{profile?.data?.height}</TableCell>
                                        </TableRow>
                                        <TableRow className="odd:bg-white even:bg-slate-50">
                                            <TableCell className="font-sm p-1 pl-5 w-[200px] font-semibold">Gotra(m):</TableCell>
                                            <TableCell className="font-sm p-1">{profile?.data?.gotra}</TableCell>
                                        </TableRow>
                                        <TableRow className="odd:bg-white even:bg-slate-50">
                                            <TableCell className="font-sm p-1 pl-5 w-[200px] font-semibold">Religion:</TableCell>
                                            <TableCell className="font-sm p-1">{profile?.data?.religion}</TableCell>
                                        </TableRow>
                                        <TableRow className="odd:bg-white even:bg-slate-50">
                                            <TableCell className="font-sm p-1 pl-5 w-[200px] font-semibold">Mother Tongue:</TableCell>
                                            <TableCell className="font-sm p-1">{profile?.data?.mother_tongue}</TableCell>
                                        </TableRow>
                                        <TableRow className="odd:bg-white even:bg-slate-50">
                                            <TableCell className="font-sm p-1 pl-5 w-[200px] font-semibold">Caste:</TableCell>
                                            <TableCell className="font-sm p-1">{profile?.data?.caste}</TableCell>
                                        </TableRow>
                                        <TableRow className="odd:bg-white even:bg-slate-50">
                                            <TableCell className="font-sm p-1 pl-5 w-[200px] font-semibold">Manglik/Kuja Dosham:</TableCell>
                                            <TableCell className="font-sm p-1">{profile?.data?.manglik}</TableCell>
                                        </TableRow>
                                        <TableRow className="odd:bg-white even:bg-slate-50">
                                            <TableCell className="font-sm p-1 pl-5 w-[200px] font-semibold">About Myself/Partner:</TableCell>
                                            <TableCell className="font-sm p-1">{profile?.data?.about_me}</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                        <div className='grid md:grid-cols-2 gap-2'>
                            <div className='border w-full rounded-t-md'>
                                <div className='text-white bg-primary rounded-t-md p-1 px-3 flex justify-between gap-2'>
                                    <p className='text-sm font-bold'>Location</p>
                                </div>
                                <Table>
                                    <TableBody>
                                        {profile?.data?.id == user?.id ?
                                            <>
                                                <TableRow className="odd:bg-white even:bg-slate-50">
                                                    <TableCell className="font-sm p-1 pl-5 w-[200px] font-semibold">Address:</TableCell>
                                                    <TableCell className="font-sm p-1">{profile?.data?.address_line1}</TableCell>
                                                </TableRow>
                                                <TableRow className="odd:bg-white even:bg-slate-50">
                                                    <TableCell className="font-sm p-1 pl-5 w-[200px] font-semibold">Email Id:</TableCell>
                                                    <TableCell className="font-sm p-1">{profile?.data?.email}</TableCell>
                                                </TableRow>
                                                <TableRow className="odd:bg-white even:bg-slate-50">
                                                    <TableCell className="font-sm p-1 pl-5 w-[200px] font-semibold">Alternate Phone:</TableCell>
                                                    <TableCell className="font-sm p-1">{profile?.data?.phone}</TableCell>
                                                </TableRow>
                                                <TableRow className="odd:bg-white even:bg-slate-50">
                                                    <TableCell className="font-sm p-1 pl-5 w-[200px] font-semibold">Mobile:</TableCell>
                                                    <TableCell className="font-sm p-1">{profile?.data?.mobile}</TableCell>
                                                </TableRow>
                                            </> : ""
                                        }
                                        <TableRow className="odd:bg-white even:bg-slate-50">
                                            <TableCell className="font-sm p-1 pl-5 w-[200px] font-semibold">City:</TableCell>
                                            <TableCell className="font-sm p-1">{profile?.data?.city}</TableCell>
                                        </TableRow>
                                        <TableRow className="odd:bg-white even:bg-slate-50">
                                            <TableCell className="font-sm p-1 pl-5 w-[200px] font-semibold">State:</TableCell>
                                            <TableCell className="font-sm p-1">{profile?.data?.statename}</TableCell>
                                        </TableRow>
                                        <TableRow className="odd:bg-white even:bg-slate-50">
                                            <TableCell className="font-sm p-1 pl-5 w-[200px] font-semibold">Country:</TableCell>
                                            <TableCell className="font-sm p-1">{profile?.data?.countryname}</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </div>
                            <div className='border w-full rounded-t-md'>
                                <div className='text-white bg-primary rounded-t-md p-1 px-3 flex justify-between gap-2'>
                                    <p className='text-sm font-bold'>Professional Details</p>
                                </div>
                                <Table>
                                    <TableBody>
                                        <TableRow className="odd:bg-white even:bg-slate-50">
                                            <TableCell className="font-sm p-1 pl-5 w-[200px] font-semibold">Qualification:</TableCell>
                                            <TableCell className="font-sm p-1">{profile?.data?.qualification}</TableCell>
                                        </TableRow>
                                        <TableRow className="odd:bg-white even:bg-slate-50">
                                            <TableCell className="font-sm p-1 pl-5 w-[200px] font-semibold">Employed In:</TableCell>
                                            <TableCell className="font-sm p-1">{profile?.data?.employed_in}</TableCell>
                                        </TableRow>
                                        <TableRow className="odd:bg-white even:bg-slate-50">
                                            <TableCell className="font-sm p-1 pl-5 w-[200px] font-semibold">Profession:</TableCell>
                                            <TableCell className="font-sm p-1">{profile?.data?.profession_str}</TableCell>
                                        </TableRow>
                                        <TableRow className="odd:bg-white even:bg-slate-50">
                                            <TableCell className="font-sm p-1 pl-5 w-[200px] font-semibold">Annual income:</TableCell>
                                            <TableCell className="font-sm p-1">{profile?.data?.income}</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                        <div className='grid md:grid-cols-2 gap-2 mt-2'>
                            <div className='border w-full rounded-t-md'>
                                <div className='text-white bg-primary rounded-t-md p-1 px-3 flex justify-between gap-2'>
                                    <p className='text-sm font-bold'>Basic Information</p>
                                </div>
                                <Table>
                                    <TableBody>
                                        <TableRow className="odd:bg-white even:bg-slate-50">
                                            <TableCell className="font-sm p-1 pl-5 w-[200px] font-semibold">Horoscope:</TableCell>
                                            <TableCell className="font-sm p-1">{profile?.data?.horoscope}</TableCell>
                                        </TableRow>
                                        <TableRow className="odd:bg-white even:bg-slate-50">
                                            <TableCell className="font-sm p-1 pl-5 w-[200px] font-semibold">Birth Place / Time:</TableCell>
                                            <TableCell className="font-sm p-1">{`${profile?.data?.birth_city} / ${profile?.data?.birth_hr}:${profile?.data?.birth_min}`}</TableCell>
                                        </TableRow>
                                        <TableRow className="odd:bg-white even:bg-slate-50">
                                            <TableCell className="font-sm p-1 pl-5 w-[200px] font-semibold">Complexion:</TableCell>
                                            <TableCell className="font-sm p-1">{profile?.data?.complexion}</TableCell>
                                        </TableRow>
                                        <TableRow className="odd:bg-white even:bg-slate-50">
                                            <TableCell className="font-sm p-1 pl-5 w-[200px] font-semibold">Special case:</TableCell>
                                            <TableCell className="font-sm p-1">{profile?.data?.special_cases}</TableCell>
                                        </TableRow>
                                        <TableRow className="odd:bg-white even:bg-slate-50">
                                            <TableCell className="font-sm p-1 pl-5 w-[200px] font-semibold">Diet:</TableCell>
                                            <TableCell className="font-sm p-1">{profile?.data?.diet}</TableCell>
                                        </TableRow>
                                        <TableRow className="odd:bg-white even:bg-slate-50">
                                            <TableCell className="font-sm p-1 pl-5 w-[200px] font-semibold">Smoke:</TableCell>
                                            <TableCell className="font-sm p-1">{profile?.data?.smoke}</TableCell>
                                        </TableRow>
                                        <TableRow className="odd:bg-white even:bg-slate-50">
                                            <TableCell className="font-sm p-1 pl-5 w-[200px] font-semibold">Drink:</TableCell>
                                            <TableCell className="font-sm p-1">{profile?.data?.drink}</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </div>
                            <div className='border w-full rounded-t-md'>
                                <div className='text-white bg-primary rounded-t-md p-1 px-3 flex justify-between gap-2'>
                                    <p className='text-sm font-bold'>Family Detail</p>
                                </div>
                                <Table>
                                    <TableBody>
                                        <TableRow className="odd:bg-white even:bg-slate-50">
                                            <TableCell className="font-sm p-1 pl-5 w-[200px] font-semibold">Father Occupation:</TableCell>
                                            <TableCell className="font-sm p-1">{profile?.data?.f_occupation}</TableCell>
                                        </TableRow>
                                        <TableRow className="odd:bg-white even:bg-slate-50">
                                            <TableCell className="font-sm p-1 pl-5 w-[200px] font-semibold">Mother Occupation:</TableCell>
                                            <TableCell className="font-sm p-1">{profile?.data?.m_occupation}</TableCell>
                                        </TableRow>
                                        <TableRow className="odd:bg-white even:bg-slate-50">
                                            <TableCell className="font-sm p-1 pl-5 w-[200px] font-semibold">Brother(s):</TableCell>
                                            <TableCell className="font-sm p-1">{profile?.data?.brother}</TableCell>
                                        </TableRow>
                                        <TableRow className="odd:bg-white even:bg-slate-50">
                                            <TableCell className="font-sm p-1 pl-5 w-[200px] font-semibold">Sister(s):</TableCell>
                                            <TableCell className="font-sm p-1">{profile?.data?.sister}</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    </div> :
                    <Error404 />
                }
            </>}
        </div >
    )
}

export default Profile