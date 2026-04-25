import HomePage from './pages/HomePage';
import DetectionPage from './pages/DetectionPage';
import ResultsPage from './pages/ResultsPage';
import HistoryPage from './pages/HistoryPage';
import type { ReactNode } from 'react';

export interface RouteConfig {
  name: string;
  path: string;
  element: ReactNode;
  visible?: boolean;
  /** Accessible without login. Routes without this flag require authentication. Has no effect when RouteGuard is not in use. */
  public?: boolean;
}

export const routes: RouteConfig[] = [
  {
    name: 'Home',
    path: '/',
    element: <HomePage />,
    public: true,
  },
  {
    name: 'Detection',
    path: '/detection',
    element: <DetectionPage />,
    public: true,
  },
  {
    name: 'Results',
    path: '/results',
    element: <ResultsPage />,
    public: true,
  },
  {
    name: 'History',
    path: '/history',
    element: <HistoryPage />,
    public: true,
  }
];
