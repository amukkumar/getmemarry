import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import HoroscopeSingle from "../components/global/horoscopesingle";
import HoroscopeMatch from "../components/global/horoscopematch";

const Horoscope = () => {

    return (
        <div className="bg">
            <div className="section-title text-center relative pb-3 pt-14 wow fadeInUp" data-wow-delay="0.1s">
                <h5 className="font-bold text-2xl text-primary uppercase">Horoscope</h5>
                <p className="font-bold text-4xl">Horoscope Match   </p>
            </div>
            <div className="flex flex-col gap-2 justify-center items-center mt-8 wow fadeInUp p-3" data-wow-delay="0.4s">
                <Tabs defaultValue="id" className="lg:w-5/12">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="id">Check Horoscope</TabsTrigger>
                        <TabsTrigger value="match">Horoscope Match</TabsTrigger>
                    </TabsList>
                    <TabsContent value="id">
                        <HoroscopeSingle />
                    </TabsContent>
                    <TabsContent value="match">
                        <HoroscopeMatch />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}

export default Horoscope