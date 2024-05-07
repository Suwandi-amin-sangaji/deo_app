import get from 'lodash/get';
import isArray from 'lodash/isArray';
import isObject from 'lodash/isObject';

import { getInitialDataPathUsingTempKeys } from './paths';

/* eslint-disable indent */




const cleanData = ({ browserState, serverState }, custom_fields, componentsSchema, populateForm) => {



 // return browserState;
  
  
  const rootServerState = serverState;
  const rootBrowserState = browserState;

  const currentSchema = {
    attributes : custom_fields
  }
  
  const getType = (schema, attrName) => get(schema, ['attributes', attrName, 'type'], '');
  const getOtherInfos = (schema, arr) => get(schema, ['attributes', ...arr], '');


  




  const recursiveCleanData = (browserState, serverState, schema, pathToParent) => {


    return Object.keys(browserState).reduce((acc, current) => {
      const path = pathToParent ? `${pathToParent}.${current}` : current;
      const attrType = getType(schema, current);

      
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
             // console.log('FILESSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS')
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


    //  console.log('============================================================')
      //console.log(current);
     // console.log(cleanedData);
     // console.log('============================================================')
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
