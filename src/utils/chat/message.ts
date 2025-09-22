// Helper to parse latest 'proposed-quote' payload from messages (expects newest-first ordering)
// Returns the parsed JSON payload or null if none found.
export function getLatestProposedQuotePayload(msgs: Array<{ content?: string | null }>): any | null {
    if (!Array.isArray(msgs)) return null;
    for (const m of msgs) {
        const content = (m?.content || '').trim();
        if (!content.startsWith('{')) continue;
        try {
            const parsed = JSON.parse(content);
            if (parsed && parsed.type === 'proposed-quote') {
                return parsed;
            }
        } catch {}
    }
    return null;
}

// Convenience helper to retrieve the seq number from the latest proposed-quote payload
export function getLatestProposedQuoteSeq(msgs: Array<{ content?: string | null }>, defaultSeq: number = 1): number {
    const latest = getLatestProposedQuotePayload(msgs);
    const seq = Number((latest as any)?.quote?.workSteps?.[0]?.seq);
    return Number.isFinite(seq) && seq > 0 ? seq : defaultSeq;
}