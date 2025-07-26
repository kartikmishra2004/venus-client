import PiPlayBooking from '@/components/piplay/PiPlayBooking'
import React from 'react'
import { getSession } from '@/lib/auth'

async function PIplay() {
    const session = await getSession();
    if (session)
        return (
            <div className='w-full mt-14 flex p-10'>
                <PiPlayBooking sessionId={session.value} />
            </div>
        )
}

export default PIplay
