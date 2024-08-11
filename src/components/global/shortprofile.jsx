import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import AppShortcutOutlinedIcon from '@mui/icons-material/AppShortcutOutlined';
import { Button } from "@/components/ui/button"
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import useLoading from '../../hook/loading';

const ShortProfile = ({ profile }) => {

    const apiUrl = import.meta.env.VITE_API_URL;
    const { loading, startLoading, stopLoading } = useLoading();
    const [image, setImage] = useState("");
    const resource = useSelector((state) => state.global.resource.payload);
    const navigate = useNavigate();

    const fetchProfileImg = async (id) => {
        startLoading();
        try {
            const response = await axios.get(apiUrl + 'image_api/getsnap_amuk.php', {
                params: {
                    id: id,
                    typ: "pic",
                    picid: 1
                }
            });
            setImage(response.data)
        } catch (error) {
            console.error('Error fetching captcha:', error);
        }
        stopLoading();
    };

    useEffect(() => {
        fetchProfileImg(profile?.id)
    }, [])

    return (
        <Card className="w-50">
            <CardContent className="p-2">
                <div className='flex flex-col sm:flex-row sm:gap-2'>
                    <div className='text-white bg-primary rounded-t-md p-1 px-3 flex sm:hidden justify-between gap-2'>
                        <p className='text-sm'>ID: {profile?.username}</p>
                        <AppShortcutOutlinedIcon fontSize='small' />
                    </div>
                    <Avatar className="sm:w-1/3 w-full h-auto rounded-md" style={{ aspectRatio: "3/4" }}>
                        <AvatarImage className="object-contain rounded-md" src={image.image} />
                        <AvatarFallback>GM</AvatarFallback>
                    </Avatar>
                    <div className='rounded-md border w-full'>
                        <div className='text-white bg-primary rounded-t-md p-1 px-3 sm:flex hidden justify-between gap-2'>
                            <p className='text-sm'>ID: {profile?.username}</p>
                            <AppShortcutOutlinedIcon fontSize='small' />
                        </div>
                        <Table>
                            <TableBody>
                                <TableRow className="odd:bg-white even:bg-slate-50">
                                    <TableCell className="font-sm p-1 pl-5 w-[200px] font-semibold">Name:</TableCell>
                                    <TableCell className="font-sm p-1">{profile?.firstname}</TableCell>
                                </TableRow>
                                <TableRow className="odd:bg-white even:bg-slate-50">
                                    <TableCell className="font-sm p-1 pl-5 w-[200px] font-semibold">Age/Height:</TableCell>
                                    <TableCell className="font-sm p-1">{`${profile?.age} / ${resource?.height[profile?.height - 1]?.value || profile.height}`}</TableCell>
                                </TableRow>
                                <TableRow className="odd:bg-white even:bg-slate-50">
                                    <TableCell className="font-sm p-1 pl-5 w-[200px] font-semibold">Status:</TableCell>
                                    <TableCell className="font-sm p-1">{`${profile?.maritalstatus}`}</TableCell>
                                </TableRow>
                                <TableRow className="odd:bg-white even:bg-slate-50">
                                    <TableCell className="font-sm p-1 pl-5 w-[200px] font-semibold">Qualification:</TableCell>
                                    <TableCell className="font-sm p-1">{`${profile?.qualification}`}</TableCell>
                                </TableRow>
                                <TableRow className="odd:bg-white even:bg-slate-50">
                                    <TableCell className="font-sm p-1 pl-5 w-[200px] font-semibold">Profession:</TableCell>
                                    <TableCell className="font-sm p-1">{`${profile?.professional_str}`}</TableCell>
                                </TableRow>
                                <TableRow className="odd:bg-white even:bg-slate-50">
                                    <TableCell className="font-sm p-1 pl-5 w-[200px] font-semibold">Religion:</TableCell>
                                    <TableCell className="font-sm p-1">{`${profile?.religion}`}</TableCell>
                                </TableRow>
                                <TableRow className="odd:bg-white even:bg-slate-50">
                                    <TableCell className="font-sm p-1 pl-5 w-[200px] font-semibold">Caste:</TableCell>
                                    <TableCell className="font-sm p-1">{`${profile?.caste}`}</TableCell>
                                </TableRow>
                                <TableRow className="odd:bg-white even:bg-slate-50">
                                    <TableCell className="font-sm p-1 pl-5 w-[200px] font-semibold">Location:</TableCell>
                                    <TableCell className="font-sm p-1">{`${profile?.city}, ${profile?.statename}, ${profile?.countryname}`}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                        <div className='flex justify-center w-full'>
                            <Button onClick={() => navigate(`/profile/${profile?.username}`)} size='sm' className='font-semibold my-2'>View Full Profile</Button>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default ShortProfile