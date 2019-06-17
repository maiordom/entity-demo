import React from 'react';
import { Formik } from 'formik';
import * as yup from 'yup';
import moment, { Moment } from 'moment';

import Input from 'ui/lib/Input';

import { IRestrictionLifetime } from 'src/entities/Codes/models/Restriction';

import { Row, Field, Inline, SimpleError } from 'src/components/Form/Form';
import SingleDatePicker from 'src/components/Calendar/Calendar';

export class FormikLifetime extends Formik<{}, {
    lifetimeFrom?: string;
    lifetimeUntil?: string;
    lifetimeFromTime?: string;
    lifetimeUntilTime?: string;
}> {}

const setTimeToDate = (date: string, time: string = '00:00') => {
    const [ hours, minutes ] = time.split(':');

    return moment(date)
        .set('hours', Number(hours))
        .set('minutes', Number(minutes))
        .format();
};

export interface IProps {
    formRef: React.RefObject<FormikLifetime>;
    component: IRestrictionLifetime;
}

export default ({ formRef, component }: IProps) => (
    <FormikLifetime
        ref={formRef}
        initialValues={{}}
        onSubmit={() => {}}
        validate={(values) => {
            const errors = {} as any;

            if (!Object.keys(values).length) {
                errors.lifetimeFrom = 'Необходимо заполнить одно из полей';
            }

            return errors;
        }}
        render={({ values, setFieldValue, errors }) => (<>
            <div className="label">С какого времени можно активировать</div>
            <Row className="mt-none">
                <Field className="mr-s">
                    <SingleDatePicker
                        locator="calendar-from"
                        openDirection="up"
                        placeholder="Укажите дату"
                        onChange={(date: Moment) => {
                            if (date) {
                                setFieldValue('lifetimeFrom', date.format());
                                component.lifetimeFrom = setTimeToDate(
                                    date.format(),
                                    values.lifetimeFromTime
                                );
                            } else {
                                setFieldValue('lifeTimeFrom', '');
                                component.lifetimeFrom = '';
                            }
                        }}
                    />
                </Field>
                <Field>
                    <Input
                        locator="time-from-input"
                        theme="light"
                        placeholder="Время, н-р 10:20"
                        onBlur={(time: string) => {
                            setFieldValue('lifetimeFromTime', time);

                            if (component.lifetimeFrom) {
                                component.lifetimeFrom = setTimeToDate(
                                    component.lifetimeFrom,
                                    time
                                );
                            }
                        }}
                    />
                </Field>
            </Row>
            <div className="label mt-m">По какую дату можно активировать</div>
            <Row className="mt-none">
                <Field className="mr-s">
                    <SingleDatePicker
                        openDirection="up"
                        locator="calendar-to"
                        placeholder="Укажите дату"
                        onChange={(date: Moment) => {
                            if (date) {
                                setFieldValue('lifetimeUntil', date.format());
                                component.lifetimeUntil = setTimeToDate(
                                    date.format(),
                                    values.lifetimeUntilTime
                                );
                            } else {
                                setFieldValue('lifetimeUntil', '');
                                component.lifetimeUntil = '';
                            }
                        }}
                    />
                </Field>
                <Field>
                    <Input
                        theme="light"
                        locator="time-to-input"
                        placeholder="Время, н-р 10:20"
                        onBlur={(time: string) => {
                            setFieldValue('lifetimeUntilTime', time);

                            if (component.lifetimeUntil) {
                                component.lifetimeUntil = setTimeToDate(
                                    component.lifetimeUntil,
                                    time
                                );
                            }
                        }}
                    />
                </Field>
            </Row>
            {errors.lifetimeFrom && (
                <SimpleError
                    className="text-align-left mt-s"
                >
                    {errors.lifetimeFrom}
                </SimpleError>
            )}
        </>)}
    />
);
