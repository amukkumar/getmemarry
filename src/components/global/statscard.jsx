import React from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Link } from 'react-router-dom'

const StatsCard = ({ title, number, icon, link }) => {
    return (
        <Card className='flex-1 rounded-md min-w-40'>
            <CardContent className='py-2 px-3'>
                <p className='text-sm font-semibold'>{title}</p>
                <div className='flex justify-between items-center'>
                    <h1 className='text-3xl font-semibold'>{number}</h1>
                    {icon}
                </div>
                <Link to={link} className='text-sm text-primary underline'>See Details</Link>
            </CardContent>
        </Card>
    )
}

export default StatsCard