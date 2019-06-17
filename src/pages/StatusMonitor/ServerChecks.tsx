import React from 'react';

import Icon from 'ui/lib/Icon';

import ServerManager from './ServerManager';
import { IServerChecks, IServerCheck } from 'src/entities/StatusMonitor/models/ServerChecks';
import { IServiceStatuses } from 'src/entities/StatusMonitor/store';

interface IProps {
    serviceStatuses: IServiceStatuses;
    serverChecks: IServerChecks;
    onEditServerCheckClick: (serverChecks: IServerChecks, check: IServerCheck) => void;
    onCreateServerCheckClick: (serverChecks: IServerChecks) => void;
}

interface IState {
    checkMode: string;
}

import css from './ServerChecks.css';

export default class ServerChecks extends React.Component<IProps, IState> {
    render() {
        const { serverChecks, serviceStatuses } = this.props;

        return (<>
            <div className="mb-s">
                <ServerManager
                    serviceStatuses={serviceStatuses}
                    serverChecks={serverChecks}
                    key={serverChecks.name}
                >
                    {serverChecks.name}&nbsp;<span className={css.checkMode}>{serverChecks.checkMode}</span>
                </ServerManager>
            </div>
            <div className="inline flex-wrap-wrap">
                {serverChecks.checks.map(check => (
                    <div
                        onClick={() => {
                            this.props.onEditServerCheckClick(serverChecks, check);
                        }}
                        className={`${css.check} line-height-m`}
                    >
                        {Object.keys(check).map(key => (
                            <div>{key}: {check[key] || '—'}</div>
                        ))}
                    </div>
                ))}
                <div
                    onClick={() => {
                        this.props.onCreateServerCheckClick(serverChecks);
                    }}
                    className={`${css.addCheck} ${css.check}`}
                >
                    <Icon className={css.plus} category="controls" name="plus" />
                </div>
            </div>
        </>)
    }
}
