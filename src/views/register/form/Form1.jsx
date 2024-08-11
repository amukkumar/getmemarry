import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Card } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns"
import { ArrowRightIcon, CalendarIcon } from "@radix-ui/react-icons"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input";

import {
    ToggleGroup,
    ToggleGroupItem,
} from "@/components/ui/toggle-group"

const formSchema = z.object({
    profilecreated: z.string().min(2, {
        message: "Please select profile for",
    }),
    firstname: z.string().min(2, {
        message: "Please enter a valid name.",
    }),
    lastname: z.string().min(2, {
        message: "Please enter a valid last name.",
    }),
    gender: z.string().min(1, {
        message: "Please select gender.",
    }),
    dob: z.date({
        message: "Please select date of birth",
    }),
    username: z.string().min(8, {
        message: "Please enter a valid email/mobile.",
    }),
    password: z.string().min(8, {
        message: "Password must be at least 8 characters.",
    }),
})
const Form1 = ({ formData, setFormData, setTabValue }) => {

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            profilecreated: formData.profilecreated || "myself",
            firstname: formData.firstname || "",
            lastname: formData.lastname || "",
            gender: formData.gender || "",
            dob: formData.dob || "",
            username: formData.username || "",
            password: formData.password || "",
        },
    })

    const onSubmit = (value) => {
        setFormData({ ...formData, ...value });
        setTabValue(2);
    }

    return (
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField
                        control={form.control}
                        name="profilecreated"
                        render={({ field }) => (
                            <FormItem className="space-y-1">
                                <FormLabel>This Profile is for</FormLabel>
                                <FormControl>
                                    <ToggleGroup
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        type='single'
                                        size="sm"
                                        variant="outline"
                                        className='flex flex-wrap justify-start'
                                    >
                                        <ToggleGroupItem value="myself">My Self</ToggleGroupItem>
                                        <ToggleGroupItem value="myson">My Son</ToggleGroupItem>
                                        <ToggleGroupItem value="mydaughter">My Daughter</ToggleGroupItem>
                                        <ToggleGroupItem value="mybrother">My Brother</ToggleGroupItem>
                                        <ToggleGroupItem value="mysister">My Sister</ToggleGroupItem>
                                        <ToggleGroupItem value="myfriend">My Friend</ToggleGroupItem>
                                        <ToggleGroupItem value="myrelative">My Relative</ToggleGroupItem>
                                    </ToggleGroup>
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
                    <div className="grid grid-cols-2 gap-5">

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
                                                className="flex"
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

                        <FormField
                            control={form.control}
                            name="dob"
                            render={({ field }) => (
                                <FormItem className="flex flex-col space-y-1 mt-3">
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
                    </div>
                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem className="space-y-1 mt-2">
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
                            <FormItem className="space-y-1 mt-2">
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input type="password" placeholder="Password" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="text-center mt-5">
                        <Button type='submit' size='lg'>Next <ArrowRightIcon variant="solid" className="font-bold ml-2 h-6 w-6" /></Button>
                    </div>
                </form >
            </Form >
        </>
    )
}

export default Form1