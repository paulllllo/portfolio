import Component from '../classes/Component.js'
import TextSlideUp from './Utils/TextSlideUp.js'

export default class AboutDescription extends Component {
    constructor () {
        super({
            element: '.about_main_content_bio',
            elements: {}
        })

        this.createEffect()
    }

    createEffect () {
        this.bioSlide = new TextSlideUp({ element: this.element })
    }
}
