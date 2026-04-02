import { teamIllustrationUrl } from '@/utils/teamIllustrationUrl';

/**
 * Uploaded photo, or a deterministic illustrated avatar (DiceBear) — not initials-only.
 * Pass `variant` (e.g. team index) for a different background tint per person.
 * `illustrationOnly` — always use DiceBear (keeps landing team visually consistent).
 */
export default function TeamAvatar({ name, photoUrl, size = 96, variant = 0, illustrationOnly = false }) {
    const px = `${size}px`;
    const src = illustrationOnly || !photoUrl ? teamIllustrationUrl(name, variant) : photoUrl;

    return (
        <img
            src={src}
            alt=""
            className="mx-auto rounded-full object-cover shadow-lg ring-2 ring-white/25 dark:ring-white/10"
            style={{ width: px, height: px }}
            loading="lazy"
            decoding="async"
        />
    );
}
