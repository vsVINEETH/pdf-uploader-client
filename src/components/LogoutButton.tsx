'use client'
import React from 'react'
import { useRouter } from 'next/navigation';
import { userAuthService } from '@/services/userAuthService'
import { useSetAtom } from 'jotai';
import { userAtom } from '@/store/userAtom';

export default function LogoutButton() {
    const {logout} = userAuthService;
    const setUser = useSetAtom(userAtom);
    const router = useRouter();

    
    const handleLogout = async () => {
        const confirmation = confirm('Are you sure, logout ?');
        if(!confirmation) return;
        const response = await logout();

        if(response){
          
          setUser(null);
          router.replace('/login');
        };
    }
  return (
    <>
    <button  className='w-40 h-20 text-white bg-green'
    onClick={handleLogout}
    >Logout</button>
    </>
  )
};
