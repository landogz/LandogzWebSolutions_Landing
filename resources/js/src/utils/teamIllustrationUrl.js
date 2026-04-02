/**
 * Deterministic illustrated avatar (DiceBear) when no photo is uploaded.
 * `variant` picks a distinct background tint so teammates don’t look identical at a glance.
 * @see https://www.dicebear.com/styles/notionists/
 */
const BG_HEX = ['c0aede', 'b6e3f4', 'ffd5dc', 'd1d4f9', 'fdba74', 'a7f3d0', 'fecdd3', 'bfdbfe'];

export function teamIllustrationUrl(name, variant = 0) {
    const seed = encodeURIComponent(String(name || 'member').trim() || 'member');
    const bg = BG_HEX[Math.abs(variant) % BG_HEX.length];
    return `https://api.dicebear.com/9.x/notionists/svg?seed=${seed}&backgroundColor=${bg}`;
}
