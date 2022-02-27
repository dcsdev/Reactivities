import React, { ChangeEvent, useState } from 'react';
import { Form, Segment, Button } from 'semantic-ui-react';
import { IActivity } from '../../../app/models/IActivity';

interface Props {
    closeForm: () => void;
    activity: IActivity | undefined;
    createOrEdit: (activity: IActivity) => void;

}

export default function ActivityForm({closeForm, activity : selectedActivity, createOrEdit}: Props) 
{
    const initialState = selectedActivity ?? {
        id: '',
        title: '',
        category: '',
        description: '',
        date: '',
        city: '',
        venue: '',
    }

    const [activity, setActivity] = useState(initialState);

    function handleSubmit() {
        console.log(activity);
        createOrEdit(activity);
    }

    function handleInputChange(event : ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const {name, value} = event.target;
        setActivity({...activity, [name] : value});
    }

    return (
        <Segment clearing>
            <Form onSubmit={handleSubmit} autoComplete='off'>
                <Form.Input placeholder='Title' value={activity.title} name='title' onChange={handleInputChange} />
                <Form.TextArea placeholder='Description' value={activity.description} name='description' />
                <Form.Input placeholder='Category' value={activity.category} name='category'  onChange={handleInputChange} />
                <Form.Input placeholder='Date' value={activity.date} name='date'  onChange={handleInputChange} />
                <Form.Input placeholder='City' value={activity.city} name='city'  onChange={handleInputChange} />
                <Form.Input placeholder='Venue' value={activity.venue} name='venue'  onChange={handleInputChange} />

                <Button floated="right" positive type='submit' content='Save' />
                <Button floated="right" positive content='Cancel' onClick={closeForm} />
            </Form>
        </Segment>
    )
}