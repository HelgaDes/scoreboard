// Make this file a module so `declare global` works.
export {}

// noinspection JSUnusedGlobalSymbols
declare global {
    /**
     * Payload that backend/socket will send for deposit overlay.
     * Kept global so both the dev helper and event typing stay consistent.
     */
    interface DepositPayload {
        id: string
        agentName: string
        amount: number
        currency?: string
    }

    /**
     * Dev helper available in the browser console:
     *   window.__deposit({ agentName?, amount?, currency? })
     */
        // noinspection JSUnusedGlobalSymbols
    interface Window {
        __deposit?: (o?: Partial<DepositPayload>) => void
    }

    /**
     * Nice typings for addEventListener('app:deposit', …)
     */
        // noinspection JSUnusedGlobalSymbols
    interface GlobalEventHandlersEventMap {
        'app:deposit': CustomEvent<Partial<DepositPayload>>
    }
}

