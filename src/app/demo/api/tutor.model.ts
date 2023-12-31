interface Sexo {
    label: string;
    value: string;
}
export interface Tutor {
    id?: string;
    key?: string;
    code?: string;
    name?: string;
    cep?: string;
    numero?: string;
    description?: string;
    price?: number;
    quantity?: number;
    sexo?: Sexo;
    category?: string;
    image?: string;
    rating?: number;
}
