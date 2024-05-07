const findAllAndReplaceSetup = (components, predicate = () => false, replacement = undefined) => {

  const findAllAndReplace = (
    data,
    attributes,
    { ignoreFalseyValues = false, path = [], parent = attributes } = {}
  ) => {
    return Object.entries(attributes).reduce(
      (acc, [key, value]) => {
        if (
          ignoreFalseyValues &&
          (acc === null || acc === undefined || acc[key] === undefined || acc[key] === null)
        ) {
          return acc;
        }

        if (predicate(value, { path: [...path, key], parent })) {
          acc[key] =
            typeof replacement === 'function'
              ? replacement(acc[key], { path: [...path, key], parent: acc })
              : replacement;
        }

        if (value.type === 'component') {
          const componentAttributes = components[value.component].attributes;

          if (!value.repeatable && acc[key] && typeof acc[key] === 'object') {
            acc[key] = findAllAndReplace(acc[key], componentAttributes, {
              ignoreFalseyValues,
              path: [...path, key],
              parent: attributes[key],
            });
          } else if (value.repeatable && Array.isArray(acc[key])) {
            acc[key] = acc[key].map((datum, index) => {
              const data = findAllAndReplace(datum, componentAttributes, {
                ignoreFalseyValues,
                path: [...path, key, index],
                parent: attributes[key],
              });

              return data;
            });
          }
        } else if (value.type === 'dynamiczone' && Array.isArray(acc[key])) {
          acc[key] = acc[key].map((datum, index) => {
            const componentAttributes = components[datum.__component].attributes;
            const data = findAllAndReplace(datum, componentAttributes, {
              ignoreFalseyValues,
              path: [...path, key, index],
              parent: attributes[key],
            });

            return data;
          });
        }

        return acc;
      },
      { ...data }
    );
  };

  return findAllAndReplace;
};

export { findAllAndReplaceSetup as findAllAndReplace };
