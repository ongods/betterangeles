import { beforeEach, describe, expect, it, vi } from 'vitest';
import { loadMarkdownContent } from './markdownLoader';

const fixture = vi.hoisted(() => ({
  content: '',
  data: {} as Record<string, unknown>,
}));

vi.mock(
  '../../content/services/business/apply-for-sanitary-permit.md?raw',
  () => ({
    get default() {
      return fixture.content;
    },
  })
);
vi.mock('../../content/government/departments/executive.md?raw', () => ({
  get default() {
    return fixture.content;
  },
}));
vi.mock('../../content/government/departments/executive.json', () => ({
  get default() {
    return fixture.data;
  },
}));

beforeEach(() => {
  fixture.content = '';
  fixture.data = {};
});

describe('loadMarkdownContent', () => {
  it.each(['\n', '\r\n'])(
    'extracts the first paragraph with %j line endings and no companion JSON',
    async newline => {
      fixture.content = [
        '# Test service',
        '',
        '> A short description.',
        '',
        '## Requirements',
        '',
        'Bring the application form.',
      ].join(newline);

      const result = await loadMarkdownContent(
        'apply-for-sanitary-permit',
        'business',
        'service'
      );

      expect(result).toEqual({
        content: fixture.content,
        title: 'Test service',
        description: 'A short description.',
        data: {},
      });
    }
  );

  it('uses companion JSON before environment values and preserves empty and zero values', async () => {
    fixture.content =
      '# {GOVERNMENT_NAME}\n\n{MAYOR} / {HARNESS_FALLBACK} / {EMPTY} / {ZERO}';
    fixture.data = {
      GOVERNMENT_NAME: 'Test City',
      MAYOR: 'Companion mayor',
      EMPTY: '',
      ZERO: 0,
    };
    vi.stubEnv('VITE_MAYOR', 'Environment mayor');
    vi.stubEnv('VITE_EMPTY', 'Should not replace empty JSON values');
    vi.stubEnv('VITE_HARNESS_FALLBACK', 'Environment fallback');

    const result = await loadMarkdownContent(
      'executive',
      'departments',
      'government'
    );

    expect(result.title).toBe('Test City');
    expect(result.description).toBe(
      'Companion mayor / Environment fallback /  / 0'
    );
    expect(result.data).toEqual(fixture.data);
  });

  it('preserves unresolved tokens and handles markdown without metadata', async () => {
    fixture.content = 'Content with {HARNESS_UNKNOWN_TOKEN}.';
    vi.stubEnv('VITE_HARNESS_UNKNOWN_TOKEN', undefined);

    const result = await loadMarkdownContent(
      'executive',
      'departments',
      'government'
    );

    expect(result.content).toBe(fixture.content);
    expect(result.title).toBeUndefined();
    expect(result.description).toBeUndefined();
  });

  it('reports a missing document as a useful loader error', async () => {
    const errorLog = vi.spyOn(console, 'error').mockImplementation(() => {});

    await expect(
      loadMarkdownContent('harness-missing-page', 'business', 'service')
    ).rejects.toThrow('Document not found: harness-missing-page');
    expect(errorLog).toHaveBeenCalledOnce();
  });
});
