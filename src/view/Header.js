import { $ } from '../helper/dom.js'
import { Template } from './Template.js'

export default class Header extends Template {
	constructor() {
		super()
		const rootNode = $('header')
		rootNode.insertAdjacentHTML('afterbegin', this.template())
	}

	template() {
		return `
	 <img src="images/note.png" alt="" />
	<h1>Shopping List</h1> 	
    `
	}
}
