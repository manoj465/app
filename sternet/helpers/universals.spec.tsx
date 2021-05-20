import React from 'react';
import { render } from '@testing-library/react';
import { BasicUniversals } from './universals.composition';

it('should render with the correct text', () => {
  const { getByText } = render(<BasicUniversals />);
  const rendered = getByText('hello from Universals');
  expect(rendered).toBeTruthy();
});
