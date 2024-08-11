import React, { useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTrigger, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom'
import { Input } from "@/components/ui/input"
import { useSelector } from 'react-redux';
import { useToast } from "@/components/ui/use-toast"
import axios from 'axios';
import { Verified } from '@mui/icons-material';

const Details = ({ title, text, icon, verify, linktext, flag, mobile }) => {

    const apiUrl = import.meta.env.VITE_API_URL;
    const user = useSelector((state) => state.global.user.payload);
    const { toast } = useToast();
    const [message, setMessage] = useState("");
    const [code, setCode] = useState("");

    const handleChange = (val) => {
        if (val && verify !== 1) {
            if (mobile) {
                sendMobileCode();
            }
            else {
                sendEmailCode();
            }
        }
        else {
            setMessage("");
        }
    }

    const sendMobileCode = () => {
        axios.get(apiUrl + 'resendVerificationCode.php', {
            params: {
                token: user?.token,
                txtmobile: text
            }
        })
            .then(function (response) {
                if (response.status == 200) {
                    setMessage(response.data);
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
    }

    const verifyMobile = () => {
        const formData = new FormData();
        formData.append("txtmobile", text)
        formData.append("txtverificationcode", code)
        axios.post(apiUrl + 'verifyMobile.php', formData, {
            params: {
                token: user?.token
            }
        })
            .then(function (response) {
                if (response.status == 200) {
                    setMessage(response.data);
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
    }

    const sendEmailCode = () => {
        const formData = new FormData();
        formData.append("txtemail", text)
        axios.post(apiUrl + 'resend_conflink.php', formData, {
            params: {
                token: user?.token
            }
        })
            .then(function (response) {
                if (response.status == 200) {
                    setMessage(response.data);
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
    }

    return (
        <Card className='flex-1 rounded-md min-w-40'>
            <CardContent className='py-2 px-3'>
                <p className='text-sm font-semibold'>{title}</p>
                <div className='flex justify-between items-center'>
                    <h1 className='text-md font-semibold'>{text}</h1>
                    {icon}
                </div>
                {flag ?
                    <Dialog onOpenChange={handleChange}>
                        <DialogTrigger asChild>
                            <Link className='text-sm text-primary underline'>{linktext}</Link>
                        </DialogTrigger>
                        {verify !== 1 ?
                            <>
                                {mobile ?
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Verify Mobile</DialogTitle>
                                            <DialogDescription className='flex flex-col gap-3'>
                                                <span className='flex flex-col gap-3'>
                                                    <span>You have received a mobile verification code on your mobile, Please input it and verify your mobile number +91 {text}.</span>
                                                    <Input placeholder="Type Verification code" value={code} onChange={(e) => setCode(e.target.value)} />
                                                    <span className={message.success ? "text-lime-600" : "text-red-600"}>{message.message}</span>
                                                </span>
                                            </DialogDescription>
                                        </DialogHeader>
                                        <DialogFooter className="sm:justify-between gap-3">
                                            <DialogClose asChild>
                                                <Button variant='outline'>Close</Button>
                                            </DialogClose>
                                            <Button onClick={() => verifyMobile()}>Verify</Button>
                                        </DialogFooter>
                                    </DialogContent> :
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Verify Email</DialogTitle>
                                            <DialogDescription>
                                                <span className='flex flex-col gap-3'>
                                                    <span>Lost or didn't receive your confirmation email after registration? Input the email that was used during your matrimonial member registration to have the email re-sent. Now to verify your email address, check your email and click the confirmation link.</span>
                                                    <span className={message.success ? "text-lime-600" : "text-red-600"}>{message.message}</span>
                                                </span>
                                            </DialogDescription>
                                        </DialogHeader>
                                        <DialogFooter className="sm:justify-center">
                                            <DialogClose asChild>
                                                <Button>Close</Button>
                                            </DialogClose>
                                        </DialogFooter>
                                    </DialogContent>
                                }
                            </> :
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Verify Status</DialogTitle>
                                    <DialogDescription className='text-center'>
                                        <span className='flex flex-col gap-3 items-center'>
                                            <span>You are already Verified.</span>
                                            <Verified fontSize='large' className='text-lime-500' />
                                        </span>
                                    </DialogDescription>
                                </DialogHeader>
                                <DialogFooter className="sm:justify-center">
                                    <DialogClose asChild>
                                        <Button>Close</Button>
                                    </DialogClose>
                                </DialogFooter>
                            </DialogContent>
                        }
                    </Dialog> :
                    <Link className='text-sm text-primary underline'>{linktext}</Link>
                }
            </CardContent>
        </Card>
    )
}

export default Details