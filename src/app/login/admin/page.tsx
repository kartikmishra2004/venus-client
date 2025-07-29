import { LoginForm } from '@/components/login-form'
import React from 'react'

const AdminLogin = () => {
    return (
        <div className='w-full h-screen flex justify-center items-center'>
            <LoginForm className='xl:w-[30vw] lg:w-[40vw] md:w-[70vw] sm:w-[80vw] w-full  px-4' />
        </div>
    )
}

export default AdminLogin