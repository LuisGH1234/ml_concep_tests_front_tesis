import React, { FC, useEffect, useState } from "react";
import "../../App.css";
import io from "socket.io-client";
import {
    Col,
    Row,
    Card,
    CardBody,
    CardTitle,
    Input,
    InputGroup,
    InputGroupAddon,
} from "reactstrap";
import { InputFile, Button, Lottie, Layout, Table } from "../../components";
import Axios, { AxiosError } from "axios";
import { IResponseTraining } from "../../@types";
import errorJson from "../../assets/error.json";
import successJson from "../../assets/success.json";
import loadingJson from "../../assets/loading.json";

type Response = { message: string; code: number } | null;

const BASE_URL = "http://3.230.230.245:5000";
// const BASE_URL = "http://127.0.0.1:5000";
const socket = io(BASE_URL);

function validateEmail(email: string) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

export const Trainig: FC = () => {
    // const file = useRef<Input<any> | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [email, setEmail] = useState<string>("");
    const [fileError, setFileError] = useState(false);
    const [emailError, setEmailError] = useState(false);
    const [response, setResponse] = useState<Response>(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<IResponseTraining | null>(null);

    useEffect(() => {
        console.log("CDM");
        socket.on("message", (data: IResponseTraining) => {
            // console.log(data);
            setResult(data);
            setLoading(false);
        });
        // socket.emit("my_event", "asasasas");
        return () => {
            socket.disconnect();
        };
    }, []);

    useEffect(() => {
        if (loading === true) window.location.hash = "#pickup";
    }, [loading]);

    const fetchStartTraining = async () => {
        let errors = false;
        if (file == null) {
            setFileError(true);
            errors = true;
        } else setFileError(false);
        if (email.length > 0 && !validateEmail(email)) {
            setEmailError(true);
            errors = true;
        } else setEmailError(false);
        if (errors) return;
        try {
            setResult(null);
            setLoading(true);
            const form = new FormData();
            form.append("file", file as any);
            if (email.length > 0) {
                form.append("recipients", JSON.stringify([email]));
            } else form.append("recipients", JSON.stringify([]));
            const res = await Axios.post<Response>(`${BASE_URL}/execute_training`, form);
            console.log(res.data);
            setResponse(res.data);
        } catch (error) {
            setLoading(false);
            const response = (error as AxiosError).response;
            if (response) {
                setResponse(response.data);
                console.error(response.data);
            } else console.error(error);
            setResult({
                error: true,
                message: "Ocurrio un problema durante el entrenamiento",
            } as IResponseTraining);
        }
    };

    const renderTrainigTable = () => {
        if (result?.training) {
            return (
                <Table
                    columns={[
                        {
                            header: "Nombre",
                            value: (a) => <div style={{ textAlign: "left" }}>{a.name}</div>,
                        },
                        {
                            header: "Accurcy",
                            value: (a) => (
                                <div style={{ textAlign: "right" }}>
                                    {Number(a.accuracy).toFixed(2)}
                                </div>
                            ),
                        },
                    ]}
                    data={result.training}
                    // data={transformTrainingData(result)}
                />
            );
        }
    };

    const renderCrossValTable = () => {
        if (result?.cross_validation) {
            return (
                <Table
                    columns={[
                        {
                            header: "Nombre",
                            value: (a) => <div style={{ textAlign: "left" }}>{a.name}</div>,
                        },
                        {
                            header: "Accurcy",
                            value: (a) => (
                                <div style={{ textAlign: "right" }}>
                                    {Number(a.score.accuracy).toFixed(2)}
                                </div>
                            ),
                        },
                        {
                            header: "Estabilidad",
                            value: (a) => (
                                <div style={{ textAlign: "right" }}>
                                    {Number(a.score.std).toFixed(2)}
                                </div>
                            ),
                        },
                    ]}
                    data={result.cross_validation}
                    // data={transformCrossValData(result)}
                />
            );
        }
    };

    const renderTables = () => {
        if (!result) return <div />;
        else if (result.error === true)
            return (
                <div>
                    <Lottie
                        animationData={errorJson}
                        style={{ width: 150, height: 150, margin: "auto" }}
                    />
                    <div className="alert alert-danger" role="alert" style={{ margin: "0 8px" }}>
                        <span style={{ fontWeight: "bold" }}>Error: </span>
                        {result.message}
                    </div>
                </div>
            );
        return (
            <div style={{ margin: "2rem 8px" }}>
                <Lottie
                    animationData={successJson}
                    style={{ width: 150, height: 150, margin: "auto" }}
                />
                <h3 style={{ margin: "1rem 0" }}>Resultados</h3>
                <Row style={{ margin: "1.5rem 0" }}>
                    <Col lg="6" md="12" sm="12">
                        <Card>
                            <CardBody>
                                <CardTitle>
                                    <h5 style={{ textAlign: "left" }}>Entrenamiento Simple</h5>
                                </CardTitle>
                                {renderTrainigTable()}
                            </CardBody>
                        </Card>
                    </Col>
                    <Col lg="6" md="12" sm="12">
                        <Card>
                            <CardBody>
                                <CardTitle>
                                    <h5 style={{ textAlign: "left" }}>Cross Validation</h5>
                                </CardTitle>
                                {renderCrossValTable()}
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        );
    };

    const renderLoading = () => {
        return (
            <div style={{ margin: "2rem 8px" }}>
                <h3>{response?.message || "Cargando"}</h3>
                <Lottie
                    animationData={loadingJson}
                    loop
                    style={{ width: 150, height: 150, margin: "auto" }}
                />
                {/* <Spinner type="grow" style={{ width: "3rem", height: "3rem", color: "#2B3797" }} /> */}
            </div>
        );
    };

    return (
        <div>
            <h1 style={{ color: "rgba(43, 55, 151, 0.85)" }}>
                Sistema de auxilio para el adulto mayor utilizando Machine Learning
            </h1>
            <div style={{ height: 20 }} />
            <Row style={{ margin: "0 8px" }}>
                <Col md="12">
                    <p style={{ textAlign: "justify" }}>
                        La presente aplicación tiene por finalidad demostrar el nivel de precisión
                        que tienen distintos modelos de Machine Learning, al momento de determinar
                        el nivel de riesgo cardiovascular de las personas. Para ello se usará el
                        dataset de Cleveland propiedad de la Universidad de California en Irvine.
                    </p>
                </Col>
                <Col md="12" className="mb-4">
                    <div style={{ marginBottom: 15, marginTop: 15 }}>
                        <InputFile
                            onChange={(file) => {
                                // console.log(a);
                                window.location.hash = "";
                                setFile(file);
                                setFileError(false);
                            }}
                        />
                        <div style={{ height: 24, color: "red", textAlign: "start" }}>
                            {fileError ? "El campo es obligatorio" : null}
                        </div>
                    </div>
                    <div>
                        <InputGroup>
                            <InputGroupAddon addonType="prepend">@</InputGroupAddon>
                            <Input
                                placeholder="Colocar un email"
                                onChange={(e) => setEmail(e.target.value)}
                                type="email"
                                value={email}
                            />
                        </InputGroup>
                        <div style={{ height: 24, color: "red", textAlign: "start" }}>
                            {emailError ? "El email no es valido" : null}
                        </div>
                    </div>
                </Col>
                <Col md="12">
                    <Button
                        style={{ backgroundColor: "#2B3797", borderColor: "#2B3797" }}
                        onClick={fetchStartTraining}
                        disabled={loading}
                    >
                        Comenzar entrenamiento
                    </Button>
                </Col>
            </Row>
            <hr style={{ width: "inherit" }} />
            <a id="pickup" />
            {loading ? renderLoading() : renderTables()}
        </div>
    );
};

/**
 * <Button
                    onClick={() => {
                        console.log("emitting");
                        socket.emit("my_event", "asasasas");
                    }}
                >
                    Bootstrap
                </Button>
 */
