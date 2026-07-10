import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import AddCD from '../AddCD';
import * as cdService from '../../services/cdService';

vi.mock('../../services/cdService');

describe('AddCD', () => {
  test('affiche le formulaire avec les 3 champs', () => {
    render(<AddCD onAdd={() => {}} />);
    expect(screen.getByPlaceholderText('Titre du CD')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Artiste')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Année')).toBeInTheDocument();
  });

  test('appelle addCD et onAdd lors de la soumission valide', async () => {
    cdService.addCD.mockResolvedValue({ id: 1, title: 'Test', artist: 'Artist', year: '2024' });
    const handleAdd = vi.fn();

    render(<AddCD onAdd={handleAdd} />);

    fireEvent.change(screen.getByPlaceholderText('Titre du CD'), { target: { value: 'Test' } });
    fireEvent.change(screen.getByPlaceholderText('Artiste'), { target: { value: 'Artist' } });
    fireEvent.change(screen.getByPlaceholderText('Année'), { target: { value: '2024' } });

    fireEvent.click(screen.getByText('Ajouter'));

    await waitFor(() => {
      expect(cdService.addCD).toHaveBeenCalledWith({ title: 'Test', artist: 'Artist', year: '2024' });
      expect(handleAdd).toHaveBeenCalledTimes(1);
    });
  });

  test('ne soumet pas si un champ est vide', () => {
    const handleAdd = vi.fn();
    render(<AddCD onAdd={handleAdd} />);

    fireEvent.change(screen.getByPlaceholderText('Titre du CD'), { target: { value: 'Test' } });
    fireEvent.click(screen.getByText('Ajouter'));

    expect(handleAdd).not.toHaveBeenCalled();
  });
});