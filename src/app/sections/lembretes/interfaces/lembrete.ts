export default interface Lembrete {
    id: number;
    nome: string;
    cor?: string;
    idCategoria?: number;
    descricao?: string;
    agendadoPara?: string;
}
