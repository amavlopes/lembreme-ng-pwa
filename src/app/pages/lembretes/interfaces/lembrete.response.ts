export default interface LembreteResponse {
    id: number;
    name: string;
    color: string;
    category?: {
        id: number;
        name: string;
    };
    description?: string;
    scheduledAt?: string;
}
