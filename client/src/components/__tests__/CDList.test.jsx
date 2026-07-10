import { render, screen, waitFor } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import CDList from '../CDList';
import * as cdService from '../../services/cdService';

vi.mock('../../services/cdService');

describe('CDList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('affiche "Aucun CD disponible" quand la liste est vide', async () => {
    cdService.getCDs.mockResolvedValue([]);

    render(<CDList />);

    expect(await screen.findByText('Aucun CD disponible')).toBeInTheDocument();
  });

  test('affiche la liste des CD récupérés', async () => {
    cdService.getCDs.mockResolvedValue([
      { id: 1, title: 'Divide', artist: 'Ed Sheeran', year: 2017 },
      { id: 2, title: 'Thriller', artist: 'Michael Jackson', year: 1982 },
    ]);

    render(<CDList />);

    expect(await screen.findByText('Divide - Ed Sheeran (2017)')).toBeInTheDocument();
    expect(screen.getByText('Thriller - Michael Jackson (1982)')).toBeInTheDocument();
  });

  test('appelle deleteCD et rafraîchit la liste au clic sur Supprimer', async () => {
    cdService.getCDs
      .mockResolvedValueOnce([{ id: 1, title: 'Divide', artist: 'Ed Sheeran', year: 2017 }])
      .mockResolvedValueOnce([]);
    cdService.deleteCD.mockResolvedValue();

    render(<CDList />);

    const deleteButton = await screen.findByText(/Supprimer/i);
    deleteButton.click();

    await waitFor(() => {
      expect(cdService.deleteCD).toHaveBeenCalledWith(1);
    });

    expect(await screen.findByText('Aucun CD disponible')).toBeInTheDocument();
    expect(cdService.getCDs).toHaveBeenCalledTimes(2); // appel initial + refresh après delete
  });
});