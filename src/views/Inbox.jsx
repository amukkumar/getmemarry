import React, { useEffect, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card"
import { useNavigate, useParams } from 'react-router-dom';
import Received from './inbox/recieved';
import Send from './inbox/send';
import Accept from './inbox/accept';
import Declined from './inbox/declined';
import Response from './inbox/response';

const Inbox = () => {
    const navigate = useNavigate();
    const { page } = useParams();
    const [tabValue, setTabValue] = useState(page);

    const handleChange = (val) => {
        setTabValue(val);
        navigate("/inbox/" + val);
    }

    useEffect(() => {
        if (!page) {
            navigate("/inbox/recieved");
        } else {
            setTabValue(page);
        }
    }, [page, navigate]);

    return (
        <>
            <div className='bg'>
                <div className='contaiener p-3'>
                    <div className='flex justify-center'>
                        <Tabs value={tabValue} onValueChange={handleChange} className='flex flex-col items-center'>
                            <TabsList className="flex justify-start sm:justify-center gap-5 overflow-y-hidden sm:w-min w-screen px-3 lg:p-1 sticky top-[70px] z-10">
                                <TabsTrigger value="recieved">Received</TabsTrigger>
                                <TabsTrigger value="send">Send</TabsTrigger>
                                <TabsTrigger value="accept">Accept</TabsTrigger>
                                <TabsTrigger value="declined">Declined</TabsTrigger>
                                <TabsTrigger value="await">Response Await</TabsTrigger>
                            </TabsList>
                            <TabsContent value="recieved" className='w-full'>
                                <Received />
                            </TabsContent>
                            <TabsContent value="send" className='w-full'>
                                <Send />
                            </TabsContent>
                            <TabsContent value="accept" className='w-full'>
                                <Accept />
                            </TabsContent>
                            <TabsContent value="declined" className='w-full'>
                                <Declined />
                            </TabsContent>
                            <TabsContent value="await" className='w-full'>
                                <Response />
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Inbox