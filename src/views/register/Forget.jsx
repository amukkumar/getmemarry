import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import logo from '../../assets/logo/getmemarrylogo.png'
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { useDispatch } from "react-redux"
import { useToast } from "@/components/ui/use-toast"
import { setName, setToken, setUser } from "../../store/globalSlice"
import useLoading from "../../hook/loading"
import Loading from "../../components/global/loading"
import { useEffect, useState } from "react"

const formSchema = z.object({
    username: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }),
    captcha: z.string().min(1, {
        message: "Fill the captcha.",
    }),
})
const Forget = () => {

    const domainUrl = import.meta.env.VITE_DOMAIN_URL;
    const apiUrl = import.meta.env.VITE_API_URL;
    const { toast } = useToast();
    const { loading, startLoading, stopLoading } = useLoading();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [captchaImage, setCaptchaImage] = useState('');
    const [captchaText, setCaptchaText] = useState('');

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            captcha: "",
        },
    })

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
            doForget(values);
        }
        else {
            toast({
                variant: "destructive",
                description: "Invalid Captcha!"
            })
        }
    }

    const doForget = (values) => {
        startLoading();
        const formData = new FormData();
        formData.append("txtemail", values.username)
        axios.post(apiUrl + 'getforgotpass.php', formData)
            .then(function (response) {
                if (response.data.success) {
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
                fetchCaptcha();
                stopLoading();
            });
    }

    useEffect(() => {
        fetchCaptcha();
    }, [])

    return (
        <>
            <Loading loading={loading} />
            <div className="bg w-full h-screen flex flex-col gap-5 justify-center items-center">
                <img src={logo} />
                <Card className="w-[350px]">
                    <CardHeader className="text-center">
                        <CardTitle className="text-primary text-xl">Forgot Password</CardTitle>
                        <CardDescription>Please provide the e-mail address / mobile.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)}>
                                <FormField
                                    control={form.control}
                                    name="username"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email/Mobile</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Email/Mobile" {...field} />
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
                                <div className="text-center mt-10">
                                    <Button size='lg' type="submit">Reset Password</Button>
                                </div>
                            </form>
                        </Form>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <Button size="sm" onClick={() => navigate('/login')}>Login</Button>
                        <Button size="sm" onClick={() => navigate('/register')} variant="outline">New User?</Button>
                    </CardFooter>
                </Card>
            </div>
        </>
    )
}

export default Forget