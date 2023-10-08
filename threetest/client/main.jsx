import React from 'react';
import { createRoot } from 'react-dom/client';
import { Meteor } from 'meteor/meteor';
import { App } from '/imports/ui/App';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { Terminal } from '../imports/meterm/Terminal';
import { Main } from '/imports/games/lastspaceship/ui/Main';
import { SignUp } from '/imports/games/lastspaceship/ui/SignUp';
import { AstroView } from '/imports/games/lastspaceship/ui/AstroView';
import { GalaxyView } from '/imports/games/lastspaceship/ui/GalaxyView';
import Row from 'react-bootstrap/esm/Row';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    children: [
      {
        index: true,
        element: <Row><h4>Hi there</h4></Row>,
      },
      {
        path: "/system",
        element: <AstroView />,
      },
      {
        path: "/signup",
        element: <SignUp />,
      },
      {
        path: "/galaxy/:id",
        element: <GalaxyView />,
      }
    ]
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
