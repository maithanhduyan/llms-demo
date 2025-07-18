// Generated by Copilot
/**
 * Counter utility
 * @module counter
 */

/**
 * Setup a counter on a DOM element
 * @param element - The HTML element to attach the counter to
 */
export function setupCounter(element: HTMLElement): void {
    let counter = 0;
    const setCounter = (count: number) => {
        counter = count;
        element.innerHTML = `count is ${counter}`;
    };
    element.addEventListener('click', () => setCounter(counter + 1));
    setCounter(0);
}
