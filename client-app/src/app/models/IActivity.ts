import { act } from "react-dom/test-utils";
import { object } from "yup";
import { Profile } from "./Iprofile";

export interface IActivity {
    id: string;
    title: string;
    date: Date | null;
    description: string;
    category: string;
    city: string;
    venue: string;
    hostUserName: string;
    isCancelled: boolean;
    isGoing : boolean;
    isHost : boolean;
    attendees?: Profile[]
    host? : Profile
}

export class IActivity implements IActivity {
    constructor(init? : ActivityFormValues) {
        Object.assign(this,init);
    }
}

export class ActivityFormValues {
    id? : string = undefined;
    title: string = '';
    category: string = '';
    description: string = '';
    date: Date | null = null;
    city: String = '';
    venue: String = '';

    constructor(activity? : ActivityFormValues) {
        if(activity) {
            this.id = activity.id;
            this.title = activity.title;
            this.category = activity.category;
            this.description = activity.description;
            this.date = activity.date;
            this.venue = activity.venue;
            this.city = activity.city;
        }
        
    }
}