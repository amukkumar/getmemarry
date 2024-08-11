import { useEffect, useState } from "react"
import axios from "axios"
import { useToast } from "@/components/ui/use-toast"
import useLoading from "../hook/loading"
import Loading from "../components/global/loading"

const Privacy = () => {

    const apiUrl = import.meta.env.VITE_API_URL;
    const { toast } = useToast();
    const { loading, startLoading, stopLoading } = useLoading();
    const [privacy, setPrivacy] = useState('');

    const getPrivacy = () => {
        startLoading();
        axios.get(apiUrl + 'privacy.php')
            .then(function (response) {
                if (response.data.success) {
                    setPrivacy(response.data.data)
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
                toast({
                    variant: "destructive",
                    description: error.response.data.message,
                })
            })
            .finally(function () {
                stopLoading();
            });
    }

    useEffect(() => {
        getPrivacy();
    }, [])

    return (
        <>
            <div className="bg container p-3">
                <div className="section-title text-center relative pb-3 pt-10 wow fadeInUp" data-wow-delay="0.1s">
                    <h5 className="font-bold text-2xl text-primary uppercase"></h5>
                    <p className="font-bold text-4xl">Privacy Policy</p>
                </div>
                <Loading loading={loading} />
                <div className="m-16 text-md" dangerouslySetInnerHTML={{ __html: privacy }}></div>
            </div>
        </>
    )
}

export default Privacy