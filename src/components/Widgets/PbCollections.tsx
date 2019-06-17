import React from 'react';
import { connect } from 'react-redux';
import get from 'lodash/get';

import PbCollectionWidget from 'ui/lib/PbCollectionWidget';

import getAchievementsByIds, { IGetAchievementsByIdsRequestParams, IAchievement } from 'src/entities/Achievements/services/GetAchievementsByIds';

import { IWidgetPbCollections } from 'src/entities/Content/store';
import { ProductCardSkeleton } from 'ui/lib/ProductCard';

import { IUser } from 'src/entities/User/store';
import { IStore } from 'src/store';

const locale = {
    allCollections: 'Все коллекции',
    collections: 'Коллекции',
    collectionsTooltip: 'Собери все предметы коллекции (достаточно получить каждый предмет хотя&nbsp;бы один раз) и&nbsp;получи улучшенную версию Deluxe в&nbsp;свой инвентарь навсегда!',
    from: 'из'
};

interface IProps {
    user: IUser;
    widget: IWidgetPbCollections;
    imgTemplate: string;
    onClick: (widget: IWidgetPbCollections) => void;
}

interface IActions {
    actions: {
        getAchievementsByIds: (params: IGetAchievementsByIdsRequestParams) => Promise<Array<IAchievement>>;
    };
}

interface IState {
    collections: Array<IAchievement>;
    isLoading: boolean;
}

import css from './Widgets.css';

export class PbCollections extends React.PureComponent<IProps & IActions, IState> {
    state: IState = {
        collections: [],
        isLoading: true
    };

    fetchAchievements = async () => {
        this.setState({ isLoading: true });

        const { userId } = this.props.user.profile;
        const { source: { achievementIds: ids }, serviceId } = this.props.widget;

        const archievements = await this.props.actions.getAchievementsByIds({ ids, toPartnerId: serviceId, userId });

        this.setState({
            isLoading: false,
            collections: archievements
        });
    }

    componentDidMount() {
        if (this.props.widget.status === 'error') {
            return;
        }

        this.fetchAchievements();
    }

    onClick = () => {
        this.props.onClick(this.props.widget);
    };

    render() {
        const { collections, isLoading } = this.state;
        const { imgTemplate, widget } = this.props;

        if (widget.status === 'error') {
            return (
                <div className={`
                    ${css.simpleCard}
                    ${css.inactiveCard}
                `}>
                    <span className="pl-s pr-s">{widget.statusText}</span>
                </div>
            );
        }

        if (isLoading) {
            return <ProductCardSkeleton theme="light" />;
        }

        return (
            <div className={css.container} onClick={this.onClick}>
                <div className={css.blank} />
                <PbCollectionWidget
                    theme="light"
                    collections={collections}
                    imgTemplate={imgTemplate}
                    localization={{
                        allCollections: locale.allCollections,
                        collections: locale.collections,
                        tooltip: locale.collectionsTooltip,
                        from: locale.from
                    }}
                />
            </div>
        );
    }
}

const mapStateToProps = (state: IStore) => ({
    imgTemplate: get(state.imagesGroups, 'achievements.default', ''),
    user: state.user
});

const mapDispatchToProps = () => ({
    actions: {
        getAchievementsByIds
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(PbCollections);
