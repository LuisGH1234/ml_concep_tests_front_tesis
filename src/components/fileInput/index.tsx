import React, { FC, useState } from "react";

interface IProps {
    onChange?: (file: File) => void;
}

export const InputFile: FC<IProps> = (props) => {
    const [fileName, setFileName] = useState<string | null>(null);
    return (
        // <div style={{ display: "inline-flex" }}>
        <div style={{ display: "flex" }}>
            <label
                style={{
                    // height: "2.5rem",
                    backgroundColor: "#2B3797",
                    cursor: "pointer",
                    border: "1px solid #2B3797",
                    borderRadius: ".25rem 0 0 .25rem",
                    padding: ".375rem .75rem",
                    justifyContent: "center",
                    margin: 0,
                    // fontSize: "1rem",
                    color: "#fff",
                }}
            >
                <input
                    onChange={({ target }) => {
                        const name = target.value.split("\\").pop();
                        setFileName(name!);
                        if (props.onChange) {
                            const file = (target.files || [])[0];
                            props.onChange(file);
                        }
                    }}
                    type="file"
                    style={{ display: "none" }}
                />
                Buscar
            </label>
            <div
                style={{
                    flex: "auto",
                    display: "flex",
                    border: "1px solid #ced4da",
                    borderRadius: "0 .25rem .25rem 0",
                    padding: "0 6px",
                    width: "auto",
                    textAlign: "left",
                }}
            >
                {!fileName ? (
                    <span
                        style={{
                            padding: "0 10px",
                            flex: "auto",
                            margin: "auto",
                            color: "#777777",
                        }}
                    >
                        Escoge el archivo
                    </span>
                ) : (
                    <span
                        style={{
                            padding: "0 10px",
                            flex: "auto",
                            margin: "auto",
                            color: "rgba(0, 0, 0, 0.65)",
                        }}
                    >
                        {fileName}
                    </span>
                )}
            </div>
        </div>
        // </div>
    );
};
