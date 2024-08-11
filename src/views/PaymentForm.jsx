import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import Loading from '../components/global/loading';
import useLoading from '../hook/loading';

const formSchema = z.object({
    merchant_id: z.string().min(1, { message: "Merchant ID is required" }),
    order_id: z.string().min(1, { message: "Order ID is required" }),
    amount: z.string().min(1, { message: "Amount is required" }),
    currency: z.string().min(1, { message: "Currency is required" }),
    redirect_url: z.string().min(1, { message: "Redirect URL is required" }),
    cancel_url: z.string().min(1, { message: "Cancel URL is required" }),
    billing_name: z.string().min(1, { message: "Billing name is required" }),
    billing_email: z.string().min(1, { message: "Billing email is required" }).email("Invalid email address"),
});

const PaymentForm = () => {

    const apiUrl = import.meta.env.VITE_API_URL;
    const { toast } = useToast();
    const { loading, startLoading, stopLoading } = useLoading();
    const navigate = useNavigate();

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            merchant_id: "",
            order_id: "",
            amount: "",
            currency: "INR",
            redirect_url: "",
            cancel_url: "",
            billing_name: "",
            billing_email: "",
        },
    });

    const onSubmit = (values) => {
        startLoading();
        const formData = new FormData();
        for (const key in values) {
            formData.append(key, values[key]);
        }
        axios.post(apiUrl + 'api/ccavenue', formData)
            .then(response => {
                // Handle response
                window.location.href = response.data.redirectUrl;
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };

    return (
        <div className='bg container mt-14'>
            <div className="section-title text-center relative pb-3 mt-6 mb-8">
                <h5 className="font-bold text-2xl text-primary uppercase">Payment Details</h5>
                <p className="font-bold text-4xl">Get the Best Plan for you.</p>
            </div>
            <div className="flex justify-center">
                <Card className='p-0 mt-6 lg:w-2/3 w-full'>
                    <CardContent className='p-3'>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)}>
                                <div className="grid grid-cols-1 gap-2">
                                    <FormField control={form.control} name="merchant_id" render={({ field }) => (
                                        <FormItem className="space-y-1">
                                            <FormLabel>Merchant ID</FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="Merchant ID" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="order_id" render={({ field }) => (
                                        <FormItem className="space-y-1">
                                            <FormLabel>Order ID</FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="Order ID" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="amount" render={({ field }) => (
                                        <FormItem className="space-y-1">
                                            <FormLabel>Amount</FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="Amount" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="currency" render={({ field }) => (
                                        <FormItem className="space-y-1">
                                            <FormLabel>Currency</FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="Currency" readOnly />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="redirect_url" render={({ field }) => (
                                        <FormItem className="space-y-1">
                                            <FormLabel>Redirect URL</FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="Redirect URL" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="cancel_url" render={({ field }) => (
                                        <FormItem className="space-y-1">
                                            <FormLabel>Cancel URL</FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="Cancel URL" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="billing_name" render={({ field }) => (
                                        <FormItem className="space-y-1">
                                            <FormLabel>Billing Name</FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="Billing Name" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="billing_email" render={({ field }) => (
                                        <FormItem className="space-y-1">
                                            <FormLabel>Billing Email</FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="Billing Email" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                </div>
                                <div className="flex justify-center m-10">
                                    <Button type="submit" size="lg">
                                        Checkout
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default PaymentForm;
