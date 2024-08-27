import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useDispatch, useSelector } from "react-redux"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SearchOutlined } from '@mui/icons-material'
import { setPartner } from "../store/globalSlice";
import useLoading from "../hook/loading";
import Loading from "../components/global/loading";
import { useToast } from "@/components/ui/use-toast"

const formSchema = z.object({

    lookingfor: z.string().min(1, {
        message: "Please select profile for",
    }),
    maritalstatus: z.string().min(2, {
        message: "Please enter a marital status.",
    }),
    ageto: z.string().min(2, {
        required_error: "Age is required",
    }),
    agefrom: z.string().min(2, {
        required_error: "Age is required",
    }),
    manglik: z.string().min(2, {
        required_error: "Height is required",
    }),
    specialcases: z.string().min(3, {
        message: "Please select special cases.",
    }),
    qualification: z.string().min(3, {
        message: "Please select Qualification.",
    }),
    employedin: z.string().min(3, {
        message: "Please select Employed In.",
    }),
    profession: z.string().min(3, {
        message: "Please select Profession.",
    }),
    heightto: z.string().min(1, {
        required_error: "Height is required",
    }),
    heightfrom: z.string().min(1, {
        required_error: "Height is required",
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
    state: z.string().min(2, {
        message: "Please select State.",
    }),
    city: z.string().min(3, {
        message: "Please select City.",
    }),
    annualincome: z.string().min(1, {
        message: "Please select Annual Income.",
    }),
    withphoto: z.boolean({
        message: "Cast must be boolean.",
    }),
})

const Search = () => {

    const apiUrl = import.meta.env.VITE_API_URL;
    const resource = useSelector((state) => state.global?.resource?.payload);
    const partner = useSelector((state) => state.global?.partner?.payload);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { toast } = useToast();
    const { loading, startLoading, stopLoading } = useLoading();
    const [idValue, setIdValue] = useState("");
    const [tabValue, setTabValue] = useState(partner?.tabValue || 'data');
    const [flag, setFlag] = useState(false);
    const [country, setCountry] = useState([]);
    const [state, setState] = useState([]);
    const [city, setCity] = useState([]);
    const [dataReady, setDataReady] = useState(0);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            lookingfor: "F",
            maritalstatus: "Doesn't Matter",
            agefrom: "18",
            ageto: "70",
            manglik: "Doesn't Matter",
            specialcases: "Doesn't Matter",
            employedin: "Doesn't Matter",
            qualification: "Doesn't Matter",
            profession: "Doesn't Matter",
            heightfrom: "Doesn't Matter",
            heightto: "Doesn't Matter",
            religion: "Doesn't Matter",
            mothertongue: "Doesn't Matter",
            caste: "Doesn't Matter",
            nocaste: false,
            country: "India All",
            state: "Doesn't Matter",
            city: "Doesn't Matter",
            annualincome: "Doesn't Matter",
            withphoto: false
        },
    })

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
        if (code == "Doesn't Matter") {
            setDataReady(prevData => prevData + 2);
            stopLoading();
            return;
        }

        axios.get(apiUrl + 'state.php', {
            params: {
                country_code: code == "India All" ? "IN" : code
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
            });
    }

    const getCity = (countryCode, stateCode) => {
        if (stateCode == "Doesn't Matter" || stateCode == undefined) {
            setDataReady(prevData => prevData + 1);
            stopLoading();
            return;
        }
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
                else {
                    setDataReady(prevData => prevData + 1);
                }
            })
            .catch(error => {
                console.error(error);
            })
            .finally(function () {
                stopLoading();
            });
    }

    const { setValue, reset } = form;
    const onSubmit = (values) => {
        doSearch(values);
    }

    const doSearch = (values) => {
        dispatch(setPartner({ tabValue: tabValue, ...values }));
        navigate('/search/searchresult/1')
    }

    const handleTabChange = (val) => {
        dispatch(setPartner({ ...partner, tabValue: val }));
        setTabValue(val);
    }

    const handleReset = () => {
        reset({
            lookingfor: "F",
            maritalstatus: "Doesn't Matter",
            agefrom: "18",
            ageto: "70",
            manglik: "Doesn't Matter",
            specialcases: "Doesn't Matter",
            employedin: "Doesn't Matter",
            qualification: "Doesn't Matter",
            profession: "Doesn't Matter",
            heightfrom: "Doesn't Matter",
            heightto: "Doesn't Matter",
            religion: "Doesn't Matter",
            mothertongue: "Doesn't Matter",
            caste: "Doesn't Matter",
            nocaste: false,
            country: "India All",
            state: "Doesn't Matter",
            city: "Doesn't Matter",
            annualincome: "Doesn't Matter",
            withphoto: false
        });

        toast({
            variant: "success",
            description: "Form reset successfully.",
        });
    }
    useEffect(() => {
        if (country?.length !== 0)
            getState("IN");
    }, [country]);

    useEffect(() => {
        if (state?.length !== 0)
            getCity("IN", partner?.state);
    }, [state]);

    useEffect(() => {
        getCountry();
    }, []);

    useEffect(() => {
        if (dataReady < 4) {
            reset(partner);
            setDataReady(prevData => prevData + 1);
        }
    }, [country, state, city]);

    return (
        <div className="bg">
            <Loading loading={loading && tabValue == "data"} />
            <div className="section-title text-center relative pb-3 pt-16 wow fadeInUp" data-wow-delay="0.1s">
                <h5 className="font-bold text-2xl text-primary uppercase">Find the perfect matches you</h5>
                <p className="font-bold text-4xl">Search your partner</p>
            </div>
            <div className="flex flex-col gap-2 justify-center items-center mt-8 p-3">
                <Tabs value={tabValue} onValueChange={handleTabChange} className="lg:w-2/3 w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="data">Partner Search</TabsTrigger>
                        <TabsTrigger value="idsearch">Search by Profile Id</TabsTrigger>
                    </TabsList>
                    <TabsContent value="idsearch">
                        <Card>
                            <CardContent className="flex gap-3 p-3">
                                <div className="flex-1">
                                    <Input value={idValue} onChange={(e) => setIdValue(e.target.value)} type="email" placeholder="Enter Profile ID" />
                                    {idValue.length < 3 ? <p className="text-sm mt-2 text-red-500">Please Enter Name or Profile ID</p> : ""}
                                </div>
                                <Button onClick={() => idValue.length > 2 && navigate('/profile/' + idValue)}>FIND<SearchOutlined sx={{ fontSize: "20px", marginLeft: "5px" }} /></Button>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="data">
                        <Card>
                            <CardContent className="flex gap-3 p-3">
                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
                                        <FormField
                                            control={form.control}
                                            name="lookingfor"
                                            render={({ field }) => (
                                                <FormItem className="space-y-1 mt-2">
                                                    <FormLabel>Looking for</FormLabel>
                                                    <FormControl>
                                                        <ToggleGroup
                                                            onValueChange={field.onChange}
                                                            value={field.value}
                                                            type='single'
                                                            size="sm"
                                                            variant="outline"
                                                            className='flex flex-wrap justify-start gap-5'
                                                        >
                                                            <ToggleGroupItem className="flex-1" value="M">Groom</ToggleGroupItem>
                                                            <ToggleGroupItem className="flex-1" value="F">Bride</ToggleGroupItem>
                                                        </ToggleGroup>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="maritalstatus"
                                            render={({ field }) => (
                                                <FormItem className="space-y-1 mt-2">
                                                    <FormLabel>Marital Status</FormLabel>
                                                    <Select onValueChange={field.onChange} value={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select Marital Status" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value={`Doesn't Matter`}>Doesn't Matter</SelectItem>
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
                                        <div className='flex items-end flex-1 gap-2 mt-2'>
                                            <FormField
                                                control={form.control}
                                                name="agefrom"
                                                render={({ field }) => (
                                                    <FormItem className="space-y-1 flex-1">
                                                        <FormLabel>Age</FormLabel>
                                                        <Select onValueChange={field.onChange} value={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {Array.from({ length: 70 - 18 + 1 }, (_, i) => 18 + i).map((num, index) => (
                                                                    <SelectItem key={index} value={`${num}`}>{num}</SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <p className='mb-2'>to</p>
                                            <FormField
                                                control={form.control}
                                                name="ageto"
                                                render={({ field }) => (
                                                    <FormItem className="space-y-1 flex-1">
                                                        <Select onValueChange={field.onChange} value={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {Array.from({ length: 70 - 18 + 1 }, (_, i) => 18 + i).map((num, index) => (
                                                                    <SelectItem key={index} value={`${num}`}>{num}</SelectItem>
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
                                            name="manglik"
                                            render={({ field }) => (
                                                <FormItem className="space-y-1 mt-2">
                                                    <FormLabel>Manglik / Kuja Dosham</FormLabel>
                                                    <Select onValueChange={field.onChange} value={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select Manglik / Kuja Dosham" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value={`Doesn't Matter`}>Doesn't Matter</SelectItem>
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
                                            name="specialcases"
                                            render={({ field }) => (
                                                <FormItem className="space-y-1 mt-2">
                                                    <FormLabel>Special Cases</FormLabel>
                                                    <Select onValueChange={field.onChange} value={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select Special Cases" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value={`Doesn't Matter`}>Doesn't Matter</SelectItem>
                                                            <SelectItem value="Not Applicable">Not Applicable</SelectItem>
                                                            <SelectItem value="Physically Challenged">Physically Challenged</SelectItem>
                                                            <SelectItem value="HIV Positive">HIV Positive</SelectItem>
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
                                                        <Select onValueChange={field.onChange} value={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Select Employed In" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                <SelectItem value={`Doesn't Matter`}>Doesn't Matter</SelectItem>
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
                                                                <SelectItem value={`Doesn't Matter`}>Doesn't Matter</SelectItem>
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
                                                            <SelectItem value={`Doesn't Matter`}>Doesn't Matter</SelectItem>
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
                                        <div className='flex items-end flex-1 gap-2'>
                                            <FormField
                                                control={form.control}
                                                name="heightfrom"
                                                render={({ field }) => (
                                                    <FormItem className="space-y-1 mt-2 flex-1">
                                                        <FormLabel>Height</FormLabel>
                                                        <Select onValueChange={field.onChange} value={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Doesn't Matter" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                <SelectItem value={`Doesn't Matter`}>Doesn't Matter</SelectItem>
                                                                {resource.height.map((item, index) => (
                                                                    <SelectItem key={index} value={`${item.key}`}>{item.value}</SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <p className='mb-2'>to</p>
                                            <FormField
                                                control={form.control}
                                                name="heightto"
                                                render={({ field }) => (
                                                    <FormItem className="space-y-1 mt-2 flex-1">
                                                        <Select onValueChange={field.onChange} value={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Doesn't Matter" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                <SelectItem value={`Doesn't Matter`}>Doesn't Matter</SelectItem>
                                                                {resource.height.map((item, index) => (
                                                                    <SelectItem key={index} value={`${item.key}`}>{item.value}</SelectItem>
                                                                ))}
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
                                                                <SelectItem value={`Doesn't Matter`}>Doesn't Matter</SelectItem>
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
                                                                <SelectItem value={`Doesn't Matter`}>Doesn't Matter</SelectItem>
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
                                                        <Select onValueChange={field.onChange} value={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Select Caste" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                <SelectItem value={`Doesn't Matter`}>Doesn't Matter</SelectItem>
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
                                        <FormField
                                            control={form.control}
                                            name="country"
                                            render={({ field }) => (
                                                <FormItem className="space-y-1">
                                                    <FormLabel>Country</FormLabel>
                                                    <Select onValueChange={(code) => {
                                                        field.onChange(code);
                                                        setValue("state", "Doesn't Matter", { shouldValidate: true });
                                                        setValue("city", "Doesn't Matter", { shouldValidate: true });
                                                        (code == "IN" || code == "India All" || code == "") ? setFlag(false) : setFlag(true);
                                                    }} value={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select Country" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value={`Doesn't Matter`}>Doesn't Matter</SelectItem>
                                                            <SelectItem value={`India All`}>India All</SelectItem>
                                                            {country?.map((item, index) => (
                                                                <SelectItem key={index} value={`${item.code}`}>
                                                                    {item.name}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <div className="grid grid-cols-2 gap-5">
                                            <FormField
                                                control={form.control}
                                                name="state"
                                                render={({ field }) => (
                                                    <FormItem className="space-y-1 mt-2">
                                                        <FormLabel>State</FormLabel>
                                                        <Select onValueChange={(code) => {
                                                            field.onChange(code);
                                                            if (code !== "")
                                                                getCity("IN", code);
                                                            setValue("city", "Doesn't Matter", { shouldValidate: true });
                                                        }} value={field.value} disabled={flag}>
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Select State" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                <SelectItem value={`Doesn't Matter`}>Doesn't Matter</SelectItem>
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
                                                        <Select onValueChange={field.onChange} value={field.value} disabled={flag}>
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Select City" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                <SelectItem value={`Doesn't Matter`}>Doesn't Matter</SelectItem>
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
                                                            <SelectItem value={`Doesn't Matter`}>Doesn't Matter</SelectItem>
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
                                        <FormField
                                            control={form.control}
                                            name="withphoto"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-col gap-5 space-y-0 mt-4">
                                                    <div className="flex flex-row gap-2">
                                                        <FormControl>
                                                            <Checkbox
                                                                checked={field.value}
                                                                onCheckedChange={field.onChange}
                                                            />
                                                        </FormControl>
                                                        <FormLabel>With Photo</FormLabel>
                                                    </div>
                                                </FormItem>
                                            )}
                                        />
                                        <div className="flex flex-col items-center justify-center gap-5 m-5">
                                            <Button type='submit' size='lg'>Search Partner</Button>
                                            <Button type='button' size='sm' variant='outline' onClick={handleReset}>Reset Form</Button>
                                        </div>
                                    </form >
                                </Form >
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}

export default Search