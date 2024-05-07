import get from 'lodash/get';
import isArray from 'lodash/isArray';
import isObject from 'lodash/isObject';

import { getInitialDataPathUsingTempKeys } from './paths';

/* eslint-disable indent */

/**
 *
 * @param {{ browserState: object, serverState: object }} browserState – the modifiedData from REDUX, serverState - the initialData from REDUX
 * @param {object} currentSchema
 * @param {object} componentsSchema
 * @returns
 */
const cleanData = ({ browserState, serverState }, currentSchema, componentsSchema, populateForm) => {
  const rootServerState = serverState;
  const rootBrowserState = browserState;
  const getType = (schema, attrName) => get(schema, ['attributes', attrName, 'type'], '');
  const getOtherInfos = (schema, arr) => get(schema, ['attributes', ...arr], '');




  const recursiveCleanData = (browserState, serverState, schema, pathToParent) => {


    return Object.keys(browserState).reduce((acc, current) => {
      const path = pathToParent ? `${pathToParent}.${current}` : current;
      const attrType = getType(schema, current);

      // This is the field value
      const value = get(browserState, current);
      const oldValue = get(serverState, current);
      const component = getOtherInfos(schema, [current, 'component']);
      const isRepeatable = getOtherInfos(schema, [current, 'repeatable']);
      let cleanedData;



      switch (attrType) {
        case 'json':
          cleanedData = JSON.parse(value);
          break;
        
        
          case 'time': {
          cleanedData = value;
          // FIXME
          if (value && value.split(':').length < 3) {
            cleanedData = `${value}:00`;
          }
          break;
        }


        case 'media':{
          if (getOtherInfos(schema, [current, 'multiple']) === true) {
            cleanedData = value ? value.filter((file) => !(file instanceof File)) : null;
          } else {
            if(!value){
              cleanedData = null;
            }else{
              console.log('FILESSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS')
              cleanedData = value;
            }
          }
          break;
        }

        case 'component':
          if (isRepeatable) {
            cleanedData = value
              ? value.map((data, index) => {
                  const subCleanedData = recursiveCleanData(
                    data,
                    (oldValue ?? [])[index],
                    componentsSchema[component],
                    `${path}.${index}`
                  );

                  return subCleanedData;
                })
              : value;
          } else {
            cleanedData = value
              ? recursiveCleanData(value, oldValue, componentsSchema[component], path)
              : value;
          }

          break;

        case 'relation': {
          /*
          const trueInitialDataPath = getInitialDataPathUsingTempKeys(rootServerState, rootBrowserState)(path).join('.');
          
          let actualOldValue = get(rootServerState, trueInitialDataPath, []);
          const connectedRelations = value.reduce((acc, relation, currentIndex, array) => {
            const relationOnServer = actualOldValue.find((oldRelation) => oldRelation.id === relation.id);

            const relationInFront = array[currentIndex + 1];
            if (!relationOnServer || relationOnServer.__temp_key__ !== relation.__temp_key__) {
              const position = relationInFront ? { before: relationInFront.id } : { end: true };
              return [...acc, { id: relation.id, position }];
            }
            return acc;
          }, []);

          const disconnectedRelations = actualOldValue.reduce((acc, relation) => {
            if (!value.find((newRelation) => newRelation.id === relation.id)) {
              return [...acc, { id: relation.id }];
            }
            return acc;
          }, []);
          */

          

          //console.log('INI RELATION CONNECT - CLEAN DATA');
          //console.log(current);
          //console.log(populateForm);
          //console.log('INI RELATION CONNECT - CLEAN DATA');
          

          if(value.length === 0){
            cleanedData = {
              disconnect: [],
              connect: [],
            };
          }else{
            
            if(isArray(value)){
              let connect = value.map((item)=>{
                return {id: item.id, position: {end: true}}
              });
              cleanedData = {
                disconnect: [],
                connect: connect,
              };
            }else{
              cleanedData = {
                disconnect: [],
                connect: [],
              };
            }
          }
          break;
        }

        case 'dynamiczone':
          cleanedData = value.map((componentData, index) => {
            const subCleanedData = recursiveCleanData(
              componentData,
              (oldValue ?? [])[index],
              componentsSchema[componentData.__component],
              `${path}.${index}`
            );

            return subCleanedData;
          });
          break;
        default:
          cleanedData = helperCleanData(value, 'id');
      }


      console.log('============================================================')
      console.log(current);
      console.log(cleanedData);
      console.log('============================================================')
      acc[current] = cleanedData;

      return acc;
    }, {});
  };

  return recursiveCleanData(browserState, serverState, currentSchema, '');
};

// TODO: check which parts are still needed: I suspect the
// isArray part can go away, but I'm not sure what could send
// an object; in case both can go away we might be able to get
// rid of the whole helper
export const helperCleanData = (value, key) => {
  if (isArray(value)) {
    return value.map((obj) => (obj[key] ? obj[key] : obj));
  }
  if (isObject(value)) {
    return value[key];
  }

  return value;
};

export default cleanData;
