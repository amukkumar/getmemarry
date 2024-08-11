import React, { useEffect, useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import axios from 'axios'
import { useSelector } from 'react-redux'
import { useToast } from "@/components/ui/use-toast"
import useLoading from '../../hook/loading'
import Loading from './loading'

const PictureCard = ({ setDefaultSnap, picDefault, setPicDefault, index }) => {

    const apiUrl = import.meta.env.VITE_API_URL;
    const user = useSelector((state) => state.global.user.payload);
    const { toast } = useToast();
    const { loading, startLoading, stopLoading } = useLoading();
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    const fetchProfileImg = async () => {
        startLoading();
        try {
            const response = await axios.get(apiUrl + 'image_api/getsnap_amuk.php', {
                params: {
                    id: user?.id,
                    typ: "full",
                    picid: index
                }
            });
            setPreviewUrl(response.data.image)
        } catch (error) {
            console.error('Error fetching captcha:', error);
        }
        stopLoading();
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            const fileTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
            if (fileTypes.includes(selectedFile.type)) {
                setFile(selectedFile);
            } else {
                toast({
                    variant: "destructive",
                    description: "Only .jpeg, .jpg, .png, .gif files",
                })
            }
        }
    };

    const handleDelete = (flag) => {
        startLoading();
        axios.get(apiUrl + 'deletesnap.php', {
            params: {
                token: user.token,
                picno: index
            }
        })
            .then(response => {
                if (response.data.success && flag) {
                    setFile(null);
                    fetchProfileImg();
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

    const uploadPhoto = async () => {
        startLoading();
        const formData = new FormData();
        formData.append('picid', index);
        formData.append('txtimages[]', file, file.name);
        // Send the request
        axios.post(apiUrl + "savesnap.php", formData, {
            params: {
                token: user.token
            }
        })
            .then((response) => {
                if (response.data.message == "success") {
                    toast({
                        variant: "success",
                        description: "Photo uploaded successfully",
                    })
                    setPreviewUrl(URL.createObjectURL(file));
                }
                else {
                    toast({
                        variant: "destructive",
                        description: response.data.message,
                    })
                }
            })
            .catch((error) => {
                console.error(error);
            })
            .finally(function () {
                stopLoading();
            });
    }

    useEffect(() => {
        if (file !== null) {
            handleDelete(false);
        }
    }, [file])

    useEffect(() => {
        fetchProfileImg();
    }, [])

    return (
        <>
            <Loading loading={loading} />
            <Card>
                <CardContent className='px-3 pb-3 pt-2'>
                    <div className='flex justify-between items-center'>
                        <h1 className='text-primary font-semibold text-lg mb-2'>{index}. Picture</h1>
                        <div className='flex items-center gap-2 mb-2'>
                            <p>Make Default</p>
                            <Checkbox
                                checked={picDefault == index}
                                onCheckedChange={() => { setPicDefault(index); setDefaultSnap(index) }}
                            />
                        </div>
                    </div>
                    <div className='text-center'>
                        <img className='rounded-md h-[400px] md:h-[300px] w-full object-contain' src={previewUrl} alt='Profile' />
                    </div>
                    <div className='flex justify-between mt-2'>
                        <Input
                            className='custom-file-input bg-primary text-primary'
                            id="picture"
                            type="file"
                            accept="image/jpeg,image/jpg,image/png,image/gif"
                            onChange={handleFileChange}
                        />
                        <Button size='sm' className='bg-destructive' onClick={() => handleDelete(true)}>Delete</Button>
                    </div>
                </CardContent>
            </Card>
        </>
    )
}

export default PictureCard
