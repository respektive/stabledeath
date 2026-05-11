const FRAME_BUDGET_MS = 8;
const IDLE_TIMEOUT_MS = 500;

type QueuedTask = () => void;

const queue: QueuedTask[] = [];
let scheduled = false;

function runQueue(deadline?: IdleDeadline) {
    scheduled = false;

    const started = performance.now();

    while (queue.length > 0) {
        const hasIdleTime = deadline ? deadline.timeRemaining() > 4 : true;
        const hasFrameBudget = performance.now() - started < FRAME_BUDGET_MS;

        if (!hasIdleTime || !hasFrameBudget) {
            break;
        }

        queue.shift()?.();
    }

    if (queue.length > 0) {
        scheduleQueue();
    }
}

function scheduleQueue() {
    if (scheduled) {
        return;
    }

    scheduled = true;

    if (window.requestIdleCallback) {
        window.requestIdleCallback(runQueue, { timeout: IDLE_TIMEOUT_MS });
        return;
    }

    requestAnimationFrame(() => {
        setTimeout(runQueue, 0);
    });
}

export function queueRender(task: QueuedTask) {
    let cancelled = false;

    queue.push(() => {
        if (!cancelled) {
            task();
        }
    });
    scheduleQueue();

    return () => {
        cancelled = true;
    };
}
