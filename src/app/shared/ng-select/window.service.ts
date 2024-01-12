import { Injectable } from '@angular/core';

@Injectable({providedIn: "root"})
export class WindowService {
    requestAnimationFrame(fn: FrameRequestCallback) {
        return window.requestAnimationFrame(fn);
    }

    setTimeout(handler: (...args: any[]) => void, timeout: number): number {
        return window.setTimeout(handler, timeout);
    }
}
