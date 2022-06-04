import { observer } from 'mobx-react-lite';
import React from 'react';
import { Link } from 'react-router-dom';
import { List, Image, Popup } from 'semantic-ui-react';
import { Profile } from '../../../app/models/Iprofile';
import ProfileCard from '../../profiles/ProfileCard';

interface Props {
    attendees: Profile[];
}

export default observer(function ActivityListItemAttendee({ attendees }: Props) {
    return (
        <List horizontal>
            {attendees.map(att =>

                <Popup hoverable key={att.username} trigger={
                    <List.Item key={att.username}><Image size='mini' circular src={att.image || '/assets/user.png'} /></List.Item>
                }>
                    <Popup.Content>
                        <ProfileCard profile={att} />
                    </Popup.Content>
                </Popup>
            )}
        </List>
    )
});