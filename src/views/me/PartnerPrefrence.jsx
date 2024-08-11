import React, { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import CallIcon from '@mui/icons-material/Call';
import axios from 'axios';
import { useSelector } from 'react-redux';
import TransferList from '../../components/global/transferlist'

const PartnerPrefrence = () => {

    const apiUrl = import.meta.env.VITE_API_URL;
    const resource = useSelector((state) => state.global.resource.payload);
    const [country, setCountry] = useState([]);

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

    const formSchema = z.object({
        ageto: z.string().min(2, {
            message: "Please select age.",
        }),
        agefrom: z.string().min(2, {
            message: "Please select age.",
        }),
        maritalstatus: z.string().min(1, {
            message: "Please select marital status.",
        }),
        manglik: z.string().min(0, {
            message: "Please select manglik.",
        }),
        specialcases: z.string().min(2, {
            message: "Please select special cases.",
        }),
        heightto: z.string().min(1, {
            message: "Please select height.",
        }),
        heightfrom: z.string().min(1, {
            message: "Please select height.",
        }),
        annualincome: z.string().min(1, {
            message: "Please select height.",
        }),
        qualification: z.object({
            key: z.string(),
            value: z.string()
        }).array().min(0, {
            message: "Can't be empty!",
        }),
        professionstream: z.object({
            key: z.string(),
            value: z.string()
        }).array().min(0, {
            message: "Can't be empty!",
        }),
        employedin: z.object({
            key: z.string(),
            value: z.string()
        }).array().min(0, {
            message: "Can't be empty!",
        }),
        religion: z.object({
            key: z.string(),
            value: z.string()
        }).array().min(0, {
            message: "Can't be empty!",
        }),
        mothertongue: z.object({
            key: z.string(),
            value: z.string()
        }).array().min(0, {
            message: "Can't be empty!",
        }),
        caste: z.object({
            key: z.string(),
            value: z.string()
        }).array().min(0, {
            message: "Can't be empty!",
        }),
        country: z.object({
            name: z.string(),
        }).array().min(0, {
            message: "Can't be empty!",
        }),

    })

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            ageto: "18",
            agefrom: "18",
            maritalstatus: "Doesn't Matter",
            manglik: "Doesn't Matter",
            specialcases: "Not Applicable",
            heightto: "1",
            heightfrom: "32",
            annualincome: "Doesn't Matter",
            qualification: [],
            professionstream: [],
            employedin: [],
            religion: [],
            mothertongue: [],
            caste: [],
            country: [],
        },
    })

    const onSubmit = (value) => {
        console.log(value)
    }

    useEffect(() => {
        getCountry();
    }, [])

    return (
        <>
            <div className='bg flex flex-col gap-2 justify-center items-center pt-5'>
                <div className="section-title text-center relative pb-3 m-8">
                    <h5 className="font-bold text-2xl text-primary uppercase">Partner Preferrence</h5>
                    <p className="font-bold text-4xl">Save your partner preferrence</p>
                </div>
                <div className='flex justify-center container p-3'>
                    <Card className='w-full md:max-w-[768px]'>
                        <CardContent className='p-3'>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-1'>
                                    <div className='grid grid-cols-1 lg:grid-cols-2 gap-3'>
                                        <div className='flex items-end flex-1 gap-2'>
                                            <FormField
                                                control={form.control}
                                                name="ageto"
                                                render={({ field }) => (
                                                    <FormItem className="space-y-1 flex-1">
                                                        <FormLabel>Age</FormLabel>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                                                name="agefrom"
                                                render={({ field }) => (
                                                    <FormItem className="space-y-1 flex-1">
                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                                                            <SelectItem value={`Doesn't Matter`}>{`Doesn't Matter`}</SelectItem>
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
                                    </div>
                                    <FormField
                                        control={form.control}
                                        name="manglik"
                                        render={({ field }) => (
                                            <FormItem className="space-y-1 mt-2">
                                                <FormLabel>Manglik</FormLabel>
                                                <FormControl>
                                                    <Card className="shadow-sm px-4 py-2 rounded-md">
                                                        <RadioGroup
                                                            onValueChange={field.onChange}
                                                            value={field.value}
                                                            className="flex justify-between"
                                                        >
                                                            <FormItem className="flex items-center space-x-3 space-y-0">
                                                                <FormControl>
                                                                    <RadioGroupItem value="Doesn't Matter" />
                                                                </FormControl>
                                                                <FormLabel className="font-normal">
                                                                    Doesn't Matter
                                                                </FormLabel>
                                                            </FormItem>
                                                            <FormItem className="flex items-center space-x-3 space-y-0">
                                                                <FormControl>
                                                                    <RadioGroupItem value="Yes" />
                                                                </FormControl>
                                                                <FormLabel className="font-normal">
                                                                    Yes
                                                                </FormLabel>
                                                            </FormItem>
                                                            <FormItem className="flex items-center space-x-3 space-y-0">
                                                                <FormControl>
                                                                    <RadioGroupItem value="No" />
                                                                </FormControl>
                                                                <FormLabel className="font-normal">
                                                                    No
                                                                </FormLabel>
                                                            </FormItem>
                                                        </RadioGroup>
                                                    </Card>
                                                </FormControl>

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
                                    <div className='flex items-end flex-1 gap-2'>
                                        <FormField
                                            control={form.control}
                                            name="heightto"
                                            render={({ field }) => (
                                                <FormItem className="space-y-1 flex-1">
                                                    <FormLabel>Height</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {resource?.height?.map((item, index) => (
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
                                            name="heightfrom"
                                            render={({ field }) => (
                                                <FormItem className="space-y-1 flex-1">
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {resource?.height?.map((item, index) => (
                                                                <SelectItem key={index} value={`${item.key}`}>{item.value}</SelectItem>
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
                                            <FormItem className="space-y-1">
                                                <FormLabel>Annual Income</FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select Annual Income" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value={`Doesn't Matter`}>{`Doesn't Matter`}</SelectItem>
                                                        {resource?.annual_income?.map((item, index) => (
                                                            <SelectItem key={index} value={`${item.key}`}>{item.value}</SelectItem>
                                                        ))}
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
                                            <FormItem className="space-y-1 mt-1">
                                                <FormControl>
                                                    <TransferList title="Qualification" onValueChange={field.onChange} value={field.value} list={resource?.qualification} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="professionstream"
                                        render={({ field }) => (
                                            <FormItem className="space-y-1 mt-1">
                                                <FormControl>
                                                    <TransferList title="Profession Stream" onValueChange={field.onChange} value={field.value} list={resource?.profession} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="employedin"
                                        render={({ field }) => (
                                            <FormItem className="space-y-1 mt-1">
                                                <FormControl>
                                                    <TransferList title="Employed In" onValueChange={field.onChange} value={field.value} list={resource?.employed_in} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="religion"
                                        render={({ field }) => (
                                            <FormItem className="space-y-1 mt-1">
                                                <FormControl>
                                                    <TransferList title="Religion" onValueChange={field.onChange} value={field.value} list={resource?.religion} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="mothertongue"
                                        render={({ field }) => (
                                            <FormItem className="space-y-1 mt-1">
                                                <FormControl>
                                                    <TransferList title="Mother Tongue" onValueChange={field.onChange} value={field.value} list={resource?.mothertongue} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="caste"
                                        render={({ field }) => (
                                            <FormItem className="space-y-1 mt-1">
                                                <FormControl>
                                                    <TransferList title="Caste" onValueChange={field.onChange} value={field.value} list={resource?.castes} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="country"
                                        render={({ field }) => (
                                            <FormItem className="space-y-1 mt-1">
                                                <FormControl>
                                                    <TransferList title="Country" onValueChange={field.onChange} value={field.value} list={country} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className='text-center p-5'>
                                        <Button className="" type="submit">Submit</Button>
                                    </div>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    )
}

export default PartnerPrefrence