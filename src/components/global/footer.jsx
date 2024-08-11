import { Phone } from '@mui/icons-material';
import React, { useEffect } from 'react'
import playstore from '../../assets/img/playstore.png'
import WOW from 'wow.js';

const Footer = () => {

    useEffect(() => {
        new WOW().init();
    }, [])

    return (
        <>
            <footer className='bg-orange-50 shadow-lg'>
                <div id="contact" className="container-fluid bg-dark text-light wow fadeInUp" data-wow-delay="0.1s">
                    <div className="w-full p-0">
                        <div className="flex flex-col lg:flex-row gap-0">
                            <div className="p-4 border py-16 odd:bg-white even:bg-slate-50 w-full lg:w-1/3 flex flex-col items-center">
                                <div className="section-title sm relative pb-3 mb-4">
                                    <h3 className="text-xl font-semibold">Main Branch</h3>
                                </div>
                                <div className="flex mb-2">
                                    <p className="mb-0">Getmemarry.com Matrimony Center</p>
                                </div>
                                <div className="text-center mb-2">
                                    <p className="mb-0">SIA Infotech
                                        #42, 1st Floor, 2nd Cross,
                                        OMBR Layout (besides St. George College) Banaswadi
                                        Bangalore - 560043 India</p>
                                </div>
                                <div className="flex gap-2 mb-2">
                                    <Phone className='bg-primary text-white rounded-sm p-1' />
                                    <p className="mb-0">+91-9980781978</p>
                                </div>
                            </div>
                            <div className="p-4 border py-16 odd:bg-white even:bg-slate-50 w-full lg:w-1/3 flex flex-col items-center">
                                <div className="section-title sm relative pb-3 mb-4">
                                    <h3 className="text-xl font-semibold">Second Branch</h3>
                                </div>
                                <div className="flex mb-2">
                                    <p className="mb-0">Getmemarry.com Matrimony Center</p>
                                </div>
                                <div className="text-center mb-2">
                                    <p className="mb-0">SIA Infotech
                                        Plot No : 37, 1st Floor, Above Gayatri Medical Store
                                        Shastri Nagar Chowk, Nagar Road,
                                        Pune - 411006 India</p>
                                </div>
                                <div className="flex gap-2 items-center mb-2">
                                    <Phone className='bg-primary text-white rounded-sm p-1' />
                                    <p className="mb-0">+91-9980781978</p>
                                </div>
                            </div>
                            <div className="p-4 border py-16 odd:bg-white even:bg-slate-50 w-full lg:w-1/5 flex flex-col items-center">
                                <div className="section-title sm relative pb-3 mb-4">
                                    <h3 className="text-xl font-semibold">Quick Links</h3>
                                </div>
                                <div className="link-animated flex flex-col items-center">
                                    <a className="text-light mb-2" href="/privacy-policy"><i
                                        className="bi bi-arrow-right text-primary me-2"></i>Privacy Policy</a>
                                    <a className="text-light mb-2" href="/term-of-use"><i
                                        className="bi bi-arrow-right text-primary me-2"></i>Term of use</a>
                                    <a className="text-light mb-2" href="/#about"><i
                                        className="bi bi-arrow-right text-primary me-2"></i>About Us</a>
                                    <a className="text-light" href="contact-us"><i
                                        className="bi bi-arrow-right text-primary me-2"></i>Contact Us</a>
                                </div>
                            </div>
                            <div className="p-4 border py-16 odd:bg-white even:bg-slate-50 w-full lg:w-1/5 flex flex-col items-center">
                                <div className="section-title sm relative pb-3 mb-4">
                                    <h3 className="text-xl font-semibold">Popular Links</h3>
                                </div>
                                <div className="link-animated flex flex-col items-center">
                                    <a className="text-light mb-2" href="/"><i
                                        className="bi bi-arrow-right text-primary me-2"></i>Home</a>
                                    <a className="text-light mb-2" href="/search"><i
                                        className="bi bi-arrow-right text-primary me-2"></i>Search</a>
                                    <a className="text-light mb-2" href="/membership"><i
                                        className="bi bi-arrow-right text-primary me-2"></i>Pricing</a>
                                    <a className="text-light mb-2" href="/testimonial"><i
                                        className="bi bi-arrow-right text-primary me-2"></i>Testimonial</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container-fluid text-white" style={{ background: "#061429" }}>
                    <div className="container text-center">
                        <div className="flex flex-col lg:flex-row gap-2 justify-between items-center">
                            <div className='flex items-center flex-col lg:flex-row mt-5 lg:mt-0 p-3'>
                                <img src={playstore} width="150px" />
                                <p>Download App form PlayStore</p>
                            </div>
                            <div className="flex items-center justify-center">
                                <p className="p-3">&copy; <a className="text-white border-bottom" href="#">GetmeMarry.com </a>
                                    Design by <a className="text-white border-bottom" target='_blank' href="https://amukkumar.com/"><u>Amuk Kumar</u></a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    )
}

export default Footer