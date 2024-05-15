import React, { useState, useEffect } from 'react';
import OnPagination from '../onlineAppointmentsEditPagination';
import OffPagination from '../offlineAppointmentsEditPagination';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import ViewAdd from '../viewAdd';
import ViewList from '../adminItemCard';
import ExhibitAdd from '../exhibitAdd';
import ExhibitList from '../exhibitListAdmin';
import CreateView from '../createView';
import Users from '../allUserList';
import EmailPost from '../emailPost';

function UserPage() {
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {

            const decodedToken = decodeToken(token);
            setUserId(decodedToken.userId);
        }
    }, []); 

    const decodeToken = (token) => {
        const tokenParts = token.split('.');
        const decodedPayload = JSON.parse(atob(tokenParts[1]));
        return decodedPayload;
    };

    return (
        <div>
            <Tabs
                defaultActiveKey="home"
                id="fill-tab-example"
                className="mb-3"
                fill
                >
                <Tab eventKey="home" title="Записи">
                    <Tabs
                    defaultActiveKey="home"
                    id="fill-tab-example"
                    className="mb-3"
                    fill
                    >
                    <Tab eventKey="home" title="Онлайн записи">
                        <OnPagination />
                    </Tab>
                    <Tab eventKey="profile" title="Офлайн записи">
                        <OffPagination />
                    </Tab>
                    </Tabs>
                </Tab>
                <Tab eventKey="news" title="Выставки">
                    <Tabs
                    defaultActiveKey="profile"
                    id="fill-tab-example"
                    className="mb-3"
                    fill
                    >
                    <Tab eventKey="profile" title="Добавить выставку">
                        <ViewAdd />
                    </Tab>
                    <Tab eventKey="view" title="Создать файл выставки">
                        <CreateView />
                    </Tab>
                    <Tab eventKey="news" title="Список выставок">
                        <ViewList />
                    </Tab>
                    </Tabs>
                </Tab>
                <Tab eventKey="exhibit" title="Экспонаты">
                    <Tabs
                    defaultActiveKey="profile"
                    id="fill-tab-example"
                    className="mb-3"
                    fill
                    >
                    <Tab eventKey="profile" title="Добавить экспонат">
                        <ExhibitAdd />
                    </Tab>
                    <Tab eventKey="exhibitList" title="Список экспонатов">
                        <ExhibitList />
                    </Tab>
                    </Tabs>
                </Tab>
                <Tab eventKey="users" title="Пользователи">
                    <Tabs
                    defaultActiveKey="profile"
                    id="fill-tab-example"
                    className="mb-3"
                    fill
                    >
                    <Tab eventKey="profile" title="Список пользователей">
                        <Users />
                    </Tab>
                    <Tab eventKey="email" title="Email рассылка">
                        <EmailPost></EmailPost>
                    </Tab>
                    </Tabs>
                </Tab>
            </Tabs>
        </div>
    );
}


export default UserPage;
