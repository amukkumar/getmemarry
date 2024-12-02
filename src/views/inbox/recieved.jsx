import React, { useEffect, useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import axios from 'axios';
import AvatarPic from './avatar';
import useLoading from '../../hook/loading';
import Loading from '../../components/global/loading';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Received = () => {

    const apiUrl = import.meta.env.VITE_API_URL;
    const user = useSelector((state) => state.global.user.payload);
    const navigate = useNavigate();
    const { toast } = useToast();
    const { loading, startLoading, stopLoading } = useLoading();
    const [profile, setProfile] = useState([]);

    const getRecieved = () => {
        startLoading();
        axios.get(apiUrl + 'showReceivedExpInterest.php', {
            params: {
                token: user.token,
            }
        })
            .then(function (response) {
                if (response.status == 200) {
                    setProfile(response.data.data);
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

    const acceptInterest = (id, listid) => {
        startLoading();
        axios.get(apiUrl + 'expInterest.php', {
            params: {
                token: user.token,
                remove: 0,
                ref_id: id,
                id: listid,
            }
        })
            .then(function (response) {
                if (response.status == 200) {
                    toast({
                        variant: "success",
                        description: response.data.message,
                    })
                    getRecieved();
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

    const declineInterest = (id, listid) => {
        startLoading();
        axios.get(apiUrl + 'expInterest.php', {
            params: {
                token: user.token,
                remove: 1,
                ref_id: id,
                id: listid,
            }
        })
            .then(function (response) {
                if (response.status == 200) {
                    toast({
                        variant: "success",
                        description: response.data.message,
                    })
                    getRecieved();
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
        getRecieved();
    }, [])

    return (
        <div className='flex flex-col gap-2'>
            <Loading loading={loading} />
            {profile.map((item, index) => {
                return (
                    <Card key={index} className='mx-2 cursor-pointer' onClick={() => navigate('/profile/' + item.ref_username)}>
                        <CardContent className="flex justify-between items-center p-2">
                            <div className='flex gap-2 items-center'>
                                <AvatarPic id={item.ref_userid} />
                                <h1>{item.ref_firstname} ({item.ref_username})</h1>
                            </div>

                            <div className='flex gap-2'>
                                <Button className='bg-green-600' onClick={(e) => { e.stopPropagation(); acceptInterest(item.ref_userid, item?.lisid) }}>Accept</Button>
                                <Button className='bg-red-600 text-white rounded-md p-2' onClick={(e) => { e.stopPropagation(); declineInterest(item.ref_userid, item?.lisid) }}>Decline</Button>
                            </div>

                        </CardContent>
                    </Card>
                )
            })}
        </div>
    )
}

export default Received