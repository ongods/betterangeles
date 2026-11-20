import { type ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { expect, it } from 'vitest';
import { tableData } from './tableData';

it('keeps linked text, empty cells and scope in their original columns', () => {
  const result = tableData([
    <thead key="head">
      <tr>
        <th>Office</th>
        <th>Contact</th>
        <th>Scope</th>
      </tr>
    </thead>,
    <tbody key="body">
      <tr>
        <td>ICTD</td>
        <td>
          045; <a href="mailto:ictd@example.test">Email</a>
        </td>
        <td>
          Portal support; <a href="https://example.test/source">Source</a>
        </td>
      </tr>
      <tr>
        <td>Other office</td>
        <td></td>
        <td>Not confirmed</td>
      </tr>
    </tbody>,
  ]);
  expect(result.headers).toEqual(['Office', 'Contact', 'Scope']);
  expect(result.rows).toHaveLength(2);
  expect(result.rows[0]).toHaveLength(3);
  expect(renderToStaticMarkup(<>{result.rows[0][1]}</>)).toContain(
    'href="mailto:ictd@example.test"'
  );
  const scope = renderToStaticMarkup(<>{result.rows[0][2]}</>);
  expect(scope).toContain('Portal support;');
  expect(scope).toContain('href="https://example.test/source"');
  expect(scope).not.toContain('mailto:');
  expect(result.rows[1][1]).toBeUndefined();
  expect(result.rows[1][2]).toBe('Not confirmed');
});

it('recognizes react-markdown node metadata independently of generated keys', () => {
  const MarkdownNode = ({
    children,
  }: {
    children?: ReactNode;
    node: { tagName: string };
  }) => <>{children}</>;
  const result = tableData(
    <MarkdownNode node={{ tagName: 'tbody' }}>
      <MarkdownNode node={{ tagName: 'tr' }}>
        <MarkdownNode node={{ tagName: 'td' }}>
          Contact <a href="https://example.test">source</a>
        </MarkdownNode>
        <MarkdownNode node={{ tagName: 'td' }}>Scope</MarkdownNode>
      </MarkdownNode>
    </MarkdownNode>
  );
  expect(result.rows[0]).toHaveLength(2);
  expect(renderToStaticMarkup(<>{result.rows[0][0]}</>)).toContain(
    'href="https://example.test"'
  );
  expect(result.rows[0][1]).toBe('Scope');
});
