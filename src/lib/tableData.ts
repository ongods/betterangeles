import { Children, isValidElement, type ReactNode } from 'react';

type TableNodeProps = {
  children?: ReactNode;
  node?: { tagName?: string };
};

/** Read native tables and react-markdown's component nodes without flattening cells. */
export function tableData(children: ReactNode) {
  const headers: ReactNode[] = [];
  const rows: ReactNode[][] = [];
  const visit = (nodes: ReactNode, inHeader = false) => {
    Children.forEach(nodes, child => {
      if (!isValidElement<TableNodeProps>(child)) return;
      const tag =
        typeof child.type === 'string' ? child.type : child.props.node?.tagName;
      if (tag === 'tr') {
        const cells: ReactNode[] = [];
        Children.forEach(child.props.children, cell => {
          if (!isValidElement<TableNodeProps>(cell)) return;
          const cellTag =
            typeof cell.type === 'string'
              ? cell.type
              : cell.props.node?.tagName;
          if (cellTag === 'td' || cellTag === 'th') {
            cells.push(cell.props.children);
          }
        });
        if (inHeader) headers.push(...cells);
        else if (cells.length) rows.push(cells);
      } else {
        visit(child.props.children, inHeader || tag === 'thead');
      }
    });
  };
  visit(children);
  return { headers, rows };
}
