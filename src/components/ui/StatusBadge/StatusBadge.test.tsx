import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import StatusBadge from '../StatusBadge';

describe('StatusBadge Component', () => {
  it('Should render correct text and color for "pending" status', () => {
    render(<StatusBadge status="pending" />);
    
    const badge = screen.getByText('Pendiente');
    expect(badge).toBeInTheDocument();
    
    // Check for yellow background class on the container div
    expect(badge.closest('div')).toHaveClass('bg-yellow-100');
  });

  it('Should render correct text and color for "accepted" status', () => {
    render(<StatusBadge status="accepted" />);
    
    const badge = screen.getByText('Aprobado');
    expect(badge).toBeInTheDocument();
    expect(badge.closest('div')).toHaveClass('bg-green-100');
  });

  it('Should render correct text and color for "rejected" status', () => {
    render(<StatusBadge status="rejected" />);
    
    const badge = screen.getByText('Rechazado');
    expect(badge).toBeInTheDocument();
    expect(badge.closest('div')).toHaveClass('bg-red-100');
  });

  it('Should fallback to displaying the raw status text if unknown', () => {
    render(<StatusBadge status="custom-status" />);
    
    expect(screen.getByText('custom-status')).toBeInTheDocument();
  });
});