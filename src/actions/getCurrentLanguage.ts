'use server'

import { cookies } from 'next/headers'

export async function getCurrentLanguage() {
    const cookieStore = await cookies()
    try {
        const data = cookieStore.get('current-language')?.value
        if (!data) return null

        const parsedData = JSON.parse(data)
        return parsedData.state.currentLang || null
    } catch {
        return null
    }
}