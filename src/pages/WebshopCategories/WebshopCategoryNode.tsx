import React from 'react';
import classnames from 'classnames';

import { IWebshopCategory } from 'src/entities/WebshopCategories/store';

export interface IProps {
    level?: boolean;
    category: IWebshopCategory;
    onClick: (category: IWebshopCategory) => void;
}

const getChildrensLevel = (category: IWebshopCategory, excludeLast?: boolean) => {
    let childrensLevel = 0;

    const calcChildrensLevel = (category: IWebshopCategory, excludeLast?: boolean) => {
        const level = category.childrens.length;
        const childrens = excludeLast
            ? category.childrens.slice(0, level - 1)
            : category.childrens;

        childrensLevel += level;
        childrens.forEach((item) => {
            calcChildrensLevel(item);
        });
    }

    calcChildrensLevel(category, excludeLast);

    return childrensLevel;
};

import css from './WebshopCategoryNode.css';
const nodeHeight = 35;
const nodeMargin = 15;

export default class WebshopCategoryNode extends React.PureComponent<IProps, any> {
    onClick = (event) => {
        this.props.onClick(this.props.category);
        event.stopPropagation();
    };

    render() {
        const { category, level } = this.props;
        const childsCount = category.childrens.length;
        const childrensLevel = getChildrensLevel(category, true);

        return (
            <div
                onClick={this.onClick}
                data-slug={`${category.slug}`}
                data-locator="shop-category"
                data-category-id={category.id}
                className={classnames(
                    category.isHidden && css.hidden,
                    level && css.level,
                    css.wrapper,
                    'col-6',
                    'webshop-category-node'
                )}
            >
                {childsCount > 0 && (
                    <div className={css.staff} style={{
                        height: childrensLevel * nodeHeight + childrensLevel * nodeMargin - nodeHeight / 2
                    }} />
                )}
                <div className={css.container}>{category.name.ru}</div>
                {category.childrens.map(category => (
                    <WebshopCategoryNode
                        level
                        key={category.id}
                        category={category}
                        onClick={this.props.onClick}
                    />
                ))}
            </div>
        );
    }
}
