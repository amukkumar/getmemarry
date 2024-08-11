import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Card } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ArrowLeftIcon, ArrowRightIcon, CalendarIcon } from "@radix-ui/react-icons"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"

const formSchema = z.object({
    maritalstatus: z.string().min(1, {
        message: "Please enter a marital status.",
    }),
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
    })
})
const Form2 = ({ formData, setFormData, setTabValue, resource }) => {

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            maritalstatus: formData.maritalstatus || "",
            height: formData.height || "",
            specialcases: formData.specialcases || "",
            religion: formData.religion || "",
            mothertongue: formData.mothertongue || "",
            caste: formData.caste || "",
            nocaste: formData.nocaste || false,
        },
    })

    const onSubmit = (value) => {
        setFormData({ ...formData, ...value });
        setTabValue(3);
    }

    return (
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-2 gap-5">
                        <FormField
                            control={form.control}
                            name="maritalstatus"
                            render={({ field }) => (
                                <FormItem className="space-y-1">
                                    <FormLabel>Marital Status</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Height" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {resource.height.map((item, index) => {
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
                        name="specialcases"
                        render={({ field }) => (
                            <FormItem className="space-y-1 mt-2">
                                <FormLabel>Special Cases</FormLabel>
                                <FormControl>
                                    <Card className="shadow-sm px-4 py-2 rounded-md">
                                        <RadioGroup
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            className="flex"
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
                                            {resource.religion.map((item, index) => {
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
                                            {resource.mothertongue.map((item, index) => {
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
                                            {resource.castes.map((item, index) => {
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
                    <div className="flex justify-between mt-10">
                        <Button variant="outline" size='lg' type="button" onClick={() => setTabValue(1)}><ArrowLeftIcon variant="solid" className="font-bold mr-2 h-6 w-6" />Prev </Button>
                        <Button type='submit' size='lg'>Next <ArrowRightIcon variant="solid" className="font-bold ml-2 h-6 w-6" /></Button>
                    </div>
                </form >
            </Form >
        </>
    )
}

export default Form2