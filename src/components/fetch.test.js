// __tests__/fetch.test.js
import React from 'react'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import Fetch from './fetch'

const server = setupServer(
  rest.get('/greeting', (req, res, ctx) => {
    return res(ctx.json({ greeting: 'hello there' }))
  })
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

test('loads and displays greeting', async () => {
  const { getByRole, findByRole, getByText } = render(<Fetch url="/greeting" />)

  fireEvent.click(getByText('Load Greeting'))

  await findByRole('heading')

  expect(getByRole('heading')).toHaveTextContent('hello there')
  expect(getByRole('button')).toHaveAttribute('disabled')
})

test('handlers server error', async () => {
  server.use(
    rest.get('/greeting', (req, res, ctx) => {
      return res(ctx.status(500))
    })
  )

  const { getByRole, findByRole, getByText } =  render(<Fetch url="/greeting" />)

  fireEvent.click(getByText('Load Greeting'))

  await findByRole('alert')

  expect(getByRole('alert')).toHaveTextContent('Oops, failed to fetch!')
  expect(getByRole('button')).not.toHaveAttribute('disabled')
})