import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { useSelector } from "react-redux";

const formSchema = z.object({

    oldpassword: z.string().min(2, {
        message: "Please enter old password.",
    }),
    newpassword: z.string().min(2, {
        message: "Please enter new password.",
    }),
    confirmpassword: z.string().min(2, {
        message: "Please enter confirm password.",
    }),
    captcha: z.string().min(4, {
        message: "Please enter Captcha.",
    }),
})

const ChangePassword = () => {

    const apiUrl = import.meta.env.VITE_API_URL;
    const domainUrl = import.meta.env.VITE_DOMAIN_URL;
    const user = useSelector((state) => state.global.user.payload);
    const { toast } = useToast()
    const navigate = useNavigate();
    const [captchaImage, setCaptchaImage] = useState('');
    const [captchaText, setCaptchaText] = useState('');

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            oldpassword: "",
            newpassword: "",
            confirmpassword: "",
            captcha: "",
        },
    })

    const { reset } = form;

    const fetchCaptcha = async () => {
        try {
            const response = await axios.get(domainUrl + 'captcha/SecurityImage_amuk.php');
            const data = response.data;
            setCaptchaImage(data.captcha_image);
            setCaptchaText(data.captcha_text);
        } catch (error) {
            console.error('Error fetching captcha:', error);
        }
    };

    const onSubmit = (values) => {
        if (captchaText == values.captcha) {
            doChange(values);
        }
        else {
            toast({
                variant: "destructive",
                description: "Invalid Captcha!"
            })
        }

    }

    const doChange = (values) => {
        const formdata = new FormData();
        formdata.append("txtoldpwd", values.oldpassword);
        formdata.append("txtnewpwd", values.newpassword);
        formdata.append("txtconpwd", values.confirmpassword)
        axios.post(apiUrl + "modifympass.php", formdata, {
            params: {
                token: user.token,
            }
        })
            .then(function (response) {
                if (response.status == 200) {
                    reset({
                        oldpassword: "",
                        newpassword: "",
                        confirmpassword: "",
                        captcha: "",
                    })
                    toast({
                        variant: "success",
                        description: response.data.message,
                    })
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
                fetchCaptcha();
            });
    }

    useEffect(() => {
        fetchCaptcha();
    }, []);
    return (
        <div className="bg">
            <div className="section-title text-center relative pb-3 pt-14 wow fadeInUp" data-wow-delay="0.1s">
                <h5 className="font-bold text-2xl text-primary uppercase">Change Password</h5>
                <p className="font-bold text-4xl">Change your password</p>
            </div>
            <div className="flex flex-col gap-2 justify-center items-center mt-8 wow fadeInUp p-3" data-wow-delay="0.4s">
                <Card>
                    <CardContent className="flex flex-col gap-3 p-3 max-w-[400px]">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
                                <FormField
                                    control={form.control}
                                    name="oldpassword"
                                    render={({ field }) => (
                                        <FormItem className="space-y-1">
                                            <FormLabel>Old Password</FormLabel>
                                            <FormControl>
                                                <Input type='password' placeholder="Old Password" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="newpassword"
                                    render={({ field }) => (
                                        <FormItem className="space-y-1">
                                            <FormLabel>New Password</FormLabel>
                                            <FormControl>
                                                <Input type='password' placeholder="New Password" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="confirmpassword"
                                    render={({ field }) => (
                                        <FormItem className="space-y-1">
                                            <FormLabel>Confirm New Password</FormLabel>
                                            <FormControl>
                                                <Input type='password' placeholder="Confirm New Password" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="grid grid-cols-2 gap-5 mt-2">
                                    <FormField
                                        control={form.control}
                                        name="captcha"
                                        render={({ field }) => (
                                            <FormItem className="space-y-1">
                                                <FormLabel>Verification code</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Verification code" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="captchaimg"
                                        render={({ field }) => (
                                            <FormItem className="space-y-1">
                                                <FormLabel>&nbsp;</FormLabel>
                                                <img className="rounded-md" src={captchaImage} alt="CAPTCHA" />
                                            </FormItem>
                                        )}
                                    />

                                </div>
                                <div className="flex justify-center m-5">
                                    <Button type='submit' size='lg'>Submit</Button>
                                </div>
                            </form >
                        </Form >
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default ChangePassword