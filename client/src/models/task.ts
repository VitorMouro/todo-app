export default interface Task {
    id: string;
    title: string;
    description: string;
    status: 'pending' | 'in_progress' | 'completed';
    createdAt: Date;
    updatedAt: Date;
    userId: string;
}
