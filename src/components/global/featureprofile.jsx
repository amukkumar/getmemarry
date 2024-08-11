import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useToast } from "@/components/ui/use-toast"
import { useSelector } from 'react-redux';
import ShortProfile from './shortprofile';
import Loading from './loading';
import useLoading from '../../hook/loading';

const FeatureProfile = () => {

    const apiUrl = import.meta.env.VITE_API_URL;
    const { toast } = useToast();
    const { loading, startLoading, stopLoading } = useLoading();
    const [featureProfile, setFeatureProfile] = useState([]);

    const getFeatureProfile = () => {
        startLoading();
        axios.get(apiUrl + 'getfeaturedprofiles.php')
            .then(function (response) {
                if (response.status == 200) {
                    setFeatureProfile(response.data.data);
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
        getFeatureProfile();
    }, []);


    return (
        <>
            {/* <Loading loading={loading} /> */}
            <div className="section-title text-center relative p-3 my-16">
                <h5 className="font-bold text-2xl text-primary uppercase">Most match of your Preferences</h5>
                <p className="font-bold text-4xl">Recommended Profile</p>
            </div>
            <div className='grid lg:grid-cols-2 gap-3 grid-auto'>
                {featureProfile?.map((item, index) => {
                    return (
                        <ShortProfile key={index} profile={item} />
                    )
                })}
            </div>
        </>
    )
}

export default FeatureProfile