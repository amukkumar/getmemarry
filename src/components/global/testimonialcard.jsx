import React from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"

const TestimonialCard = () => {
    return (
        <>
            <Card className='rounded-md'>
                <CardContent className='pb-3 px-0'>
                    <div>
                        <img className='rounded-t-md' src='https://getmemarry.com/images/successimage1-TS4195-RY9464.jpg' alt='tetimonial' />
                    </div>
                    <div>
                        <Table>
                            <TableBody>
                                <TableRow className="odd:bg-white even:bg-slate-50">
                                    <TableCell className="font-sm p-1 text-center w-1/2">Name:</TableCell>
                                    <TableCell className="font-sm p-1 text-center w-1/2">adsf</TableCell>
                                </TableRow>
                                <TableRow className="odd:bg-white even:bg-slate-50">
                                    <TableCell className="font-sm p-1 text-center w-1/2">Age/Height:</TableCell>
                                    <TableCell className="font-sm p-1 text-center w-1/2">adsfas</TableCell>
                                </TableRow>
                                <TableRow className="odd:bg-white even:bg-slate-50">
                                    <TableCell className="font-sm p-1 text-center w-1/2">Status:</TableCell>
                                    <TableCell className="font-sm p-1 text-center w-1/2">asdf</TableCell>
                                </TableRow>
                                <TableRow className="odd:bg-white even:bg-slate-50">
                                    <TableCell className="font-sm p-1 text-center w-1/2">Qualification:</TableCell>
                                    <TableCell className="font-sm p-1 text-center w-1/2">adsf</TableCell>
                                </TableRow>
                                <TableRow className="odd:bg-white even:bg-slate-50">
                                    <TableCell className="font-sm p-1 text-center w-1/2">Profession:</TableCell>
                                    <TableCell className="font-sm p-1 text-center w-1/2">dsaf</TableCell>
                                </TableRow>
                                <TableRow className="odd:bg-white even:bg-slate-50">
                                    <TableCell className="font-sm p-1 text-center w-1/2">Religion:</TableCell>
                                    <TableCell className="font-sm p-1 text-center w-1/2">adsf</TableCell>
                                </TableRow>
                                <TableRow className="odd:bg-white even:bg-slate-50">
                                    <TableCell className="font-sm p-1 text-center w-1/2">Caste:</TableCell>
                                    <TableCell className="font-sm p-1 text-center w-1/2">dsaf</TableCell>
                                </TableRow>
                                <TableRow className="odd:bg-white even:bg-slate-50">
                                    <TableCell className="font-sm p-1 text-center w-1/2">Location:</TableCell>
                                    <TableCell className="font-sm p-1 text-center w-1/2 text-center w-1/2">adsf</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </>
    )
}

export default TestimonialCard