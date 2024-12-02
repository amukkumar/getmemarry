import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Autocomplete } from "@/components/ui/autocomplete";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { useSelector } from "react-redux"
import useLoading from "../../hook/loading";
import Loading from "../../components/global/loading";

const formSchema = z.object({
    profilecreated: z.string(),
    complexion: z.string(),
    gotra: z.string(),
    birthhr: z.string(),
    birthmin: z.string(),
    birthplace: z.string(),
    horoscope: z.string(),
    manglik: z.string(),
    diet: z.string(),
    smoke: z.string(),
    drink: z.string(),
    fatheroccupation: z.string(),
    motheroccupation: z.string(),
    brother: z.string(),
    brotherwhichmarried: z.string(),
    sister: z.string(),
    sisterwhichmarried: z.string(),
    address: z.string(),
    areacode: z.string(),
    alternatephone: z.string(),
    about: z.string()
});


const Register2 = () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const location = useLocation();
    const { state } = location;
    const navigate = useNavigate();
    const resource = useSelector((state) => state.global.resource.payload);
    const { toast } = useToast();
    const { loading, startLoading, stopLoading } = useLoading();
    const [bro, setBro] = useState(0);
    const [sis, setSis] = useState(0);
    const [bcity, setBCity] = useState([]);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            profilecreated: "Self",
            complexion: "",
            gotra: "",
            birthhr: "",
            birthmin: "",
            birthplace: "",
            horoscope: "",
            manglik: "",
            diet: "",
            smoke: "",
            drink: "",
            fatheroccupation: "",
            motheroccupation: "",
            brother: "",
            brotherwhichmarried: "",
            sister: "",
            sisterwhichmarried: "",
            address: "",
            areacode: "",
            alternatephone: "",
            about: ""
        },
    })

    const { setValue } = form;

    const onSubmit = (values) => {
        console.log(values)
        doUpdate(values);
    }

    const doUpdate = (values) => {
        startLoading();
        let formdata = new FormData();
        formdata.append('newuserid', state?.newuserid);
        formdata.append('profile_created', values.profilecreated);
        formdata.append('txtcomplexion', values.complexion);
        formdata.append('txtbirthhr', values.birthhr);
        formdata.append('txtbirthmin', values.birthmin);
        formdata.append('keyword', values.birthplace);
        formdata.append('txtgotra', values.gotra);
        formdata.append('txthoroscope', values.horoscope);
        formdata.append('manglik', values.manglik);
        formdata.append('txtdiet', values.diet);
        formdata.append('txtsmoke', values.smoke);
        formdata.append('txtdrink', values.drink);
        formdata.append('txtf_occupation', values.fatheroccupation);
        formdata.append('txtm_occupation', values.motheroccupation);
        formdata.append('txtbrother', values.brother);
        formdata.append('txtbrother_cases', values.brotherwhichmarried);
        formdata.append('txtsister', values.sister);
        formdata.append('txtsister_cases', values.sisterwhichmarried);
        formdata.append('txtaddress1', values.address);
        formdata.append('txtccode', values.areacode);
        formdata.append('txtphone', values.alternatephone);
        formdata.append('about_me', values.about);

        // Send the request
        axios.post(apiUrl + "savesignup2.php", formdata)
            .then((response) => {
                if (response.status == 200) {
                    toast({
                        variant: "success",
                        description: "Successfully details updated."
                    })
                    navigate('/upload-photo', { state: { newuserid: state?.newuserid } });
                }
                else {
                    toast({
                        variant: "destructive",
                        description: "Register has some error."
                    })
                }
            })
            .catch((error) => {
                toast({
                    variant: "destructive",
                    description: error.response.data.message,
                })
            })
            .finally(function () {
                stopLoading();
            });
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

    useEffect(() => {
        if (!state?.newuserid) {
            navigate('/login');
            return;
        }
    }, [])

    return (
        <>
            <div className='bg flex flex-col gap-2 justify-center items-center px-3'>
                <Loading loading={loading} />
                <Card className='p-0 mt-14 lg:w-2/3 w-full'>
                    <CardHeader className="text-center p-3">
                        <CardTitle className="text-primary text-xl">Register</CardTitle>
                        <CardDescription>Welcome to GetmeMarry.</CardDescription>
                    </CardHeader>
                    <CardContent className='p-3'>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)}>
                                <FormField
                                    control={form.control}
                                    name="profilecreated"
                                    render={({ field }) => (
                                        <FormItem className="space-y-1 mt-0">
                                            <FormLabel>Profile Created By</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select Profile Creator" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="Self">Self</SelectItem>
                                                    <SelectItem value="Parents/Guardian">Parents/Guardian</SelectItem>
                                                    <SelectItem value="Sibling">Sibling</SelectItem>
                                                    <SelectItem value="Friends">My Friend</SelectItem>
                                                    <SelectItem value="Others">Others</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="grid grid-cols-2 gap-3 mt-2">
                                    <FormField
                                        control={form.control}
                                        name="complexion"
                                        render={({ field }) => (
                                            <FormItem className="space-y-1">
                                                <FormLabel>Complexion</FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select Complexion" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="Very fair">Very fair</SelectItem>
                                                        <SelectItem value="Fair">Fair</SelectItem>
                                                        <SelectItem value="Wheatish">Wheatish</SelectItem>
                                                        <SelectItem value="Brown">Brown</SelectItem>
                                                        <SelectItem value="Dark Brown">Dark Brown</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="gotra"
                                        render={({ field }) => (
                                            <FormItem className="space-y-1">
                                                <FormLabel>Gotra</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Gotra" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-3 mt-2">
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
                                <div className="grid grid-cols-2 gap-3">
                                    <FormField
                                        control={form.control}
                                        name="horoscope"
                                        render={({ field }) => (
                                            <FormItem className="space-y-1 mt-2">
                                                <FormLabel>Horoscope</FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select Horoscope" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="Optional">Optional</SelectItem>
                                                        <SelectItem value="Yes">Yes</SelectItem>
                                                        <SelectItem value="No">No</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="manglik"
                                        render={({ field }) => (
                                            <FormItem className="space-y-1 mt-2">
                                                <FormLabel>Manglik</FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select Manglik" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="No">No</SelectItem>
                                                        <SelectItem value="Yes">Yes</SelectItem>
                                                        <SelectItem value="Don't Know">Don't Know</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                    <FormField
                                        control={form.control}
                                        name="diet"
                                        render={({ field }) => (
                                            <FormItem className="space-y-1 mt-2">
                                                <FormLabel>Diet</FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select diet type" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="Veg">Veg</SelectItem>
                                                        <SelectItem value="Non-Veg">Non-Veg</SelectItem>
                                                        <SelectItem value="Eggetarian">Eggetarian</SelectItem>
                                                        <SelectItem value="Jain">Jain</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="smoke"
                                        render={({ field }) => (
                                            <FormItem className="space-y-1 mt-2">
                                                <FormLabel>Smoke</FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Smoke" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="No">No</SelectItem>
                                                        <SelectItem value="Yes">Yes</SelectItem>
                                                        <SelectItem value="Occasionally">Occasionally</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="drink"
                                        render={({ field }) => (
                                            <FormItem className="space-y-1 mt-2">
                                                <FormLabel>Drink</FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Drink" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="No">No</SelectItem>
                                                        <SelectItem value="Yes">Yes</SelectItem>
                                                        <SelectItem value="Occasionally">Occasionally</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <FormField
                                        control={form.control}
                                        name="fatheroccupation"
                                        render={({ field }) => (
                                            <FormItem className="space-y-1 mt-2">
                                                <FormLabel>Father Occupation</FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select Father Occupation" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="Business/Enterpreneur">Business/Enterpreneur</SelectItem>
                                                        <SelectItem value="Service - Private">Service - Private</SelectItem>
                                                        <SelectItem value="Service - Govt./PSU">Service - Govt./PSU</SelectItem>
                                                        <SelectItem value="Defense/Armed Forces">Defense/Armed Forces</SelectItem>
                                                        <SelectItem value="Civil Services">Civil Services</SelectItem>
                                                        <SelectItem value="Professor/Teacher">Professor/Teacher</SelectItem>
                                                        <SelectItem value="Retired">Retired</SelectItem>
                                                        <SelectItem value="Not Employed">Not Employed</SelectItem>
                                                        <SelectItem value="Passed away">Passed away</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="motheroccupation"
                                        render={({ field }) => (
                                            <FormItem className="space-y-1 mt-2">
                                                <FormLabel>Mother Occupation</FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select Mother Occupation" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="Housewife">Housewife</SelectItem>
                                                        <SelectItem value="Business/Enterpreneur">Business/Enterpreneur</SelectItem>
                                                        <SelectItem value="Service - Private">Service - Private</SelectItem>
                                                        <SelectItem value="Service - Govt./PSU">Service - Govt./PSU</SelectItem>
                                                        <SelectItem value="Defense/Armed Forces">Defense/Armed Forces</SelectItem>
                                                        <SelectItem value="Civil Services">Civil Services</SelectItem>
                                                        <SelectItem value="Professor/Teacher">Professor/Teacher</SelectItem>
                                                        <SelectItem value="Retired">Retired</SelectItem>
                                                        <SelectItem value="Not Employed">Not Employed</SelectItem>
                                                        <SelectItem value="Passed away">Passed away</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <FormField
                                        control={form.control}
                                        name="brother"
                                        render={({ field }) => (
                                            <FormItem className="space-y-1 mt-2">
                                                <FormLabel>Brother</FormLabel>
                                                <Select onValueChange={(code) => {
                                                    field.onChange(code);
                                                    setBro(code);
                                                    setValue("brotherwhichmarried", "", { shouldValidate: false });
                                                }} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select no of brothers" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="1">1</SelectItem>
                                                        <SelectItem value="2">2</SelectItem>
                                                        <SelectItem value="3">3</SelectItem>
                                                        <SelectItem value="More">More</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="brotherwhichmarried"
                                        render={({ field }) => (
                                            <FormItem className="space-y-1 mt-2">
                                                <FormLabel>Brother which married</FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Brother which married" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {Array.from({ length: bro == "More" ? 4 : bro - 0 + 1 }, (_, i) => 0 + i).map((num, index) => (
                                                            <SelectItem key={index} value={`${num}`}>{num.toString().padStart(1, '0')}</SelectItem>
                                                        ))}
                                                        {bro == "More" ? <SelectItem value="All">All</SelectItem> : ""}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <FormField
                                        control={form.control}
                                        name="sister"
                                        render={({ field }) => (
                                            <FormItem className="space-y-1 mt-2">
                                                <FormLabel>Sister</FormLabel>
                                                <Select onValueChange={(code) => {
                                                    field.onChange(code);
                                                    setSis(code);
                                                    setValue("sisterwhichmarried", "", { shouldValidate: false });
                                                }} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select no of sisters" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="1">1</SelectItem>
                                                        <SelectItem value="2">2</SelectItem>
                                                        <SelectItem value="3">3</SelectItem>
                                                        <SelectItem value="More">More</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="sisterwhichmarried"
                                        render={({ field }) => (
                                            <FormItem className="space-y-1 mt-2">
                                                <FormLabel>Sister which married</FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Sister which married" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {Array.from({ length: sis == "More" ? 4 : sis - 0 + 1 }, (_, i) => 0 + i).map((num, index) => (
                                                            <SelectItem key={index} value={`${num}`}>{num.toString().padStart(1, '0')}</SelectItem>
                                                        ))}
                                                        {sis == "More" ? <SelectItem value="All">All</SelectItem> : ""}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <FormField
                                    control={form.control}
                                    name="address"
                                    render={({ field }) => (
                                        <FormItem className="space-y-1 mt-2">
                                            <FormLabel>Address</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="Enter Address" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="grid grid-cols-2 gap-3">
                                    <FormField
                                        control={form.control}
                                        name="areacode"
                                        render={({ field }) => (
                                            <FormItem className="space-y-1 mt-2">
                                                <FormLabel>Area Code</FormLabel>
                                                <FormControl>
                                                    <Input type="text" placeholder="Enter Area Code" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="alternatephone"
                                        render={({ field }) => (
                                            <FormItem className="space-y-1 mt-2">
                                                <FormLabel>Alternate Phone</FormLabel>
                                                <FormControl>
                                                    <Input type="text" placeholder="Enter Alternate Phone" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <FormField
                                    control={form.control}
                                    name="about"
                                    render={({ field }) => (
                                        <FormItem className="space-y-1 mt-2">
                                            <FormLabel>About myself</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="About myself" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="flex justify-center my-8">
                                    <Button type='submit' size='lg'>Update Profile</Button>
                                </div>
                            </form >
                        </Form >
                    </CardContent>
                    <CardFooter className="flex justify-center">
                        <Button onClick={() => navigate('/upload-photo', { state })} size="sm" variant="outline">Skip this page</Button>
                    </CardFooter>
                </Card>
            </div >
        </>
    )
}

export default Register2