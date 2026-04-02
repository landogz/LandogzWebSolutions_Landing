/** @param {Array<{ category?: string, name: string, proficiency?: number }>} skills */
export function groupSkillsByCategory(skills) {
    const map = new Map();
    for (const s of skills || []) {
        const cat = s.category?.trim() || 'General';
        if (!map.has(cat)) map.set(cat, []);
        map.get(cat).push(s);
    }
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
}
