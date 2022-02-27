import React from 'react';
import { Grid } from 'semantic-ui-react';
import { IActivity } from '../../../app/models/IActivity';
import ActivityDetails from '../details/ActivityDetails';
import ActivityForm from '../form/ActivityForm';
import ActivityList from './ActivityList';

interface Props {
    activities: IActivity[];
    selectedActivity: IActivity | undefined;
    selectActivity: (id: string) => void;
    cancelSelectActivity: () => void;
    editMode: boolean;
    openForm: (id: string) => void;
    closeForm: () => void;
    createOrEdit: (activity: IActivity) => void;
    deleteActivity: (id: string) => void;
    submitting: boolean;

}

export default function ActivityDashboard({ activities, selectedActivity, selectActivity, cancelSelectActivity, editMode, openForm, submitting, closeForm , createOrEdit, deleteActivity}: Props ) {
    return (
        <Grid>
            <Grid.Column width='10'>
                <ActivityList submitting={submitting} deleteActivity={deleteActivity} activities={activities} selectActivity={selectActivity} />
            </Grid.Column>
            <Grid.Column width='6'>
                {selectedActivity &&
                <ActivityDetails activity={selectedActivity} cancelSelectActivity={cancelSelectActivity} openForm={openForm}  />}
                {editMode && 
                        <ActivityForm submitting={submitting} createOrEdit={createOrEdit} closeForm={closeForm} activity={selectedActivity}></ActivityForm>}
            </Grid.Column>
        </Grid>
    )
}