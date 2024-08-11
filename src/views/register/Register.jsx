import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import logo from '../../assets/logo/getmemarrylogo.png'
import { useEffect, useState } from "react"
import Form1 from "./form/Form1"
import Form2 from "./form/Form2"
import Form3 from "./form/Form3"
import { useNavigate } from "react-router-dom"
import axios from "axios"

const Register = () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();
    const [tabValue, setTabValue] = useState(1);
    const [resource, setResource] = useState({});
    const [formData, setFormData] = useState({});

    const getResourse = () => {
        axios.get(apiUrl + 'htmlresources.php')
            .then(function (response) {
                if (response.data.status == "Ok") {
                    setResource(response.data.data);
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    const doRegister = () => {
        console.log(formData);
    }

    useEffect(() => {
        getResourse();
    }, []);

    useEffect(() => {
        if (tabValue == 4) doRegister();
    }, [tabValue])

    return (
        <>
            <div className="bg w-full min-h-screen flex flex-col gap-2 justify-center items-center">
                <img src={logo} className="mt-3" />
                <Card className='mx-2'>
                    <CardHeader className="text-center p-3">
                        <CardTitle className="text-primary text-xl">Register</CardTitle>
                        <CardDescription>Welcome to GetmeMarry.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Tabs value={tabValue} className="w-min-[360px] sm:w-[450px]">
                            <TabsContent value={1}>
                                <Form1 formData={formData} setFormData={setFormData} setTabValue={setTabValue} />
                            </TabsContent>
                            <TabsContent value={2}>
                                <Form2 formData={formData} setFormData={setFormData} setTabValue={setTabValue} resource={resource} />
                            </TabsContent>
                            <TabsContent value={3}>
                                <Form3 formData={formData} setFormData={setFormData} setTabValue={setTabValue} resource={resource} />
                            </TabsContent>
                            <TabsContent value={4}>
                                <div className="text-center">
                                    Registration Completed
                                </div>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                    <CardFooter className="flex justify-center">
                        <Button onClick={() => navigate('/login')} size="sm" variant="outline">{tabValue == 4 ? "Go to Login" : "Already a Member!"}</Button>
                    </CardFooter>
                </Card>
            </div>
        </>
    )
}

export default Register