import React, { FC } from "react";
import { Input, InputProps } from "reactstrap";

type IOption = { label: string; value: string };

interface IProps extends InputProps {
    options: IOption[];
    onChangeValue: (value: string) => void;
}

export function Select({ options, onChangeValue, placeholder, ...props }: IProps) {
    return (
        <Input
            {...props}
            type="select"
            // value={{value: '', label: ''}}
            onChange={(e) => onChangeValue(e.target.value)}
            // defaultValue=""
            // options={genderOptions}
        >
            <option hidden disabled value="">
                {placeholder}
            </option>
            {options.map((x, i) => (
                <option value={x.value} key={`${i}-select`}>
                    {x.label}
                </option>
            ))}
        </Input>
    );
}
