/*
 * Copyright 2019 balena.io
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as _ from 'lodash';
import * as React from 'react';
import { v4 as uuidV4 } from 'uuid';

import * as flashState from '../../models/flash-state';
import * as selectionState from '../../models/selection-state';
import { Actions, store } from '../../models/store';
import * as analytics from '../../modules/analytics';
import { open as openExternal } from '../../os/open-external/services/open-external';
import { FlashAnother } from '../flash-another/flash-another';
import { FlashResults } from '../flash-results/flash-results';

import EtcherSvg from '../../../assets/etcher.svg';
import LoveSvg from '../../../assets/love.svg';
import BalenaSvg from '../../../assets/balena.svg';

function restart(goToMain: () => void) {
	selectionState.deselectAllDrives();
	analytics.logEvent('Restart');

	// Reset the flashing workflow uuid
	store.dispatch({
		type: Actions.SET_FLASHING_WORKFLOW_UUID,
		data: uuidV4(),
	});

	goToMain();
}

function formattedErrors() {
	const errors = _.map(
		_.get(flashState.getFlashResults(), ['results', 'errors']),
		(error) => {
			return `${error.device}: ${error.message || error.code}`;
		},
	);
	return errors.join('\n');
}

function FinishPage({ goToMain }: { goToMain: () => void }) {
	const results = flashState.getFlashResults().results || {};
	return (
		<div className="page-finish row around-xs">
			<div className="col-xs">
				<div className="box center">
					<FlashResults results={results} errors={formattedErrors()} />

					<FlashAnother
						onClick={() => {
							restart(goToMain);
						}}
					/>
				</div>

				<div className="box center">
					<div className="fallback-banner">
						<div className="caption-big">
							Thanks for using
							<span
								style={{ cursor: 'pointer' }}
								onClick={() =>
									openExternal(
										'https://balena.io/etcher?ref=etcher_offline_banner',
									)
								}
							>
								<EtcherSvg width="165px" style={{ margin: '0 10px' }} />
							</span>
						</div>
						<div className="caption-small fallback-footer">
							made with
							<LoveSvg height="20px" style={{ margin: '0 10px' }} />
							by
							<span
								style={{ cursor: 'pointer' }}
								onClick={() =>
									openExternal('https://balena.io?ref=etcher_success')
								}
							>
								<BalenaSvg height="20px" style={{ margin: '0 10px' }} />
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default FinishPage;
