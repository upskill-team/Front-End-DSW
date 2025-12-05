import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Button from './Button';

describe('Button Component', () => {
  it('Should render children text correctly', () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  it('Should handle click events', () => {
    const handleClick = vi.fn(); // Spy function
    render(<Button onClick={handleClick}>Action</Button>);
    
    const button = screen.getByText('Action');
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('Should show loading spinner and be disabled when isLoading is true', () => {
    render(<Button isLoading>Submit</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    
    // Original text should not be visible (replaced by spinner)
    expect(screen.queryByText('Submit')).not.toBeInTheDocument();
  });

  it('Should apply variant classes correctly', () => {
    render(<Button variant="destructive">Delete</Button>);
    
    const button = screen.getByText('Delete');
    expect(button).toHaveClass('bg-red-500');
  });
});