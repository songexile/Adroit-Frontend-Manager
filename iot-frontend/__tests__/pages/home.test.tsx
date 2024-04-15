import { render, screen } from '@testing-library/react'
import Home from '../../src/pages/index'
import { useSession } from 'next-auth/react'

jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
}))

describe('HomePage', () => {
  it('should render loading message when not authenticated', () => {
    ;(useSession as jest.Mock).mockReturnValueOnce({ data: null })

    render(<Home />)
  })
})
