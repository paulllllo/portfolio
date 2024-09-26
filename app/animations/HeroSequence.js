import GSAP from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger.js'
import Component from '../classes/Component.js'

export default class HeroSequence extends Component {
    constructor () {
        super({
            element: '.home_hero',
            elements: {
                heroText: '.home_hero_text_wrapper',
                globe: '.home_hero_media',
                blurDiv: '.home_hero_blur'
            }
        })

        this.createTimeline()
    }

    createTimeline () {
        // console.log('createTimeline')
        GSAP.registerPlugin(ScrollTrigger)
        this.timeline = GSAP.timeline({
            scrollTrigger: {
                // containerAnimation: this.scrollAnimation,
                trigger: this.elements.heroText,
                pin: this.element,
                // pinSpacing: false,
                start: 'top 20%',
                end: '100% 40%',
                scrub: true,
                markers: true
            }
        })
        // console.log(this.observer)

        this.timeline.to(this.elements.blurDiv, {
            // backdropFilter: 'blur(5px)',
            // '-webkit-backdrop-filter': 'blur(5px)'
            autoAlpha: 1
            // y: -300
        })

        this.timeline.to(this.elements.heroText, {
            autoAlpha: 0
            // y: -300
        }, '<')

        // this.timeline.to(this.elements.globe, {
        //     autoAlpha: 0,
        //     // scale: 2
        //     // y: -300
        // }, '<')
    }

    animateIn () {}

    animateOut () {}

    onResize () {}
}
