import React, { FC } from "react";
import { Header } from "../navbar";

export const Layout: FC = ({ children }) => {
    return (
        <div className="App">
            <Header />
            <div
                className="container p-2 container-fluid"
                style={{ display: "flex", flexDirection: "column" }}
            >
                {children}
            </div>
        </div>
    );
};
