import TurfBooking from '@/components/turf/TurfBooking'
import React from 'react'
import { getSession } from '@/lib/auth'

const Turf = async () => {
    const session = await getSession()
    if (session)
        return (
            <div className='md:w-full w-screen md:mt-14 flex md:p-10 md:px-10 px-4 md:mb-0 mb-10 mt-20'>
                <TurfBooking sessionId={session.value} />
            </div>
        )
}

export default Turf