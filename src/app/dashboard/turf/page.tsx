import TurfBooking from '@/components/turf/TurfBooking'
import React from 'react'
import { getSession } from '@/lib/auth'

const Turf = async () => {
    const session = await getSession()
    if (session)
        return (
            <div className='w-full mt-14 flex p-10'>
                <TurfBooking sessionId={session.value} />
            </div>
        )
}

export default Turf