import React, { FC } from "react";
import { Navbar, NavbarBrand, NavbarToggler } from "reactstrap";

export const Header: FC = () => {
    return (
        <Navbar color="faded" style={{ backgroundColor: "#2B3797" }} dark expand="md">
            <NavbarBrand style={{ color: "#FFFFFF" }} href="/">
                PRY2020114 - SAPAML
            </NavbarBrand>
            {/* <NavbarToggler onClick={() => {}} /> */}
        </Navbar>
    );
};
