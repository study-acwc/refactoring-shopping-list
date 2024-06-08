import { $ } from '../helper/dom.js'
import { Template } from './Template.js'

export default class Form extends Template {
	constructor() {
		super()
		const rootNode = $('#item-form')
		rootNode.insertAdjacentHTML('afterbegin', this.template())
	}

	template() {
		return `
				<div class="form-control">
					<input
						type="text"
						class="form-input"
						id="item-input"
						name="item"
						placeholder="Enter Item"
					/>
				</div>
				<div class="form-control">
					<button type="submit" class="btn">
						<i class="fa-solid fa-plus"></i> Add Item
					</button>
				</div>
    `
	}
}
