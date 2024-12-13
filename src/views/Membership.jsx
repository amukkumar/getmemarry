import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import DownloadDoneOutlinedIcon from '@mui/icons-material/DownloadDoneOutlined';
import CloseIcon from '@mui/icons-material/Close';
import { Card, CardContent } from "@/components/ui/card"
import { useSelector } from 'react-redux';
import axios from 'axios';
import Loading from '../components/global/loading';
import useLoading from '../hook/loading';
import { useNavigate } from 'react-router-dom';


const Membership = () => {

    const apiUrl = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();
    const token = useSelector((state) => state.global.token);
    const user = useSelector((state) => state.global.user.payload);
    const { loading, startLoading, stopLoading } = useLoading();
    const [membership, setMembership] = useState({ membership_plans: [] });
    const [profile, setProfile] = useState({});

    const getProfile = () => {
        startLoading();
        axios.get(apiUrl + 'profile.php', {
            params: {
                id: user?.id,
            }
        })
            .then(function (response) {
                if (response.status == 200) {
                    setProfile(response.data);
                }
                else {
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

    const handlePayment = (item) => {
        if (token.payload)
            handleSubmit(item);
        else
            navigate('/login')
    }

    const handleSubmit = (item) => {
        // Create a query string for the GET request
        const queryString = new URLSearchParams({
            txtpromocode: '',
            txtmembershiptype: item.membership_name,
            token: token.payload // Ensure this is valid and defined in the scope
        }).toString();

        // Construct the full URL with the query string
        const actionUrl = `${apiUrl}getorderid_amuk.php?${queryString}`;

        // Redirect to the URL (GET request)
        window.location.href = actionUrl;
    };

    const getMembership = () => {
        startLoading();
        axios.get(apiUrl + 'membership_plans.php')
            .then(function (response) {
                if (response.status == 200) {
                    setMembership(response.data.data);
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
        getMembership();
        getProfile();
    }, [])
    return (
        <div className='bg'>
            <Loading loading={loading} />
            {!loading && <div className='container p-3'>
                <div id="pricing" className="container-fluid py-0 wow fadeInUp" data-wow-delay="0.1s">
                    <div className="pt-5">
                        <div className="section-title text-center relative pb-3 mt-6 mb-8">
                            <h5 className="font-bold text-2xl text-primary uppercase">Membership Plans</h5>
                            <p className="font-bold text-4xl">Competitive Prices only for you</p>
                        </div>
                        <Carousel
                            className="w-full p-0 lg:p-5"
                            opts={{
                                align: "start",
                                loop: true,
                            }}
                        >
                            <CarouselContent className="-ml-1">
                                {membership.membership_plans.map((item, index) => (
                                    <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3">
                                        <Card className="wow slideInUp" data-wow-delay="0.4s">
                                            <CardContent className="rounded-md p-0">
                                                <div className="text-center py-4 px-5">
                                                    <h4 className="text-primary text-3xl font-semibold underline">{item.membership_name}</h4>
                                                </div>
                                                <div className="flex justify-center pb-3 text-gray-500">
                                                    <h1 className="text-2xl font-semibold align-middle">
                                                        <small className="text-sm align-top">₹</small><strike className="text-red-600"><span className='text-gray-500'>{item.original_pricing}</span></strike><small
                                                            className="align-bottom text-sm"> /{item.validity_months} Month</small>
                                                    </h1>
                                                </div>
                                                <div className="flex justify-center px-5">
                                                    <h1 className="text-5xl font-semibold align-middle">
                                                        <small className="text-2xl align-top">₹</small>{item.discounted_pricing}<small
                                                            className="align-bottom text-2xl"> /{item.validity_months} Month</small>
                                                    </h1>
                                                </div>
                                                <div className='p-5 mt-8'>
                                                    <div className="flex justify-between items-center mb-2 text-sm odd:bg-white even:bg-slate-50">
                                                        <span>{membership.membership_properties.create_profile}</span>
                                                        {item.create_profile == "yes" ? <DownloadDoneOutlinedIcon className='text-green-600' /> : <CloseIcon className='text-red-600' />}
                                                    </div>
                                                    <div className="flex justify-between items-center mb-2 text-sm odd:bg-white even:bg-slate-50">
                                                        <span>{membership.membership_properties.horoscope}</span>
                                                        {item.horoscope == "yes" ? <DownloadDoneOutlinedIcon className='text-green-600' /> : <CloseIcon className='text-red-600' />}
                                                    </div>
                                                    <div className="flex justify-between items-center mb-2 text-sm odd:bg-white even:bg-slate-50">
                                                        <span>{membership.membership_properties.send_interest}</span>
                                                        {item.send_interest == "yes" ? <DownloadDoneOutlinedIcon className='text-green-600' /> : <CloseIcon className='text-red-600' />}
                                                    </div>
                                                    <div className="flex justify-between items-center mb-2 text-sm odd:bg-white even:bg-slate-50">
                                                        <span>{membership.membership_properties.featured_member}</span>
                                                        {item.featured_member == "yes" ? <DownloadDoneOutlinedIcon className='text-green-600' /> : <CloseIcon className='text-red-600' />}
                                                    </div>
                                                    <div className="flex justify-between items-center mb-2 text-sm odd:bg-white even:bg-slate-50">
                                                        <span>{membership.membership_properties.regular_email}</span>
                                                        {item.regular_email == "yes" ? <DownloadDoneOutlinedIcon className='text-green-600' /> : <CloseIcon className='text-red-600' />}
                                                    </div>
                                                    <div className="flex justify-between items-center mb-2 text-sm odd:bg-white even:bg-slate-50">
                                                        <span>{membership.membership_properties.view_contact}</span>
                                                        <h1>{item.view_contact}</h1>
                                                    </div>
                                                    <div className="flex justify-between items-center mb-2 text-sm odd:bg-white even:bg-slate-50">
                                                        <span>{membership.membership_properties.contact_profile}</span>
                                                        {item.contact_profile == "yes" ? <DownloadDoneOutlinedIcon className='text-green-600' /> : <CloseIcon className='text-red-600' />}
                                                    </div>

                                                    <div className="flex justify-between items-center mb-2 text-sm odd:bg-white even:bg-slate-50">
                                                        <span>{membership.membership_properties.send_rec_message}</span>
                                                        {item.send_rec_message == "yes" ? <DownloadDoneOutlinedIcon className='text-green-600' /> : <CloseIcon className='text-red-600' />}
                                                    </div>

                                                    <div className='text-center'>
                                                        <Button className="py-2 px-4 mt-4" onClick={() => handlePayment(item)}>Subscribe Now</Button>
                                                    </div>

                                                </div>
                                            </CardContent>
                                        </Card>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                            <CarouselPrevious className="left-0.5 lg:left-3.5 bg-primary text-white" />
                            <CarouselNext className="right-0 lg:right:0.5 bg-primary text-white" />
                        </Carousel>
                    </div>
                </div >
            </div >}
        </div >
    )
}

export default Membership