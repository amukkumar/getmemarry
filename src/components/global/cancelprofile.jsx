import React, { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTrigger, DialogClose } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ContactPage, EmailRounded } from '@mui/icons-material'
import { useSelector } from 'react-redux'
import axios from 'axios'

const CancelProfile = () => {

    const apiUrl = import.meta.env.VITE_API_URL;
    const user = useSelector((state) => state.global.user.payload);
    const [reason, setReason] = useState("");
    const [open, setOpen] = useState(false);

    const handleCancel = () => {
        const formData = new FormData();
        formData.append("reason", reason)
        axios.post(apiUrl + 'cancel.php', {
            params: {
                token: user.token,
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

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button className='flex-1 text-sm' size="sm">Cancel My Profile<ContactPage sx={{ fontSize: "20px", marginLeft: "5px" }} /></Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <div className='w-full flex flex-col items-center'>
                            <div className="section-title sm relative pb-3">
                                <h3 className="text-xl font-semibold">Reason for Cancellation</h3>
                            </div>
                        </div>
                    </DialogHeader>
                    <div className="space-y-1">
                        <Label>Name</Label>
                        <Input disabled value={user?.firstname} />
                        <Label >Reason</Label>
                        <Textarea value={reason} onChange={(val) => setReason(val.target.value)} />
                    </div>
                    <DialogFooter className="sm:justify-center gap-3">
                        <Button variant="secondary" type="button" onClick={handleCancel}>
                            Cancel Profile
                        </Button>
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

export default CancelProfile