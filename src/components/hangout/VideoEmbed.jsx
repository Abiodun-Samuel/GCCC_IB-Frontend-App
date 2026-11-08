import { memo, useState } from 'react';
import { ExternalLink, Play } from 'lucide-react';
import { youtubeEmbedUrl, youtubeThumbnail, youtubeWatchUrl } from './hangoutUtils';

/**
 * A YouTube video that loads only when someone presses play, so the page
 * doesn't pull in YouTube for everyone. `video` is { id, title, channel }.
 */
const VideoEmbed = ({ video, className = '', captionClassName = '' }) => {
  const [playing, setPlaying] = useState(false);
  if (!video?.id) return null;

  return (
    <figure className={className}>
      <div className="relative aspect-video overflow-hidden rounded-2xl bg-black">
        {playing ? (
          <iframe
            src={youtubeEmbedUrl(video.id)}
            title={video.title}
            className="absolute inset-0 h-full w-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            className="group absolute inset-0 flex items-center justify-center focus-visible:outline-none"
          >
            {/* hqdefault is 4:3 with black bands; covering a 16:9 box trims only the bands. */}
            <img src={youtubeThumbnail(video.id)} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-90 transition-opacity group-hover:opacity-100" />
            <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-white/95 text-[#062c4f] shadow-sm transition-transform group-hover:scale-110 group-focus-visible:ring-4 group-focus-visible:ring-(--hg-sun)">
              <Play size={26} className="ml-1 fill-current" aria-hidden="true" />
            </span>
            <span className="sr-only">Play video: {video.title}</span>
          </button>
        )}
      </div>
      <figcaption className={`mt-3 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 text-sm text-(--hg-muted) ${captionClassName}`}>
        <span>
          <span className="font-semibold text-(--hg-ink)">{video.title}</span>
          {video.channel && <> by {video.channel}</>}
        </span>
        <a
          href={youtubeWatchUrl(video.id)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 font-semibold text-(--hg-brand) hover:underline"
        >
          Watch on YouTube
          <ExternalLink size={13} aria-hidden="true" />
        </a>
      </figcaption>
    </figure>
  );
};

export default memo(VideoEmbed);
