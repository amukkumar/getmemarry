import React from 'react'
import Stats from '../components/global/stats'
import FeatureProfile from '../components/global/featureprofile'

const Home = () => {

    return (
        <div className='bg'>
            <div className='container p-3'>
                <Stats />
                <FeatureProfile />
            </div>
        </div>
    )
}

export default Home