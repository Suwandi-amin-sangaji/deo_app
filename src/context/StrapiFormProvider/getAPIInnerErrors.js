import { normalizeAPIError } from './normalizeAPIError';
export function getAPIInnerErrors(error, { getTrad }) {
  const normalizedError = normalizeAPIError(error, getTrad);
  if (normalizedError?.errors) {
    return normalizedError.errors.reduce((acc, error) => {
      acc[error.values.path] = {
        id: error.id,
        defaultMessage: error.defaultMessage,
      };
      return acc;
    }, {});
  }
  return normalizedError.defaultMessage;
}
