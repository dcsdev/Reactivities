import { format } from "date-fns";
import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { ActivityFormValues, IActivity } from "../models/IActivity";
import { Profile } from "../models/Iprofile";
import { store } from "./store";

export default class ActivitySTore {
  title = "Hello from Mobx!";
  activities: IActivity[] = [];
  activityRegistry = new Map<string, IActivity>();
  selectedActivity: IActivity | undefined = undefined;
  editMode = false;
  loading = false;
  loadingInitial = false;

  constructor() {
    makeAutoObservable(this);
  }

  get activitiesByDate() {
    return Array.from(this.activityRegistry.values()).sort(
      (a, b) => a.date!.getTime() - b.date!.getTime()
    );
  }

  get groupedActivities() {
    return Object.entries(
      this.activitiesByDate.reduce((activities, activity) => {
        const date = format(activity.date!, "dd MMM yyyy");
        activities[date] = activities[date]
          ? [...activities[date], activity]
          : [activity];
        return activities;
      }, {} as { [key: string]: IActivity[] })
    );
  }

  loadActivities = async () => {
    this.setLoadingInitial(true);

    try {
      const activities = await agent.Activities.list();

      activities.forEach((act) => {
        this.setActivity(act);
      });
      this.setLoadingInitial(false);
    } catch (error) {
      this.setLoadingInitial(false);
      console.log(error);
    }
  };

  loadActivity = async (id: string) => {
    let activity = this.getActivity(id);

    if (activity) {
      this.selectedActivity = activity;
      return activity;
    } else {
      this.loadingInitial = true;
      try {
        activity = await agent.Activities.details(id);
        this.setActivity(activity);
        runInAction(() => {
          this.selectedActivity = activity;
        });

        this.setLoadingInitial(false);
        return activity;
      } catch (error) {
        console.log(error);
        this.setLoadingInitial(false);
      }
    }
  };

  private getActivity = (id: string) => {
    return this.activityRegistry.get(id);
  };

  private setActivity = (activity: IActivity) => {
    const user = store.userStore.user;

    if (user == null) return;

    if (user) {
      activity.isGoing = activity.attendees!.some(
        (a) => a.username === user.userName
      );
    }

    activity.isHost = activity.hostUserName === user.userName;
    activity.host = activity.attendees?.find(
      (x) => x.username === activity.hostUserName
    );

    activity.date = new Date(activity.date!);
    this.activityRegistry.set(activity.id, activity);
  };

  setLoadingInitial = (state: boolean) => {
    this.loadingInitial = state;
  };

  createActivity = async (activity: ActivityFormValues) => {
    const user = store.userStore.user;
    const attendee = new Profile(user!);

    try {
      await agent.Activities.create(activity);
      const newActivity = new IActivity(activity);
      newActivity.hostUserName = user!.userName;
      newActivity.attendees = [attendee];

      this.setActivity(newActivity);
      runInAction(() => {
        this.selectedActivity = newActivity;
      });
    } catch (error) {
      console.log(error);
    }
  };

  updateActivity = async (activity: ActivityFormValues) => {
    this.loading = true;
    try {
      await agent.Activities.update(activity);
      runInAction(() => {
        if(activity.id) {
          let updatedActivity = {...this.getActivity(activity.id), ...activity}
          this.activityRegistry.set(activity.id, this.updateActivity as unknown as IActivity);
          this.selectedActivity = updatedActivity as IActivity;
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  deleteActivity = async (id: string) => {
    this.loading = true;

    try {
      await agent.Activities.delete(id);

      runInAction(() => {
        this.activityRegistry.delete(id);
        this.loading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  updateAttendance = async () => {
    const user = store.userStore.user;
    this.loading = true;

    try {
      await agent.Activities.attend(this.selectedActivity!.id);
      runInAction(() => {
        if(this.selectedActivity?.isGoing) {
          this.selectedActivity.attendees = this.selectedActivity.attendees?.filter(a => a.username !== user?.userName)
          this.selectedActivity.isGoing = false;
        } else 
        {
          const attendee = new Profile(user!);
          this.selectedActivity?.attendees?.push(attendee);
          this.selectedActivity!.isGoing = true;
        }

        this.activityRegistry.set(this.selectedActivity!.id,this.selectedActivity!);
      })
    } catch (error) {
      console.log(error);
    } finally {
      runInAction(() => (this.loading = false));
    }
  }

  cancelActivityToggle = async() => {
    this.loading = true;
    try {
      await agent.Activities.attend(this.selectedActivity!.id);
      runInAction(() => {
        this.selectedActivity!.isCancelled = !this.selectedActivity?.isCancelled;
        this.activityRegistry.set(this.selectedActivity!.id, this.selectedActivity!);
      })
    } catch (error) {
      console.log(error);
    } finally {
      runInAction(() => this.loading = false);
    }
  }
}
