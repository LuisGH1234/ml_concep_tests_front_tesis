import React, { FC } from "react";
import { Table as $Table } from "reactstrap";

interface IColumn<T> {
    header: string;
    value: (obj: T) => any;
}

interface IProps<T = any> {
    columns: IColumn<T>[];
    data: T[];
}

export function Table<T>(props: IProps<T>) {
    const renderHead = () => {
        return (
            <thead>
                <tr>
                    {props.columns.map((x, i) => (
                        <th key={i} style={{ textAlign: "left" }}>
                            {x.header}
                        </th>
                    ))}
                </tr>
            </thead>
        );
    };

    const renderColumn = (row: T, column: IColumn<T>, index: number) => {
        return <td key={index}>{column.value(row)}</td>;
    };

    const renderRow = (row: T, index: number) => {
        return <tr key={index}>{props.columns.map((col, i) => renderColumn(row, col, i))}</tr>;
    };

    const renderRows = () => {
        return <tbody>{props.data.map(renderRow)}</tbody>;
    };

    return (
        <$Table bordered responsive striped style={{ tableLayout: "fixed" }}>
            {renderHead()}
            {renderRows()}
        </$Table>
    );
}
