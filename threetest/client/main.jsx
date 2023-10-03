import React from 'react';
import { createRoot } from 'react-dom/client';
import { Meteor } from 'meteor/meteor';
import { App } from '/imports/ui/App';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { Game } from '/imports/games/simtower/ui/Game';
import { GameAntares } from '/imports/games/antares/ui/GameAntares';
import { Terminal } from '../imports/meterm/Terminal';
import { GameLastSS } from '/imports/games/lastspaceship/ui/GameLastSS';
import { ShipSetup } from '/imports/games/lastspaceship/ui/ShipSetup';

const router = createBrowserRouter([
  {
    path: "/",
    element: <GameLastSS />,
  },
  {
    path: "/ship",
    element: <ShipSetup />,
  },
  {
    path: "/antares",
    element: <GameAntares />,
  },
  {
    path: "/planet",
    element: <App />
  },
  {
    path: "/term",
    element: <Terminal />
  }
]);

Meteor.startup(() => {
  const container = document.getElementById('react-target');
  const root = createRoot(container);
  root.render(<React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>);
});
