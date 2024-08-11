import React, { useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import axios from 'axios';

const AvatarPic = ({ id }) => {

    const apiUrl = import.meta.env.VITE_API_URL;
    const [image, setImage] = useState("");
    const fetchProfileImg = async () => {
        try {
            const response = await axios.get(apiUrl + 'image_api/getsnap_amuk.php', {
                params: {
                    id: id,
                    typ: "pic",
                }
            });
            setImage(response.data)
        } catch (error) {
            console.error('Error fetching captcha:', error);
        }
    };

    useEffect(() => {
        fetchProfileImg()
    }, [])

    return (
        <Avatar>
            <AvatarImage src={image?.image} />
            <AvatarFallback>GM</AvatarFallback>
        </Avatar>
    )
}

export default AvatarPic