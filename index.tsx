import { Box, Button, Checkbox, CheckboxGroup, Input, Radio, Select, Stack, Textarea, Text, VStack, FormControl, FormLabel, HStack } from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";

export default function FormButton({button, form, setForm, onOpen} : any) : JSX.Element {
    
    const onClick = useCallback(() => {
        onOpen();
    }, [])
    
    const [amount, setAmount] = useState(button.amount ? parseFloat(button.amount) : 0.0);
    const [formattedAmount, setFormattedAmount] = useState('');

    useEffect(() => {
        setAmount(button.amount ? parseFloat(button.amount) : 0.0);
    }, [button])

    useEffect(() => {
        if(amount) {
            const formattedAmount = new Intl.NumberFormat('en-US', { style: 'currency', currency: button.currency }).format(amount);
            setFormattedAmount(formattedAmount);
        }
    }, [amount])

    

    useEffect(() => {
        
        let variation = 0;
        
        for( const key in form ) {
            const item = form[key];
            if(button.form[key]) {
                
                if(['select', 'radio', 'checkboxes'].includes(button.form[key].type)) {
                    console.log('searching for ', item.value);
                    
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
   
    
    }, [form])

    return (
        <VStack alignItems='flex-start' gap="2">
            { button.form?.length && button.form.map((field: any, index: number) => {

                return (
                    <FormControl key={index}>
                        <FormLabel>{field.label}</FormLabel>
                    { field.type === 'text' && 
                        <Input 
                            placeholder={field.label} 
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
                        />
                    }
                     
                    { field.type === 'textarea' &&
                        <Textarea
                            placeholder={field.label}
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
                        />
                    }

                    { field.type === 'select' && 
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
                            { field.options.map((option: any, oIndex: number) => <option key={oIndex} value={option.value}>{option.value} 
                                {   option.amount ? 
                                    ' (' + (option.minus ? '-' : '+') + (new Intl.NumberFormat('en-US', { style: 'currency', currency: button.currency }).format(option.amount)) + ')'
                                     : null
                                }</option>) }

                        </Select> 
                    }

                    { field.type === 'checkboxes' &&
                        <VStack alignItems='flex-start'>
                            { field.options.map((option: any, oIndex: number) => {

                                return (
                                    <HStack justifyContent='flex-start' key={oIndex}>
                                        <Checkbox 
                                            value={option.value} 
                                            key={oIndex}
                                            isChecked={form[index]?.value?.includes(option.value)}
                                            onChange={(e) => {
                                                if(e.target.checked) {
                                                    setForm( (prev: any) => ({
                                                        ...prev,
                                                        [index]: {
                                                            ...prev[index],
                                                            value: [...prev[index].value, option.value]
                                                        }
                                                    }))
                                                } else {
                                                    setForm( (prev: any) => ({
                                                        ...prev,
                                                        [index]: {
                                                            ...prev[index],
                                                            value: prev[index].value.filter((val: any) => val !== option.value)
                                                        }
                                                    }))
                                                }
                                            }}
                                        >{option.value}</Checkbox>
                                        {option.amount ? <Text color='gray.500' fontSize='sm' ml='4'>({option.minus ? '-' : '+'} {new Intl.NumberFormat('en-US', { style: 'currency', currency: button.currency }).format(option.amount)})</Text> : null}
                                    </HStack>
                                )
                            }) }
                        </VStack>
                    }
                    { field.type === 'radio' && 
                        <VStack alignItems='flex-start'>
                            { field.options.map((option: any, oIndex: number) =>
                                <HStack justifyContent='flex-start' key={oIndex}>
                                    <Radio
                                        value={option.value}
                                        key={oIndex}
                                        isChecked={form[index]?.value === option.value}
                                        onChange={(e) => {
                                            setForm( (prev: any) => ({
                                                ...prev,
                                                [index]: {
                                                    ...prev[index],
                                                    value: e.target.value
                                                }
                                            }))
                                        }}
                                    >{option.value}</Radio>
                                    {option.amount ? <Text color='gray.500' fontSize='sm' ml='4'>({option.minus ? '-' : '+'} {new Intl.NumberFormat('en-US', { style: 'currency', currency: button.currency }).format(option.amount)})</Text> : null}
                                </HStack>
                            )}
                        </VStack>
                    }
                    </FormControl>
                )
            })}
            <VStack>
                <Text fontSize="sm">{formattedAmount} ({button.currency?.toUpperCase()})</Text>
                <Button onClick={onClick}>
                    {button.label}
                </Button>
            </VStack>
        </VStack>
    )
}