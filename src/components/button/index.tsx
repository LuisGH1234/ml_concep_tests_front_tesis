import React, { FC, useState } from "react";
import { ButtonProps, Button as $Button, Spinner } from "reactstrap";

interface IProps extends ButtonProps {}

export const Button: FC<IProps> = ({ children, style, ...rest }) => {
    return (
        <$Button
            {...rest}
            style={{ ...style }}
            // style={{ backgroundColor: "#2B3797", borderColor: "#2B3797" }}
        >
            <div style={{ display: "flex" }}>
                {rest.disabled ? (
                    <Spinner style={{ margin: "auto", width: 16, height: 16 }} size="sm" />
                ) : (
                    <div style={{ margin: "auto", width: 16, height: 16 }} />
                )}
                <div style={{ margin: "auto", width: 8, height: 16 }} />
                {children}
                <div style={{ margin: "auto", width: 16 + 8, height: 16 }} />
            </div>
        </$Button>
    );
};
