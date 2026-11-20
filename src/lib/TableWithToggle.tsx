/**
 * Table component with view toggle functionality
 */

import {
  type ReactNode,
  type HTMLAttributes,
  useState,
  useMemo,
  useEffect,
} from 'react';
import { Table, List } from 'lucide-react';
import { type TypographyTheme } from './typographyThemes';

import { tableData as readTableData } from './tableData';

// Custom Table Component with view toggle
export const TableWithToggle = ({
  children,
  theme,
  ...props
}: {
  children: ReactNode;
  theme: TypographyTheme;
} & HTMLAttributes<HTMLTableElement>) => {
  const [viewMode, setViewMode] = useState<'table' | 'list'>('table');
  const [isMobile, setIsMobile] = useState(false);

  // Set responsive default view
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 640); // sm breakpoint
    };

    // Check on mount
    checkScreenSize();

    // Listen for resize events
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Set default view based on screen size
  useEffect(() => {
    if (isMobile) {
      setViewMode('list');
    } else {
      setViewMode('table');
    }
  }, [isMobile]);

  const tableData = useMemo(() => readTableData(children), [children]);

  return (
    <div className="-mx-4 sm:mx-0 mb-6">
      {/* View Toggle Buttons */}
      <div className="flex justify-end mb-4 gap-2 px-4 sm:px-0">
        <button
          onClick={() => setViewMode('table')}
          className={`px-3 py-2 text-sm font-medium rounded-md transition-colors flex items-center gap-2 ${
            viewMode === 'table'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Table size={16} />
          Table
        </button>
        <button
          onClick={() => setViewMode('list')}
          className={`px-3 py-2 text-sm font-medium rounded-md transition-colors flex items-center gap-2 ${
            viewMode === 'list'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <List size={16} />
          List
        </button>
      </div>

      {viewMode === 'table' ? (
        <div className="overflow-x-auto">
          <table
            className={`${theme.components.table} sticky-table`}
            style={
              {
                '--first-col-width': '12rem',
              } as React.CSSProperties
            }
            {...props}
          >
            {children}
          </table>
        </div>
      ) : (
        <div className="space-y-4 px-4 sm:px-0">
          {tableData?.rows && tableData.rows.length > 0 ? (
            tableData.rows.map((row, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm mx-2 sm:mx-0"
              >
                <div className="grid gap-3">
                  {tableData.headers.map((header, headerIndex) => (
                    <div
                      key={headerIndex}
                      className="flex flex-col sm:flex-row sm:items-center"
                    >
                      <div className="font-semibold text-gray-800 text-sm mb-1 sm:mb-0 sm:w-1/3 sm:pr-4">
                        {header}:
                      </div>
                      <div className="text-gray-700 text-sm sm:w-2/3">
                        {row[headerIndex] ?? ''}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mx-2 sm:mx-0">
              <div className="text-yellow-800 text-sm">
                No table rows are available. Switch to Table to view the
                original content.
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
