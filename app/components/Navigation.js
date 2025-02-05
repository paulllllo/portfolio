import GSAP from 'gsap'

import Component from '../classes/Component.js'

export default class Navigation extends Component {
    constructor ({ template }) {
        super({
            element: '.nav_bar',
            elements: {
                items: '.nav_link_item',
                links: 'nav_list_link'
            }
        })

        this.onChange(template)
    }

    onChange (template) {
        if (template === 'about') {
            // GSAP.to(this.element, {
            //     color: null,
            //     duration: 1.5
            // })

            // console.log('first element', this.elements.items[0])

            GSAP.to(this.elements.items[1], {
                autoAlpha: 1,
                duration: 0.75,
                delay: 0.75
            })

            GSAP.to(this.elements.items[0], {
                autoAlpha: 0,
                duration: 0.75
            })
        } else {
            // GSAP.to(this.element, {
            //     color: null,
            //     duration: 1.5
            // })

            GSAP.to(this.elements.items[1], {
                autoAlpha: 0,
                duration: 0.75
            })

            GSAP.to(this.elements.items[0], {
                autoAlpha: 1,
                duration: 0.75,
                delay: 0.75
            })
        }
    }
}
