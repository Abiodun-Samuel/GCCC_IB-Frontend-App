import { memo, useCallback, useEffect, useState } from 'react';
import { Copy, Download, Loader2, Share2 } from 'lucide-react';
import { Toast } from '@/lib/toastify';
import { createShareImage, shareCard, SHARE_FLYER, SHARE_SIZE } from './shareImage';
import { DISPLAY } from './HangoutTheme';
import { HANGOUT } from './hangoutContent';
import { CARD, SECONDARY_BUTTON } from './hangoutStyles';
import { downloadBlob, hangoutPageUrl, inviteMessage, slugify } from './hangoutUtils';

const SAVED_MESSAGES = {
  'saved-and-copied': 'Image saved and invite copied. Attach the image in your chat and paste the message with it.',
  saved: 'Image saved. Attach it in your chat with the hangout link.',
};

/**
 * After registering: the member's own hangout card. "Share" sends the image
 * with the invite message and hangout link together; Download and Copy link
 * are there for anything else.
 *
 * The image (or, if drawing it fails, the general flyer) is ready as a Blob
 * before the button is enabled, so sharing starts straight from the tap:
 * some phones refuse a share that waits on a download first.
 */
const ShareCard = ({ name, game, startsAt }) => {
  const [image, setImage] = useState({ status: 'drawing', blob: null, url: null });

  useEffect(() => {
    let cancelled = false;
    let objectUrl = null;
    const show = (status, blob) => {
      if (cancelled) return;
      objectUrl = URL.createObjectURL(blob);
      setImage({ status, blob, url: objectUrl });
    };

    createShareImage({ name, game })
      .then((blob) => show('ready', blob))
      .catch(() => fetch(SHARE_FLYER)
        .then((response) => response.blob())
        .then((blob) => show('fallback', blob))
        .catch(() => !cancelled && setImage({ status: 'failed', blob: null, url: SHARE_FLYER })));

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [name, game]);

  const message = inviteMessage(startsAt, game);
  const filename = `${slugify(`gccc-hangout-2026-${name}`)}.jpg`;
  const canUseImage = !!image.blob;

  const share = useCallback(async () => {
    try {
      const outcome = await shareCard({ blob: image.blob, filename, title: HANGOUT.title, text: message });
      if (outcome !== 'shared') Toast.success(SAVED_MESSAGES[outcome]);
    } catch (error) {
      if (error?.name === 'AbortError') return;
      Toast.error("Couldn't share right now. Use Download and Copy link instead.");
    }
  }, [filename, image.blob, message]);

  const download = useCallback(() => downloadBlob(image.blob, filename), [filename, image.blob]);

  const copyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(hangoutPageUrl());
      Toast.success('Link copied. Paste it in your church group chats.');
    } catch {
      Toast.error("Couldn't copy the link. Copy it from your browser's address bar instead.");
    }
  }, []);

  return (
    <aside aria-labelledby="share-title" className={`${CARD} p-5 sm:p-6`}>
      <h3 id="share-title" className={`${DISPLAY} text-2xl font-extrabold text-(--hg-ink)`}>Invite other members</h3>
      <p className="mt-1.5 text-base text-(--hg-muted)">
        Share your hangout card on WhatsApp or your status so more of the church family come along.
      </p>

      <div className="mt-5 overflow-hidden rounded-2xl bg-(--hg-deep)" style={{ aspectRatio: `${SHARE_SIZE.width} / ${SHARE_SIZE.height}` }}>
        {image.status === 'drawing' ? (
          <div className="flex h-full items-center justify-center text-white/80">
            <Loader2 size={28} className="animate-spin" aria-hidden="true" />
            <span className="sr-only">Making your hangout card</span>
          </div>
        ) : (
          <img
            src={image.url}
            alt={image.status === 'ready'
              ? `Hangout card: ${name} is going to the GCCC IB Hangout 2026, playing ${game}`
              : 'GCCC IB Hangout 2026 flyer: Saturday 28 November 2026, 10:00 AM, Agodi Gardens, Ibadan'}
            width={SHARE_SIZE.width}
            height={SHARE_SIZE.height}
            className="block h-auto w-full"
          />
        )}
      </div>

      <button
        type="button"
        onClick={share}
        disabled={!canUseImage}
        aria-describedby="share-hint"
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-(--hg-action) px-5 py-3.5 text-base font-bold text-(--hg-on-action) transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-(--hg-brand)/40 disabled:opacity-60"
      >
        <Share2 size={18} aria-hidden="true" />
        Share image
      </button>
      <p id="share-hint" className="mt-2 text-center text-sm text-(--hg-muted)">
        Sends your card with an invite message and the hangout link.
      </p>

      <div className="mt-4 grid grid-cols-2 gap-2.5">
        <button type="button" onClick={download} disabled={!canUseImage} className={`${SECONDARY_BUTTON} px-4`}>
          <Download size={16} aria-hidden="true" />
          Download
        </button>
        <button type="button" onClick={copyLink} className={`${SECONDARY_BUTTON} px-4`}>
          <Copy size={16} aria-hidden="true" />
          Copy link
        </button>
      </div>
    </aside>
  );
};

export default memo(ShareCard);
