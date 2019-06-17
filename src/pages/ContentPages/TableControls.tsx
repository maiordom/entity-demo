import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { withRouter, RouteComponentProps } from 'react-router';

import Button from 'ui/lib/Button';
import Loader from 'ui/lib/Loader';

import { IContentPage } from 'src/entities/Content/store';
import { getContentPage, IGetContentPageRequestParams } from 'src/entities/Content/actions';
import { selectContentPage, ISelectContentPageParams } from 'src/entities/Content/actions';
import { deleteContentPage, IDeleteContentPageParams } from 'src/entities/Content/actions';
import api from 'src/routes/api';
import clientRoutes from 'src/routes/client';

export interface IProps {
    data: IContentPage;
}

export interface IActions {
    actions: {
        deleteContentPage: (params: IDeleteContentPageParams) => Promise<void>;
        selectContentPage: (params: ISelectContentPageParams) => void;
        getContentPage: (
            serviceId: string,
            contentPage: IContentPage,
            params: IGetContentPageRequestParams
        ) => Promise<void>;
    };
}

interface IState {
    loaders: {
        getContentPage: boolean;
        deleteContentPage: boolean;
    };
}

import css from './TableControls.css';

class TableControls extends React.PureComponent<IProps & IActions & RouteComponentProps<any>, IState> {
    state = {
        loaders: {
            getContentPage: false,
            deleteContentPage: false
        }
    };

    setLoaderState(changes: { getContentPage?: boolean; deleteContentPage?: boolean; }) {
        this.setState({ loaders: { ...this.state.loaders, ...changes } });
    }

    onEditPageClick = () => {
        this.setLoaderState({ getContentPage: true });
        this.props.actions.getContentPage(
            this.props.data.serviceId,
            this.props.data,
            { pageId: this.props.data.id }
        ).then(() => {
            this.setLoaderState({ getContentPage: false });
            this.props.actions.selectContentPage({ page: this.props.data });
            this.props.history.push(clientRoutes.editPage);
        }).catch((exx) => {
            this.setLoaderState({ getContentPage: false });
        });
    };

    onDeletePageClick = () => {
        const { id, serviceId } = this.props.data;

        this.setLoaderState({ deleteContentPage: true });
        this.props.actions.deleteContentPage({ pageId: id, serviceId: serviceId }).then(() => {
            this.setLoaderState({ deleteContentPage: false });
        }).catch(() => {
            this.setLoaderState({ deleteContentPage: false });
        });
    };

    render() {
        const { loaders } = this.state;
        const { data } = this.props;

        return (
            <div className={classNames(css.container, 'inline')}>
                <div className="col-3 align-items-center inline justify-content-center">
                    {loaders.getContentPage
                        ? <Loader size="small" className={css.loader} />
                        : <Button
                            onClick={this.onEditPageClick}
                            theme="thin-black"
                            mods={['wide', 'size-small', 'font-size-small']}
                        >
                            Редактировать
                        </Button>
                    }
                </div>
                {!data.isDefault && (
                    <div className="col-2 ml-s align-items-center inline justify-content-center">
                        {loaders.deleteContentPage
                            ? <Loader size="small" className={css.loader} />
                            : <Button
                                onClick={this.onDeletePageClick}
                                theme="thin-black"
                                mods={['wide', 'size-small', 'font-size-small']}
                            >
                                Удалить
                            </Button>
                        }
                    </div>
                )}
            </div>
        );
    }
}

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({
        getContentPage,
        selectContentPage,
        deleteContentPage
    }, dispatch)
});

export default connect(null, mapDispatchToProps)(withRouter(TableControls));
