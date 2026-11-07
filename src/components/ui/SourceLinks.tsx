import { getSource } from '../../data/cityData';

export default function SourceLinks({ ids }: { ids: string[] }) {
  return (
    <p className="mt-3 text-sm text-gray-700">
      Sources:{' '}
      {ids.map((id, index) => {
        const source = getSource(id);
        if (!source) return null;
        return (
          <span key={id}>
            {index > 0 && '; '}
            {source.url ? (
              <a href={source.url}>{source.title}</a>
            ) : (
              source.title
            )}
          </span>
        );
      })}
    </p>
  );
}
