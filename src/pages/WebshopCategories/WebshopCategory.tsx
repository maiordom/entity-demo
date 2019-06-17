import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import interact from 'interactjs';

import Button from 'ui/lib/Button';

import { editWebshopCategory, IEditWebshopCategoryRequestParams } from 'src/entities/WebshopCategories/actions';
import { changeWebshopCategory, IChangeWebshopCategoryParams } from 'src/entities/WebshopCategories/actions';

import { IStore } from 'src/store';
import { IWebshopCategory } from 'src/entities/WebshopCategories/store';
import WebshopCategoryNode from './WebshopCategoryNode';
import Overlay from 'src/components/Overlay/Overlay';
import WebshopCategoryManager from './WebshopCategoryManager';

export interface IProps {
    serviceId: string;
    onChange?: () => void;
    categories: { [categoryId: string]: IWebshopCategory; }
}

export interface IActions {
    actions: {
        editWebshopCategory: (params: IEditWebshopCategoryRequestParams) => Promise<void>;
        changeWebshopCategory: (params: IChangeWebshopCategoryParams) => void;
    };
}

interface IState {
    currentActionType: string;
    currentCategory: IWebshopCategory;
}

import nodeCSS from './WebshopCategoryNode.css';
const root = document.querySelector('body');

class WebshopCategory extends React.PureComponent<IProps & IActions, IState> {
    state = {
        currentActionType: null,
        currentCategory: null
    };
    dragEndTimeout: number = 0;
    overlayCategoryManagerRef: React.RefObject<Overlay> = React.createRef();

    dragMoveListener (event) {
        const { target } = event;
        const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
        const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

        target.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
        target.setAttribute('data-x', x);
        target.setAttribute('data-y', y);
    }

    componentDidMount() {
        let dragActive;

        interact('.webshop-category-node').draggable({
            inertia: true,
            autoScroll: true,
            onmove: this.dragMoveListener,

            onstart: (event) => {
                root.classList.add('dragging');
                event.target.classList.add(nodeCSS.dragActive);
                event.target.querySelectorAll('.webshop-category-node').forEach(node => {
                    node.classList.remove('webshop-category-node');
                });
                dragActive = event.target;
            },

            onend: (event) => {
                const { target } = event;

                root.classList.remove('dragging');
                dragActive.querySelectorAll('.' + nodeCSS.wrapper).forEach(node => {
                    node.classList.add('webshop-category-node');
                });
                dragActive = null;
                event.target.classList.remove(nodeCSS.dragActive);
                target.style.transform = 'translate(0px, 0px)';
                target.setAttribute('data-x', 0);
                target.setAttribute('data-y', 0);
                this.dragEndTimeout = (new Date()).getTime();
            }
        }).styleCursor(false);

        interact('.webshop-category-node').dropzone({
            accept: '.webshop-category-node',
            overlap: 'pointer',

            ondragenter: (event) => {
                event.target.classList.add(nodeCSS.activeDropzone);
            },

            ondragleave: (event) => {
                event.target.classList.remove(nodeCSS.activeDropzone);
            },

            ondrop: (event: any) => {
                const dropzone = event.target;
                const { categoryId: parentCategoryId } = dropzone.dataset;
                const { categoryId } = event.dragEvent.currentTarget.dataset;
                const category = Object.assign(this.props.categories.map[categoryId]);

                delete category.childrens;
                category.parentCategoryId = parentCategoryId;

                this.props.actions.changeWebshopCategory({ category: category, parentCategoryId: parentCategoryId });
                this.props.actions.editWebshopCategory({ value: category })
                    .then(this.props.onChange)
                    .catch(this.props.onChange);
            },

            ondropdeactivate: (event) => {
                event.target.classList.remove(nodeCSS.activeDropzone);
            }
        });
    }

    onWebshopCategoryManagerClose = () => {
        this.setState({
            currentActionType: 'create',
            currentCategory: null
        });
        this.overlayCategoryManagerRef.current.toggleVisibility();
    };

    onEditWebshopCategoryClick = (category: IWebshopCategory) => {
        if ((new Date()).getTime() - this.dragEndTimeout < 1000) {
            return;
        }

        this.setState({
            currentCategory: category,
            currentActionType: 'edit'
        }, () => {
            this.overlayCategoryManagerRef.current.toggleVisibility(true);
        });
    };

    onCreateWebshopCategoryClick = () => {
        this.setState({
            currentActionType: 'create',
            currentCategory: null
        }, () => {
            this.overlayCategoryManagerRef.current.toggleVisibility(true);
        });
    };

    render() {
        const { categories: { tree, map }, serviceId } = this.props;
        const {
            currentCategory,
            currentActionType
        } = this.state;
        const hasData = map && Object.keys(map).length > 0;

        return (<>
            <Overlay ref={this.overlayCategoryManagerRef}>
                <WebshopCategoryManager
                    onClose={this.onWebshopCategoryManagerClose}
                    serviceId={serviceId}
                    type={currentActionType}
                    category={currentCategory}
                />
            </Overlay>
            {hasData ? Object.keys(tree).map(key => (
                <WebshopCategoryNode
                    key={tree[key].id}
                    category={tree[key]}
                    onClick={this.onEditWebshopCategoryClick}
                />
            )) :
                hasData === false 
                    ? <div>Нет данных</div>
                    : null
            }
            {serviceId && (
                <Button
                    locator="add-category-button"
                    className="mt-m"
                    onClick={this.onCreateWebshopCategoryClick}
                    mods={['size-small', 'font-size-small']}
                    theme="thin-black"
                >
                    Создать категорию    
                </Button>
            )}
        </>);
    }
}

const mapStateToProps = (state: IStore) => ({
    serviceId: state.appsOptions.selected.id,
    categories: state.webshopCategories[state.appsOptions.selected.id] || {}
});

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({
        editWebshopCategory,
        changeWebshopCategory
    }, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(WebshopCategory);
