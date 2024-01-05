export interface Task {
    id: number,
    title: string,
    completed: boolean,
    editing: boolean
}

export type Filters = 'all' |  'pending' | 'completed';

export enum FilterValues {
    All = 'all',
    Pending = 'pending',
    Completed = 'completed'
}