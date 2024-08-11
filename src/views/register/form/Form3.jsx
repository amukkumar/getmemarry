import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form";
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { ArrowLeftIcon, ArrowRightIcon, CalendarIcon } from "@radix-ui/react-icons"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import axios from "axios"
import { useEffect, useState } from "react"

const formSchema = z.object({
    country: z.string().min(2, {
        message: "Please select Country.",
    }),
    mobile: z.string().min(10, {
        message: "Mobile Number is required.",
    }),
    state: z.string().min(2, {
        message: "Please select State.",
    }),
    city: z.string().min(3, {
        message: "Please select City.",
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
    annualincome: z.string().min(1, {
        message: "Please select Annual Income.",
    }),
})

const Form3 = ({ formData, setFormData, setTabValue, resource }) => {

    const apiUrl = import.meta.env.VITE_API_URL;
    const [country, setCountry] = useState([]);
    const [state, setState] = useState([]);
    const [city, setCity] = useState([]);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            country: formData.country || "",
            mobile: formData.mobile || "",
            state: formData.state || "",
            city: formData.city || "",
            qualification: formData.qualification || "",
            employedin: formData.employedin || "",
            profession: formData.profession || "",
            annualincome: formData.annualincome || "",
        },
    })

    const { getValues } = form;

    const onSubmit = (value) => {
        setFormData({ ...formData, ...value });
        setTabValue(4);
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

    useEffect(() => {
        getCountry();
    }, []);

    return (
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-2 gap-5">
                        <FormField
                            control={form.control}
                            name="country"
                            render={({ field }) => (
                                <FormItem className="space-y-1">
                                    <FormLabel>Country</FormLabel>
                                    <Select onValueChange={(code) => {
                                        field.onChange(code);
                                        getState(code);
                                    }} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Country" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {country.map((item, index) => (
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
                                        <Input placeholder="Mobile" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
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
                                        getCity(getValues('country'), code);
                                    }} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select State" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {state.map((item, index) => (
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
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select City" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {city.map((item, index) => (
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
                    <div className="grid grid-cols-2 gap-5">
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
                                            {resource.qualification.map((item, index) => {
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
                            name="employedin"
                            render={({ field }) => (
                                <FormItem className="space-y-1 mt-2">
                                    <FormLabel>Employed In</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Employed In" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {resource.employed_in.map((item, index) => {
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
                                            {resource.profession.map((item, index) => {
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
                                            {resource.annual_income.map((item, index) => {
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
                    <div className="flex justify-between mt-10">
                        <Button variant="outline" size='lg' type="button" onClick={() => setTabValue(2)}><ArrowLeftIcon variant="solid" className="font-bold mr-2 h-6 w-6" />Prev </Button>
                        <Button type='submit' size='lg'>Finish</Button>
                    </div>
                </form>
            </Form>
        </>
    )
}

export default Form3
