import get from 'lodash/get';
import isBoolean from 'lodash/isBoolean';
import isEmpty from 'lodash/isEmpty';
import isNaN from 'lodash/isNaN';
import toNumber from 'lodash/toNumber';
import * as yup from 'yup';
import isFieldTypeNumber from './isFieldTypeNumber';


const errorsTrads = {
    "email": "email tidak valid",
    "json": "json tidak valid",
    "lowercase": "harus huruf kecil",
    "max": "error max",
    "maxLength": "error max length",
    "min": "error min",
    "minLength": "error min length",
    "regex": "error",
    "required": "required",
    "unique": "harus unik",
    "integer": "harus angka"
};


yup.addMethod(yup.mixed, 'defined', function () {
  return this.test('defined', errorsTrads.required, (value) => value !== undefined);
});

yup.addMethod(yup.array, 'notEmptyMin', function (min) {
  return this.test('notEmptyMin', errorsTrads.min, (value) => {
    if (isEmpty(value)) {
      return true;
    }

    return value.length >= min;
  });
});

yup.addMethod(yup.string, 'isInferior', function (message, max) {
  return this.test('isInferior', message, function (value) {
    if (!value) {
      return true;
    }

    if (Number.isNaN(toNumber(value))) {
      return true;
    }

    return toNumber(max) >= toNumber(value);
  });
});

yup.addMethod(yup.string, 'isSuperior', function (message, min) {
  return this.test('isSuperior', message, function (value) {
    if (!value) {
      return true;
    }

    if (Number.isNaN(toNumber(value))) {
      return true;
    }

    return toNumber(value) >= toNumber(min);
  });
});

//const getAttributes = (data) => get(data, ['attributes'], {});


















const createYupSchema = (attributes, isCreatingEntry, { components }) => {

  const options = { isCreatingEntry: isCreatingEntry, isDraft: false, isFromComponent: false };
  

  


  return yup.object().shape(
    Object.keys(attributes).reduce((acc, current) => {
      const attribute = attributes[current];
      acc[current]
      let schema = yup.mixed();
        if (!['id', 'updatedAt', 'createdAt'].includes(current)) {
          if (
            attribute.type !== 'relation' &&
            attribute.type !== 'component' &&
            attribute.type !== 'dynamiczone'
          ) {
            schema = createYupSchemaAttribute(attribute.type, attribute, options);
          }

          if (attribute.type === 'relation') {
            acc[current] = [
              'oneWay',
              'oneToOne',
              'manyToOne',
              'oneToManyMorph',
              'oneToOneMorph',
            ].includes(attribute.relationType)
              ? schema = yup.array().min(1, 'Required').required('Array is required')
              : schema = yup.object().test(
                'is-not-empty', 
                'The object should not be empty', 
                value => value && Object.keys(value).length > 0
              ).required('Object is required');
          }
        }

      acc[current] = schema;
      return acc;
    }, {})
  );
};




/*
const createYupSchemaAttribute = (type, validations, options) => {
  let schema = yup.mixed();

  if (['string', 'uid', 'text', 'richtext', 'email', 'password', 'enumeration'].includes(type)) {
    schema = yup.string().required('Required');
  }

  if (type === 'json') {
    schema = yup
      .mixed(errorsTrads.json)
      .test('isJSON', errorsTrads.json, (value) => {
        if (!value || !value.length) {
          return true;
        }
        try {
          JSON.parse(value);
          return true;
        } catch (err) {
          return false;
        }
      })
      .nullable()
      .test('required', errorsTrads.required, (value) => {
        if (validations.required && (!value || !value.length)) {
          return false;
        }
        return true;
      });
  }

  if (type === 'email') {
    schema = schema.email(errorsTrads.email);
  }

  if (['number', 'integer', 'float', 'decimal'].includes(type)) {
    schema = yup
      .number()
      .transform((cv) => (isNaN(cv) ? undefined : cv))
      .typeError().required('Required');
  }

  if (type === 'biginteger') {
    schema = yup.string().matches(/^-?\d*$/).required('Required');
  }

  if (['date', 'datetime'].includes(type)) {
    schema = yup.date().required('Required');
  }

  Object.keys(validations).forEach((validation) => {
    const validationValue = validations[validation];

    if (
      !!validationValue ||
      (!isBoolean(validationValue) && Number.isInteger(Math.floor(validationValue))) ||
      validationValue === 0
    ) {
      switch (validation) {
        case 'required': {
          if (!options.isDraft) {
            if (type === 'password' && options.isCreatingEntry) {
              schema = schema.required(errorsTrads.required);
            }

            if (type !== 'password') {
              if (options.isCreatingEntry) {
                schema = schema.required(errorsTrads.required);
              } else {
                schema = schema.test('required', errorsTrads.required, (value) => {
                  // Field is not touched and the user is editing the entry
                  if (value === undefined && !options.isFromComponent) {
                    return true;
                  }

                  if (isFieldTypeNumber(type)) {
                    if (value === 0) {
                      return true;
                    }

                    return !!value;
                  }


                  if (type === 'boolean') {
                    // Boolean value can be undefined/unset in modifiedData when generated in a new component
                    return value !== null && value !== undefined;
                  }


                  if (type === 'date' || type === 'datetime') {
                    if (typeof value === 'string') {
                      return !isEmpty(value);
                    }
                    return !isEmpty(value?.toString());
                  }
                  return !isEmpty(value);
                });
              }
            }
          }

          break;
        }

        case 'max': {
          if (type === 'biginteger') {
            schema = schema.isInferior(errorsTrads.max, validationValue);
          } else {
            schema = schema.max(validationValue, errorsTrads.max);
          }
          break;
        }
        case 'maxLength':
          schema = schema.max(validationValue, errorsTrads.maxLength);
          break;
        case 'min': {
          if (type === 'biginteger') {
            schema = schema.isSuperior(errorsTrads.min, validationValue);
          } else {
            schema = schema.min(validationValue, errorsTrads.min);
          }
          break;
        }
        case 'minLength': {
          if (!options.isDraft) {
            schema = schema.min(validationValue, errorsTrads.minLength);
          }
          break;
        }
        case 'regex':
          schema = schema.matches(new RegExp(validationValue), {
            message: errorsTrads.regex,
            excludeEmptyString: !validations.required,
          });
          break;
        case 'lowercase':
          if (['text', 'textarea', 'email', 'string'].includes(type)) {
            schema = schema.strict().lowercase();
          }
          break;
        case 'uppercase':
          if (['text', 'textarea', 'email', 'string'].includes(type)) {
            schema = schema.strict().uppercase();
          }
          break;
        case 'positive':
          if (isFieldTypeNumber(type)) {
            schema = schema.positive();
          }
          break;
        case 'negative':
          if (isFieldTypeNumber(type)) {
            schema = schema.negative();
          }
          break;
        default:
          schema = schema.nullable();
      }
    }
  });

  return schema;
};
*/


const createYupSchemaAttribute = (type, validations, options) => {
  let schema = yup.mixed();

  if (['string', 'uid', 'text', 'richtext', 'email', 'password', 'enumeration'].includes(type)) {
    if (validations.required) {
      schema = yup.string().required();
    }else{
      schema = yup.string();
    }
  }

  if (type === 'json') {
    schema = yup
      .mixed(errorsTrads.json)
      .test('isJSON', errorsTrads.json, (value) => {
        if (!value || !value.length) {
          return true;
        }

        try {
          JSON.parse(value);

          return true;
        } catch (err) {
          return false;
        }
      })
      .nullable()
      .test('required', errorsTrads.required, (value) => {
        if (validations.required && (!value || !value.length)) {
          return false;
        }

        return true;
      });
  }

  if (type === 'email') {
    if (validations.required) {
      schema = schema.email(errorsTrads.email).required();
    }else{
      schema = schema.email(errorsTrads.email);
    }
   
  }

  if (['number', 'integer', 'float', 'decimal'].includes(type)) {
    if (validations.required) {
      schema = yup.number().transform((cv) => (isNaN(cv) ? undefined : cv)).typeError().required();
    }else{
      schema = yup.number().transform((cv) => (isNaN(cv) ? undefined : cv)).typeError();
    }
  }

  if (type === 'biginteger') {
    if (validations.required) {
      schema = yup.string().matches(/^-?\d*$/).required();
    }else{
      schema = yup.string().matches(/^-?\d*$/);
    }
  }

  if (['date', 'datetime'].includes(type)) {
    if (validations.required) {
      schema = yup.date().required();
    }else{
      schema = yup.date();
    }
  }

  Object.keys(validations).forEach((validation) => {
    const validationValue = validations[validation];

    if (!!validationValue || (!isBoolean(validationValue) && Number.isInteger(Math.floor(validationValue))) || validationValue === 0) {
      console.log(validation);
      console.log('BABI')
      switch (validation) {
        case 'required': {
          if (!options.isDraft) {
            if (type === 'password' && options.isCreatingEntry) {
              schema = schema.required(errorsTrads.required);
            }

            if (type !== 'password') {
              if (options.isCreatingEntry) {
                schema = schema.required(errorsTrads.required);
              } else {
                schema = schema.test('required', errorsTrads.required, (value) => {
                  // Field is not touched and the user is editing the entry
                  if (value === undefined && !options.isFromComponent) {
                    return true;
                  }

                  if (isFieldTypeNumber(type)) {
                    if (value === 0) {
                      return true;
                    }

                    return !!value;
                  }

                  if (type === 'boolean') {
                    // Boolean value can be undefined/unset in modifiedData when generated in a new component
                    return value !== null && value !== undefined;
                  }

                  if (type === 'date' || type === 'datetime') {
                    if (typeof value === 'string') {
                      return !isEmpty(value);
                    }

                    return !isEmpty(value?.toString());
                  }

                  return !isEmpty(value);
                });
              }
            }
          }

          break;
        }

        case 'max': {
          if (type === 'biginteger') {
            schema = schema.isInferior(errorsTrads.max, validationValue);
          } else {
            schema = schema.max(validationValue, errorsTrads.max);
          }
          break;
        }
        case 'maxLength':
          schema = schema.max(validationValue, errorsTrads.maxLength);
          break;
        case 'min': {
          if (type === 'biginteger') {
            schema = schema.isSuperior(errorsTrads.min, validationValue);
          } else {
            schema = schema.min(validationValue, errorsTrads.min);
          }
          break;
        }
        case 'minLength': {
          if (!options.isDraft) {
            schema = schema.min(validationValue, errorsTrads.minLength);
          }
          break;
        }
        case 'regex':
          schema = schema.matches(new RegExp(validationValue), {
            message: errorsTrads.regex,
            excludeEmptyString: !validations.required,
          });
          break;
        case 'lowercase':
          if (['text', 'textarea', 'email', 'string'].includes(type)) {
            schema = schema.strict().lowercase();
          }
          break;
        case 'uppercase':
          if (['text', 'textarea', 'email', 'string'].includes(type)) {
            schema = schema.strict().uppercase();
          }
          break;
        case 'positive':
          if (isFieldTypeNumber(type)) {
            schema = schema.positive();
          }
          break;
        case 'negative':
          if (isFieldTypeNumber(type)) {
            schema = schema.negative();
          }
          break;
        default:
          schema = schema.nullable();
      }
    }
  });

  return schema;
};
export default createYupSchema;
