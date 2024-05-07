const extractValuesFromYupError = (errorType, errorParams) => {
  if (!errorType || !errorParams) {
    return {};
  }

  return {
    [errorType]: errorParams[errorType],
  };
};

const getYupInnerErrors = (error) =>
  (error?.inner || []).reduce((acc, currentError) => {
    acc[currentError.path.split('[').join('.').split(']').join('')] = {
      id: currentError.message,
      defaultMessage: currentError.message,
      values: extractValuesFromYupError(currentError?.type, currentError?.params),
    };

    return acc;
  }, {});

export { getYupInnerErrors };
