export interface ITraining {
    name: string;
    accuracy: number;
}

export interface IAccuracy {
    accuracy: number;
    std: number;
}

export interface ICrossValidation {
    name: string;
    score: IAccuracy;
}

export interface IResponseTraining {
    error: boolean;
    message?: string;
    training: ITraining[];
    cross_validation: ICrossValidation[];
}
