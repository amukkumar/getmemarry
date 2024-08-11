import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import axios from 'axios'
import { useSelector } from 'react-redux'
import { useToast } from "@/components/ui/use-toast"
import { useLocation, useNavigate } from 'react-router-dom'
import useLoading from '../../hook/loading'
import Loading from '../../components/global/loading'

const UploadProfile = () => {

    const apiUrl = import.meta.env.VITE_API_URL;
    const token = useSelector((state) => state.global.token.payload);
    const { toast } = useToast();
    const location = useLocation();
    const { state } = location;
    const navigate = useNavigate();
    const { loading, startLoading, stopLoading } = useLoading();
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    const fetchProfileImg = async () => {
        startLoading();
        try {
            const response = await axios.get(apiUrl + 'image_api/getsnap_amuk.php', {
                params: {
                    id: state?.newuserid,
                    typ: "full",
                    picid: 1
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
                token: token,
                picno: 1
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
        formData.append('picid', 1);
        formData.append('txtimages[]', file, file.name);
        // Send the request
        axios.post(apiUrl + "savesnap.php", formData, {
            params: {
                token: token
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
        if (!state?.newuserid) {
            navigate('/login');
            return;
        }
        fetchProfileImg();
    }, [])

    return (
        <>
            <Loading loading={loading} />
            <div className='flex justify-center items-center py-14'>
                <Card className='max-w-[400px]'>
                    <CardContent className='px-3 pb-3 pt-2'>
                        <div className='flex justify-between items-center'>
                            <h1 className='text-primary font-semibold text-lg mb-2'>Profile Picture</h1>
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
                    <CardFooter className="flex justify-center">
                        <Button onClick={() => navigate('/login')} size="sm" variant="outline">Go to login</Button>
                    </CardFooter>
                </Card>
            </div>
        </>
    )
}

export default UploadProfile
