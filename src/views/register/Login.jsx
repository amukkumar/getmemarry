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

const formSchema = z.object({
    username: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }),
    password: z.string().min(4, {
        message: "Password must be at least 4 characters.",
    }),
})
const Login = () => {

    const apiUrl = import.meta.env.VITE_API_URL;
    const { toast } = useToast();
    const { loading, startLoading, stopLoading } = useLoading();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            password: "",
        },
    })

    const onSubmit = (values) => {
        doLogin(values);
    }

    const doLogin = (values) => {
        startLoading();
        const formData = new FormData();
        formData.append(' txtusername', values.username);
        formData.append('txtpassword', values.password);
        axios.post(apiUrl + 'midlogin.php', formData)
            .then(function (response) {
                if (response.data.message == "ok") {
                    dispatch(setToken(response.data.data.token));
                    dispatch(setUser(response.data.data));
                    dispatch(setName(response.data.data.firstname));
                    navigate('/')
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

    return (
        <>
            <Loading loading={loading} />
            <div className="bg w-full h-screen flex flex-col gap-5 justify-center items-center">
                <img src={logo} />
                <Card className="w-[350px]">
                    <CardHeader className="text-center">
                        <CardTitle className="text-primary text-xl">Login</CardTitle>
                        <CardDescription>Welcome to GetmeMarry.</CardDescription>
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
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <Input type="password" placeholder="Password" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="text-center mt-10">
                                    <Button size='lg' type="submit">Login</Button>
                                </div>
                            </form>
                        </Form>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <Button size="sm" onClick={() => navigate('/register')}>New User?</Button>
                        <Button size="sm" onClick={() => navigate('/forget')} variant="outline">Forget?</Button>
                    </CardFooter>
                </Card>
            </div>
        </>
    )
}

export default Login