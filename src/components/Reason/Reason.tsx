import React from 'react';
import { connect } from 'react-redux';

import Input from 'ui/lib/Input';

import { Row, Field, } from 'src/components/Form/Form';
import { IReason } from 'src/types/IReason';
import { IStore } from 'src/store';

type TSetFieldValue = (field: string, value: any) => void;

export interface IFormikValues {
    reason: IReason;
}

interface IReasonFieldProps {
    values: IFormikValues;
    setFieldValue: TSetFieldValue;
}

export const InternalReason = ({ values, setFieldValue }: IReasonFieldProps) =>
    <Input
        locator="input-internal-reason"
        label="Внутреняя причина"
        placeholder="Укажите внутреннюю причину"
        theme="light"
        value={values.reason.internal}
        onChange={(value: string) => {
            setFieldValue('reason.internal', value);
        }}
    />;

export const ExternalRUReason = ({ values, setFieldValue }: IReasonFieldProps) =>
    <Input
        iconCategory="flags"
        iconWrapperClassName="flag-icon"
        icon="RU"
        locator="input-external-reason"
        placeholder="Укажите причину для ru региона"
        theme="light"
        value={values.reason.external.ru}
        onChange={(value: string) => {
            setFieldValue('reason.external.ru', value);
        }}
    />;

export const ExternalENReason = ({ values, setFieldValue }: IReasonFieldProps) =>
    <Input
        iconCategory="flags"
        iconWrapperClassName="flag-icon"
        icon="EU"
        locator="input-external-reason"
        placeholder="Укажите причину для en региона"
        theme="light"
        value={values.reason.external.en}
        onChange={(value: string) => {
            setFieldValue('reason.external.en', value);
        }}
    />;

export const ExternalPTReason = ({ values, setFieldValue }: IReasonFieldProps) =>
    <Input
        iconCategory="flags"
        iconWrapperClassName="flag-icon"
        icon="BR"
        locator="input-external-reason"
        placeholder="Укажите причину для pt региона"
        theme="light"
        value={values.reason.external.pt}
        onChange={(value: string) => {
            setFieldValue('reason.external.pt', value);
        }}
    />;

class ReasonComponent extends React.Component<{
    values: IFormikValues,
    setFieldValue: TSetFieldValue,
    lang: string
}, any> {
    render() {
        const { values, setFieldValue, lang } = this.props;

        return (<>
            <Row>
                <Field>
                    <InternalReason values={values} setFieldValue={setFieldValue} />
                </Field>
            </Row>
            <Row>
                <div className="font-size-medium">Внешняя причина</div>
            </Row>
            <Row className="mt-s">
                <Field>
                    {lang === 'ru' && (
                        <ExternalRUReason values={values} setFieldValue={setFieldValue} />
                    )}
                    {lang === 'en' && (
                        <ExternalENReason values={values} setFieldValue={setFieldValue} />
                    )}
                    {lang === 'pt' && (
                        <ExternalPTReason values={values} setFieldValue={setFieldValue} />
                    )}
                </Field>
            </Row>
        </>);
    }
}

const mapStateToProps = (state: IStore) => ({
    lang: state.area.selected.lang
});

export const Reason = connect(mapStateToProps, null)(ReasonComponent);
