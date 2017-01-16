// Copyright 2015, 2016 Parity Technologies (UK) Ltd.
// This file is part of Parity.

// Parity is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// Parity is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with Parity.  If not, see <http://www.gnu.org/licenses/>.
import thunk from 'redux-thunk';
import { routerMiddleware } from 'react-router-redux';

import ErrorsMiddleware from '~/ui/Errors/middleware';
import SettingsMiddleware from '~/views/Settings/middleware';
import SignerMiddleware from './providers/signerMiddleware';

import statusMiddleware from '~/views/Status/middleware';
import CertificationsMiddleware from './providers/certifications/middleware';
import ChainMiddleware from './providers/chainMiddleware';
import RegistryMiddleware from './providers/registry/middleware';

export default function (api, browserHistory) {
  const errors = new ErrorsMiddleware();
  const signer = new SignerMiddleware(api);
  const settings = new SettingsMiddleware();
  const status = statusMiddleware();
  const certifications = new CertificationsMiddleware();
  const routeMiddleware = routerMiddleware(browserHistory);
  const chain = new ChainMiddleware();
  const registry = new RegistryMiddleware(api);

  const middleware = [
    settings.toMiddleware(),
    signer.toMiddleware(),
    errors.toMiddleware(),
    certifications.toMiddleware(),
    chain.toMiddleware(),
    registry
  ];

  return middleware.concat(status, routeMiddleware, thunk);
}
