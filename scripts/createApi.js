// import fs from 'fs';
const fs = require('fs');

// import path from 'path';
const path = require('path');

const appPath = process.argv[2];
const apiName = process.argv[3];

const dir = path.resolve(
  __dirname,
  `../src/shared/services/api/${appPath}/${apiName}`,
);

const index = `export * from './useCreate${apiName}';
export * from './useGet${apiName}List';
export * from './useDelete${apiName}';
export * from './useGet${apiName}';
export * from './useEdit${apiName}';
`;

const search = `import useAxios from 'axios-hooks';
import { RETAILER_${apiName.toUpperCase()} } from '../../route';
import { appMerchant } from '@redux/slices';
import React from 'react';
import { useDispatch } from 'react-redux';

export const useGet${apiName}List = () => {
  const dispatch = useDispatch();

  const [{ data: ${apiName.toLowerCase()}List, loading, error, response }, execute] =
    useAxios(
      { method: 'GET', url: \`\${RETAILER_${apiName.toUpperCase()}.url}/search\` },
      {
        manual: true,
      },
  );

  React.useEffect(() => {
    if (loading) {
      dispatch(appMerchant.showLoading());
    }
    if (!loading && response) {
      dispatch(appMerchant.hideLoading());

    }
  }, [${apiName.toLowerCase()}List?.data, dispatch, loading, response]);

  const get${apiName}List = (params) => {
    execute({
      params: params,
    });
  };

  return [${apiName.toLowerCase()}List, get${apiName}List];
};
`;

const get = `import useAxios from 'axios-hooks';
import { RETAILER_${apiName.toUpperCase()} } from '../../route';
import { appMerchant } from '@redux/slices';
import React from 'react';
import { useDispatch } from 'react-redux';

export const useGet${apiName} = () => {
  const dispatch = useDispatch();

  const [{ data: ${apiName.toLowerCase()}, loading, error, response }, execute] = useAxios(
    { method: 'GET' },
    {
      manual: true,
    },
  );

  React.useEffect(() => {
    if (loading) {
      dispatch(appMerchant.showLoading());
    }
    if (!loading && response) {
      dispatch(appMerchant.hideLoading());
    }
  }, [${apiName.toLowerCase()}?.data, dispatch, loading, response]);

  const get${apiName} = (${apiName.toLowerCase()}Id) => {
    execute({
      url: \`\${RETAILER_${apiName.toUpperCase()}.url}/\${${apiName.toLowerCase()}Id}\`,
    });
  };

  return [${apiName.toLowerCase()}, get${apiName}];
};
`;

const create = `import useAxios from 'axios-hooks';
import { RETAILER_${apiName.toUpperCase()} } from '../../route';
import { appMerchant } from '@redux/slices';
import React from 'react';
import { useDispatch } from 'react-redux';

export const useCreate${apiName} = () => {
  const dispatch = useDispatch();

  const [{ data: ${apiName.toLowerCase()}Create, loading, error, response }, execute] = useAxios(
    { method: 'POST', url: RETAILER_${apiName.toUpperCase()}.url },
    {
      manual: true,
    },
  );

  React.useEffect(() => {
    if (loading) {
      dispatch(appMerchant.showLoading());
    }
    if (!loading && response) {
      dispatch(appMerchant.hideLoading());
    }
  }, [${apiName.toLowerCase()}Create?.data, dispatch, loading, response]);

  const create${apiName} = (params) => {
    execute({
      data: params,
    });
  };

  return [${apiName.toLowerCase()}Create, create${apiName}];
};
`;

const del = `import useAxios from 'axios-hooks';
import { RETAILER_${apiName.toUpperCase()} } from '../../route';
import { appMerchant } from '@redux/slices';
import React from 'react';
import { useDispatch } from 'react-redux';

export const useDelete${apiName} = (onCallback) => {
  const dispatch = useDispatch();

  const [{ data: ${apiName.toLowerCase()}Delete, loading, error, response }, execute] = useAxios(
    { method: 'DELETE' },
    {
      manual: true,
    },
  );

  React.useEffect(() => {
    if (loading) {
      dispatch(appMerchant.showLoading());
    }
    if (!loading && response) {
      dispatch(appMerchant.hideLoading());
      if (onCallback && typeof onCallback === 'function') {
        onCallback();
      }
    }
  }, [ dispatch, loading, response]);

  const delete${apiName} = (${apiName.toLowerCase()}Id) => {
    execute({
      url: \`\${RETAILER_${apiName.toUpperCase()}.url}/\${${apiName.toLowerCase()}Id}\`,
    });
  };

  return [${apiName.toLowerCase()}Delete, delete${apiName}];
};
`;

const put = `import useAxios from 'axios-hooks';
import { RETAILER_${apiName.toUpperCase()} } from '../../route';
import { appMerchant } from '@redux/slices';
import React from 'react';
import { useDispatch } from 'react-redux';

export const useEdit${apiName} = () => {
  const dispatch = useDispatch();

  const [{ data: ${apiName.toLowerCase()}Edit, loading, error, response }, execute] = useAxios(
    { method: 'PUT',  },
    {
      manual: true,
    },
  );

  React.useEffect(() => {
    if (loading) {
      dispatch(appMerchant.showLoading());
    }
    if (!loading && response) {
      dispatch(appMerchant.hideLoading());
    }
  }, [${apiName.toLowerCase()}Edit?.data, dispatch, loading, response]);

  const edit${apiName} = (params, id) => {
    execute({
      data: params,
      url: \`\${RETAILER_${apiName.toUpperCase()}.url}/\${id}\`,
    });
  };

  return [${apiName.toLowerCase()}Edit, edit${apiName}];
};
`;

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}
fs.writeFileSync(dir + '/index.js', index);
fs.writeFileSync(dir + `/useGet${apiName}List.js`, search);
fs.writeFileSync(dir + `/useGet${apiName}.js`, get);
fs.writeFileSync(dir + `/useCreate${apiName}.js`, create);
fs.writeFileSync(dir + `/useDelete${apiName}.js`, del);
fs.writeFileSync(dir + `/useEdit${apiName}.js`, put);
