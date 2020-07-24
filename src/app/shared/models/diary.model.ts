import { Action } from '../enums/action.enum';

export interface Diary {
    id?: string;
    userId?: string;
    createdDate?: any;
    action?: Action;
    description?: string;
    browser?: string;
    device?: string;
}
