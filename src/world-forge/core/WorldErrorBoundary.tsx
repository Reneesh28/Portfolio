import { Component, type ErrorInfo, type ReactNode } from 'react';

interface WorldErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface WorldErrorBoundaryState {
  failed: boolean;
}

/**
 * Contains 3D failures (lost context, shader errors) so they never blank the page.
 * The DOM hero and the Classic link stay usable when the scene fails.
 */
export default class WorldErrorBoundary extends Component<WorldErrorBoundaryProps, WorldErrorBoundaryState> {
  state: WorldErrorBoundaryState = { failed: false };

  static getDerivedStateFromError(): WorldErrorBoundaryState {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('[World Forge] 3D scene failed to render.', error, info.componentStack);
  }

  render(): ReactNode {
    return this.state.failed ? (this.props.fallback ?? null) : this.props.children;
  }
}
