import { memo } from 'react';

/** "Photo: Elizfred, CC BY-SA 4.0, Wikimedia Commons" with links, or "Photo: Pexels". */
const PhotoCredit = ({ credit, className = '' }) => {
  if (!credit) return null;
  if (!credit.author) return <span className={className}>Photo: {credit.source}</span>;

  return (
    <span className={className}>
      Photo:{' '}
      <a href={credit.url} target="_blank" rel="noopener noreferrer" className="underline-offset-2 hover:underline">
        {credit.author}
      </a>
      ,{' '}
      <a href={credit.licenseUrl} target="_blank" rel="noopener noreferrer license" className="underline-offset-2 hover:underline">
        {credit.license}
      </a>
      , {credit.source}
    </span>
  );
};

export default memo(PhotoCredit);
