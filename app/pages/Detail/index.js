import Page from 'classes/page.js'

export default class Detail extends Page {
    constructor () {
        super({
            id: 'detail',
            element: '.details',
            elements: {
                wrapper: '.details_wrapper'
            }
        })
    }

    destroy () {
        super.destroy()
        // this.link.removeEventListeners()
    }
}
