import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import CDItem from '../CDItem';

describe('CDItem', () => {
  const mockCD = { id: 1, title: 'Divide', artist: 'Ed Sheeran', year: 2017 };

  test('affiche correctement les informations du CD', () => {
    render(<CDItem cd={mockCD} onDelete={() => {}} />);
    expect(screen.getByText('Divide - Ed Sheeran (2017)')).toBeInTheDocument();
  });

  test('appelle onDelete avec le bon id au clic sur Supprimer', () => {
    const handleDelete = vi.fn();
    render(<CDItem cd={mockCD} onDelete={handleDelete} />);

    fireEvent.click(screen.getByText(/Supprimer/i));

    expect(handleDelete).toHaveBeenCalledWith(1);
    expect(handleDelete).toHaveBeenCalledTimes(1);
  });
});