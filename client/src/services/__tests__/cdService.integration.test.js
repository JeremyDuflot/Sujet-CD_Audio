import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import { getCDs, addCD, deleteCD } from '../cdService';

describe("cdService - Intégration API réelle (Frontend <-> Backend)", () => {
  let createdId;

  beforeAll(async () => {
    const cd = await addCD({ title: 'Integration Test', artist: 'Test Artist', year: '2024' });
    createdId = cd.id;
  });

  afterAll(async () => {
    if (createdId) {
      try {
        await deleteCD(createdId);
      } catch {
      }
    }
  });

  test('addCD a bien créé un CD avec un id', () => {
    expect(createdId).toBeDefined();
    expect(typeof createdId).toBe('number');
  });

  test('getCDs renvoie le CD ajouté depuis la vraie base', async () => {
    const cds = await getCDs();
    const found = cds.find((cd) => cd.id === createdId);
    expect(found).toBeDefined();
    expect(found.title).toBe('Integration Test');
    expect(found.artist).toBe('Test Artist');
  });

  test('deleteCD supprime bien le CD via l\'API réelle', async () => {
    await deleteCD(createdId);
    const cds = await getCDs();
    const found = cds.find((cd) => cd.id === createdId);
    expect(found).toBeUndefined();
  });

  test('deleteCD rejette un id invalide sans appeler l\'API', async () => {
    await expect(deleteCD(-1)).rejects.toThrow('Identifiant de CD invalide');
  });
});