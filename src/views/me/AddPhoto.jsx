import React, { useEffect, useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import axios from 'axios';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import PictureCard from '../../components/global/picturecard';
import { useDispatch, useSelector } from 'react-redux';
import { useToast } from "@/components/ui/use-toast"
import Loading from '../../components/global/loading';
import useLoading from '../../hook/loading';
import { setUser } from '../../store/globalSlice';

const AddPhoto = () => {

    const apiUrl = import.meta.env.VITE_API_URL;
    const user = useSelector((state) => state.global.user.payload);
    const dispatch = useDispatch();
    const [change, setChange] = useState(user?.photo_confidential);
    const [picDefault, setPicDefault] = useState(0);
    const { toast } = useToast();
    const { loading, startLoading, stopLoading } = useLoading();


    const fetchProfileImg = async () => {
        startLoading();
        try {
            const response = await axios.get(apiUrl + 'image_api/getsnap_amuk.php', {
                params: {
                    id: user?.id,
                    typ: "pic",
                }
            });
            setPicDefault(response.data.picId)
        } catch (error) {
            console.error('Error fetching captcha:', error);
        }
        stopLoading();
    };

    const handleVisibility = (val) => {
        startLoading();
        const formData = new FormData();
        formData.append("token", user?.token);
        formData.append("photocopt", val);
        axios.post(apiUrl + 'photoconfidential.php', formData)
            .then(response => {
                if (response.data.success) {
                    toast({
                        variant: "success",
                        description: "Visiblity updated.",
                    })
                    dispatch(setUser({ ...user, ...{ "photo_confidential": val } }))
                }
            })
            .catch(error => {
                console.error(error);
            })
            .finally(function () {
                stopLoading();
            });
    };

    const setDefaultSnap = (id) => {
        startLoading();
        axios.get(apiUrl + 'setDefaultPic.php', {
            params: {
                token: user.token,
                picno: id
            }
        })
            .then(response => {
                if (response.data.success) {
                    toast({
                        variant: "success",
                        description: response.data.message,
                    })
                }
                else {
                    uploadPhoto();
                }
            })
            .catch(error => {
                console.error(error);
            })
            .finally(function () {
                stopLoading();
            });
    };

    useEffect(() => {
        fetchProfileImg();
    }, [])

    return (
        <>
            <div className='bg'>
                <Loading loading={loading} />
                <div className='container p-3'>
                    <div className="section-title text-center relative pb-3 m-8">
                        <h5 className="font-bold text-2xl text-primary uppercase">Add Photo</h5>
                        <p className="font-bold text-4xl">Show your best picture</p>
                    </div>
                    <div className='flex justify-center'>
                        <Card>
                            <CardContent className='px-3 pb-3 pt-2 flex flex-col text-center gap-2'>
                                <p className='text-primary'>Change Picture Visibility</p>
                                <ToggleGroup
                                    onValueChange={(val) => { setChange(val); handleVisibility(val) }}
                                    value={change}
                                    type='single'
                                    size="sm"
                                    variant="outline"
                                    className='flex flex-wrap justify-start'
                                >
                                    <ToggleGroupItem value="N">Don't show to any one</ToggleGroupItem>
                                    <ToggleGroupItem value="Y">Show to all</ToggleGroupItem>
                                </ToggleGroup>
                            </CardContent>
                        </Card>
                    </div>
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-5'>
                        {[1, 2, 3, 4, 5].map((item) => {
                            return (
                                <PictureCard key={item} setDefaultSnap={setDefaultSnap} picDefault={picDefault} setPicDefault={setPicDefault} index={item} />
                            )
                        })}
                    </div>
                </div>
            </div>
        </>
    )
}

export default AddPhoto