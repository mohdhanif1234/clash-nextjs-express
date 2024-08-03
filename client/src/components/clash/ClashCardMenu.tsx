'use client'
import { ClashType } from "@/types/clash.types"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { EllipsisVertical } from "lucide-react"
import dynamic from "next/dynamic"
import { Suspense, useState } from "react"

const EditClash = dynamic(() => import("./EditClash"))

const ClashCardMenu = ({ clash, token }: { clash: ClashType, token: string }) => {

    const [open, setOpen] = useState<boolean>(false);

    return (
        <>
            {
                open && (
                    <Suspense fallback={<p>Loading...</p>}>
                        <EditClash
                            open={open}
                            setOpen={setOpen}
                            clash={clash}
                            token={token}
                        />
                    </Suspense>
                )
            }
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <EllipsisVertical />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setOpen(true)}>Edit</DropdownMenuItem>
                    <DropdownMenuItem>Copy Link</DropdownMenuItem>
                    <DropdownMenuItem>Delete</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    )
}

export default ClashCardMenu
