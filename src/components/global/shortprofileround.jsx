import React, { useEffect, useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import AppShortcutOutlinedIcon from '@mui/icons-material/AppShortcutOutlined';
import { Button } from "@/components/ui/button"
import { useLoaderData, useNavigate } from 'react-router-dom';
import axios from 'axios';
import dayjs from 'dayjs';
import useLoading from '../../hook/loading';

const ShortProfileRound = ({ profile }) => {

    const apiUrl = import.meta.env.VITE_API_URL;
    const { loading, startLoading, stopLoading } = useLoading();
    const [image, setImage] = useState("");
    const navigate = useNavigate();

    const fetchProfileImg = async () => {
        startLoading();
        try {
            const response = await axios.get(apiUrl + 'image_api/getsnap_amuk.php', {
                params: {
                    id: profile?.id,
                    typ: "pic"
                }
            });
            setImage(response.data)
        } catch (error) {
            console.error('Error fetching captcha:', error);
        }
        stopLoading();
    };

    useEffect(() => {
        if (profile?.id > 0)
            fetchProfileImg();
    }, [profile?.id])

    return (
        <Card className="w-full h-full">
            <CardContent className="p-2">
                <div className='flex flex-col gap-0'>
                    <div className='text-white bg-primary rounded-t-md p-1 px-3 flex justify-between gap-2'>
                        <p className='text-sm'>ID: {profile?.username}</p>
                        <AppShortcutOutlinedIcon fontSize='small' />
                    </div>
                    <img className="rounded-full aspect-square p-2 object-cover" src={image.image} />
                    <div className='rounded-md border w-full'>
                        <Table>
                            <TableBody>
                                <TableRow className="odd:bg-white even:bg-slate-50">
                                    <TableCell className="font-sm p-1 pl-5 w-[100px] font-semibold">Name:</TableCell>
                                    <TableCell className="font-sm p-1">{`${profile?.firstname} ${profile?.lastname}`}</TableCell>
                                </TableRow>
                                <TableRow className="odd:bg-white even:bg-slate-50">
                                    <TableCell className="font-sm p-1 pl-5 w-[100px] font-semibold">Age/Height:</TableCell>
                                    <TableCell className="font-sm p-1">{`${dayjs().diff(profile?.birth_date, 'year')} / ${profile?.height}`}</TableCell>
                                </TableRow>
                                <TableRow className="odd:bg-white even:bg-slate-50">
                                    <TableCell className="font-sm p-1 pl-5 w-[100px] font-semibold">Status:</TableCell>
                                    <TableCell className="font-sm p-1">{`${profile?.maritalstatus}`}</TableCell>
                                </TableRow>
                                <TableRow className="odd:bg-white even:bg-slate-50">
                                    <TableCell className="font-sm p-1 pl-5 w-[100px] font-semibold">Qualification:</TableCell>
                                    <TableCell className="font-sm p-1">{`${profile?.qualification}`}</TableCell>
                                </TableRow>
                                <TableRow className="odd:bg-white even:bg-slate-50">
                                    <TableCell className="font-sm p-1 pl-5 w-[100px] font-semibold">Profession:</TableCell>
                                    <TableCell className="font-sm p-1">{`${profile?.professional_str}`}</TableCell>
                                </TableRow>
                                <TableRow className="odd:bg-white even:bg-slate-50">
                                    <TableCell className="font-sm p-1 pl-5 w-[100px] font-semibold">Religion:</TableCell>
                                    <TableCell className="font-sm p-1">{`${profile?.religion}`}</TableCell>
                                </TableRow>
                                <TableRow className="odd:bg-white even:bg-slate-50">
                                    <TableCell className="font-sm p-1 pl-5 w-[100px] font-semibold">Caste:</TableCell>
                                    <TableCell className="font-sm p-1">{`${profile?.caste}`}</TableCell>
                                </TableRow>
                                <TableRow className="odd:bg-white even:bg-slate-50">
                                    <TableCell className="font-sm p-1 pl-5 w-[100px] font-semibold">Location:</TableCell>
                                    <TableCell className="font-sm p-1">{`${profile?.city} ${profile?.statename} ${profile?.countryname}`}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                        <div className='flex justify-center w-full'>
                            <Button onClick={() => navigate(`/profile/${profile?.username}`)} className='w-full font-bold'>View Full Profile</Button>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card >
    )
}

export default ShortProfileRound