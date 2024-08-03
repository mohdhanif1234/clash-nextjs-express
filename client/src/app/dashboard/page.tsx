import Navbar from '@/components/base/Navbar'
import AddClash from '@/components/clash/AddClash'
import React from 'react'
import { CustomSession, authOptions } from '../api/auth/[...nextauth]/options'
import { getServerSession } from 'next-auth'
import { ClashType } from '@/types/clash.types'
import { fetchClashes } from '../fetch/clashFetch'
import ClashCard from '@/components/clash/ClashCard'

const Dashboard = async () => {

  const session: CustomSession | null = await getServerSession(authOptions);

  const clashes: Array<ClashType> | [] = await fetchClashes(session?.user?.token!)

  return (
    <div className='container'>
      <Navbar />
      <div className='text-end mt-10'>
        <AddClash user={session?.user!} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {
          clashes.length > 0 && clashes.map((item, index) => <ClashCard clash={item} key={index} token={session?.user?.token!} />)
        }
      </div>
    </div>
  )
}

export default Dashboard
