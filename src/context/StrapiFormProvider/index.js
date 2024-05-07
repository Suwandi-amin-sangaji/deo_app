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








const createAttributesLayout = ( custom_fields) => {
  const inject_fields = [];
  let new___ = []
  Object.keys(custom_fields).map((item) => {
    let field_build = {
      name: item,
      fieldSchema: {
        type: custom_fields[item]['type'],
        required: custom_fields[item]['required'] || false,
        unique: custom_fields[item]['unique'] || false,
        multiple : custom_fields[item]['multiple'] || undefined,
        relationType : custom_fields[item]['relationType'] || undefined,
        targetModel : custom_fields[item]['targetModel'] || undefined,
        default : custom_fields[item]['default'] || undefined,
        enum : custom_fields[item]['enum'] || [],
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
  inject_fields.push([new___]);
  return inject_fields;
};












export const StrapiFormBuilder = memo(({
  mutateLink = "/yori-android/add-data",
  populateForm = {},
  custom_fields = {},
  onCreateSuccess,
  layout,
  TAG_USEQUERY,
  isCreatingEntry = true,
  user,
  initialValues = {},
  model
}) => {


  const initialValuesYori = useMemo(() => {
    return initialValues;
  }, [initialValues])




  return (

    <ChildrenComponentData
    //  allLayoutData={layout}
      model={model}
      slug={model}
      populateForm={populateForm}
      custom_fields={custom_fields}
      user={user}
      onCreateSuccess={onCreateSuccess}
      isCreatingEntry={isCreatingEntry}
      initialValues={initialValuesYori}
      mutateLink={mutateLink}
      TAG_USEQUERY={TAG_USEQUERY}
    

    />

  )
})

















const ChildrenComponentData = ({
  onCreateSuccess,
 // allLayoutData,
  model,
  populateForm = {},
  initialValues = {},
  isCreatingEntry = true,
  isLoadingForData = false,
  user = { user },
  custom_fields = {},
  mutateLink,
  TAG_USEQUERY

}) => {



  const queryClient = useQueryClient();
  const [errorForm, setErrorForm] = useState(null);
  const [reducerState, dispatch] = useReducer(reducer, initialState);
  const { formErrors, initialData, modifiedData, modifiedDZName, shouldCheckErrors } = reducerState;
  const { post } = getFetchClient();
  const previousInitialValues = usePrev(initialValues);
 // const currentContentTypeLayout = get(allLayoutData, ['contentType'], {});





  
  const mutation = useMutation({
    mutationFn: async (formData) => {
      const { data } = await post(mutateLink, {
        model: model,
        data: formData,
        TAG_USEQUERY: TAG_USEQUERY
      }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      return data
    },

    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: [TAG_USEQUERY] });
      dispatch({ type: 'RESET_FORM' })
      onCreateSuccess();
      //if(socket){
      //socket.emit('invalidateQueries',{TAG_USEQUERY})
      //}
    },
    onError: (error, variables, context) => {
      if (error.response?.data?.error?.message) {
        setErrorForm(error.response?.data?.error?.message)
      }
      console.log(`rolling back optimistic update with id ${context.id}`)
    }
  })








  const yupSchema = useMemo(() => {
    return createYupSchema(
      custom_fields,
      isCreatingEntry,
      {components: {}},
    );
  }, [
    isCreatingEntry,
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
    if (initialValues && custom_fields && !isEqual(previousInitialValues, initialValues)) {
      dispatch({
        type: 'INIT_FORM',
        initialValues,
        components : {},
        attributes: custom_fields,
       
      });
    }
  }, [
    custom_fields,
    initialValues,
   // currentContentTypeLayout,
    previousInitialValues,
  ]);







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
      const cleanedData = cleanData({ browserState: modifiedData, serverState: initialData}, custom_fields, {}, populateForm);
      cleanFormValue = {};
      Object.keys(cleanedData).map((item)=>{
        if(custom_fields[item]){
          cleanFormValue[item] = cleanedData[item];
        }
      });
      return cleanFormValue;
    },

    [ populateForm, custom_fields]
  );








  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      let errors = {};

      try {
        await yupSchema.validate(modifiedData, { abortEarly: false });
      } catch (err) {
       // console.log(err);
        errors = getYupInnerErrors(err);
      }
      //console.log(errors)

      try {
        if (isEmpty(errors)) {
          const formData = createFormData(modifiedData, initialData);
         // console.log(JSON.stringify({ ...formData, ...populateForm }));
          if (isCreatingEntry) {
            mutation.mutate({ ...formData, ...populateForm })
          } else {
            mutation.mutate({ ...formData, ...populateForm })
           
          }
        }
      } catch (err) {
        console.log(err);
        errors = {
          ...errors,
          ...getAPIInnerErrors(err, { getTrad : (id)=>{ return `content-manager.${id}`} }),
        };
      }
      dispatch({ type: 'SET_FORM_ERRORS', errors });
    },
    [
      onCreateSuccess,
      createFormData,
      isCreatingEntry,
      modifiedData,
      initialData,
      yupSchema,
      populateForm,
      mutation
    ]
  );






  const generateField = useMemo(() => {
      return createAttributesLayout( custom_fields)
  }, [custom_fields])





  return (
    <StrapiForm.Provider value={{
      onChange: handleChange,
      formErrors: formErrors,
      isCreatingEntry: isCreatingEntry,
      modifiedData: modifiedData,
     // shouldNotRunValidations: shouldNotRunValidations,
      attributes: custom_fields,
    
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
                user={user}
                error={errorForm}
                generateField={generateField}
                onSubmit={handleSubmit}
              />
            </View>
          </>
        ) : (
          <>
            <View className="flex-1 bg-white relative px-4 flex-col mt-2">
              <RenderForm
                user={user}
                error={errorForm}
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













const RenderForm = ({ generateField, onSubmit, formErrors, user, error }) => {



  return Platform.OS == 'android' ? (
    <ScrollView bounces={false} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
      {error && (<View className=" bg-red-500 items-center justify-center p-4 rounded-lg">
        <Text className=" text-white ">{error}</Text>
      </View>)}
      {generateField.map((item, index) => {
        return (<Fragment key={index}>
          <RenderPerRow cols_per_row={item} user={user} />
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
            <RenderPerRow cols_per_row={item}  user={user} />
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














const RenderPerRow = ({ cols_per_row,  user }) => {
  return (<>
    {cols_per_row.map((field, index_field) => {
      //first section no dinamicZone
      return (<Fragment key={index_field}>
        {field.map(({ fieldSchema, labelAction, metadatas, name, size, queryInfos }, index_dua) => {
          return (<View key={index_dua} className="space-y-2 px-1 w-full mt-2">
            <YoriInput
              user={user}
            
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