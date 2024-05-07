import React, { createContext, useContext } from 'react';

const StrapiForm = createContext();
export const useStrapiForm = () => {
  return useContext(StrapiForm);
};
export default  StrapiForm;