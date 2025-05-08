export interface Task {
    id: string;
    title: string;
    description: string;
    status: 'pending' | 'in-progress' | 'completed';
    due: Date;
    user_id: string;
    group_id: string;
    created_at: Date;
    updated_at: Date;
}
