import { Button } from "@/components/ui/button"
import { Card, CardContent, } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { cn } from "@/lib/utils"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns"
import { CalendarIcon } from "@radix-ui/react-icons"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { useSelector } from "react-redux"
import useLoading from "../../hook/loading";
import Loading from "../../components/global/loading";
import { Autocomplete } from "@/components/ui/autocomplete";
import dayjs from "dayjs";

const months = [
    { name: "January", value: '01' },
    { name: "February", value: '02' },
    { name: "March", value: '03' },
    { name: "April", value: '04' },
    { name: "May", value: '05' },
    { name: "June", value: '06' },
    { name: "July", value: '07' },
    { name: "August", value: '08' },
    { name: "September", value: '09' },
    { name: "October", value: '10' },
    { name: "November", value: '11' },
    { name: "December", value: '12' }
];


const formSchema = z.object({
    profilecreated: z.string(),
    firstname: z.string(),
    lastname: z.string(),
    username: z.string(),
    gender: z.string(),
    date: z.string(),
    month: z.string(),
    year: z.string(), // Using string here, you may convert it to Date during form submission or validation if needed.
    complexion: z.string(),
    gotra: z.string(),
    maritalstatus: z.string(),
    height: z.string(),
    birthhr: z.string(),
    birthmin: z.string(),
    birthplace: z.string(),
    specialcases: z.string(),
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
    religion: z.string(),
    mothertongue: z.string(),
    caste: z.string(),
    nocaste: z.boolean(),
    country: z.string(),
    mobile: z.string(),
    state: z.string(),
    city: z.string(),
    address: z.string(),
    alternatephone: z.string(),
    qualification: z.string(),
    employedin: z.string(),
    companyname: z.string(),
    profession: z.string(),
    annualincome: z.string(),
    about: z.string()
});


const EditProfile = () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const user = useSelector((state) => state.global.user.payload);
    const resource = useSelector((state) => state.global.resource.payload);
    const { toast } = useToast();
    const { loading, startLoading, stopLoading } = useLoading();
    const [bro, setBro] = useState(0);
    const [sis, setSis] = useState(0);
    const [country, setCountry] = useState([]);
    const [state, setState] = useState([]);
    const [city, setCity] = useState([]);
    const [dataReady, setDataReady] = useState(0);
    const [profile, setProfile] = useState({});
    const [bcity, setBCity] = useState([]);

    const getProfile = () => {
        startLoading();
        axios.get(apiUrl + 'profile.php', {
            params: {
                id: user.id,
            }
        })
            .then(function (response) {
                if (response.status == 200) {
                    setProfile({
                        ...response.data.data,
                        castenobar: response.data.data.castenobar === "1"
                    });
                    getCountry();
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

    const getIncomeKey = (val) => {
        const foundItem = resource.annual_income.find(item => item.value == val);
        return foundItem ? foundItem : "";
    };

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            profilecreated: "",
            firstname: "",
            lastname: "",
            username: "",
            gender: "",
            date: "",
            month: "",
            year: "",
            complexion: "",
            gotra: "",
            maritalstatus: "",
            height: "",
            birthhr: "",
            birthmin: "",
            birthplace: "",
            specialcases: "",
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
            religion: "",
            mothertongue: "",
            caste: "",
            nocaste: false,
            country: "",
            mobile: "",
            state: "",
            city: "",
            address: "",
            alternatephone: "",
            qualification: "",
            employedin: "",
            companyname: "",
            profession: "",
            annualincome: "",
            about: ""
        },
    })

    const { getValues, setValue, reset } = form;

    const getCountry = () => {
        startLoading();
        axios.get(apiUrl + 'country.php')
            .then(response => {
                if (response.data.status === "Ok") {
                    setCountry(response.data.data.country);
                }
            })
            .catch(error => {
                console.error(error);
                stopLoading();
            })
    }

    const getState = (code) => {
        axios.get(apiUrl + 'state.php', {
            params: {
                country_code: code
            }
        })
            .then(response => {
                if (response.data.status === "Ok") {
                    setState(response.data.data);
                }
            })
            .catch(error => {
                console.error(error);
                stopLoading();
            })
    }

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
            })
            .finally(function () {
                stopLoading();
            });
    };


    const onSubmit = (values) => {
        doUpdate(values);
    }

    const doUpdate = (values) => {
        startLoading();
        let formdata = new FormData();
        formdata.append('profile_created', values.profilecreated);
        formdata.append('txtfirstname', values.firstname);
        formdata.append('txtlastname', values.lastname);
        formdata.append('txtemail', values.username);
        formdata.append('txtgender', values.gender === 'm' ? ' male' : ' female');
        formdata.append('txtbirthMonth', values.month);
        formdata.append('txtbirthDay', values.date);
        formdata.append('txtbirthYear', values.year);
        formdata.append('txtcomplexion', values.complexion);
        formdata.append('txtmaritalstatus', values.maritalstatus);
        formdata.append('txtnchildren', '0');
        formdata.append('txtbirthhr', values.birthhr);
        formdata.append('txtbirthmin', values.birthmin);
        formdata.append('txtbirthcity', values.birthplace);
        formdata.append('txtheight', values.height); // Assuming a default height
        formdata.append('txtgotra', values.gotra);
        formdata.append('Special_cases', values.specialcases);
        formdata.append('txthoroscope', values.horoscope);
        formdata.append('txtmanglik', values.manglik);
        formdata.append('txtdiet', values.diet);
        formdata.append('txtsmoke', values.smoke);
        formdata.append('txtdrink', values.drink);
        formdata.append('txtf_occupation', values.fatheroccupation);
        formdata.append('txtm_occupation', values.motheroccupation);
        formdata.append('txtbrother', values.brother);
        formdata.append('txtbrother_cases', values.brotherwhichmarried);
        formdata.append('txtsister', values.sister);
        formdata.append('txtsister_cases', values.sisterwhichmarried);
        formdata.append('txtreligion', values.religion);
        formdata.append('txtmother_tongue', values.mothertongue);
        formdata.append('txtcaste', values.caste);
        formdata.append('txtcastenobar', values.nocaste ? '1' : '0');
        formdata.append('txtfrom', values.country);
        formdata.append('txtmobile', values.mobile);
        formdata.append('txtstateuser', values.state);
        formdata.append('txtcityuser', values.city);
        formdata.append('txtaddress1', values.address);
        formdata.append('txtphone', values.alternatephone);
        formdata.append('txtqualification', values.qualification);
        formdata.append('txtoccupation', values.employedin);
        formdata.append('txtin', values.companyname); // Assuming this is the company name
        formdata.append('txtprofessional_str', values.profession);
        formdata.append('txtincome', values.annualincome); // Assuming this is the income field
        formdata.append('about_me', values.about);
        formdata.append('txtzip', '90001'); // Assuming a default zip code

        // Send the request
        axios.post(apiUrl + "modifyuser.php", formdata, {
            params: {
                token: user.token
            }
        })
            .then((response) => {
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

    const setData = () => {
        if (profile && Object.keys(profile)?.length > 0) {
            const [year, month, date] = profile.birth_date.split('-');
            //console.log(date)
            reset({
                profilecreated: profile.profile_created || "",
                firstname: profile.firstname || "",
                lastname: profile.lastname || "",
                username: profile.email || "",
                gender: profile.gender || "",
                date: date || "",
                month: month || "",
                year: year,
                complexion: profile.complexion || "",
                gotra: profile.gotra || "",
                maritalstatus: profile.maritalstatus || "",
                height: profile.height_number || "",
                birthhr: profile.birth_hr || "",
                birthmin: profile.birth_min || "",
                birthplace: profile.birth_city || "",
                specialcases: profile.special_cases || "",
                horoscope: profile.horoscope || "",
                manglik: profile.manglik || "",
                diet: profile.diet || "",
                smoke: profile.smoke || "",
                drink: profile.drink || "",
                fatheroccupation: profile.f_occupation || "",
                motheroccupation: profile.m_occupation || "",
                brother: profile.brother || "",
                brotherwhichmarried: profile.brother_cases || "",
                sister: profile.sister,
                sisterwhichmarried: profile.sister_cases || "",
                religion: profile.religion || "",
                mothertongue: profile.mother_tongue || "",
                caste: profile.caste || "",
                nocaste: profile.castenobar == "1" ? true : false || false,
                country: profile.country || "",
                mobile: profile.mobile || "",
                state: profile.state_province || "",
                city: profile.city || "",
                address: profile.address_line1 || "",
                alternatephone: profile.phone || "",
                qualification: profile.qualification,
                employedin: profile.occupation || "",
                companyname: profile.employed_in || "",
                profession: profile.professional_str || "",
                annualincome: getIncomeKey(profile.income).key || "",
                about: profile.about_me || ""
            });
        }
    };

    useEffect(() => {
        if (country?.length !== 0)
            getState(profile.country);
    }, [country]);

    useEffect(() => {
        if (state?.length !== 0)
            getCity(profile.country, profile.state_province);
    }, [state]);

    useEffect(() => {
        getProfile();
    }, []);

    useEffect(() => {
        if (dataReady < 5) {
            setData();
            setDataReady(prevData => prevData + 1);
        }
    }, [country, state, city]);

    return (
        <>
            <div className='bg flex flex-col gap-2 justify-center items-center px-3'>
                <div className="section-title text-center relative pb-3 my-12">
                    <h5 className="font-bold text-2xl text-primary uppercase">Edit Profile</h5>
                    <p className="font-bold text-4xl">Tailor Your Profile</p>
                </div>
                <Loading loading={loading} />
                <Card className='p-0 mt-0 lg:w-2/3 w-full'>
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
                                <div className="grid grid-cols-2 gap-3">
                                    <FormField
                                        control={form.control}
                                        name="firstname"
                                        render={({ field }) => (
                                            <FormItem className="space-y-1 mt-1">
                                                <FormLabel>First Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="First Name" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="lastname"
                                        render={({ field }) => (
                                            <FormItem className="space-y-1 mt-1">
                                                <FormLabel>Last Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Last Name" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <FormField
                                    control={form.control}
                                    name="username"
                                    render={({ field }) => (
                                        <FormItem className="space-y-1 mt-2">
                                            <FormLabel>Email/Mobile</FormLabel>
                                            <FormControl>
                                                <Input type='email' disabled={profile.email_status == 1} placeholder="Email/Mobile" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <FormField
                                        control={form.control}
                                        name="gender"
                                        render={({ field }) => (
                                            <FormItem className="space-y-1 mt-1">
                                                <FormLabel>Select Gender</FormLabel>
                                                <FormControl>
                                                    <Card className="shadow-sm px-2 py-2 rounded-md">
                                                        <RadioGroup
                                                            onValueChange={field.onChange}
                                                            value={field.value}
                                                            className="flex gap-3"
                                                        >
                                                            <FormItem className="flex items-center space-x-3 space-y-0">
                                                                <FormControl>
                                                                    <RadioGroupItem value="m" />
                                                                </FormControl>
                                                                <FormLabel className="font-normal">
                                                                    Male
                                                                </FormLabel>
                                                            </FormItem>
                                                            <FormItem className="flex items-center space-x-3 space-y-0">
                                                                <FormControl>
                                                                    <RadioGroupItem value="f" />
                                                                </FormControl>
                                                                <FormLabel className="font-normal">
                                                                    Female
                                                                </FormLabel>
                                                            </FormItem>
                                                        </RadioGroup>
                                                    </Card>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <div className="flex gap-2">
                                        <FormField
                                            control={form.control}
                                            name="date"
                                            render={({ field }) => (
                                                <FormItem className="space-y-1 flex-1">
                                                    <FormLabel>Date of birth</FormLabel>
                                                    <Select onValueChange={field.onChange} value={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Date" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {Array.from({ length: 31 }, (_, i) => (1 + i).toString().padStart(2, '0')).map((num, index) => (
                                                                <SelectItem key={index} value={num}>{num}</SelectItem>
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
                                                    <Select onValueChange={field.onChange} value={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Month" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {months.map((item, index) => (
                                                                <SelectItem key={index} value={item.value}>{item.name}</SelectItem>
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
                                                    <Select onValueChange={field.onChange} value={field.value}>
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
                                </div>
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
                                    <FormField
                                        control={form.control}
                                        name="maritalstatus"
                                        render={({ field }) => (
                                            <FormItem className="space-y-1">
                                                <FormLabel>Marital Status</FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select Marital Status" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="Unmarried">Unmarried</SelectItem>
                                                        <SelectItem value="Divorced">Divorced</SelectItem>
                                                        <SelectItem value="Widow/Widower">Widow/Widower</SelectItem>
                                                        <SelectItem value="Saparated">Saparated</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="height"
                                        render={({ field }) => (
                                            <FormItem className="space-y-1">
                                                <FormLabel>Height</FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select Height" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {resource?.height?.map((item, index) => {
                                                            return (
                                                                <SelectItem key={index} value={`${item.key}`}>{item.value}</SelectItem>
                                                            )
                                                        })}
                                                    </SelectContent>
                                                </Select>
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
                                <FormField
                                    control={form.control}
                                    name="specialcases"
                                    render={({ field }) => (
                                        <FormItem className="space-y-1 mt-2">
                                            <FormLabel>Special Cases</FormLabel>
                                            <FormControl>
                                                <Card className="shadow-sm px-4 py-2 rounded-md">
                                                    <RadioGroup
                                                        onValueChange={field.onChange}
                                                        value={field.value}
                                                        className="flex justify-between"
                                                    >
                                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                                            <FormControl>
                                                                <RadioGroupItem value="Not Applicable" />
                                                            </FormControl>
                                                            <FormLabel className="font-normal">
                                                                Not Applicable
                                                            </FormLabel>
                                                        </FormItem>
                                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                                            <FormControl>
                                                                <RadioGroupItem value="Physically Challenged" />
                                                            </FormControl>
                                                            <FormLabel className="font-normal">
                                                                Physically Challenged
                                                            </FormLabel>
                                                        </FormItem>
                                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                                            <FormControl>
                                                                <RadioGroupItem value="HIV Positive" />
                                                            </FormControl>
                                                            <FormLabel className="font-normal">
                                                                HIV Positive
                                                            </FormLabel>
                                                        </FormItem>
                                                    </RadioGroup>
                                                </Card>
                                            </FormControl>

                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
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
                                <div className="grid grid-cols-2 gap-3">
                                    <FormField
                                        control={form.control}
                                        name="religion"
                                        render={({ field }) => (
                                            <FormItem className="space-y-1 mt-2">
                                                <FormLabel>Religion</FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select Religion" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {resource?.religion?.map((item, index) => {
                                                            return (
                                                                <SelectItem key={index} value={item.key}>{item.value}</SelectItem>
                                                            )
                                                        })}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="mothertongue"
                                        render={({ field }) => (
                                            <FormItem className="space-y-1 mt-2">
                                                <FormLabel>Mother Tongue</FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select Mother Tongue" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {resource?.mothertongue?.map((item, index) => {
                                                            return (
                                                                <SelectItem key={index} value={item.key}>{item.value}</SelectItem>
                                                            )
                                                        })}
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
                                        name="caste"
                                        render={({ field }) => (
                                            <FormItem className="space-y-1 mt-2">
                                                <FormLabel>Caste</FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select Caste" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {resource?.castes?.map((item, index) => {
                                                            return (
                                                                <SelectItem key={index} value={item.key}>{item.value}</SelectItem>
                                                            )
                                                        })}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="nocaste"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col gap-3 space-y-0 mt-4">
                                                <FormLabel>Caste bar<br></br></FormLabel>
                                                <div className="flex flex-row gap-2">
                                                    <FormControl>
                                                        <Checkbox
                                                            checked={field.value}
                                                            onCheckedChange={field.onChange}
                                                        />
                                                    </FormControl>
                                                    <FormLabel>Caste no bar</FormLabel>
                                                </div>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-3 mt-2">
                                    <FormField
                                        control={form.control}
                                        name="country"
                                        render={({ field }) => (
                                            <FormItem className="space-y-1">
                                                <FormLabel>Country</FormLabel>
                                                <Select onValueChange={(code) => {
                                                    field.onChange(code);
                                                    getState(code);
                                                    setValue('state', "", { shouldValidate: true });
                                                    setValue('city', "", { shouldValidate: true });
                                                }} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select Country" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {country?.map((item, index) => (
                                                            <SelectItem key={index} value={item.code}>
                                                                {item.dial_code + " " + item.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="mobile"
                                        render={({ field }) => (
                                            <FormItem className="space-y-1">
                                                <FormLabel>Mobile</FormLabel>
                                                <FormControl>
                                                    <Input disabled={profile.mobile_status == 1} type='number' placeholder="Mobile" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <FormField
                                        control={form.control}
                                        name="state"
                                        render={({ field }) => (
                                            <FormItem className="space-y-1 mt-2">
                                                <FormLabel>State</FormLabel>
                                                <Select onValueChange={(code) => {
                                                    field.onChange(code);
                                                    getCity(getValues('country'), code);
                                                    setValue('city', "", { shouldValidate: true })
                                                }} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select State" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {state?.map((item, index) => (
                                                            <SelectItem key={index} value={item.code}>
                                                                {item.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="city"
                                        render={({ field }) => (
                                            <FormItem className="space-y-1 mt-2">
                                                <FormLabel>City</FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select City" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {city?.map((item, index) => (
                                                            <SelectItem key={index} value={item.code}>
                                                                {item.name}
                                                            </SelectItem>
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
                                        name="alternatephone"
                                        render={({ field }) => (
                                            <FormItem className="space-y-1 mt-2">
                                                <FormLabel>Alternate Phone</FormLabel>
                                                <FormControl>
                                                    <Input type="number" placeholder="Enter Alternate Phone" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="qualification"
                                        render={({ field }) => (
                                            <FormItem className="space-y-1 mt-2">
                                                <FormLabel>Qualification</FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select Qualification" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {resource?.qualification?.map((item, index) => {
                                                            return (
                                                                <SelectItem key={index} value={item.key}>{item.value}</SelectItem>
                                                            )
                                                        })}
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
                                        name="employedin"
                                        render={({ field }) => (
                                            <FormItem className="space-y-1 mt-2">
                                                <FormLabel>Employed In</FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select Employed In" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {resource?.employed_in?.map((item, index) => {
                                                            return (
                                                                <SelectItem key={index} value={item.key}>{item.value}</SelectItem>
                                                            )
                                                        })}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="companyname"
                                        render={({ field }) => (
                                            <FormItem className="space-y-1 mt-2">
                                                <FormLabel>Company Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Enter Company Name" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <FormField
                                        control={form.control}
                                        name="profession"
                                        render={({ field }) => (
                                            <FormItem className="space-y-1 mt-2">
                                                <FormLabel>Profession</FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select Profession" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {resource?.profession?.map((item, index) => {
                                                            return (
                                                                <SelectItem key={index} value={item.key}>{item.value}</SelectItem>
                                                            )
                                                        })}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="annualincome"
                                        render={({ field }) => (
                                            <FormItem className="space-y-1 mt-2">
                                                <FormLabel>Annual Income</FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select Annual Income" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {resource?.annual_income?.map((item, index) => {
                                                            return (
                                                                <SelectItem key={index} value={`${item.key}`}>{item.value}</SelectItem>
                                                            )
                                                        })}
                                                    </SelectContent>
                                                </Select>
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
                </Card>
            </div >
        </>
    )
}

export default EditProfile