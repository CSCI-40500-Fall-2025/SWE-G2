/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import App from '../App';
import log from '../src/utils/logger';

test('renders correctly', async () => {
  log.info('INFO: Testing App component rendering');
  await ReactTestRenderer.act(() => {
    ReactTestRenderer.create(<App />);
  });
});