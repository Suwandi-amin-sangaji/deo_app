
import get from 'lodash/get';
export const getInitialDataPathUsingTempKeys = (initialData, modifiedData) => (currentPath) => {
  const splitPath = currentPath.split('.');

  return splitPath.reduce((acc, currentValue, index) => {
    const initialDataParent = get(initialData, acc);
    const modifiedDataTempKey = get(modifiedData, [
      ...splitPath.slice(0, index),
      currentValue,
      '__temp_key__',
    ]);

    if (Array.isArray(initialDataParent) && typeof modifiedDataTempKey === 'number') {
      const initialDataIndex = initialDataParent.findIndex(
        (entry) => entry.__temp_key__ === modifiedDataTempKey
      );

      acc.push(initialDataIndex.toString());

      return acc;
    }

    acc.push(currentValue);

    return acc;
  }, []);
};
