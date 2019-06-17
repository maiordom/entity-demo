import React from 'react';
import { connect } from 'react-redux';
import { Formik } from 'formik';
import * as yup from 'yup';
import moment, { Moment } from 'moment';
import get from 'lodash/get';
import cloneDeep from 'lodash/cloneDeep';

import Input from 'ui/lib/Input';
import Checkbox from 'ui/lib/Checkbox';

import { IWidgetTimer } from 'src/entities/Content/store';

import { Row, Field, Inline, SimpleError, Error } from 'src/components/Form/Form';

import { DATE_SHORT_FORMAT } from 'src/constants';
import { WIDGET_TYPE_TIMER } from './Constructor';
import { IStore } from 'src/store';
import { IAreaItem } from 'src/entities/Area/store';

import SingleDatePicker from 'src/components/Calendar/Calendar';
import UploadImage from './UploadImage';
import Image from 'src/components/Image/Image';

export interface IProps {
    area: IAreaItem;
    widget: IWidgetTimer;
}

interface IFormikTimerWidgetValues extends IWidgetTimer {
    intervalStartDateTime?: string;
    finishDateTime?: string;
    intervalDays?: number;
    intervalHours?: number;
    intervalMinutes?: number;
    intervalSeconds?: number;
}

class FormikTimerWidget extends Formik<{}, IFormikTimerWidgetValues> {}

interface IState {
    widget: IFormikTimerWidgetValues;
    isIntervalEvent?: boolean;
    hasLink: boolean;
}

import api from 'src/routes/api';
import css from './Timer.css';

export class Timer extends React.PureComponent<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        const { area } = props;
        const widget = {
            type: WIDGET_TYPE_TIMER,
            source: {
                text: { [area.lang]: '' },
                buttonText: { [area.lang]: '' },
                intervalStartDate: '',
                finishDate: '',
                intervalSeconds: ''
            }
        };
        const state: IState = {
            widget: cloneDeep(props.widget || widget),
            isIntervalEvent: false,
            hasLink: false
        };

        if (state.widget.source.data) {
            state.hasLink = true;
        }

        const secondsDispersion = this.getSecondsDispersion(state.widget.source.intervalSeconds || 0);

        if (state.widget.source.intervalSeconds) {
            state.isIntervalEvent = true;
        }

        state.widget.intervalDays = secondsDispersion.days;
        state.widget.intervalHours = secondsDispersion.hours;
        state.widget.intervalMinutes = secondsDispersion.minutes;
        state.widget.intervalSeconds = secondsDispersion.seconds;

        state.widget.intervalStartDateTime = state.widget.source.intervalStartDate
            ? moment(props.widget.source.intervalStartDate).format('HH:mm')
            : '';

            state.widget.finishDateTime = state.widget.source.finishDate
            ? moment(props.widget.source.finishDate).format('HH:mm')
            : '';

        this.state = state;
    }

    formRef: React.RefObject<FormikTimerWidget> = React.createRef();

    getDate(date: string, time: string) {
        const timeArr = time.split(':');
        const hours = Number(timeArr[0]);
        const minutes = Number(timeArr[1]);

        return moment(date).hours(hours).minutes(minutes).format();
    }

    getSecondsDispersion(interval: number) {
        let days = 0;
        let hours = 0;
        let minutes = 0;
        let seconds = 0;

        seconds = interval % 60;
        interval = interval - seconds;
  
        minutes = interval / 60 % 60;
        interval = interval / 60 - minutes;
  
        hours = interval / 60 % 24;
        interval = interval / 60 - hours;
  
        days = interval / 24;

        return {
            days,
            hours,
            minutes,
            seconds
        };
    }

    getIntervalSeconds(values: IFormikTimerWidgetValues) {
        const {
            intervalDays = 0,
            intervalHours = 0,
            intervalMinutes = 0,
            intervalSeconds = 0
        } = values;

        return 24 * 60 * 60 * Number(intervalDays)
            + 60 * 60 * Number(intervalHours)
            + 60 * Number(intervalMinutes)
            + 60 * Number(intervalSeconds);
    }

    getWidgetConfig = (): IWidgetTimer => {
        let values: IFormikTimerWidgetValues = this.formRef.current.getFormikBag().values;

        values = cloneDeep(values);

        const { intervalStartDate, finishDate } = values.source;
        const { intervalStartDateTime, finishDateTime } = values;

        if (intervalStartDate && intervalStartDateTime) {
            values.source.intervalStartDate = this.getDate(intervalStartDate, intervalStartDateTime);
        }

        if (finishDate && finishDateTime) {
            values.source.finishDate = this.getDate(finishDate, finishDateTime);
        }

        return values;
    };

    validate() {
        let values: IFormikTimerWidgetValues = this.formRef.current.getFormikBag().values;

        if (this.state.isIntervalEvent) {
            delete values.source.finishDate;
        } else {
            delete values.source.intervalSeconds;
            delete values.source.intervalStartDate;
        }

        if (!values.source.data) {
            delete values.source.data;
            delete values.source.target;
        }

        if (!this.state.hasLink) {
            delete values.source.target;
            delete values.source.data;
            delete values.source.buttonText;
        }

        return this.formRef.current.submitForm().then(() => {
            const { errors } = this.formRef.current.getFormikBag();
            let errorsCount = Object.keys(errors).length;

            if (errors.source) {
                errorsCount--;
            }

            if (errorsCount > 0) {
                return Promise.resolve(errors);
            }

            if (!errors.source || errors.source && !Object.keys(errors.source).length) {
                return Promise.resolve({});
            }

            return Promise.resolve(errors);
        });
    }

    render() {
        const { area } = this.props;
        const { widget, isIntervalEvent, hasLink } = this.state;

        return (
            <FormikTimerWidget
                ref={this.formRef}
                initialValues={{ ...widget }}
                onSubmit={() => {}}
                validationSchema={yup.object().shape({
                    intervalStartDateTime: yup.string().nullable().matches(/^\d{2}:\d{2}$/, {
                        message: 'Неверный формат времени, нужно указать в формате hh:mm',
                        excludeEmptyString: true
                    }),
                    finishDateTime: yup.string().nullable().matches(/^\d{2}:\d{2}$/, {
                        message: 'Неверный формат времени, нужно указать в формате hh:mm',
                        excludeEmptyString: true
                    }),
                    source: yup.object().shape({
                        text: yup.object().shape({
                            [area.lang]: yup.string().required('Укажите заголовок')
                        }),
                        intervalStartDate: yup.mixed().test('intervalStartDate', 'Укажи дату начала', function (value: string) {
                            if (!isIntervalEvent) {
                                return true;
                            }

                            return !!value;;
                        }),
                        intervalSeconds: yup.mixed().test('intervalSeconds', 'Укажи интервал повторения', function (value: string) {
                            if (!isIntervalEvent) {
                                return true;
                            }

                            return !!value;;
                        }),
                        finishDate: yup.mixed().test('finishDate', 'Укажи дату окончания', function (value: string) {
                            if (isIntervalEvent) {
                                return true;
                            }

                            return !!value;
                        })
                    })
                })}
                render={({ touched, errors, values, setFieldValue }) => (
                    <div className="col-6">
                        <Row>
                            <Checkbox
                                theme="light"
                                label="Повторяющееся событие"
                                checked={isIntervalEvent}
                                onClick={(isIntervalEvent: boolean) => {
                                    this.setState({ isIntervalEvent });
                                }}
                            />
                        </Row>
                        {isIntervalEvent && (
                            <Row col className="mt-s">
                                <Inline>
                                    <Row col>
                                        <div className="label">Ближайшее событие</div>
                                        <Inline>
                                            <Field className={css.date}>
                                                <SingleDatePicker
                                                    openDirection="up"
                                                    date={values.source.intervalStartDate}
                                                    placeholder="dd.mm.yyyy"
                                                    onChange={(date: Moment) => {
                                                        setFieldValue(
                                                            'source.intervalStartDate',
                                                            date ? date.format(DATE_SHORT_FORMAT) : null
                                                        );
                                                    }}
                                                    showClearDate
                                                />
                                            </Field>
                                            <Field className={`${css.time} ml-s`}>
                                                <Input
                                                    theme="light"
                                                    value={values.intervalStartDateTime}
                                                    placeholder="hh:mm"
                                                    onBlur={(time: string) => {
                                                        setFieldValue('intervalStartDateTime', time || null);
                                                    }}
                                                />
                                            </Field>
                                        </Inline>
                                    </Row>
                                    <Row col className="mt-none ml-l">
                                        <div className="label">Интервал повторения</div>
                                        <Inline>
                                            <Input
                                                type="number"
                                                wrapperClassName={css.intervalItem}
                                                className={css.intervalInput}
                                                placeholder="dd"
                                                theme="light"
                                                value={String(values.intervalDays || '')}
                                                onChange={(days: string) => {
                                                    values.intervalDays = Number(days);
                                                    setFieldValue('source.intervalSeconds', this.getIntervalSeconds(values))
                                                }}
                                            />
                                            <div className={css.intervalSpacer}>:</div>
                                            <Input
                                                type="number"
                                                wrapperClassName={css.intervalItem}
                                                className={css.intervalInput}
                                                placeholder="hh"
                                                theme="light"
                                                value={String(values.intervalHours || '')}
                                                onChange={(hours: string) => {
                                                    values.intervalHours = Number(hours);
                                                    setFieldValue('source.intervalSeconds', this.getIntervalSeconds(values))
                                                }}
                                            />
                                            <div className={css.intervalSpacer}>:</div>
                                            <Input
                                                type="number"
                                                wrapperClassName={css.intervalItem}
                                                className={css.intervalInput}
                                                placeholder="mm"
                                                theme="light"
                                                value={String(values.intervalMinutes || '')}
                                                onChange={(minutes: string) => {
                                                    values.intervalMinutes = Number(minutes);
                                                    setFieldValue('source.intervalSeconds', this.getIntervalSeconds(values))
                                                }}
                                            />
                                            <div className={css.intervalSpacer}>:</div>
                                            <Input
                                                type="number"
                                                wrapperClassName={css.intervalItem}
                                                className={css.intervalInput}
                                                placeholder="ss"
                                                theme="light"
                                                value={String(values.intervalSeconds || '')}
                                                onChange={(seconds: string) => {
                                                    values.intervalSeconds = Number(seconds);
                                                    setFieldValue('source.intervalSeconds', this.getIntervalSeconds(values))
                                                }}
                                            />
                                        </Inline>
                                    </Row>
                                </Inline>
                                {get(touched, 'source.intervalStartDate') && get(errors, 'source.intervalStartDate') && (
                                    <SimpleError className="text-align-left mt-s">
                                        {errors.source.intervalStartDate}
                                    </SimpleError>
                                )}
                                {get(touched, 'source.intervalSeconds') && get(errors, 'source.intervalSeconds') && (
                                    <SimpleError className="text-align-left mt-s">
                                        {errors.source.intervalSeconds}
                                    </SimpleError>
                                )}
                                {touched.intervalStartDateTime && errors.intervalStartDateTime && (
                                    <SimpleError className="text-align-left mt-s">
                                        {errors.intervalStartDateTime}
                                    </SimpleError>
                                )}
                            </Row>
                        )}
                        {!isIntervalEvent && (
                            <Row col className="mt-s">
                                <div className="label">Конец отсчета</div>
                                <Inline>
                                    <Field className={css.date}>
                                        <SingleDatePicker
                                            openDirection="up"
                                            date={values.source.finishDate}
                                            placeholder="dd.mm.yyyy"
                                            onChange={(date: Moment) => {
                                                setFieldValue(
                                                    'source.finishDate',
                                                    date ? date.format(DATE_SHORT_FORMAT) : ''
                                                );
                                            }}
                                            showClearDate
                                        />
                                    </Field>
                                    <Field className={`${css.time} ml-s`}>
                                        <Input
                                            theme="light"
                                            value={values.finishDateTime}
                                            placeholder="hh:mm"
                                            onBlur={(time: string) => {
                                                setFieldValue('finishDateTime', time || '');
                                            }}
                                        />
                                    </Field>
                                </Inline>
                                {get(touched, 'source.finishDate') && get(errors, 'source.finishDate') && (
                                    <SimpleError className="text-align-left mt-s">
                                        {errors.source.finishDate}
                                    </SimpleError>
                                )}
                                {touched.finishDateTime && errors.finishDateTime && (
                                    <SimpleError className="text-align-left mt-s">
                                        {errors.finishDateTime}
                                    </SimpleError>
                                )}
                            </Row>
                        )}
                        {values.imageId && (
                            <Row className="mt-l">
                                <Image
                                    width={185}
                                    height={345}
                                    imageType="launcherCol1"
                                    imageGroup="widgets"
                                    imageId={values.imageId}
                                />
                            </Row>
                        )}
                        <Row className={values.imageId ? 'mt-s' : 'mt-l'}>
                            <UploadImage
                                title={values.imageId && 'Изменить изображение'}
                                displayFileName={false}
                                imageGroup="widgets"
                                onUploadImage={({ imageId }: { imageId: string}) => {
                                    setFieldValue('imageId', imageId);
                                }}
                            />
                        </Row>
                        <Error showDetails className="text-align-left mt-s" route={
                            api.images.uploadImage
                        } />
                        <Row className="mt-s">
                            <Field>
                                <Input
                                    status={
                                        get(touched, 'source.text') &&
                                        get(errors, `source.text.${area.lang}`) ? 'error' : null
                                    }
                                    hint={
                                        get(touched, 'source.text') &&
                                        get(errors, `source.text.${area.lang}`)
                                    }
                                    label="Текст на виджете"
                                    placeholder="Укажи текст на виджете"
                                    value={values.source.text[area.lang]}
                                    theme="light"
                                    onChange={(buttonText: string) => {
                                        setFieldValue(`source.text.${area.lang}`, buttonText);
                                    }}
                                />
                            </Field>
                        </Row>
                        <Checkbox
                            theme="light"
                            label="Кнопка"
                            className="mt-l"
                            checked={hasLink}
                            onClick={(hasLink: boolean) => {
                                this.setState({ hasLink });
                            }}
                        />
                        {hasLink && (<>
                            <Row className="mt-s">
                                <Field>
                                    <Input
                                        theme="light"
                                        label="Cсылка"
                                        placeholder="URL"
                                        value={values.source.data}
                                        onChange={(data: string) => {
                                            setFieldValue('source.target', 'externalLink');
                                            setFieldValue('source.data', data);
                                        }}
                                    />
                                </Field>
                            </Row>
                            <Row className="mt-s">
                                <Field>
                                    <Input
                                        status={
                                            get(touched, 'source.buttonText') &&
                                            get(errors, `source.buttonText.${area.lang}`) ? 'error' : null
                                        }
                                        hint={
                                            get(touched, 'source.buttonText') &&
                                            get(errors, `source.buttonText.${area.lang}`)
                                        }                                    
                                        label="Текст кнопки"
                                        placeholder="Укажи текст кнопки"
                                        value={values.source.buttonText[area.lang]}
                                        theme="light"
                                        onChange={(buttonText: string) => {
                                            setFieldValue(`source.buttonText.${area.lang}`, buttonText);
                                        }}
                                    />
                                </Field>
                            </Row>
                        </>)}
                    </div>
                )}
            />
        );
    }
}

const mapStateToProps = (state: IStore) => ({
    area: state.area.selected
});

export default connect(mapStateToProps, null, null, { withRef: true })(Timer);
