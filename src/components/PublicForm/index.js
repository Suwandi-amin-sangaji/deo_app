import React, { useState, memo, useEffect, useMemo, createContext, useContext, useReducer, Fragment, useCallback } from 'react';

import cloneDeep from 'lodash/cloneDeep';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import set from 'lodash/set';


import { Platform, View, KeyboardAvoidingView, Text, ScrollView, TouchableOpacity } from "react-native";
import createDefaultForm from './createDefaultForm';
import { formatContentTypeData } from './formatContentTypeData';
import createYupSchema from './schema';
import { getYupInnerErrors } from './getYupInnerErrors';
import { getAPIInnerErrors } from './getAPIInnerErrors';
import cleanData from './cleanData';
import { usePrev } from './usePrev';
import StrapiForm from './StrapiFormContext';
import YoriInput from './Input';
import reducer, { initialState } from './reducer';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getFetchClient } from '@api/getFetchClient';
//import { useSocketIo } from '@app/(tabs)/_layout';







const getTrad = (id) => `content-manager.${id}`;


const createAttributesLayout = (currentContentTypeLayoutData, custom_fields) => {

  if (!currentContentTypeLayoutData.layouts) {
    if (!custom_fields) {
      return [];
    } else {
      const inject_fields = [];
      let new___ = []
      Object.keys(custom_fields).map((item) => {
        let field_build = {
          name: item,
          fieldSchema: {
            "type": custom_fields[item]['type'],
            "required": custom_fields[item]['required'] || false,
            "unique": custom_fields[item]['unique'] || false
          },
          metadatas: {
            "label": custom_fields[item]['type'] || custom_fields[item]['label'],
            "description": custom_fields[item]['description'] || '',
            "placeholder": custom_fields[item]['placeholder'] || '',
            "visible": true,
            "editable": true
          }
        }
        new___.push(field_build);
      });

      inject_fields.push([new___]);
      return inject_fields;
    }
  }

  const currentLayout = currentContentTypeLayoutData.layouts.edit;
  const attributes = currentContentTypeLayoutData.attributes;

  const getType = (name) => get(attributes, [name, 'type'], '');

  let currentRowIndex = 0;
  const newLayout = [];

  currentLayout.forEach((row) => {
    const hasDynamicZone = row.some(({ name }) => getType(name) === 'dynamiczone');

    if (!newLayout[currentRowIndex]) {
      newLayout[currentRowIndex] = [];
    }

    if (hasDynamicZone) {
      currentRowIndex = currentRowIndex === 0 && isEmpty(newLayout[0]) ? 0 : currentRowIndex + 1;

      if (!newLayout[currentRowIndex]) {
        newLayout[currentRowIndex] = [];
      }
      newLayout[currentRowIndex].push(row);

      currentRowIndex += 1;
    } else {
      newLayout[currentRowIndex].push(row);
    }
  });

  const fields = newLayout.filter((arr) => arr.length > 0);
  let new___ = []
  Object.keys(custom_fields).map((item) => {
    let field_build = {
      name: item,
      fieldSchema: {
        "type": custom_fields[item]['type'],
        "required": custom_fields[item]['required'] || false,
        "unique": custom_fields[item]['unique'] || false
      },
      metadatas: {
        "label": custom_fields[item]['label'] || item,
        "description": custom_fields[item]['description'] || '',
        "placeholder": custom_fields[item]['placeholder'] || '',
        "visible": true,
        "editable": true
      }
    }
    new___.push(field_build);
  });
  fields.push([new___])

  return fields;
};









export const StrapiFormBuilder = memo(({
  mutateLink = "/yori-android/add-data",
  populateForm = {},
  hiddenFields = {},
  custom_fields = {},
  onCreateSuccess,
  layout,
  TAG_USEQUERY,
  isCreatingEntry = true,
  initialValues = {}
}) => {


  // const { post } = getFetchClient();
  const queryClient = useQueryClient();
  //const { socket } = useSocketIo();





  const componentsDataStructure = (layout) => {
    if (!layout.components) {
      return {}
    }
    return Object.keys(layout.components).reduce((acc, current) => {
      const defaultComponentForm = createDefaultForm(
        get(layout, ['components', current, 'attributes'], {}),
        layout.components
      );

      acc[current] = formatContentTypeData(
        defaultComponentForm,
        layout.components[current],
        layout.components
      );

      return acc;
    }, {});
  };



  const contentTypeDataStructure = (layout) => {
    if (!layout.contentType) {
      return {}
    }
    const contentType = createDefaultForm(layout.contentType.attributes, layout.components);
    return contentType;
  };


  /*

  
  
  
  
  
    const onPut = () => {
  
    }
  
  
  
  
    if (mutation.isLoading) {
      return (<View className="flex-1 items-center justify-center">
      <Text className=" text-lg text-indigo-700 font-bold">SAVE DATA ... </Text>
    </View>)
    }
  
    */

  return (

    <ChildrenComponentData
      allLayoutData={layout}
      model={layout?.contentType.uid}
      slug={layout?.contentType.uid}
      onPut={() => { }}
      onPublish={() => { }}
      onUnpublish={() => { }}
      onDraftRelationCheck={() => { }}
      componentsDataStructure={componentsDataStructure(layout)}
      contentTypeDataStructure={contentTypeDataStructure(layout)}
      populateForm={populateForm}
      hiddenFields={hiddenFields}
      custom_fields={custom_fields}
     
      onCreateSuccess={onCreateSuccess}
      //mutation={mutation}
      isCreatingEntry={isCreatingEntry}
      initialValues={initialValues}
      mutateLink={mutateLink}
      TAG_USEQUERY={TAG_USEQUERY}

    />

  )
})

















const ChildrenComponentData = ({
  onCreateSuccess,
  allLayoutData,
  model,
  populateForm = {},
  hiddenFields = {},
  canRead = true,
  canUpdate = true,
  componentsDataStructure,
  contentTypeDataStructure,
  createActionAllowedFields,
  from,
  initialValues = {},
  isCreatingEntry = true,
  isLoadingForData = false,
  isSingleType = false,
  onPost = () => { },
  onPublish = () => { },
  onDraftRelationCheck = () => { },
  onPut = () => { },
  onUnpublish = () => { },
  readActionAllowedFields,
  // Not sure this is needed anymore
  redirectToPreviousPage,
  slug,
  status,
  updateActionAllowedFields,
 
  custom_fields = {},
  //mutation,
  mutateLink,
  TAG_USEQUERY

}) => {




  const [errorForm, setErrorForm ] = useState(null);
  const [reducerState, dispatch] = useReducer(reducer, initialState);
  const { formErrors, initialData, modifiedData, modifiedDZName, shouldCheckErrors, publishConfirmation } = reducerState;
  const { components } = allLayoutData;
  const previousInitialValues = usePrev(initialValues);
  const currentContentTypeLayout = get(allLayoutData, ['contentType'], {});


  const { post } = getFetchClient();
  const mutation = useMutation({
    mutationFn: async (formData) => {
      const { data } = await post(mutateLink, {
        model: allLayoutData?.contentType.uid,
        data: formData,
        TAG_USEQUERY: TAG_USEQUERY
      });
      return data
    },
    onSuccess: (data, variables, context) => {
      dispatch({type: 'RESET_FORM'})
      onCreateSuccess();
      //queryClient.invalidateQueries({ queryKey: [TAG_USEQUERY] });
      //if(socket){
        //socket.emit('invalidateQueries',{TAG_USEQUERY})
      //}
    },
    onError: (error, variables, context) => {
      if(error.response?.data?.error?.message){
        setErrorForm(error.response?.data?.error?.message)
      }
      console.log(`rolling back optimistic update with id ${context.id}`)
    }
  })



  const hasDraftAndPublish = useMemo(() => {
    return get(currentContentTypeLayout, ['options', 'draftAndPublish'], false);
  }, [currentContentTypeLayout]);



  const shouldNotRunValidations = useMemo(() => {
    return hasDraftAndPublish && !initialData.publishedAt;
  }, [hasDraftAndPublish, initialData.publishedAt]);


  const shouldRedirectToHomepageWhenEditingEntry = useMemo(() => {
    if (isLoadingForData) {
      return false;
    }
    if (isCreatingEntry) {
      return false;
    }

    if (canRead === false && canUpdate === false) {
      return true;
    }
    return false;
  }, [isLoadingForData, isCreatingEntry, canRead, canUpdate]);




  const yupSchema = useMemo(() => {
    const options = { isCreatingEntry, isDraft: shouldNotRunValidations, isFromComponent: false };
    return createYupSchema(
      currentContentTypeLayout,
      {
        components: allLayoutData.components || {},
      },
      options,
      hiddenFields,
      custom_fields
    );
  }, [
    allLayoutData.components,
    currentContentTypeLayout,
    isCreatingEntry,
    shouldNotRunValidations,
    hiddenFields,
    custom_fields
  ]);


  const checkFormErrors = useCallback(
    async (dataToSet = {}) => {
      let errors = {};
      const updatedData = cloneDeep(modifiedData);

      if (!isEmpty(updatedData)) {
        set(updatedData, dataToSet.path, dataToSet.value);
      }

      try {
        // Validate the form using yup
        await yupSchema.validate(updatedData, { abortEarly: false });
      } catch (err) {
        errors = getYupInnerErrors(err);

        if (modifiedDZName) {
          errors = Object.keys(errors).reduce((acc, current) => {
            const dzName = current.split('.')[0];

            if (dzName !== modifiedDZName) {
              acc[current] = errors[current];
            }

            return acc;
          }, {});
        }
      }
      dispatch({
        type: 'SET_FORM_ERRORS',
        errors,
      });
    },
    [modifiedDZName, modifiedData, yupSchema]
  );



  useEffect(() => {
    if (!isLoadingForData) {
      checkFormErrors();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldCheckErrors]);




  useEffect(() => {
    const errorsInForm = Object.keys(formErrors);
    // TODO check if working with DZ, components...
    // TODO use querySelector querySelectorAll('[data-strapi-field-error]')
    if (errorsInForm.length > 0) {
      const firstError = errorsInForm[0];
      //const el = document.getElementById(firstError);
      //if (el) {
      //  el.focus();
      //}
    }
  }, [formErrors]);



  useEffect(() => {
    if (shouldRedirectToHomepageWhenEditingEntry) {
      //toggleNotification({
      //  type: 'info',
      //   message: { id: getTrad('permissions.not-allowed.update') },
      // });
    }
  }, [shouldRedirectToHomepageWhenEditingEntry]);



  useEffect(() => {
    dispatch({
      type: 'SET_DEFAULT_DATA_STRUCTURES',
      componentsDataStructure,
      contentTypeDataStructure,
    });
  }, [componentsDataStructure, contentTypeDataStructure]);




  useEffect(() => {
    /**
     * Only fire this effect if the initialValues are different
     * otherwise it's a fruitless effort no matter what happens.
     */
    if (
      initialValues &&
      currentContentTypeLayout?.attributes &&
      !isEqual(previousInitialValues, initialValues)
    ) {
      dispatch({
        type: 'INIT_FORM',
        initialValues,
        components,
        attributes: currentContentTypeLayout.attributes,
        //  setModifiedDataOnly  : ()=>{},
      });

      /**
       * TODO: This should be moved to a side-effect e.g. thunks
       * something to consider for V5
       */
      // if (setModifiedDataOnly) {
      //   reduxDispatch(clearSetModifiedDataOnly());
      // }
    }
  }, [
    initialValues,
    currentContentTypeLayout,
    components,
    //  setModifiedDataOnly,
    //reduxDispatch,
    previousInitialValues,
  ]);




  const dispatchAddComponent = useCallback(
    (type) =>
      (
        keys,
        componentLayoutData,
        allComponents,
        shouldCheckErrors = false,
        position = undefined
      ) => {
        dispatch({
          type,
          keys: keys.split('.'),
          position,
          componentLayoutData,
          allComponents,
          shouldCheckErrors,
        });
      },
    []
  );

  const addComponentToDynamicZone = dispatchAddComponent('ADD_COMPONENT_TO_DYNAMIC_ZONE');




  const addNonRepeatableComponentToField = useCallback(
    (keys, componentLayoutData, allComponents) => {
      dispatch({
        type: 'ADD_NON_REPEATABLE_COMPONENT_TO_FIELD',
        keys: keys.split('.'),
        componentLayoutData,
        allComponents,
      });
    },
    []
  );




  const relationConnect = useCallback(({ name, value, toOneRelation }) => {
    dispatch({
      type: 'CONNECT_RELATION',
      keys: name.split('.'),
      value,
      toOneRelation,
    });
  }, []);




  const relationLoad = useCallback(
    ({ target: { initialDataPath, modifiedDataPath, value, modifiedDataOnly } }) => {
      dispatch({
        type: 'LOAD_RELATION',
        modifiedDataPath,
        initialDataPath,
        value,
        modifiedDataOnly,
      });
    },
    []
  );


  const addRepeatableComponentToField = dispatchAddComponent('ADD_REPEATABLE_COMPONENT_TO_FIELD');





  const handleChange = useCallback(
    ({ target: { name, value, type } }, shouldSetInitialValue = false) => {
      let inputValue = value;
      // Allow to reset text, textarea, email, uid, select/enum, and number
      if (
        ['text', 'textarea', 'string', 'email', 'uid', 'select', 'select-one', 'number'].includes(
          type
        ) &&
        !value &&
        value !== 0
      ) {
        inputValue = null;
      }

      if (type === 'password' && !value) {
        dispatch({
          type: 'REMOVE_PASSWORD_FIELD',
          keys: name.split('.'),
        });

        return;
      }

      dispatch({
        type: 'ON_CHANGE',
        keys: name.split('.'),
        value: inputValue,
        shouldSetInitialValue,
      });
    },
    []
  );



  const createFormData = useCallback(
    (modifiedData, initialData) => {
      // Then we need to apply our helper
      const cleanedData = cleanData(
        { browserState: modifiedData, serverState: initialData },
        currentContentTypeLayout,
        allLayoutData.components,
        populateForm
      );
      return cleanedData;
    },
    [allLayoutData.components, currentContentTypeLayout, populateForm]
  );




  const trackerProperty = useMemo(() => {
    if (!hasDraftAndPublish) {
      return {};
    }

    return shouldNotRunValidations ? { status: 'draft' } : {};
  }, [hasDraftAndPublish, shouldNotRunValidations]);


  const handlePublishPromptDismissal = useCallback(async (e) => {
    e.preventDefault();
    return dispatch({
      type: 'RESET_PUBLISH_CONFIRMATION',
    });
  }, []);






  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      let errors = {};

      try {
        await yupSchema.validate(modifiedData, { abortEarly: false });
      } catch (err) {
        console.log(err);
        errors = getYupInnerErrors(err);
      }


      try {
        if (isEmpty(errors)) {
          const formData = createFormData(modifiedData, initialData);
          console.log(JSON.stringify({ ...formData, ...populateForm }));
          if (isCreatingEntry) {
            mutation.mutate({ ...formData, ...populateForm })
          } else {
            mutation.mutate({ ...formData, ...populateForm })
            //onPut({ ...formData, ...populateForm });
          }
        }
      } catch (err) {
        console.log(err);
        errors = {
          ...errors,
          ...getAPIInnerErrors(err, { getTrad }),
        };
      }
      dispatch({type: 'SET_FORM_ERRORS',errors});
    },
    [
      onCreateSuccess,
      createFormData,
      isCreatingEntry,
      modifiedData,
      initialData,
      onPut,
      yupSchema,
      populateForm,
      mutation
    ]
  );




  const generateField = useMemo(() => {
    if (!hiddenFields) {
      return createAttributesLayout(allLayoutData?.contentType ?? {}, custom_fields)
    }


    const fieldToRender = createAttributesLayout(allLayoutData?.contentType ?? {}, custom_fields).map((item) => {
      return item.map((field) => {
        return field.map((item_field) => {
          if (hiddenFields[item_field.name]) {
            return false;
          }
          return item_field;
        }).filter(Boolean)
      });
    });

    return fieldToRender;
  }, [hiddenFields, custom_fields, allLayoutData, model])



  console.log(errorForm)




  return (
    <StrapiForm.Provider value={{
      onChange: handleChange,
      formErrors: formErrors,
      isCreatingEntry: isCreatingEntry,
      modifiedData: modifiedData,
      shouldNotRunValidations: shouldNotRunValidations,
      attributes: currentContentTypeLayout.attributes,
      relationConnect: relationConnect,
      relationLoad: relationLoad,
    }}>


      <View className=" flex-1">
        {mutation.isLoading ? (
          <View className="flex-1 items-center justify-center">
            <Text className=" text-lg text-indigo-700 font-bold">SAVE DATA ... </Text>
          </View>
        ) : mutation.isError ? (
          <>
            <View className="flex-1 bg-white relative px-4 flex-col mt-2">
              <RenderForm
              
                error={errorForm}
                layout={allLayoutData}
                generateField={generateField}
                onSubmit={handleSubmit}
              />
            </View>
          </>
        ) : (
          <>
            <View className="flex-1 bg-white relative px-4 flex-col mt-2">
              <RenderForm
               
                layout={allLayoutData}
                generateField={generateField}
                onSubmit={handleSubmit}
              />
            </View>
          </>
        )}
      </View>





    </StrapiForm.Provider>
  )
}













const RenderForm = ({ generateField, layout, onSubmit, formErrors, error }) => {



  return Platform.OS == 'android' ? (
    <ScrollView bounces={false} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
      {error && (<View className=" bg-red-500 items-center justify-center p-4 rounded-lg">
        <Text className=" text-white ">{error}</Text>
      </View>)}
      {generateField.map((item, index) => {
        return (<Fragment key={index}>
          <RenderPerRow cols_per_row={item} layout={layout}  />
        </Fragment>)
      })}

      <View className=" flex-row items-center px-2 justify-between mt-4">
        <TouchableOpacity className="rounded bg-white p-2 px-2" onPress={() => { /**onSubmit */ }}>
          {/**<Text className="text-white uppercase text-xs">SUBMIT AND AD NEW </Text> */}
        </TouchableOpacity>

        <TouchableOpacity className="rounded bg-blue-700 p-2 px-2" onPress={onSubmit}>
          <Text className="text-white uppercase text-xs">SUBMIT</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>) :

    (<KeyboardAvoidingView
      style={{ flex: 1, flexDirection: 'column', justifyContent: 'center' }}
      behavior={Platform.OS == "ios" ? "padding" : "height"}
      keyboardVerticalOffset={200}
      enabled>
      <ScrollView bounces={false} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">


        {error && (<View className=" bg-red-500 items-center justify-center p-4 rounded-lg">
          <Text className=" text-white ">{error}</Text>
        </View>)}

        {generateField.map((item, index) => {
          return (<Fragment key={index}>
            <RenderPerRow cols_per_row={item} layout={layout}  />
          </Fragment>)
        })}

        <View className=" flex-row items-center px-2 justify-between mt-4">
          <TouchableOpacity className="rounded bg-white p-2 px-2" onPress={() => { /**onSubmit */ }}>
            {/**<Text className="text-white uppercase text-xs">SUBMIT AND AD NEW </Text> */}
          </TouchableOpacity>

          <TouchableOpacity className="rounded bg-blue-700 p-2 px-2" onPress={onSubmit}>
            <Text className="text-white uppercase text-xs">SUBMIT</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>)
}














const RenderPerRow = ({ cols_per_row, layout }) => {
  return (<>
    {cols_per_row.map((field, index_field) => {
      //first section no dinamicZone
      return (<Fragment key={index_field}>
        {field.map(({ fieldSchema, labelAction, metadatas, name, size, queryInfos }, index_dua) => {
          return (<View key={index_dua} className="space-y-2 px-1 w-full mt-2">
            <YoriInput
            
              currentContentTypeLayout={layout?.contentType}
              size={size}
              fieldSchema={fieldSchema}
              keys={name}
              labelAction={labelAction}
              metadatas={metadatas}
              queryInfos={queryInfos}
              customFieldInputs={{}}
            />
          </View>)
        })}
      </Fragment>)
    })}
  </>)
}