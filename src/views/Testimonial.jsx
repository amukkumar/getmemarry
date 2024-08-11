import React from 'react'
import TestimonialCard from '../components/global/testimonialcard'

const Testimonial = () => {
    return (
        <div className='bg'>
            <div className='container p-3'>
                <div className="section-title text-center relative pb-3 m-8">
                    <h5 className="font-bold text-2xl text-primary uppercase">Testimonial</h5>
                    <p className="font-bold text-4xl">What Our Members Say</p>
                </div>
                <div className='grid grid-cols-3 gap-3'>
                    <TestimonialCard />
                    <TestimonialCard />
                    <TestimonialCard />
                </div>
            </div>
        </div>
    )
}

export default Testimonial