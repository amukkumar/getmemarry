import React, { useEffect, useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import ShortProfileRound from '../../components/global/shortprofileround'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import { useToast } from "@/components/ui/use-toast"
import { AddAPhoto, CardMembership, Edit, Email, Group, ListAlt, Password, PhoneAndroidRounded, RecentActors, TableChart, Verified } from '@mui/icons-material';
import Details from '../../components/global/details';
import useLoading from '../../hook/loading';
import Loading from '../../components/global/loading';
import { setUser } from '../../store/globalSlice';
import Stats from '../../components/global/stats';

const MyProfile = () => {

    const apiUrl = import.meta.env.VITE_API_URL;
    const user = useSelector((state) => state.global.user.payload);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { toast } = useToast();
    const { loading, startLoading, stopLoading } = useLoading();
    const [profile, setProfile] = useState();
    const [membership, setMembership] = useState();

    const getProfile = () => {
        startLoading();
        axios.get(apiUrl + 'profile_username.php', {
            params: {
                username: user?.username
            }
        })
            .then(function (response) {
                if (response.status == 200) {
                    setProfile(response.data.data);
                    dispatch(setUser({ ...user, ...{ "photo_confidential": response.data.data?.photo_confidential } }))
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

    const membershipLevel = () => {
        axios.get(apiUrl + 'membership_status.php', {
            params: {
                token: user.token,
            }
        })
            .then(function (response) {
                if (response.status == 200) {
                    setMembership(response.data);
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
    }

    useEffect(() => {
        getProfile();
        membershipLevel();
    }, [])

    return (
        <div className='bg'>
            <Loading loading={loading} />
            {!loading &&
                <div className='container lg:py-1 p-3'>
                    <div className='flex flex-col md:flex-row gap-3 py-3'>
                        <div className='w-1/4 hidden md:block'>
                            <ShortProfileRound profile={profile} />
                        </div>
                        <div className='flex flex-col gap-3'>
                            <Stats />
                            <div className='flex flex-col lg:flex-row gap-3 flex-1'>
                                <Card className='flex-1'>
                                    <CardContent className='py-2 px-3'>
                                        <h1 className='text-lg font-semibold'>Profile Details</h1>
                                        <div className='my-2 flex flex-col gap-3'>
                                            <Details title={"Membership Level"} text={membership?.membership} linktext="Upgrade Now" icon={<CardMembership className='text-primary' />} flag={false} />
                                            <Details title={"Recent Visitors"} text={profile?.recent} linktext="See profile" icon={<RecentActors className='text-primary' />} flag={false} />
                                            <Details title={"Verify Mobile number"} text={profile?.mobile} linktext={profile?.mobile_status == 0 ? "Verify Now" : profile?.mobile_status == 1 ? "Verified" : "Invaid"} icon={<PhoneAndroidRounded className='text-primary' />} verify={profile?.mobile_status} flag={true} mobile={true} />
                                            <Details title={"Verify Email address"} text={profile?.email} linktext={profile?.email_status == 0 ? "Verify Now" : profile?.email_status == 1 ? "Verified" : "Invaid"} icon={<Email className='text-primary' />} verify={profile?.email_status} flag={true} />
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card className='flex-1'>
                                    <CardContent className='py-2 px-3'>
                                        <h1 className='text-lg font-semibold'>Profile Setting</h1>
                                        <div className='my-2 flex flex-wrap gap-2'>
                                            <div className='w-full flex justify-between items-center cursor-pointer shadow-md border p-2 px-4 rounded-md' onClick={() => navigate("edit")}><span>Edit Profile</span><Edit className='text-primary' fontSize='small' /></div>
                                            <div className='w-full flex justify-between items-center cursor-pointer shadow-md border p-2 px-4 rounded-md' onClick={() => navigate("partner-prefrence")}><span>Set Preffered Partner</span><Group className='text-primary' fontSize='small' /></div>
                                            <div className='w-full flex justify-between items-center cursor-pointer shadow-md border p-2 px-4 rounded-md' onClick={() => navigate("add-horoscope")}><span>Add Horoscope</span><TableChart className='text-primary' fontSize='small' /></div>
                                            <div className='w-full flex justify-between items-center cursor-pointer shadow-md border p-2 px-4 rounded-md' onClick={() => navigate("add-photo")}><span>Add Photo</span><AddAPhoto className='text-primary' fontSize='small' /></div>
                                            <div className='w-full flex justify-between items-center cursor-pointer shadow-md border p-2 px-4 rounded-md' onClick={() => navigate("sortlist")}><span>View Sortlist</span><ListAlt className='text-primary' fontSize='small' /></div>
                                            <div className='w-full flex justify-between items-center cursor-pointer shadow-md border p-2 px-4 rounded-md' onClick={() => navigate("change-password")}><span>Change Password</span><Password className='text-primary' fontSize='small' /></div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div >
            }
        </div>
    )
}

export default MyProfile