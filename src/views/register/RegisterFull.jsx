import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { useDispatch, useSelector } from "react-redux"
import useLoading from "../../hook/loading"
import Loading from "../../components/global/loading"
import dayjs from "dayjs"
import { Cached } from "@mui/icons-material"
import { setToken } from "../../store/globalSlice";

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

    username: z.string().min(8, {
        message: "Please enter a valid email/mobile.",
    }),
    password: z.string().min(4, {
        message: "Password must be at least 4 characters.",
    }),
    firstname: z.string().min(2, {
        message: "Please enter a valid name.",
    }),
    lastname: z.string().min(1, {
        message: "Please enter a valid last name.",
    }),
    gender: z.string().min(1, {
        message: "Please select gender.",
    }),
    date: z.string().min(1, {
        message: "Select Date",
    }),
    month: z.string().min(1, {
        message: "Select Month",
    }),
    year: z.string().min(1, {
        message: "Select Year",
    }),
    maritalstatus: z.string().min(1, {
        message: "Please enter a marital status.",
    }),
    havechildren: z.string(),
    height: z.string().min(1, {
        required_error: "Height is required",
    }),
    specialcases: z.string().min(3, {
        message: "Please select special cases.",
    }),
    religion: z.string().min(3, {
        message: "Please select religion.",
    }),
    mothertongue: z.string().min(3, {
        message: "Please select mothertongue.",
    }),
    caste: z.string().min(3, {
        message: "Please select caste.",
    }),
    nocaste: z.boolean({
        message: "Cast must be boolean.",
    }),
    country: z.string().min(2, {
        message: "Please select Country.",
    }),
    mobile: z.string().min(0, {
        message: "Mobile Number is required.",
    }),
    state: z.string().min(0, {
        message: "Please select State.",
    }),
    city: z.string().min(0, {
        message: "Please select City.",
    }),
    qualification: z.string().min(2, {
        message: "Please select Qualification.",
    }),
    employedin: z.string().min(2, {
        message: "Please select Employed In.",
    }),
    workingat: z.string(),

    profession: z.string().min(2, {
        message: "Please select Profession.",
    }),
    annualincome: z.string().min(1, {
        message: "Please select Annual Income.",
    }),
    captcha: z.string().min(4, {
        message: "Please enter Captcha.",
    }),
})

const RegisterFull = () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const domainUrl = import.meta.env.VITE_DOMAIN_URL;
    const resource = useSelector((state) => state.global.resource.payload);
    const { toast } = useToast();
    const dispatch = useDispatch();
    const { loading, startLoading, stopLoading } = useLoading();
    const navigate = useNavigate();
    const [haveChildren, setHaveChildren] = useState(false);
    const [otherEmployee, setOtherEmployee] = useState(false);
    const [dcity, setDCity] = useState(false);
    const [mobileView, setMobileView] = useState(false);
    const [captchaImage, setCaptchaImage] = useState('');
    const [captchaText, setCaptchaText] = useState('');
    const [country, setCountry] = useState([]);
    const [state, setState] = useState([]);
    const [city, setCity] = useState([]);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstname: "",
            lastname: "",
            gender: "",
            date: "",
            month: "",
            year: "",
            username: "",
            password: "",
            maritalstatus: "",
            havechildren: "",
            height: "",
            specialcases: "",
            religion: "",
            mothertongue: "",
            caste: "",
            nocaste: false,
            country: "IN##+91",
            mobile: "",
            state: "",
            city: "",
            qualification: "",
            employedin: "",
            workingat: "",
            profession: "",
            annualincome: "",
            captcha: ""
        },
    })

    const handleBlur = (e) => {
        e.target.value !== "" ? setMobileView(isNaN(e.target.value)) : setMobileView(true);
    }

    const getCountry = () => {
        axios.get(apiUrl + 'country.php')
            .then(response => {
                if (response.data.status === "Ok") {
                    setCountry(response.data.data.country);
                }
            })
            .catch(error => {
                console.error(error);
            });
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
            });
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
            });
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

    const { getValues, setValue, reset } = form;
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

        let formData = new FormData();
        formData.append('txtfirstname', values.firstname);
        formData.append('txtlastname', values.lastname);
        formData.append('txtgender', values.gender);
        formData.append('txtbirthDay', values.date);
        formData.append('txtbirthMonth', values.month);
        formData.append('txtbirthYear', values.year);
        formData.append('txtmaritalstatus', values.maritalstatus);
        formData.append('txtnchildren', values.havechildren);
        formData.append('txtheight', values.height);
        formData.append('Special_cases', values.specialcases);
        formData.append('txtreligion', values.religion);
        formData.append('txtmother_tongue', values.mothertongue);
        formData.append('txtcaste', values.caste);
        formData.append('txtcastenobar', values.nocaste ? 1 : 0);
        formData.append('txtfrom', values.country);
        formData.append('txtstateuser', values.state);
        formData.append('txtcityuser', values.city);
        formData.append('txtqualification', values.qualification);
        formData.append('txtoccupation', values.employedin);
        formData.append('txtin', values.workingat);
        formData.append('txtprofessional_str', values.profession);
        formData.append('txtincome', values.annualincome);
        formData.append('txttimezone', "0.0");
        formData.append('txtviewonline', '1');
        formData.append('txtemail', values.username);
        formData.append('txtmobile', values.mobile);
        formData.append('txtpassword', values.password);
        startLoading();
        // Send the request
        axios.post(apiUrl + "savesignup.php", formData)
            .then((response) => {
                if (response.data.message == "ok") {
                    toast({
                        variant: "success",
                        description: "Successfully Register."
                    })
                    reset({
                        firstname: "",
                        lastname: "",
                        gender: "",
                        date: "",
                        month: "",
                        year: "",
                        username: "",
                        password: "",
                        maritalstatus: "",
                        havechildren: "",
                        height: "",
                        specialcases: "",
                        religion: "",
                        mothertongue: "",
                        caste: "",
                        nocaste: false,
                        country: "",
                        mobile: "",
                        state: "",
                        city: "",
                        qualification: "",
                        employedin: "",
                        profession: "",
                        annualincome: "",
                        captcha: ""
                    })
                    dispatch(setToken(response.data.token));
                    navigate('/register-2', { state: { newuserid: response.data.data } });
                }
                else {
                    toast({
                        variant: "destructive",
                        description: response.data.message,
                    })
                }
            })
            .catch((error) => {
                console.error(error);
                toast({
                    variant: "destructive",
                    description: error.response.data.message,
                })
            })
            .finally(function () {
                stopLoading();
                fetchCaptcha();
            });
    }

    useEffect(() => {
        getCountry();
        getState('IN');
        fetchCaptcha();
    }, []);

    return (
        <>
            <Loading loading={loading} />
            <div className="bg flex flex-col gap-2 justify-center items-center my-3">
                <Card className='mx-2 lg:w-2/3 w-full mt-10'>
                    <CardHeader className="text-center p-3">
                        <CardTitle className="text-primary text-xl">Register</CardTitle>
                        <CardDescription>Welcome to GetmeMarry.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)}>
                                <FormField
                                    control={form.control}
                                    name="username"
                                    render={({ field }) => (
                                        <FormItem className="space-y-1 mt-2">
                                            <FormLabel>Email/Mobile</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Email/Mobile" {...field} onBlur={handleBlur} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem className="space-y-1 mt-2">
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <Input type="password" placeholder="Password" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="grid grid-cols-2 gap-5">
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
                                <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-5 gap-2">
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
                                                            defaultValue={field.value}
                                                            className="flex gap-3"
                                                        >
                                                            <FormItem className="flex items-center space-x-3 space-y-0">
                                                                <FormControl>
                                                                    <RadioGroupItem value="M" />
                                                                </FormControl>
                                                                <FormLabel className="font-normal">
                                                                    Male
                                                                </FormLabel>
                                                            </FormItem>
                                                            <FormItem className="flex items-center space-x-3 space-y-0">
                                                                <FormControl>
                                                                    <RadioGroupItem value="F" />
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
                                </div>
                                <div className="grid grid-cols-2 gap-5 mt-2">
                                    <FormField
                                        control={form.control}
                                        name="maritalstatus"
                                        render={({ field }) => (
                                            <FormItem className="space-y-1">
                                                <FormLabel>Marital Status</FormLabel>
                                                <Select onValueChange={(code) => {
                                                    field.onChange(code);
                                                    setHaveChildren(getValues('maritalstatus') !== 'Unmarried' || getValues('maritalstatus') == "" ? true : false);
                                                    getValues('maritalstatus') == 'Unmarried' ? setValue('havechildren', "", { shouldValidate: true }) : "";
                                                }} defaultValue={field.value}>
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
                                    {haveChildren &&
                                        <FormField
                                            control={form.control}
                                            name="havechildren"
                                            render={({ field }) => (
                                                <FormItem className="space-y-1">
                                                    <FormLabel>Have Children</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select Children" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="No">No</SelectItem>
                                                            <SelectItem value="Yes, Living together">Yes, Living together</SelectItem>
                                                            <SelectItem value="Yes, Not living together">Yes, Not living together</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    }
                                </div>
                                <FormField
                                    control={form.control}
                                    name="height"
                                    render={({ field }) => (
                                        <FormItem className="space-y-1 mt-2">
                                            <FormLabel>Height</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                                                        defaultValue={field.value}
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
                                <div className="grid grid-cols-2 gap-5">
                                    <FormField
                                        control={form.control}
                                        name="religion"
                                        render={({ field }) => (
                                            <FormItem className="space-y-1 mt-2">
                                                <FormLabel>Religion</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                                <div className="grid grid-cols-2 gap-5">
                                    <FormField
                                        control={form.control}
                                        name="caste"
                                        render={({ field }) => (
                                            <FormItem className="space-y-1 mt-2">
                                                <FormLabel>Caste</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                                            <FormItem className="flex flex-col gap-5 space-y-0 mt-4">
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
                                <div className="grid grid-cols-2 gap-5 mt-2">
                                    <FormField
                                        control={form.control}
                                        name="country"
                                        render={({ field }) => (
                                            <FormItem className="space-y-1">
                                                <FormLabel>Country</FormLabel>
                                                <Select onValueChange={(code) => {
                                                    field.onChange(code);
                                                    getState(code.match(/^[A-Z]+/)[0]);
                                                    setDCity(code == "IN##+91" ? false : true);
                                                    if (code !== "IN") { setValue('state', "", { shouldValidate: true }); setState([]) }
                                                    if (code !== "IN") { setValue('city', "", { shouldValidate: true }); setCity([]) }
                                                }} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select Country" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {country?.map((item, index) => (
                                                            <SelectItem key={index} value={item.code + '##' + item.dial_code}>
                                                                {item.name + " " + item.dial_code}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    {mobileView && <FormField
                                        control={form.control}
                                        name="mobile"
                                        render={({ field }) => (
                                            <FormItem className="space-y-1">
                                                <FormLabel>Mobile</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Mobile" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />}
                                </div>
                                <div className="grid grid-cols-2 gap-5">
                                    <FormField
                                        control={form.control}
                                        name="state"
                                        render={({ field }) => (
                                            <FormItem className="space-y-1 mt-2">
                                                <FormLabel>State</FormLabel>
                                                <Select onValueChange={(code) => {
                                                    field.onChange(code);
                                                    getCity(getValues('country').match(/^[A-Z]+/)[0], code);
                                                }} defaultValue={field.value}>
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
                                                <Select disabled={dcity} onValueChange={field.onChange} defaultValue={field.value}>
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
                                    name="qualification"
                                    render={({ field }) => (
                                        <FormItem className="space-y-1 mt-2">
                                            <FormLabel>Qualification</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                                <div className="grid grid-cols-2 gap-5">
                                    <FormField
                                        control={form.control}
                                        name="employedin"
                                        render={({ field }) => (
                                            <FormItem className="space-y-1 mt-2">
                                                <FormLabel>Employed In</FormLabel>
                                                <Select onValueChange={(code) => {
                                                    field.onChange(code);
                                                    setOtherEmployee(getValues('employedin') == 'Non Working / Unemployed' ? false : true);
                                                    getValues('employedin') !== 'Other' ? setValue('workingat', "", { shouldValidate: true }) : "";
                                                }} defaultValue={field.value}>
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
                                    {otherEmployee && <FormField
                                        control={form.control}
                                        name="workingat"
                                        render={({ field }) => (
                                            <FormItem className="space-y-1 mt-2">
                                                <FormLabel>Working At</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Working At" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />}
                                </div>
                                <div className="grid grid-cols-2 gap-5">
                                    <FormField
                                        control={form.control}
                                        name="profession"
                                        render={({ field }) => (
                                            <FormItem className="space-y-1 mt-2">
                                                <FormLabel>Profession</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                                                    <img className="rounded-md" src={captchaImage} alt="CAPTCHA" />
                                                    <Cached fontSize="small" className="cursor-pointer" onClick={() => fetchCaptcha()} />
                                                </div>
                                            </FormItem>
                                        )}

                                    />

                                </div>
                                <div className="flex justify-center mt-10">
                                    <Button type='submit' size='lg'>Create Account</Button>
                                </div>
                            </form >
                        </Form >
                    </CardContent>
                    <CardFooter className="flex justify-center">
                        <Button onClick={() => navigate('/login')} size="sm" variant="outline">"Already a Member!</Button>
                    </CardFooter>
                </Card>
            </div >
        </>
    )
}

export default RegisterFull