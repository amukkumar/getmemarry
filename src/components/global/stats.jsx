import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useToast } from "@/components/ui/use-toast"
import { useDispatch, useSelector } from 'react-redux';
import TelegramIcon from '@mui/icons-material/Telegram';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import MarkAsUnreadIcon from '@mui/icons-material/MarkAsUnread';
import { setName, setPartner, setToken, setUser } from '../../store/globalSlice';
import Loading from './loading';
import useLoading from '../../hook/loading';
import StatsCard from './statscard';
import { useNavigate } from 'react-router-dom';

const Stats = () => {

    const apiUrl = import.meta.env.VITE_API_URL;
    const user = useSelector((state) => state.global.user.payload);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { toast } = useToast();
    const { loading, startLoading, stopLoading } = useLoading();
    const [intrestCount, setIntrestCount] = useState({})


    const getIntrestCount = () => {
        startLoading();
        axios.get(apiUrl + 'interestCounts.php', {
            params: {
                token: user.token,
            }
        })
            .then(function (response) {
                if (response.status == 200) {
                    setIntrestCount(response.data);
                }
                else {
                    toast({
                        variant: "destructive",
                        description: response.data.message,
                    })
                }
            })
            .catch(function (error) {
                if (error.response.status == 401) {
                    stopLoading();
                    dispatch(setToken(null));
                    dispatch(setUser(null));
                    dispatch(setName(null));
                    dispatch(setPartner(null));
                    navigate('/login');
                }
            })
            .finally(function () {
                stopLoading();
            });
    }

    useEffect(() => {
        getIntrestCount();
    }, []);


    return (
        <>
            <Loading loading={loading} />
            <div className='flex flex-wrap gap-2 lg:gap-3'>
                <StatsCard title={"Interest Sent"} number={intrestCount?.interest_sent_by_you} icon={<TelegramIcon className='text-primary' />} link="/inbox/send" />
                <StatsCard title={"Response Awaited"} number={intrestCount?.interest_response_awaited} icon={<HourglassTopIcon className='text-primary' />} link="/inbox/await" />
                <StatsCard title={"Interest Recieved"} number={intrestCount?.interest_received} icon={<MarkAsUnreadIcon className='text-primary' />} link="/inbox/recieved" />
                <StatsCard title={"Interest Accepted"} number={intrestCount?.interest_accepted_by_others} icon={<ThumbUpAltIcon className='text-primary' />} link="/inbox/accept" />
                <StatsCard title={"Interest Declined"} number={intrestCount?.interest_declined_by_others} icon={<ThumbDownAltIcon className='text-primary' />} link="/inbox/declined" />
            </div>
        </>
    )
}

export default Stats