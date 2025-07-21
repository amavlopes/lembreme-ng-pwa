export default interface IReminder {
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
