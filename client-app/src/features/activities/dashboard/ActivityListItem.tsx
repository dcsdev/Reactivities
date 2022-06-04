import React, { SyntheticEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Icon, Item, Label, Segment } from 'semantic-ui-react';
import { useStore } from '../../../app/stores/store';
import { IActivity } from '../../../app/models/IActivity';
import { format } from 'date-fns';
import ActivityListItemAttendee from './ActivityListItemAttendee';


interface Props {
    activity: IActivity
}

export default function ActivityListItem({ activity }: Props) {

    const { activityStore } = useStore();
    const { deleteActivity } = activityStore;
    const [target, setTarget] = useState('');

    function handleActivityDelete(e: SyntheticEvent<HTMLButtonElement>, id: string) {
        setTarget(e.currentTarget.name);
        deleteActivity(id);
    }

    return (
        <Segment.Group>
            <Segment>
                {activity.isCancelled &&
                    <Label attached='top' color='red' content='Cancelled' style={{textAlign :'center'}} />
                }
                <Item.Group>
                    <Item>
                        <Item.Image style={{marginBotton: 3}} size='tiny' circular src='/assets/user.png' />
                        <Item.Content>
                            <Item.Header as={Link} to={`/activities/${activity.id}`}>
                                {activity.title}
                            </Item.Header>
                            <Item.Description>
                                Hosted By {activity.host?.displayName}
                            </Item.Description>
                            {activity.isHost && (
                                <Item.Description>
                                    <Label basic color='orange'>You are hosting this activity</Label>
                                </Item.Description>)}
                            {activity.isGoing && !activity.isHost && (
                                <Item.Description>
                                    <Label basic color='green'>You are attending this activity</Label>
                                </Item.Description>)}
                        </Item.Content>
                    </Item>
                </Item.Group>
            </Segment>
            <Segment>
                <span>
                    <Icon name='clock' />{format(activity.date!, 'dd MMM yyyy h:mm aa')}
                    <Icon name='marker' />{activity.venue}
                </span>
            </Segment>
            <Segment secondary>
                <ActivityListItemAttendee attendees={activity.attendees!} />
            </Segment>
            <Segment clearing>
                <span>
                    {activity.description}
                    <Button as={Link} to={`/activities/${activity.id}`} color='teal' floated='right' content='view' />
                </span>
            </Segment>
        </Segment.Group>
    )
}