/**
 * Force a marketing headline to at most two lines for deliberate typography.
 * - Respects explicit newlines (merges extra lines into two).
 * - 3-word titles: "A B C" → ["A B", "C"] (e.g. Landogz Web | Solutions).
 */
export function splitHeadlineToTwoLines(headline) {
    const raw = String(headline ?? '').trim();
    if (!raw) {
        return ['Landogz Web', 'Solutions'];
    }

    if (raw.includes('\n')) {
        const parts = raw
            .split(/\n/)
            .map((l) => l.trim())
            .filter(Boolean);
        if (parts.length === 0) return ['Landogz Web', 'Solutions'];
        if (parts.length === 1) return splitHeadlineToTwoLines(parts[0]);
        if (parts.length === 2) return parts;
        return [parts.slice(0, -1).join(' '), parts[parts.length - 1]];
    }

    const words = raw.split(/\s+/).filter(Boolean);
    if (words.length <= 2) {
        return words.length === 2 ? [words.join(' ')] : [words[0] || raw];
    }
    if (words.length === 3) {
        return [`${words[0]} ${words[1]}`, words[2]];
    }
    const mid = Math.ceil(words.length / 2);
    return [words.slice(0, mid).join(' '), words.slice(mid).join(' ')];
}
