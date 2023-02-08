import { Box, Button, Checkbox, CheckboxGroup, Input, Radio, Select, Stack, Textarea, Text, VStack, FormControl, FormLabel, HStack } from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";

export const fieldOptions = function({button, field, index, form, setForm, type, builder}: any) : JSX.Element[] {
    return field.options.map((option: any, oIndex: number) => {

        return (
            <HStack justifyContent='flex-start' key={oIndex}>
                {type === 'radio' &&
                    <Radio
                        value={option.value}
                        key={oIndex}
                        isChecked={form[index]?.value === option.value}
                        onChange={(e) => {
                            // setForm( (prev: any) => ({
                            //     ...prev,
                            //     [index]: {
                            //         ...prev[index],
                            //         value: e.target.value
                            //     }
                            // }))
                            // form is an array
                            const newForm = [...form];
                            newForm[index] = {
                                ...newForm[index],
                                value: e.target.value
                            }
                            setForm(newForm);
                        }}
                    >{option.value?.length ? option.value : (builder ? (<Text color='gray'>Option Text</Text>) : '')}</Radio> }

                {type === 'checkboxes' &&
                    <Checkbox 
                        value={option.value} 
                        key={oIndex}
                        isChecked={form[index]?.value?.includes(option.value)}

                        onChange={(e) => {

                            if(e.target.checked) {

                                const newForm = [...form];

                                newForm[index] = {
                                    ...newForm[index],
                                    value: [...(newForm[index]?.value ?? [] ), option.value]
                                }
                                
                                setForm(newForm);

                            } else {

                                const newForm = [...form];

                                newForm[index] = {
                                    ...newForm[index],
                                    value: newForm[index].value.filter((val: any) => val !== option.value)
                                }
                                
                                setForm(newForm);

                            }
                        }}
                    >{option.value?.length ? option.value : (builder ? (<Text color='gray'>Option Text</Text>) : '')}</Checkbox>
                }
                {option.amount ? <Text color='gray.500' fontSize='sm' ml='4'>({option.minus ? '-' : '+'} {new Intl.NumberFormat('en-US', { style: 'currency', currency: button.currency }).format(option.amount)})</Text> : null}
            </HStack>
        )
    })
}

export default function PayBongForm({button, form, setForm, onOpen, optionsItems} : any) : JSX.Element[] {
    
    const onClick = useCallback(() => {
        if(onOpen)
            onOpen();
    }, [])
    
    const [amount, setAmount] = useState(button.amount ? parseFloat(button.amount) : 0.0);
    const [formattedAmount, setFormattedAmount] = useState('');

    // useEffect(() => {
    //     setAmount(button.amount ? parseFloat(button.amount) : 0.0);
    // }, [button])

    useEffect(() => {
        if(amount) {
            const formattedAmount = new Intl.NumberFormat('en-US', { style: 'currency', currency: button.currency }).format(amount);
            setFormattedAmount(formattedAmount);
        }
    }, [amount])

    

    useEffect(() => {
        // console.log('formd', form)
        let variation = 0;
        
        for( const key in form ) {
            const item = form[key];
            if(button.form[key]) {
                
                if(['radio', 'checkboxes'].includes(button.form[key].type)) {
                    
                    const search = Array.isArray(item.value) ? item.value : [item.value];
                    
                    search.forEach( (searchItem: any) => {
                        const found = button.form[key].options.find((o : any) => o.value === searchItem);
                        
                        if(found?.amount) {
                            if(found.minus) {
                                    // subtract the found.amount from the amount, and avoid floating point errors
                                    variation = (variation * 100 - found.amount * 100) / 100;
                                    
                            } else {
                                    
                                    // add the found.amount from the amount, and avoid floating point errors
                                    variation = (variation * 100 + found.amount * 100) / 100;

                            }                                
                        }
                    });
                    
                }
            }
        }
        
        // add variation to amount, and avoid floating point errors
        const newAmount = variation ? (button.amount * 100 + variation * 100) / 100 : button.amount;
        
        setAmount(newAmount);
   
    
    }, [form, button.amount])

    
    const formItems = button?.form?.map ? button.form.map((field: any, index: number) => {
        const options = optionsItems?.[index];
        return (
            <FormControl key={index}>
                <FormLabel>{field.label}</FormLabel>
            { field.type === 'text' && 
                <Input 
                    placeholder={field.label} 
                    value={form[index]?.value} 
                    onChange={(e) => {
                        // setForm( (prev: any) => ({
                        //     ...prev,
                        //     [index]: {
                        //         ...prev[index],
                        //         value: e.target.value
                        //     }
                        // }))

                        // form is an array
                        const newForm = [...form];
                        newForm[index] = {
                            ...newForm[index],
                            value: e.target.value
                        }
                        setForm(newForm);


                        
                    }}
                />
            }
                
            { field.type === 'textarea' &&
                <Textarea
                    placeholder={field.label}
                    value={form[index]?.value}
                    onChange={(e) => {
                        // setForm( (prev: any) => ({
                        //     ...prev,
                        //     [index]: {
                        //         ...prev[index],
                        //         value: e.target.value
                        //     }
                        // }))
                        // form is an array
                        const newForm = [...form];
                        newForm[index] = {
                            ...newForm[index],
                            value: e.target.value
                        }
                        setForm(newForm);
                        
                    }}
                />
            }

            {/* { field.type === 'select' && 
                <Select 
                    value={form[index]?.value}
                    onChange={(e) => {
                        setForm( (prev: any) => ({
                            ...prev,
                            [index]: {
                                ...prev[index],
                                value: e.target.value
                            }
                        }))
                    }}
                    >
                        { fieldOptions({field, index, form, setForm, type: field.type}) }
                    { field.options.map((option: any, oIndex: number) => <option key={oIndex} value={option.value}>{option.value} 
                        {   option.amount ? 
                            ' (' + (option.minus ? '-' : '+') + (new Intl.NumberFormat('en-US', { style: 'currency', currency: button.currency }).format(option.amount)) + ')'
                                : null
                        }</option>) }

                </Select> 
            } */}

            { ['checkboxes', 'radio'].includes(field.type) &&
                <VStack alignItems='flex-start'>
                    { options ? options : fieldOptions({button, field, index, form, setForm, type: field.type}) }
                </VStack>
            }
            </FormControl>
        )
    }) as JSX.Element[] : [];

    formItems?.push((
        <VStack>
            <Text fontSize="sm">{formattedAmount} ({button.currency?.toUpperCase()})</Text>
            <Button onClick={onClick}>
                {button.label}
            </Button>
        </VStack>
    ))

    return formItems;
    
}