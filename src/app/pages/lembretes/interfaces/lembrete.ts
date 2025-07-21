export default interface Lembrete {
    id: string;
    nome: string;
    cor?: string;
    idCategoria?: number;
    descricao?: string;
    agendadoPara?: string;
}
