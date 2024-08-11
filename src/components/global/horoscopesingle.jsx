import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { cn } from "@/lib/utils"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Autocomplete } from "@/components/ui/autocomplete";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Cached } from "@mui/icons-material";
import dayjs from "dayjs";

const months = [
    { name: "January", value: 1 },
    { name: "February", value: 2 },
    { name: "March", value: 3 },
    { name: "April", value: 4 },
    { name: "May", value: 5 },
    { name: "June", value: 6 },
    { name: "July", value: 7 },
    { name: "August", value: 8 },
    { name: "September", value: 9 },
    { name: "October", value: 10 },
    { name: "November", value: 11 },
    { name: "December", value: 12 }
];

const formSchema = z.object({

    dob: z.date({
        message: "Please select date of birth",
    }),
    birthhr: z.string().min(2, {
        message: "Please select birth hour.",
    }),
    birthmin: z.string().min(2, {
        message: "Please select birth minutes.",
    }),
    birthplace: z.string().min(2, {
        message: "Please enter birth place",
    }),
    captcha: z.string().min(4, {
        message: "Please enter Captcha.",
    })
})

const HoroscopeSingle = () => {

    const apiUrl = import.meta.env.VITE_API_URL;
    const domainUrl = import.meta.env.VITE_DOMAIN_URL;
    const { toast } = useToast()
    const navigate = useNavigate();
    const [captchaImage, setCaptchaImage] = useState('');
    const [captchaText, setCaptchaText] = useState('');
    const [bcity, setBCity] = useState([]);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            dob: "",
            birthhr: "",
            birthmin: "",
            birthplace: "",
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
            doRegister(values);
        }
        else {
            toast({
                variant: "destructive",
                description: "Invalid Captcha!"
            })
        }

    }

    function debounce(func, wait) {
        let timeout;
        return function (...args) {
            const context = this;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), wait);
        };
    }

    const getBirthCity = (val) => {
        if (val?.length < 0) return;
        axios.get(apiUrl + 'ajax_astro_city.php', {
            params: {
                query: val
            }
        })
            .then(response => {
                if (response.status == 200) {
                    if (response.data?.length > 0) {
                        setBCity(response.data);
                    }
                }
            })
            .catch(error => {
                setBCity([]);
                console.error(error);
            })
    }

    const debouncedGetBirthCity = debounce(getBirthCity, 500);

    const doRegister = (values) => {
        console.log(values);
    }

    useEffect(() => {
        fetchCaptcha();
    }, []);
    return (
        <div>
            <Card>
                <CardContent className="flex gap-3 p-3">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
                            <div className="flex gap-2">
                                <FormField
                                    control={form.control}
                                    name="date"
                                    render={({ field }) => (
                                        <FormItem className="space-y-1 flex-1">
                                            <FormLabel>Date of birth</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Date" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {Array.from({ length: 31 - 1 + 1 }, (_, i) => 1 + i).map((num, index) => (
                                                        <SelectItem key={index} value={`${num}`}>{num}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="month"
                                    render={({ field }) => (
                                        <FormItem className="space-y-1 flex-1">
                                            <FormLabel>&nbsp;</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Month" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {months.map((item, index) => (
                                                        <SelectItem key={index} value={`${item.value}`}>{item.name}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="year"
                                    render={({ field }) => (
                                        <FormItem className="space-y-1 flex-1">
                                            <FormLabel>&nbsp;</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Year" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {Array.from({ length: (parseInt(dayjs().format('YYYY')) - 18) - (parseInt(dayjs().format('YYYY')) - 80) + 1 }, (_, i) => (parseInt(dayjs().format('YYYY')) - 18) - i).map((num, index) => (
                                                        <SelectItem key={index} value={`${num}`}>{num}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                                <div className="grid grid-cols-2 gap-2">
                                    <FormField
                                        control={form.control}
                                        name="birthhr"
                                        render={({ field }) => (
                                            <FormItem className="space-y-1">
                                                <FormLabel>Birth Time</FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Hour" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {Array.from({ length: 23 - 0 + 1 }, (_, i) => 0 + i).map((num, index) => (
                                                            <SelectItem key={index} value={`${num.toString().padStart(2, '0')}`}>{num.toString().padStart(2, '0')}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="birthmin"
                                        render={({ field }) => (
                                            <FormItem className="space-y-1">
                                                <FormLabel>&nbsp;</FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Min" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {Array.from({ length: 59 - 0 + 1 }, (_, i) => 0 + i).map((num, index) => (
                                                            <SelectItem key={index} value={`${num.toString().padStart(2, '0')}`}>{num.toString().padStart(2, '0')}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <FormField
                                    control={form.control}
                                    name="birthplace"
                                    render={({ field }) => (
                                        <FormItem className="space-y-1">
                                            <FormLabel>Birth Place</FormLabel>
                                            <FormControl>
                                                <Autocomplete options={bcity} placeholder="Birth Place" {...field}
                                                    onChange={(val) => {
                                                        field.onChange(val);
                                                        debouncedGetBirthCity(val);
                                                    }}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
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
                                            <div className="flex items-center gap-1">
                                                <img className="rounded-md flex-1" src={captchaImage} alt="CAPTCHA" />
                                                <Cached fontSize="small" className="cursor-pointer" onClick={() => fetchCaptcha()} />
                                            </div>
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
    )
}

export default HoroscopeSingle