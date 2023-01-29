import React from 'react';
import { mount } from 'cypress/react'
import TestComponent from "./index"

describe('ComponentName.cy.ts', () => {
  it('does render', () => {
    mount(<TestComponent />)
  })
})
