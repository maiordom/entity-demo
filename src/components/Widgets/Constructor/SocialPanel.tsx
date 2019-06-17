import React from 'react';

import Input from 'ui/lib/Input';

import { Row, Field } from 'src/components/Form/Form';
import { IWidgetSocial, TSocialType } from 'src/entities/Content/store';
import { WIDGET_TYPE_SOCIAL } from './Constructor';

export interface IProps {
    widget: IWidgetSocial;
}

interface IState {
    socials: {
        [key in TSocialType]?: { id: string, url: string };
    };
}

const socialPatterns: { [key in TSocialType]?: RegExp } = {
    vkontakte: new RegExp('https\:\/\/vk\.com\/(.*)'),
    twitter: new RegExp('https\:\/\/twitter\.com\/(.*)'),
    discord: new RegExp('https\:\/\/discordapp\.com\/invite/(.*)'),
    facebook: new RegExp('https\:\/\/www\.facebook\.com\/(.*)'),
    twitch: new RegExp('https\:\/\/www\.twitch\.tv\/(.*)')
}

const getSocialId = (url: string, type: TSocialType): { id?: string; error?: string } => {
    const socialPattern = socialPatterns[type];

    if (type === 'forum') {
        return { id: 'forum' }; //заглушка для api. Форуму не требуется id, но это обязательное поле
    }

    if (socialPattern.test(url)) {
        return { id: url.match(socialPattern)[1] };
    } else {
        return { error: `Требуется указать ссылку на ${type}` };
    }
};

export default class SocialPanel extends React.PureComponent<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        const { widget } = props;

        this.state = {
            socials: widget && widget.source.reduce((result, { id, type, url }) => {
                result[type] = { id, url };
                return result;
            }, {}) || {}
        };
    }

    getWidgetConfig() {
        const { socials } = this.state;

        let widget: IWidgetSocial = {
            type: WIDGET_TYPE_SOCIAL,
            source: Object.keys(socials).reduce((result, type) => {
                if (socials[type]) {
                    result.push({ type, ...socials[type] });
                }
                return result;
            }, [])
        };

        if (this.props.widget) {
            widget.id = this.props.widget.id;
        }

        return widget;
    }

    onSocialNetworkChange = (params: { id?: string,  url?: string }, type: TSocialType,) => {
        this.setState({ socials: { ...this.state.socials, [type]: { ...this.state.socials[type], ...params } } });
    }

    render() {
        const { socials } = this.state;

        return (<>
            <div data-locator="social-form" className="col-6">
                <Row>
                    <Field>
                        <Social social={{ type: 'vkontakte', ...socials.vkontakte }} onChange={this.onSocialNetworkChange} />
                    </Field>
                </Row>
                <Row>
                    <Field>
                        <Social social={{ type: 'twitter', ...socials.twitter }} onChange={this.onSocialNetworkChange} />
                    </Field>
                </Row>
                <Row>
                    <Field>
                        <Social social={{ type: 'youtube', ...socials.youtube }} onChange={this.onSocialNetworkChange} />
                    </Field>
                </Row>
                <Row>
                    <Field>
                        <Social social={{ type: 'facebook', ...socials.facebook }} onChange={this.onSocialNetworkChange} />
                    </Field>
                </Row>
                <Row>
                    <Field>
                        <Social social={{ type: 'twitch', ...socials.twitch }} onChange={this.onSocialNetworkChange} />
                    </Field>
                </Row>
                <Row>
                    <Field>
                        <Social social={{ type: 'discord', ...socials.discord }} onChange={this.onSocialNetworkChange} />
                    </Field>
                </Row>
                <Row>
                    <Field>
                        <Social social={{ type: 'forum', ...socials.forum }} onChange={this.onSocialNetworkChange} />
                    </Field>
                </Row>
            </div>
        </>);
    }
}

interface ISocialState {
    id: string;
    url?: string;
    error?: string;
}

interface ISocialProps {
    social: {
        id?: string;
        type?: TSocialType;
        url?: string;
        err?: string
    }
    onChange?: (params: { url?: string, id?: string }, type: string) => void;
}

class Social extends React.PureComponent<ISocialProps, ISocialState> {
    static defaultProps: ISocialProps  = {
        social: {
            id: undefined,
            url: undefined
        }
    }

    constructor(props) {
        super(props);

        this.state = {
            id: props.social.id,
            url: props.social.url,
            error: null
        };
    }

    onChange = (url: string) => {
        const { type } = this.props.social
        const { id, error } = getSocialId(url, type);

        if (id) {
            this.setState({ id, url, error: '' });
            this.props.onChange({ id, url }, type);
        } else {
            this.setState({ error });
        }
    }

    onYoutubeIdChange = (id: string) => {
        this.setState({ id });
        this.props.onChange({ id }, this.props.social.type);
    }

    onUrlChange = (url: string) => {
        this.setState({ url });
        this.props.onChange({ url }, this.props.social.type);
    }

    renderYoutube = () => {
        const { type, url, id } = this.props.social;

        return (<>
            <Input
                locator={`${type}-account-input`}
                theme="light"
                label={`${type} Id`}
                placeholder={`Укажите id аккаунта в ${type}`}
                onChange={this.onYoutubeIdChange}
                value={id}
            />
            <Input
                locator={`${type}-account-link-input`}
                theme="light"
                label={`${type} Url`}
                className="mt-s"
                placeholder={`Укажите ссылку для ${type}`}
                onChange={this.onUrlChange}
                value={url}
            />
        </>);
    }

    renderForum = () => {
        const { type, url } = this.props.social;

        return (
            <Input
                locator={`${type}-account-input`}
                label={type}
                theme="light"
                placeholder={`Укажите ссылку для ${type}`}
                onChange={this.onChange}
                value={url}
            />
        )
    }

    renderSocial = () => {
        const { type, url } = this.props.social;
        const { error } = this.state;

        return (
            <Input
                locator={`${type}-account-link-input`}
                hint={error}
                theme="light"
                label={type}
                placeholder={`Укажите ссылку для ${type}`}
                onChange={this.onChange}
                value={url}
                status={error ? 'error' : undefined}
            />
        )
    }

    render() {
        const { type } = this.props.social;

        switch (type) {
            case 'youtube': {
                return this.renderYoutube();
            }

            case 'forum': {
                return this.renderForum();
            }

            default: {
                return this.renderSocial();
            }
        };
    }
}
