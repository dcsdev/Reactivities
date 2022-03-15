import {
  makeAutoObservable,
  runInAction,
} from "mobx";
import agent from "../api/agent";
import { IActivity } from "../models/IActivity";
import {v4 as uuid} from 'uuid';

export default class ActivitySTore {
  title = "Hello from Mobx!";
  activities: IActivity[] = [];
  activityRegistry = new Map<string,IActivity>();
  selectedActivity: IActivity | undefined = undefined;
  editMode = false;
  loading = false;
  loadingInitial = false;

  constructor() {
    makeAutoObservable(this);
  }

  get activitiesByate() {
    return Array.from(this.activityRegistry.values()).sort((a,b) => Date.parse(a.date) - Date.parse(b.date));
  }

  loadActivities = async () => {
    this.setLoadingInitial(true);

    try {
      const activities = await agent.Activities.list();

      activities.forEach((act) => {
        act.date = act.date.split("T")[0];
        this.activities.push(act);
        this.activityRegistry.set(act.id,act);
      });
      this.setLoadingInitial(false);
    } catch (error) {
      this.setLoadingInitial(false);
      console.log(error);
    }
  };

  setLoadingInitial = (state: boolean) => {
    this.loadingInitial = state;
  };

  selectActivity =(id : string) => {
      this.selectedActivity = this.activities.find(a => a.id === id);
      this.activityRegistry.get(id)
  }

  cancelSelectedActivity = () => {
      this.selectedActivity = undefined;
  }

  open = (id? : string) => {
     id ? this.selectActivity(id) : this.cancelSelectedActivity();
     this.editMode = true;
  }

  closeForm = () => {
      this.editMode = false;
  }

  createActivity = async (activity: IActivity) => {
    this.loading = true;
    activity.id = uuid();

    try {
        await agent.Activities.create(activity);
        runInAction(() => {
            this.activityRegistry.set(activity.id, activity);
            this.selectedActivity = activity;
            this.editMode = false;
            this.loading = false;
        })  
    } catch (error) {
        runInAction(() => {
            this.loading = false;
        })
    }
  }

  updateActivity = async (activity: IActivity) => {
    this.loading = true;
    try {
        await agent.Activities.update(activity);
        runInAction(() => {
            this.activityRegistry.set(activity.id,activity);
            this.selectedActivity = activity;
            this.editMode = false;
            this.loading = false;
        })  
    } catch (error) {
        runInAction(() => {
            this.loading = false;
        })
    }
  }

  deleteActivity = async (id: string) => {
      this.loading = true;

      try {
          await agent.Activities.delete(id);

          runInAction(() => {
            this.activityRegistry.delete(id);
            if(this.selectedActivity?.id == id) {
                this.cancelSelectedActivity();
            }
            this.loading = false;
          })
          
      } catch (error) {
          runInAction(() => {
            this.loading = false;
          })
      }
  }
}
