import Component from '../../classes/Component.js'
import GSAP from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger.js'

export default class TextFadeIn extends Component {
    constructor ({ element }) {
        super({
            element
        })

        GSAP.registerPlugin(ScrollTrigger)

        this.createTrigger()
    }

    createTrigger () {
        this.timeline = GSAP.timeline({
            scrollTrigger: {
                trigger: this.element,
                start: 'top 60%',
                end: 'bottom 60%',
                // scrub: true,
                // markers: true,
                ease: 'none'
                // toggleActions: 'play reset play reset'
            }
        })

        this.timeline.fromTo(this.element, {
            autoAlpha: 0,
            y: '20'
            // duration: 2
            // ease: 'power1.in'
        }, {
            autoAlpha: 1,
            y: '0',
            duration: 2,
            ease: 'power1.in'
        })
    }
}
