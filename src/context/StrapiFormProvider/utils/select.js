import { useMemo } from 'react';
import { useStrapiForm } from '../StrapiFormContext';
import get from 'lodash/get';



function useSelect(keys) {
  const { formErrors, isCreatingEntry, modifiedData, onChange, shouldNotRunValidations, attributes } = useStrapiForm();
  const properties=attributes[keys];
  const value = get(modifiedData, keys, null);
  return { 
    formErrors, 
    isCreatingEntry, 
    onChange, 
    shouldNotRunValidations, 
    value,
    properties
  };
}
export default useSelect;
