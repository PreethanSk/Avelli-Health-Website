"use client";

import { Component, type ReactNode } from "react";

/** Catches a failed WebGL start (or a crashed scene) and hands over to the SVG renders. */
export class CanvasBoundary extends Component<{ children: ReactNode; onError: () => void }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    this.props.onError();
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}
