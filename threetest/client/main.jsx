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
import { ReactorSetup } from '/imports/games/lastspaceship/ui/ReactorSetup';
import { ShipSetupNeu } from '/imports/games/lastspaceship/ui/ShipSetupNeu';
import { Main } from '/imports/games/lastspaceship/ui/Main';
import { SignUp } from '/imports/games/lastspaceship/ui/SignUp';
import { AstroView } from '/imports/games/lastspaceship/ui/AstroView';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    children: [
      {
        index: true,
        element: <AstroView />,
      },
      {
        path: "/signup",
        element: <SignUp />,
      }
    ]
  },
  {
    path: "/ship",
    element: <ShipSetup />,
  },
  {
    path: "/shipn",
    element: <ShipSetupNeu />,
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
