'use client'
import { ClashType } from '@/types/clash.types'
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import Image from 'next/image'
import { getImageUrl } from '@/lib/utils'
import { Button } from '../ui/button'
import ClashCardMenu from './ClashCardMenu'

const ClashCard = ({ clash, token }: { clash: ClashType, token: string }) => {
    return (
        <Card>
            <CardHeader className='flex justify-between items-center flex-row'>
                <CardTitle>{clash.title}</CardTitle>
                <ClashCardMenu clash={clash} token={token} />
            </CardHeader>
            <CardContent className='h-[300px]'>
                {
                    clash?.image &&
                    <Image
                        src={getImageUrl(clash?.image)}
                        width={500}
                        height={500}
                        alt={clash?.title}
                        className='rounded-md w-full h-[220px] object-contain'
                    />
                }
                <p>{clash.description}</p>

                <p>
                    <strong>Expires at:</strong>
                    {new Date(clash.expires_at).toDateString()}
                </p>
            </CardContent>
            <CardFooter>
                <Button>Items</Button>
            </CardFooter>
        </Card>

    )
}

export default ClashCard
