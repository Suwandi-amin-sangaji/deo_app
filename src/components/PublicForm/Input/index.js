import React, { memo, useMemo } from 'react';
import { View, Text, TextInput } from 'react-native'
import isNaN from 'lodash/isNaN';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';
import omit from 'lodash/omit';
import take from 'lodash/take';
import { connect, generateOptions, getInputType, select, VALIDATIONS_TO_OMIT } from './../utils';


import InputText from './InputText';
import InputSelect from './InputSelect';
import InputSingleUpload from './inputSingleUpload';
import InputMapSinglePoint from './InputMapSinglePoint';
import InputTanggal from './InputTanggal';


const getFieldName = (stringName) =>
  stringName.split('.').filter((string) => isNaN(parseInt(string, 10)));




const getStep = (type) => {
  switch (type) {
    case 'float':
    case 'decimal':
      return 0.01;
    case 'time':
    case 'datetime':
      return 15;
    default:
      return 1;
  }
};



function Inputs({
  allowedFields = [],
  componentUid,
  fieldSchema,
  formErrors,
  isCreatingEntry,
  keys,
  labelAction,
  metadatas,
  onChange,
  readableFields = [],
  shouldNotRunValidations,
  queryInfos,
  value,
  size,
  customFieldInputs,
  currentContentTypeLayout,
  user,
  //type
}) {


  const disabled = useMemo(() => !get(metadatas, 'editable', true), [metadatas]);
  const { type, customField: customFieldUid } = fieldSchema;
  const error = get(formErrors, [keys], null);

  //console.log(customFieldUid);
  //console.log('&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&')

  const fieldName = useMemo(() => {
    return getFieldName(keys);
  }, [keys]);


  const validations = useMemo(() => {
    const inputValidations = omit(
      fieldSchema,
      shouldNotRunValidations
        ? [...VALIDATIONS_TO_OMIT, 'required', 'minLength']
        : VALIDATIONS_TO_OMIT
    );

    const regexpString = fieldSchema.regex || null;

    if (regexpString) {
      const regexp = new RegExp(regexpString);

      if (regexp) {
        inputValidations.regex = regexp;
      }
    }
    return inputValidations;
  }, [fieldSchema, shouldNotRunValidations]);



  const isRequired = useMemo(() => get(validations, ['required'], false), [validations]);


  const isChildOfDynamicZone = useMemo(() => {
    const attributes = get(currentContentTypeLayout, ['attributes'], {});
    const foundAttributeType = get(attributes, [fieldName[0], 'type'], null);

    return foundAttributeType === 'dynamiczone';
  }, [currentContentTypeLayout, fieldName]);

  const inputType = useMemo(() => {
    return getInputType(type);
  }, [type]);

  const inputValue = useMemo(() => {
    // Fix for input file multipe
    if (type === 'media' && !value) {
      return [];
    }

    return value;
  }, [type, value]);

  const step = getStep(type);



  const isUserAllowedToEditField = useMemo(() => {
    const joinedName = fieldName.join('.');

    if (allowedFields.includes(joinedName)) {
      return true;
    }

    if (isChildOfDynamicZone) {
      return allowedFields.includes(fieldName[0]);
    }

    const isChildOfComponent = fieldName.length > 1;

    if (isChildOfComponent) {
      const parentFieldName = take(fieldName, fieldName.length - 1).join('.');

      return allowedFields.includes(parentFieldName);
    }

    return false;
  }, [allowedFields, fieldName, isChildOfDynamicZone]);

  const isUserAllowedToReadField = useMemo(() => {
    const joinedName = fieldName.join('.');

    if (readableFields.includes(joinedName)) {
      return true;
    }

    if (isChildOfDynamicZone) {
      return readableFields.includes(fieldName[0]);
    }

    const isChildOfComponent = fieldName.length > 1;

    if (isChildOfComponent) {
      const parentFieldName = take(fieldName, fieldName.length - 1).join('.');

      return readableFields.includes(parentFieldName);
    }

    return false;
  }, [readableFields, fieldName, isChildOfDynamicZone]);

  const shouldDisplayNotAllowedInput = useMemo(() => {
    return isUserAllowedToReadField || isUserAllowedToEditField;
  }, [isUserAllowedToEditField, isUserAllowedToReadField]);

  const shouldDisableField = useMemo(() => {
    if (!isCreatingEntry) {
      const doesNotHaveRight = isUserAllowedToReadField && !isUserAllowedToEditField;

      if (doesNotHaveRight) {
        return true;
      }

      return disabled;
    }

    return disabled;
  }, [disabled, isCreatingEntry, isUserAllowedToEditField, isUserAllowedToReadField]);

  const options = useMemo(
    () => generateOptions(fieldSchema.enum || [], isRequired),
    [fieldSchema, isRequired]
  );

  const { label, description, placeholder, visible } = metadatas;




  const inputStep = useMemo(() => {
    if (!metadatas.step || (inputType !== 'datetime' && inputType !== 'time')) {
      return step;
    }

    if (!inputValue) {
      return metadatas.step;
    }

    let minutes;

    /**
     * Wtf is this?
     */
    if (inputType === 'datetime') {
      minutes = parseInt(inputValue.substr(14, 2), 10);
    } else if (inputType === 'time') {
      minutes = parseInt(inputValue.slice(-2), 10);
    }

    return minutes % metadatas.step === 0 ? metadatas.step : step;
  }, [inputType, inputValue, metadatas.step, step]);



  if (visible === false) {
    return null;
  }



  if (customFieldUid) {
    switch (customFieldUid) {
      case 'plugin::yori-android.yoriMapsSinglePoint': {
        return (
          <InputMapSinglePoint
            value={inputValue}
            label={label}
            attribute={fieldSchema}
            onChange={onChange}
            name={keys}
          />
        )
      }
      default: {
        return null
      }
    }
  }








  switch (type) {

    case 'relation': {
      return (
        <InputSelect
          user={user}
          {...metadatas}
          {...fieldSchema}


          attribute={fieldSchema}
          //autoComplete="new-password"
          label={label}
          isNullable={inputType === 'bool' && [null, undefined].includes(fieldSchema.default)}
          description={description ? description : null}
          disabled={shouldDisableField}
          error={error}
          //labelAction={labelAction}
          //contentTypeUID={currentContentTypeLayout.uid}
          multiple={fieldSchema.multiple || false}
          name={keys}
          onChange={onChange}
          // options={options}
          placeholder={placeholder ? placeholder : null}
          required={fieldSchema.required || false}
          // step={inputStep}
          type={inputType}
          validations={validations}


          queryInfos={queryInfos}
          size={size}
          value={value}
        />);
    }





    case 'date': {
      return (<InputTanggal
        attribute={fieldSchema}
        //autoComplete="new-password"
        label={label}
        isNullable={inputType === 'bool' && [null, undefined].includes(fieldSchema.default)}
        description={description ? description : null}
        disabled={shouldDisableField}
        error={error}
        //labelAction={labelAction}
        //contentTypeUID={currentContentTypeLayout.uid}
        //multiple={fieldSchema.multiple || false}
        name={keys}
        onChange={onChange}
        // options={options}
        placeholder={placeholder ? placeholder : null}
        required={fieldSchema.required || false}
        // step={inputStep}
        type={inputType}
        validations={validations}
        value={inputValue}></InputTanggal>);
    }





    case 'time': {
      return (<Text>TIME</Text>);
    }






    case 'media': {
      return (
        <InputSingleUpload
          value={inputValue}
          label={label}
          attribute={fieldSchema}
          onChange={onChange}
          name={keys}
        />
      );
    }


    case 'datetime': {
      return (<Text>sdasdasdas</Text>);
    }





    case 'bool': {
      return (<Text>sdasdasdas</Text>);
    }





    
    default: {
      return (
        <InputText
          attribute={fieldSchema}
          //autoComplete="new-password"
          label={label}
          isNullable={inputType === 'bool' && [null, undefined].includes(fieldSchema.default)}
          description={description ? description : null}
          disabled={shouldDisableField}
          error={error}
          //labelAction={labelAction}
          //contentTypeUID={currentContentTypeLayout.uid}
          //multiple={fieldSchema.multiple || false}
          name={keys}
          onChange={onChange}
          // options={options}
          placeholder={placeholder ? placeholder : null}
          required={fieldSchema.required || false}
          // step={inputStep}
          type={inputType}
          validations={validations}
          value={inputValue}
        // withDefaultValue={false}
        />
      );
    }
  }

}


const Memoized = memo(Inputs, isEqual);
export default connect(Memoized, select);
