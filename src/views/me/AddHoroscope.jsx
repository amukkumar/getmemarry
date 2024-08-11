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
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns"
import { CalendarIcon } from "@radix-ui/react-icons"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"

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
})

const AddHoroscope = () => {

    const apiUrl = import.meta.env.VITE_API_URL;
    const domainUrl = import.meta.env.VITE_DOMAIN_URL;
    const { toast } = useToast()
    const navigate = useNavigate();
    const [captchaImage, setCaptchaImage] = useState('');
    const [captchaText, setCaptchaText] = useState('');
    const [city, setCity] = useState([]);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            dob: "",
            birthhr: "",
            birthmin: "",
            birthplace: "",
        },
    })

    const getCity = (countryCode, stateCode) => {
        axios.get(apiUrl + 'city.php', {
            params: {
                country_code: countryCode,
                state_code: stateCode
            }
        })
            .then(response => {
                if (response.data.status === "Ok") {
                    setCity(response.data.data);
                }
            })
            .catch(error => {
                console.error(error);
            });
    }
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

    const doRegister = (values) => {
        console.log(values);
    }

    useEffect(() => {

    }, []);
    return (
        <div className="bg">
            <div className="section-title text-center relative pb-3 pt-14 wow fadeInUp" data-wow-delay="0.1s">
                <h5 className="font-bold text-2xl text-primary uppercase">Horoscope</h5>
                <p className="font-bold text-4xl">Horoscope Match   </p>
            </div>
            <div className="flex flex-col gap-2 justify-center items-center mt-8 wow fadeInUp p-3" data-wow-delay="0.4s">
                <Card>
                    <CardContent className="flex flex-col gap-3 p-3">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
                                <FormField
                                    disabled
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem className="space-y-1">
                                            <FormLabel>Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Full Name" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="dob"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col space-y-2 mt-3">
                                            <FormLabel>Date of birth</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant={"outline"}
                                                            className={cn(
                                                                "pl-3 text-left font-normal",
                                                                !field.value && "text-muted-foreground"
                                                            )}
                                                        >
                                                            {field.value ? (
                                                                format(field.value, "PPP")
                                                            ) : (
                                                                <span>Pick a date</span>
                                                            )}
                                                            <CalendarIcon className="ml-auto h-4 text-primary" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar
                                                        mode="single"
                                                        selected={field.value}
                                                        onSelect={field.onChange}
                                                        disabled={(date) =>
                                                            date > new Date() || date < new Date("1900-01-01")
                                                        }
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
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
                                                    <Input placeholder="Birth Place" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="flex justify-center m-5">
                                    <Button type='submit' size='lg'>Submit</Button>
                                </div>
                            </form >
                        </Form >
                        <div className="flex items-end gap-3">
                            <div className="space-y-2">
                                <Label htmlFor="picture">Upload Horoscope</Label>
                                <Input id="picture" type="file" />
                            </div>
                            <Button type='submit'>Submit</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default AddHoroscope