import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"
import axios from "axios"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { Cached } from "@mui/icons-material"
import useLoading from "../hook/loading"

const formSchema = z.object({
    name: z.string().min(2, {
        message: "This field has to be filled.",
    }),
    email: z
        .string()
        .min(1, { message: "This field has to be filled." })
        .email({
            message: "This is not a valid email."
        }),
    comment: z.string().min(2, {
        message: "Please enter a valid comment.",
    }),
    captcha: z.string().min(3, {
        message: "Please enter a valid captch.",
    }),
})

const Contact = () => {

    const apiUrl = import.meta.env.VITE_API_URL;
    const domainUrl = import.meta.env.VITE_DOMAIN_URL;
    const user = useSelector((state) => state.global.user.payload);
    const { loading, startLoading, stopLoading } = useLoading();
    const { toast } = useToast();
    const [captchaImage, setCaptchaImage] = useState('');
    const [captchaText, setCaptchaText] = useState('');

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: user?.firstname || "" + " " + user?.lastname || "",
            email: user?.email || "",
            comment: "",
            captcha: "",
        },
    })

    const doContact = (values) => {
        startLoading();
        const formData = new FormData();
        formData.append('token', user.token);
        formData.append('txtcomment', values.comment);
        axios.post(apiUrl + 'contactus.php', formData)
            .then(function (response) {
                if (response.status == 200) {
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
                toast({
                    variant: "destructive",
                    description: error.response.data.message,
                })
            })
            .finally(function () {
                stopLoading();
            });
    }

    const onSubmit = (values) => {
        if (values.captcha == captchaText) {
            doContact(values);
        }
        else {
            toast({
                variant: "destructive",
                description: "Invalid Captcha!"
            })
        }

    }

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

    useEffect(() => {
        fetchCaptcha();
    }, [])

    return (
        <div className="bg">
            <div className='container p-3'>
                <div className="section-title text-center relative pb-3 mt-10 mb-14 wow slideInUp" data-wow-delay="0.1s">
                    <h5 className="font-bold text-2xl text-primary uppercase">Contact Us</h5>
                    <p className="font-bold text-4xl">We're Here to Help!</p>
                </div>
                <div className="flex justify-center wow slideInUp" data-wow-delay="0.4s">
                    <Card className="w-full md:w-[600px]">
                        <CardContent className='p-5'>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)}>
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem className="space-y-1 mt-2">
                                                <FormLabel>Username</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Enter Name" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem className="space-y-1 mt-2">
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Enter Email" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="comment"
                                        render={({ field }) => (
                                            <FormItem className="space-y-1 mt-2">
                                                <FormLabel>Comment</FormLabel>
                                                <FormControl>
                                                    <Textarea placeholder="Enter Comment" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <p className="text-sm">Please read the text in the image given below and type that text into the box beside it. You are asked to do this in order to verify that this action is not being performed by an automated process.</p>
                                    <div className="grid grid-cols-2 gap-5 my-2">
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
                                                    <div className="flex items-center gap-5">
                                                        <img className="rounded-md" src={captchaImage} alt="CAPTCHA" />
                                                        {/* <Cached className="cursor-pointer" onClick={() => fetchCaptcha()} /> */}
                                                    </div>
                                                </FormItem>
                                            )}
                                        />

                                    </div>
                                    <div className="flex justify-center mt-10">
                                        <Button type='submit' size='lg'>Submit</Button>
                                    </div>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default Contact