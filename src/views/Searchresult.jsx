import React, { useEffect, useState } from 'react'
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import ShortProfile from '../components/global/shortprofile'
import { useSelector } from 'react-redux';
import { useToast } from "@/components/ui/use-toast"
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { generatePagination } from '../hook/pagination';
import Error404 from '../components/global/error404';
import Loading from '../components/global/loading';
import useLoading from '../hook/loading';

const SearchResult = () => {

    const apiUrl = import.meta.env.VITE_API_URL;
    const { toast } = useToast();
    const { page } = useParams();
    const navigate = useNavigate();
    const { loading, startLoading, stopLoading } = useLoading();
    const partner = useSelector((state) => state.global.partner.payload);
    const [pagination, setPagination] = useState(generatePagination(page, 0));
    const [totalPage, setTotalPage] = useState(0);
    const [profile, setProfile] = useState([]);

    const searchProfiles = () => {
        startLoading();
        axios.post(apiUrl + "newsearch.php", {}, {
            params: {
                page: page,
                sort_by: '',
                sort_order: '',
                savesearch: 'on',
                txtgender: partner?.lookingfor == 'M' ? 'F' : 'M',
                txtlookgender: partner?.lookingfor || "",
                txtlookagestart: partner?.agefrom || "",
                txtlookageend: partner?.ageto || "",
                txtheight1: partner?.heightfrom == "Start Height" ? "" : partner?.heightfrom || "",
                txtheight2: partner?.heightto == "End Height" ? "" : partner?.heightto || "",
                with_photo: partner?.withphoto ? '1' : '0',
                txtcastenobar: partner?.nocaste ? '1' : '0',
                txtincome: partner?.annualincome == "Doesn't Matter" ? "" : partner?.annualincome || "",
                txtmaritalstatus: partner?.maritalstatus == "Doesn't Matter" ? "" : partner?.maritalstatus || "",
                txteducation: '',
                txtqualification: partner?.qualification == "Doesn't Matter" ? "" : partner?.qualification || "",
                txtoccupation: '',
                txtfrom: partner?.country == "India All" ? "IN" : partner?.country || "",
                txtstateuser: partner?.state == "Doesn't Matter" ? "" : partner?.state || "",
                txtreligion: partner?.religion == "Doesn't Matter" ? "" : partner?.religion || "",
                txtmother_tongue: partner?.mothertongue == "Doesn't Matter" ? "" : partner?.mothertongue || "",
                txtcaste: partner?.caste == "Doesn't Matter" ? "" : partner?.caste || "",
                txtmanglik: partner?.manglik == "Doesn't Matter" ? "" : partner?.manglik || "",
                txtspecial_cases: partner?.specialcases == "Doesn't Matter" ? "" : partner?.specialcases || "",
                txtcityuser: partner?.city == "Doesn't Matter" ? "" : partner?.city || "",
                txtcityuser1: partner?.city == "Doesn't Matter" ? "" : partner?.city || "",
                srchusername: '',
                txtprofessional_str: partner?.profession == "Doesn't Matter" ? "" : partner?.profession || "",
                educationquerry: ''
            }
        })
            .then(function (response) {
                if (response.status == 200) {
                    setTotalPage(response.data.total_pages);
                    setProfile(response.data.data);
                    setPagination(generatePagination(page, response.data.total_pages))
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
            })
            .finally(function () {
                stopLoading();
            });
    };

    useEffect(() => {
        searchProfiles();
    }, [page])


    return (
        <div className='bg'>
            <Loading loading={loading} />
            <div className='container p-3'>
                <div className="section-title text-center relative pb-3 m-8">
                    <h5 className="font-bold text-2xl text-primary uppercase">Most match of your Preferences</h5>
                    <p className="font-bold text-4xl">Search Results</p>
                </div>
                {!loading &&
                    <>
                        {profile?.length > 1 && page > 0 ? <div className='grid lg:grid-cols-2 gap-3 grid-auto'>
                            {profile.map((item, index) => {
                                return (
                                    <ShortProfile key={index} profile={item} />
                                )
                            })}
                        </div> :
                            <Error404 />
                        }
                    </>}
            </div>
            {totalPage > 1 &&
                <Pagination className='pt-3'>
                    <PaginationContent>
                        {page > 3 && <PaginationItem className='cursor-pointer' onClick={() => navigate("/search/searchresult/1")}>
                            <PaginationPrevious disabled />
                        </PaginationItem>}
                        {pagination.map((item, index) => {
                            return (
                                <PaginationItem key={index} className='cursor-pointer' onClick={() => navigate("/search/searchresult/" + item)}>
                                    <PaginationLink isActive={page == item}>{item}</PaginationLink>
                                </PaginationItem>
                            )
                        })}
                        {totalPage - page > 7 && <PaginationItem>
                            <PaginationEllipsis />
                        </PaginationItem>}
                        <PaginationItem className='cursor-pointer' onClick={() => navigate("/search/searchresult/" + totalPage)}>
                            <PaginationNext isActive={page == totalPage} />
                        </PaginationItem>
                    </PaginationContent >
                </Pagination >
            }
        </div >
    )
}

export default SearchResult