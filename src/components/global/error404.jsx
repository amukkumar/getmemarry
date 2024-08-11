import React from 'react'
import { Button } from "@/components/ui/button"
import { useNavigate } from 'react-router-dom'

const Error404 = () => {
    const navigate = useNavigate();
    return (
        <div className='bg'>
            <div className='flex flex-col gap-3 justify-center items-center w-full pt-24'>
                <h1 className='text-primary text-8xl font-bold'>404</h1>
                <p className='text-lg'>Profile not found.</p>
                <Button onClick={() => navigate(-1)}>Go Back!</Button>
            </div>
        </div>
    )
}

export default Error404