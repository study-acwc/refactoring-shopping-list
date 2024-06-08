import { $ } from '../helper/dom.js'
import { Template } from './Template.js'

export default class Bottom extends Template {
	constructor() {
		super()
		const rootNode = $('#bottom-section')
		rootNode.insertAdjacentHTML('afterbegin', this.template())
	}

	template() {
		return `
			<div class="filter">
				<input
					type="text"
					class="form-input-filter"
					id="filter"
					placeholder="Filter Items"
				/>
			</div>
			<ul id="item-list" class="items">
			</ul>
			<button id="clear" class="btn-clear">Clear All</button>
    `
	}
}
