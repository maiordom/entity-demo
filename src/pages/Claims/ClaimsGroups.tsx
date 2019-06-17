import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import map from 'lodash/map';

import { IStore } from 'src/store';
import { IClaims } from 'src/entities/Claim/store';
import { IOption } from 'src/entities/Apps/store';

import ClaimsGroup from './ClaimsGroup';
import { setService, ISetServiceParams } from 'src/entities/Claim/actions';

import Select from 'ui/lib/Select';

interface IProps {
    claims: IClaims;
}

interface IActions {
    actions: {
        setService: (params: ISetServiceParams) => void;
    };
}

import css from './ClaimsGroups.css';

class ClaimsGroups extends React.PureComponent<IProps & IActions, any> {
    onServiceChange = (value: string, option: IOption) => {
        this.props.actions.setService({ option });
    };

    render() {
        const { groups } = this.props.claims;
        const { claimsByService, claimsByType, apps } = this.props.claims;

        return (
            <div>
                <div className={`${css.head} align-items-center inline mb-m`}>
                    <div data-locator="claims-list" className={css.title}>Выдача прав</div>
                    {map(claimsByService, (service, key) => (
                        <div key={key} className={css.claim}>
                            <div className={css.claimName}>{key}</div>
                        </div>
                    ))}
                    <Select
                        locator="claims-list-select-add-service"
                        className="col-4 ml-m flex-shrink-fixed"
                        placeholder="Добавить сервис"
                        options={apps.items}
                        theme="light"
                        onChange={this.onServiceChange}
                        value={apps.selected && apps.selected.value}
                    />
                    <div className="col-1 flex-shrink-fixed">&nbsp;</div>
                </div>
                {map(groups, (group, key) => (
                    <ClaimsGroup
                        key={key}
                        groupKey={key}
                        group={group}
                        claimsByService={claimsByService}
                        claimsByType={claimsByType}
                    />
                ))}
            </div>
        );
    }
}

const mapStateToProps = (state: IStore): IProps => ({
    claims: state.claims
});

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({ setService }, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(ClaimsGroups);
