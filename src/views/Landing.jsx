import React, { useEffect } from 'react';
import '../lib/animate/animate.css';
import WOW from 'wow.js';
import { Card, CardContent } from "@/components/ui/card"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import img from '../assets/img/carousel-bg.jpg';
import img1 from '../assets/img/SM62778.jpg'
import DownloadDoneOutlinedIcon from '@mui/icons-material/DownloadDoneOutlined';
import CallIcon from '@mui/icons-material/Call';
import { useDispatch, useSelector } from 'react-redux';
import { setPartner } from '../store/globalSlice';
import { useNavigate } from 'react-router-dom';
import FeatureProfile from '../components/global/featureprofile';

const Landing = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const resource = useSelector((state) => state.global.resource.payload);

    const formSchema = z.object({
        lookingfor: z.string().min(1, {
            message: "Please select looking for.",
        }),
        ageto: z.string().min(2, {
            message: "Please select age.",
        }),
        agefrom: z.string().min(2, {
            message: "Please select age.",
        }),
        religion: z.string().min(0, {
            message: "Please select religion.",
        }),
        maritalstatus: z.string().min(0, {
            message: "Please select mother tounge.",
        }),
    })

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            lookingfor: "F",
            agefrom: "18",
            ageto: "50",
            religion: "",
            maritalstatus: "",
        },
    })

    const onSubmit = (values) => {
        dispatch(setPartner(values));
        navigate('/search/searchresult/1')
    }

    useEffect(() => {
        new WOW().init();
    }, [])

    return (
        <div className='bg'>
            <div className='relative'>
                <div>
                    <img className="bg-header h-[700px] md:h-[550px] w-screen object-cover" src={img} alt="Image" />
                </div>
                <div className="carousel-caption flex flex-col items-center justify-end pb-10 mt-40 md:mt-0">
                    <div className="text-center">
                        <h5 className="uppercase text-2xl font-semibold mb-10 text-primary animated slideInDown">#1 MATRIMONY</h5>
                        <h1 className="text-5xl mb-6 p-3 font-bold tracking-tight lg:text-6xl text-green-600 animated zoomIn">Where Happily Ever After Begins!</h1>
                        <div className='m-3 flex justify-center text-start'>
                            <Card className="w-full bg-white rounded-md">
                                <CardContent className="p-3 lg:p-5">
                                    <Form {...form}>
                                        <form onSubmit={form.handleSubmit(onSubmit)}>
                                            <div className='flex flex-col sm:flex-row items-auto sm:items-end gap-2'>
                                                <FormField
                                                    control={form.control}
                                                    name="lookingfor"
                                                    render={({ field }) => (
                                                        <FormItem className="space-y-1 flex-1">
                                                            <FormLabel>I'm looking for</FormLabel>
                                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                <FormControl>
                                                                    <SelectTrigger>
                                                                        <SelectValue placeholder="I'm looking for" />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent>
                                                                    <SelectItem value="M">Groom</SelectItem>
                                                                    <SelectItem value="F">Bride</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <div className='flex items-end flex-1 gap-2'>
                                                    <FormField
                                                        control={form.control}
                                                        name="agefrom"
                                                        render={({ field }) => (
                                                            <FormItem className="space-y-1 flex-1">
                                                                <FormLabel>Age</FormLabel>
                                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                    <FormControl>
                                                                        <SelectTrigger>
                                                                            <SelectValue placeholder="" />
                                                                        </SelectTrigger>
                                                                    </FormControl>
                                                                    <SelectContent>
                                                                        {Array.from({ length: 70 - 18 + 1 }, (_, i) => 18 + i).map((num, index) => (
                                                                            <SelectItem key={index} value={`${num}`}>{num}</SelectItem>
                                                                        ))}
                                                                    </SelectContent>
                                                                </Select>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <p className='mb-2'>to</p>
                                                    <FormField
                                                        control={form.control}
                                                        name="ageto"
                                                        render={({ field }) => (
                                                            <FormItem className="space-y-1 flex-1">
                                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                    <FormControl>
                                                                        <SelectTrigger>
                                                                            <SelectValue placeholder="" />
                                                                        </SelectTrigger>
                                                                    </FormControl>
                                                                    <SelectContent>
                                                                        {Array.from({ length: 70 - 29 + 1 }, (_, i) => 29 + i).map((num, index) => (
                                                                            <SelectItem key={index} value={`${num}`}>{num}</SelectItem>
                                                                        ))}
                                                                    </SelectContent>
                                                                </Select>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                                <FormField
                                                    control={form.control}
                                                    name="maritalstatus"
                                                    render={({ field }) => (
                                                        <FormItem className="space-y-1">
                                                            <FormLabel>Marital Status</FormLabel>
                                                            <Select onValueChange={field.onChange} value={field.value}>
                                                                <FormControl>
                                                                    <SelectTrigger>
                                                                        <SelectValue placeholder="Doesn't Matter" />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent>
                                                                    <SelectItem value="Unmarried">Unmarried</SelectItem>
                                                                    <SelectItem value="Divorced">Divorced</SelectItem>
                                                                    <SelectItem value="Widow/Widower">Widow/Widower</SelectItem>
                                                                    <SelectItem value="Saparated">Saparated</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="religion"
                                                    render={({ field }) => (
                                                        <FormItem className="space-y-1 flex-1">
                                                            <FormLabel>Community</FormLabel>
                                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                <FormControl>
                                                                    <SelectTrigger>
                                                                        <SelectValue placeholder="Doesn't Matter" />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent>
                                                                    {resource?.religion?.map((item, index) => {
                                                                        return (
                                                                            <SelectItem key={index} value={item.key}>{item.value}</SelectItem>
                                                                        )
                                                                    })}
                                                                </SelectContent>
                                                            </Select>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <Button className="mt-3 md:mt-0" type="submit">Search Partner</Button>
                                            </div>
                                        </form>
                                    </Form>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>

            <div id="about" className="mt-24 container-fluid wow fadeInUp" data-wow-delay="0.1s">
                <div className="container p-3 lg:p-5">
                    <div className="grid lg:grid-cols-7 grid-cols-1 gap-8">
                        <div className="col-span-4">
                            <div className="relative min-h-full">
                                <img className="lg:absolute w-100 min-h-full rounded wow zoomIn" data-wow-delay="0.9s"
                                    src={img1} style={{ objectFit: "cover" }} />
                            </div>
                        </div>

                        <div className="col-span-3">
                            <div className="section-title relative pb-3 mb-5">
                                <h5 className="font-bold text-2xl text-primary uppercase">About Us</h5>
                                <h1 className="font-bold text-4xl">Explore GetmeMarry!</h1>
                            </div>
                            <p className="mb-4">At GetmeMarry, we believe in the magic of love and the enchantment of
                                unforgettable unions. Our platform is dedicated to bringing together individuals who seek to
                                share their lives with their perfect match, creating a journey filled with love, elegance, and
                                royalty. With meticulous attention to detail and a passion for making dreams come true, we are
                                committed to making your wedding planning and partner search experience regally splendid.</p>
                            <div className="grid grid-cols-2 mb-3">
                                <div className="col-span-1 wow zoomIn" data-wow-delay="0.2s">
                                    <h5 className="mb-3 font-semibold"><DownloadDoneOutlinedIcon className='text-primary mr-5' />Find Best Match</h5>
                                    <h5 className="mb-3 font-semibold"><DownloadDoneOutlinedIcon className='text-primary mr-5' />Professional Staff</h5>
                                </div>
                                <div className="col-span-1 wow zoomIn" data-wow-delay="0.4s">
                                    <h5 className="mb-3 font-semibold"><DownloadDoneOutlinedIcon className='text-primary mr-5' />24/7 Support</h5>
                                    <h5 className="mb-3 font-semibold"><DownloadDoneOutlinedIcon className='text-primary mr-5' />Fair Prices</h5>
                                </div>
                            </div>
                            <div className="flex items-center mb-4 wow fadeIn" data-wow-delay="0.6s">
                                <div className="bg-primary text-white flex items-center justify-center rounded p-2">
                                    <CallIcon sx={{ fontSize: "40px" }} />
                                </div>
                                <div className="ps-4">
                                    <h5 className="mb-1 font-bold text-xl">Call to ask any question</h5>
                                    <h4 className="text-primary mb-0 font-bold text-2xl">+91 99807 81978</h4>
                                </div>
                            </div>
                            <Button size="lg" className="animated zoomIn h-12" onClick={() => navigate('/contact-us')}>Request A Quote</Button>
                        </div>
                    </div>
                </div >
            </div >

            <FeatureProfile />
        </div>
    );
};

export default Landing;