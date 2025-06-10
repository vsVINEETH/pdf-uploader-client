'use client'
import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react'
import { useAtom } from 'jotai';
import { userAtom } from '@/store/userAtom';

const withAuth = (WrappedComponent) => {
    return function withAuth(props) {
        const [loading, setLoading] = useState(true);

        useEffect(() => {
              const [user] = useAtom(userAtom);
            if (!user) {
                redirect("/login");
            } else {
                setLoading(false)
            }
        }, []);

        if (loading) {

            return <p>Loading...</p>
        }

        return <WrappedComponent {...props}/>;

    }

};

export default withAuth;