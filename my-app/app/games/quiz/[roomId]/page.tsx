'use client';
import { redirect, useParams } from "next/navigation";
import { useEffect } from "react"
import toast from "react-hot-toast";

function page() {
    const {roomId} = useParams();


    const fetchRoom = async () =>{
    const res = await fetch(`/api/quiz/${roomId}`);

    const data = await res.json()
    if(data.error == "Room not found"){
        
        toast.error('Room not Found');
        redirect('/games/quiz');
        return null;
    }
    }

    useEffect(()=>{
        fetchRoom();
    }, [])


  return (
    <div>Loading ...</div>
  )
}

export default page