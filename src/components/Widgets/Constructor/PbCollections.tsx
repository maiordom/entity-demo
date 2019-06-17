import React from 'react';
import { connect } from 'react-redux';
import cloneDeep from 'lodash/cloneDeep';

import Checkbox from 'ui/lib/Checkbox';
import Spinner from 'ui/lib/Spinner';

import getAchievementsByService, { IGetAchievementsByServiceRequestParams, IGetAchievementsByServiceResult } from 'src/entities/Achievements/services/GetAchievementsByService';

import RequestTracker from 'src/components/RequestTracker/RequestTracker';
import { WIDGET_TYPE_PB_COLLECTIONS } from './Constructor';
import { IWidgetPbCollections } from 'src/entities/Content/store';
import { IAchievement } from 'src/entities/Achievements/models/Achievement';

import api from 'src/routes/api';

interface IProps {
    widget: IWidgetPbCollections;
    loaders?: {
        getAchievementsByService: boolean;
    };
}

interface IActions {
    actions: {
        getAchievementsByService: (params: IGetAchievementsByServiceRequestParams) => Promise<IGetAchievementsByServiceResult>;
    };
}

interface IState extends IWidgetPbCollections {}

type IOption = IAchievement & { checked?: boolean; };

export class PbCollections extends React.PureComponent<IProps & IActions, IState> {
    state = cloneDeep(this.props.widget || {
        type: WIDGET_TYPE_PB_COLLECTIONS,
        source: {
            achievementIds: []
        }
    }) as IWidgetPbCollections;

    options: Array<IOption> = null;

    getWidgetConfig = (): IWidgetPbCollections => this.state;

    componentDidMount() {
        this.fetchItems();
    }

    async fetchItems() {
        const achievements = await this.props.actions.getAchievementsByService({
            fromPartnerId: 'forgame-ru',
            toPartnerId: 'pb-ru',
            count: 100
        });
        const { achievementIds } = this.state.source;

        this.options = achievements;
        achievements.forEach((item: IOption) => {
            item.checked = achievementIds.includes(item.id);
        });
        this.forceUpdate();
    }

    renderItem = (option: IAchievement) => {
        return (
            <div>{option.name} (id: {option.id})</div>
        );
    };

    onAchievementChange = (checked: boolean, index: number) => {
        this.options[index].checked = checked;

        const ids = this.options
            .filter(option => option.checked)
            .map(option => option.id);

        this.state.source.achievementIds = ids;
    };

    render() {
        const { loaders } = this.props;
        const { options } = this;

        return (
            <div className="col-6">
                {loaders.getAchievementsByService && (
                    <Spinner size="small" />
                )}
                {options && options.length > 0 && (<>
                    <div className="label mb-xs">Список ачивок</div>
                    {options.map((option, index) => (
                        <div className="mb-s">
                            <Checkbox
                                theme="light"
                                checked={option.checked}
                                label={option.name.ru}
                                onClick={(checked) => this.onAchievementChange(checked, index)}
                            />
                        </div>
                    ))}
                </>)}
                {options && options.length === 0 && (
                    <div>Нет данных</div>
                )}
            </div>
        );
    }
}

const mapDispatchToProps = () => ({
    actions: {
        getAchievementsByService
    }
});

const PbCollectionsWithConnect = connect(null, mapDispatchToProps, null, { withRef: true })(PbCollections);

const PbCollectionsWithForwardRef = React.forwardRef((props: IProps, ref) => (
    <RequestTracker loaders={[
        api.achievements.getAchievementsByService

    ]}>
        <PbCollectionsWithConnect ref={ref} {...props} />
    </RequestTracker>
));

export default PbCollectionsWithForwardRef;
