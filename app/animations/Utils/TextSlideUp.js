import Animation from '../../classes/Animation.js'
import GSAP from 'gsap'
import { calculate, split } from '../../utils/text.js'
// import { ScrollTrigger } from 'gsap/ScrollTrigger.js'

export default class TextSlideUp extends Animation {
    constructor ({ element }) {
        super({
            element
        })

        // GSAP.registerPlugin(ScrollTrigger)

        // console.log('this.element', this.element)

        this.timeline = GSAP.timeline()

        // this.createTrigger()
        this.createEffect()
        this.animateOut()
        this.onResize()
    }

    createEffect () {
        // this.lines = []
        split({ append: true, element: this.element })

        split({ append: true, element: this.element })

        this.spans = this.element.querySelectorAll('span span')

        // this.spans.forEach(span => {

        //     this.timeline.fromTo(span, {
        //         autoAlpha: 0,
        //         y: '10'
        //         // duration: 2
        //         // ease: 'power1.in'
        //     }, {
        //         autoAlpha: 1,
        //         y: '0',
        //         duration: 2,
        //         ease: 'power1.in'
        //     })
        // })
    }

    animateIn () {
        GSAP.set(this.element, {
            autoAlpha: 1
        })

        GSAP.fromTo(this.lines, {
            y: '100%'
        }, {
            delay: 0.5,
            duration: 1.5,
            y: '0%',
            ease: 'power2.inOut'
        })
    }

    animateOut () {
        GSAP.set(this.element, {
            autoAlpha: 0
        })
    }

    onResize () {
        this.lines = calculate(this.spans)
        console.log('lines', this.lines)
    }
}
