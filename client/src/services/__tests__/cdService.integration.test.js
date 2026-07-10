import { describe, test, expect } from 'vitest';
import { getCDs, addCD, deleteCD } from '../cdService';

describe("cdService - Intégration API réelle (Frontend <-> Backend)", () => {
  let createdId;

  test('addCD crée bien un CD via une vraie requête HTTP', async () => {
    const cd = await addCD({ title: 'Integration Test', artist: 'Test Artist', year: '2024' });
    expect(cd).toHaveProperty('id');
    createdId = cd.id;
  });

  test('getCDs renvoie le CD ajouté depuis la vraie base', async () => {
    const cds = await getCDs();
    const found = cds.find((cd) => cd.id === createdId);
    expect(found).toBeDefined();
    expect(found.title).toBe('Integration Test');
  });

  test('deleteCD supprime bien le CD via l\'API réelle', async () => {
    await deleteCD(createdId);
    const cds = await getCDs();
    const found = cds.find((cd) => cd.id === createdId);
    expect(found).toBeUndefined();
  });
});