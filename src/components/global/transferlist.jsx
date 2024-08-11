import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"


const MyCheckbox = ({ id, disabled, checked, onChange }) => (
    <Checkbox
        id={id}
        disabled={disabled}
        checked={checked}
        onCheckedChange={onChange}
    />
);

const TransferList = ({ title = "", list = [], value = [], onValueChange = () => { } }) => {

    const [data, setData] = useState(list);
    const [selected, setSelected] = useState(value);
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [removedIndex, setRemovedIndex] = useState(null);

    const add = (index) => {
        const selectedItem = data[index];
        setSelectedIndex(null);
        setSelected([...selected, selectedItem]);
    };

    const remove = (index) => {
        setRemovedIndex(null);
        setSelected(selected.filter((_, i) => i !== index));
    }

    const handleSelectedCheckboxChange = (index) => {
        setSelectedIndex(index);
    };
    const handleRemovedCheckboxChange = (index) => {
        setRemovedIndex(index);
    };

    useEffect(() => {
        onValueChange(selected);
    }, [selected])

    useEffect(() => {
        setData(list);
    }, [list])

    return (
        <>
            <div className='flex flex-col md:flex-row gap-3'>
                <div className='flex-1 space-y-1'>
                    <Label>{title}</Label>
                    <Card className='rounded-md'>
                        <CardContent className='p-2'>
                            <ScrollArea className='h-48 min-w-48'>
                                {data.map((item, index) => {
                                    const isDisabled = selected.some(selectedItem => selectedItem.key === item.key);
                                    return (
                                        <div key={index} className="flex items-center space-x-2 p-2 rounded-sm hover:bg-orange-100">
                                            <MyCheckbox
                                                id={title + index}
                                                disabled={isDisabled}
                                                checked={selectedIndex === index || isDisabled}
                                                onChange={() => handleSelectedCheckboxChange(index)}
                                            />
                                            <label
                                                htmlFor={title + index}
                                                className="text-sm font-medium leading-none"
                                            >
                                                {item.value || item.name}
                                            </label>
                                        </div>
                                    )
                                })}
                            </ScrollArea>
                        </CardContent>
                    </Card>
                </div>
                <div className='flex flex-row md:flex-col items-center md:justify-center gap-3'>
                    <Button className='w-full' disabled={selectedIndex == null} onClick={() => add(selectedIndex)}>Add</Button>
                    <Button className='w-full' disabled={removedIndex == null} onClick={() => remove(removedIndex)}> Remove</Button>
                </div>
                <div className='flex-1 space-y-1'>
                    <Label>Selected {title}</Label>
                    <Card className='rounded-md'>
                        <CardContent className='p-2'>
                            <ScrollArea className='h-48 min-w-48'>
                                {selected.map((item, index) => {
                                    return (
                                        <div key={index} className="flex items-center space-x-2 p-2 rounded-sm hover:bg-orange-100">
                                            <MyCheckbox
                                                id={title + index}
                                                checked={removedIndex === index}
                                                onChange={() => handleRemovedCheckboxChange(index)}
                                            />
                                            <label
                                                htmlFor={title + index}
                                                className="text-sm font-medium leading-none"
                                            >
                                                {item.value || item.name}
                                            </label>
                                        </div>
                                    )
                                })}
                            </ScrollArea>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    )
}

export default TransferList