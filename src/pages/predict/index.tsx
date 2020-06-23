import React, { FC, useState } from "react";
import {
    Input,
    Row,
    Col,
    InputGroup,
    Label,
    Form,
    FormGroup,
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
} from "reactstrap";
import { Select, Lottie } from "../../components";
// import Select from "react-select";
import Axios, { AxiosError } from "axios";
import loadingJson from "../../assets/loading.json";
import { render } from "@testing-library/react";

type Body = { prob: string; target: string };
interface ModalProps {
    isOpen: boolean;
    messages: string[];
    toggle: () => void;
}

const genderOptions = [
    { value: "1", label: "Masculino (1)" },
    { value: "0", label: "Femenino (0)" },
];

const anginaOptions = [
    { value: "1", label: "Angina típica (1)" },
    { value: "2", label: "Angina atípica (2)" },
    { value: "3", label: "Dolor no anginal (3)" },
    { value: "4", label: "No presenta (4)" },
];

const estadoCorOptions = [
    { value: "3", label: "Normal (3)" },
    { value: "6", label: "Defecto fijo (6)" },
    { value: "7", label: "Defecto reversible (7)" },
];

const BASE_URL = "http://3.230.230.245:5000";

const $Modal: FC<ModalProps> = (props) => {
    if (!Array.isArray(props.messages)) {
        console.log("El modal no se puede mostrar correctamente.");
        return <div />;
    }
    return (
        <Modal isOpen={props.isOpen} toggle={props.toggle} /*className={className}*/>
            <ModalHeader toggle={props.toggle}>Errores encontrados</ModalHeader>
            <ModalBody>
                {props.messages.map((x, i) => (
                    <div key={i}>
                        <label style={{ color: "red" }}>{x}</label>
                        <br />
                    </div>
                ))}
            </ModalBody>
            <ModalFooter>
                <Button color="primary" onClick={props.toggle}>
                    Cerrar
                </Button>
            </ModalFooter>
        </Modal>
    );
};

export const Predict: FC = () => {
    const [showModal, setShowModal] = useState(false);
    const [sexo, setSexo] = useState<string>("");
    const [angina, setAngina] = useState("");
    const [corazon, setCorazon] = useState("");
    const [preArterial, setPreArterial] = useState("");
    const [colesterol, setColesterol] = useState("");
    const [glucosa, setGlucosa] = useState("");
    const [bpm, setBpm] = useState("");
    const [fluroscopia, setFluroscopia] = useState("");

    const [response, setResponse] = useState<{
        loading: boolean;
        value: string | string[] | null;
        error: boolean;
    }>({
        loading: false,
        value: null,
        error: false,
    });

    const onSubmit = async (data: any) => {
        setResponse({ loading: true, value: null, error: false });
        try {
            const response = await Axios.post<Body>(`${BASE_URL}/predict`, data);
            console.log(response.data);
            setResponse({ loading: false, value: response.data.prob, error: false });
        } catch (error) {
            const response = (error as AxiosError).response;
            console.log(response?.status);
            setResponse({ loading: false, value: "Ocurrio un problema", error: true });
        }
    };

    const dataIsValid = () => {
        let message: string[] = [];
        if (sexo === "") message.push('El campo "Género" es obligatorio');
        if (angina === "") message.push('El campo "Tipo de angina" es obligatorio');

        if (preArterial === "") message.push('El campo "Presión arterial" es obligatorio');
        else if (isNaN(Number(preArterial)))
            message.push('El campo "Presión arterial" debe ser numérico');
        else if (Number(preArterial) < 1)
            message.push('El campo "Presión arterial" debe ser mayor a cero');

        if (colesterol === "") message.push('El campo "Colesterol" es obligatorio');
        else if (isNaN(Number(colesterol))) message.push('El campo "Colesterol" debe ser numérico');
        else if (Number(colesterol) < 1)
            message.push('El campo "Colesterol" debe ser mayor a cero');

        if (glucosa === "") message.push('El campo "Glucosa" en ayuna es obligatorio');
        else if (isNaN(Number(glucosa))) message.push('El campo "Glucosa" debe ser numérico');
        else if (Number(glucosa) < 1) message.push('El campo "Glucosa" debe ser mayor a cero');

        if (bpm === "") message.push('El campo "Frecuencia cardiaca" es obligatorio');
        else if (isNaN(Number(bpm)))
            message.push('El campo "Frecuencia cardiaca" debe ser numérico');
        else if (Number(bpm) < 1)
            message.push('El campo "Frecuencia cardiaca" debe ser mayor a cero');

        if (fluroscopia === "") message.push('El campo "Fluroscopia" es obligatorio');
        else {
            const num = Number(fluroscopia);
            if (num < 0 || num > 3) message.push('El campo "Fluroscopia" debe ser entre 0 a 3');
        }

        if (corazon == "") message.push('El campo "Estado del corazón" es obligatorio');

        setResponse({ loading: false, value: message, error: true });
        // console.log(message);
        return message.length === 0;
    };

    const renderLoading = () => {
        return (
            <div style={{ margin: "2rem 8px" }}>
                <Lottie
                    animationData={loadingJson}
                    loop
                    style={{ width: 150, height: 150, margin: "auto" }}
                />
            </div>
        );
    };
    const renderResponse = () => {
        if (!response.value && response.error === false) return <div />;
        // if (response.error && Array.isArray(response.value)) {
        // return (
        //     <div style={{ margin: "2rem 8px" }}>
        //         <h2 style={{ color: "red" }}>
        //             <strong>Error</strong>
        //         </h2>
        //         {response.value.map((x, i) => (
        //             <div key={i}>
        //                 <label style={{ color: "red" }}>{x}</label>
        //                 <br />
        //             </div>
        //         ))}
        //     </div>
        // );
        // }
        if (response.error === false && !Array.isArray(response.value))
            return (
                <div style={{ margin: "2rem 8px" }}>
                    {response.error && (
                        <h2 style={{ color: "red" }}>
                            <strong>Error</strong>
                        </h2>
                    )}
                    <h3>
                        {response.error ? (
                            response.value
                        ) : (
                            <label>
                                Probabilidad de riesgo cardiovascular:{" "}
                                <strong>{(Number(response.value) * 100).toFixed(2)}</strong>
                            </label>
                        )}
                    </h3>
                </div>
            );
        return <div />;
        // return <div>Ocurrio un problema al renderizar el resultado</div>;
    };

    return (
        <div>
            <$Modal
                isOpen={showModal}
                messages={response.value as string[]}
                toggle={() => setShowModal((prev) => !prev)}
            />
            <h1 style={{ color: "rgba(43, 55, 151, 0.85)" }}>
                Sistema de auxilio para el adulto mayor utilizando Machine Learning
            </h1>
            <div style={{ height: 20 }} />
            <Row style={{ margin: "0 8px" }}>
                <Col md="12">
                    <p style={{ textAlign: "justify" }}>
                        La presente aplicación tiene por finalidad determinar el riesgo
                        cardiovascular de las personas. Para ello se utiliza un modelo de Machine
                        Learning, el cual, se entrenó con el dataset de Cleveland propiedad de la
                        Universidad de California en Irvine.
                    </p>
                </Col>
            </Row>
            <h4 className="mt-4 mb-4" style={{ textAlign: "left" }}>
                Formulario de predicción
            </h4>
            <Form>
                <FormGroup row>
                    <Label style={{ textAlign: "left" }} for="sexo" md="4">
                        Género
                    </Label>
                    <Col md="8">
                        <Select
                            id="sexo"
                            disabled={response.loading}
                            value={sexo}
                            placeholder="Seleccione el género"
                            options={genderOptions}
                            onChangeValue={setSexo}
                        />
                    </Col>
                </FormGroup>
                <FormGroup row>
                    <Label style={{ textAlign: "left" }} for="angina" md="4">
                        Tipo de angina
                    </Label>
                    <Col md="8">
                        <Select
                            id="angina"
                            disabled={response.loading}
                            value={angina}
                            placeholder="Seleccione una opción"
                            options={anginaOptions}
                            onChangeValue={setAngina}
                        />
                    </Col>
                </FormGroup>
                <FormGroup row>
                    <Label style={{ textAlign: "left" }} for="presion_arterial" md="4">
                        Presión arterial (mmHg)
                    </Label>
                    <Col md="8">
                        <Input
                            id="presion_arterial"
                            disabled={response.loading}
                            placeholder="Ingrese la presión arterial"
                            value={preArterial}
                            onChange={(e) => setPreArterial(e.target.value)}
                        />
                    </Col>
                </FormGroup>
                <FormGroup row>
                    <Label style={{ textAlign: "left" }} for="colesterol" md="4">
                        Colesterol (mg/dl)
                    </Label>
                    <Col md="8">
                        <Input
                            id="colesterol"
                            disabled={response.loading}
                            placeholder="Ingrese el colesterol"
                            value={colesterol}
                            onChange={(e) => setColesterol(e.target.value)}
                        />
                    </Col>
                </FormGroup>
                <FormGroup row>
                    <Label style={{ textAlign: "left" }} for="glucosa" md="4">
                        Glucosa en ayunas (mg/dl)
                    </Label>
                    <Col md="8">
                        <Input
                            id="glucosa"
                            disabled={response.loading}
                            placeholder="Ingrese el glucosa"
                            value={glucosa}
                            onChange={(e) => setGlucosa(e.target.value)}
                        />
                    </Col>
                </FormGroup>
                <FormGroup row>
                    <Label style={{ textAlign: "left" }} for="bpm" md="4">
                        Frecuencia cardiaca en reposo (bpm)
                    </Label>
                    <Col md="8">
                        <Input
                            id="bpm"
                            disabled={response.loading}
                            placeholder="Ingrese el frecuencia cardiaca"
                            value={bpm}
                            onChange={(e) => setBpm(e.target.value)}
                        />
                    </Col>
                </FormGroup>
                <FormGroup style={{ textAlign: "left" }} row>
                    <Label for="fluroscopia" md="4">
                        Vasos principales dañados (Fluroscopia)
                    </Label>
                    <Col md="8">
                        <Input
                            id="fluroscopia"
                            disabled={response.loading}
                            type="number"
                            max={3}
                            min={0}
                            placeholder="Ingrese un valor entre 0 a 3"
                            value={fluroscopia}
                            onChange={(e) => setFluroscopia(e.target.value)}
                        />
                    </Col>
                </FormGroup>
                <FormGroup row>
                    <Label style={{ textAlign: "left" }} for="estado_corazon" md="4">
                        Estado del corazón
                    </Label>
                    <Col md="8">
                        <Select
                            id="estado_corazon"
                            disabled={response.loading}
                            value={corazon}
                            placeholder="Seleccione una opción"
                            options={estadoCorOptions}
                            onChangeValue={setCorazon}
                        />
                    </Col>
                </FormGroup>
                <Button
                    type="button"
                    onClick={(v) => {
                        const isValid = dataIsValid();
                        if (isValid) {
                            const data = {
                                sexo: Number(sexo),
                                angina: Number(angina),
                                estado_corazon: Number(corazon),
                                presion_arterial: Number(preArterial),
                                colesterol: Number(colesterol),
                                glucosa: Number(glucosa) > 120,
                                bpm: Number(bpm),
                                fluroscopia: Number(fluroscopia),
                            };
                            console.log(data);
                            onSubmit(data);
                        } else setShowModal(true);
                        v.preventDefault();
                    }}
                    disabled={response.loading}
                >
                    Predecir
                </Button>
            </Form>
            <div>{response.loading ? renderLoading() : renderResponse()}</div>
        </div>
    );
};
