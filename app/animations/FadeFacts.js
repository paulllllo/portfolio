import { each } from 'lodash'
import GSAP from 'gsap'
import Component from '../classes/Component.js'
// import GSAP from 'gsap'
// import TextFadeIn from './Utils/TextFadeIn.js'

export default class FadeFacts extends Component {
    constructor () {
        super({
            element: '.about_roadmap_info_wrapper',
            elements: {
                badge: '.about_roadmap_badge',
                texts: '.about_roadmap_info_text'
            }
        })

        this.createTrigger()
    }

    // createEffects () {
    //     // each(this.elements.badge, element => {
    //     //     this.fadeInBadge = new TextFadeIn({ element })
    //     // })

    //     each(this.elements.text, element => {
    //         this.fadeInText = new TextFadeIn({ element })
    //     })
    // }

    createTrigger () {
        each(this.elements.texts, element => {
            this.timeline = GSAP.timeline({
                scrollTrigger: {
                    trigger: element,
                    start: 'top 70%',
                    end: 'bottom top+=20%',
                    scrub: true,
                    // markers: true,
                    ease: 'none'
                    // toggleActions: 'play reset play reset'
                }
            })

            this.timeline.fromTo(element, {
                autoAlpha: 0,
                y: '20'
                // duration: 2
                // ease: 'power1.in'
            }, {
                autoAlpha: 1,
                y: '0',
                // duration: 1,
                ease: 'power1.in'
            })
        })
    }
}
