import Page from 'classes/page.js'
// import Button from '../../classes/Button.js'

export default class Home extends Page {
    constructor () {
        super({
            id: 'home',
            element: '.home',
            elements: {}
        })
    }

    destroy () {
        super.destroy()
        // this.link.removeEventListeners()
    }
}
