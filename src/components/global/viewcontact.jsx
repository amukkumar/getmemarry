import React, { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTrigger, DialogClose } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { EmailRounded } from '@mui/icons-material'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const ViewContact = ({ id }) => {

    const apiUrl = import.meta.env.VITE_API_URL;
    const user = useSelector((state) => state.global.user.payload);
    const navigate = useNavigate();
    const [contact, setContact] = useState({});
    const [open, setOpen] = useState(false);

    const handleChange = (val) => {
        if (!user) {
            navigate('/login');
            return;
        }
        if (val && !contact?.success) {
            axios.get(apiUrl + 'showfullcontact_web.php', {
                params: {
                    token: user.token,
                    toid: id
                }
            })
                .then(function (response) {
                    if (response.status == 200) {
                        setContact(response.data);
                    }
                    else {
                        setContact({});
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
    }

    return (
        <>
            <Dialog open={open} onOpenChange={(val) => { setOpen(val); handleChange(val) }}>
                <DialogTrigger asChild>
                    <Button className='flex-1 text-sm' size="sm">View Contact<EmailRounded sx={{ fontSize: "20px", marginLeft: "5px" }} /></Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <div className='w-full flex flex-col items-center'>
                            <div className="section-title sm relative pb-3">
                                <h3 className="text-xl font-semibold">Contact Details</h3>
                            </div>
                        </div>
                    </DialogHeader>
                    {contact.success ?
                        <div className="space-y-1">
                            <Label>Email</Label>
                            <Input disabled value={contact?.data?.email} />
                            <div className='flex gap-3'>
                                <div className='w-full'>
                                    <Label>Mobile No</Label>
                                    <Input disabled value={contact?.data?.mobile} />
                                </div>
                                <div className='w-full'>
                                    <Label>Alternate Contact</Label>
                                    <Input disabled id="username" value={contact?.data?.alternate_contact} />
                                </div>
                            </div>
                            <Label >Address</Label>
                            <Input disabled value={contact?.data?.address} />
                            <div className='flex gap-3'>
                                <div className='w-full'>
                                    <Label>City</Label>
                                    <Input disabled id="username" value={contact?.data?.city} />
                                </div>
                                <div className='w-full'>
                                    <Label>Zip Code</Label>
                                    <Input disabled id="username" value={contact?.data?.zip} />
                                </div>
                            </div>
                        </div> :

                        <h1 className='text-lg text-center my-3 text-red-500'>{contact?.message}</h1>
                    }
                    <DialogFooter className="sm:justify-center">
                        <DialogClose asChild>
                            <Button type="button">
                                Close
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog >
        </>
    )
}

export default ViewContact