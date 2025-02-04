import Component from '../classes/Component.js'
import GSAP from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger.js'

// import leftFoot from './leftFoot.svg'

export default class MouseSteps extends Component {
    constructor () {
        super({
            element: '.about',
            elements: {
                mainSection: '.about_main'
            }
        })

        // this.addSteps()

        this.leftFoot = document.createElement('img')
        this.leftFoot.src = 'leftFoot.svg'

        this.rightFoot = document.createElement('img')
        this.rightFoot.src = 'rightFoot.svg'

        this.mousePos = {
            x: 0,
            y: 0
        }

        this.foot = 'left'

        GSAP.registerPlugin(ScrollTrigger)

        this.timer = window.setInterval(() => {
            this.enableSteps = true
        }, 200)
    }

    addSteps (event) {
        const toggleFeet = () => {
            const foot = this.foot === 'left' ? this.leftFoot.cloneNode(true) : this.rightFoot.cloneNode(true)

            if (this.foot === 'right') {
                this.foot = 'left'
            } else {
                this.foot = 'right'
            }

            return foot
        }

        const foot = toggleFeet()
        foot.classList.add('foot')
        foot.style.left = (event.pageX) + 'px'
        foot.style.top = (event.pageY) + 'px'

        this.element.appendChild(foot)

        const footBounds = foot.getBoundingClientRect()
        const footCenter = {
            x: footBounds.left + (footBounds.width / 2),
            y: footBounds.top + (footBounds.height / 2)
        }
        // console.log('eventX', event.pageX)

        const usedCenter = this.footCenter ? this.footCenter : footCenter
        const getAngle = () => {
            let angle = Math.atan2(event.pageX - usedCenter.x, -(event.pageY - usedCenter.y)) * (180 / Math.PI)

            if (!(this.foot === 'left')) {
                angle -= 20
            } else {
                angle += 20
            }

            this.staggerAnim = GSAP.timeline()
            // console.log('angle', angle)

            return angle
        }

        foot.style.transform = `rotate(${getAngle()}deg)`
        // foot.classList.add('show')

        const removeFoot = () => {
            // console.log('remove foot element', this.element)
            this.element.removeChild(foot)
        }

        if (this.staggerAnim) {
            if (this.footCenter) {
                this.staggerAnim.to(foot, {
                    autoAlpha: 0.01,
                    delay: 0,
                    // ease: 'ease',
                    ease: 'linear',
                    duration: 1,
                    stagger: 2
                })
            }

            // this.staggerAnim.to(foot, {
            //     autoAlpha: 0.01,
            //     delay: 1,
            //     ease: 'ease',
            //     duration: 2,
            //     stagger: 2
            // })

            this.staggerAnim.to(foot, {
                autoAlpha: 0,
                delay: 1,
                ease: 'power1.out',
                duration: 2,
                stagger: 2,
                onComplete: removeFoot
            })
        }

        this.footCenter = footCenter

        // setTimeout(() => {
        //     // if (this.staggerAnim) {
        //     GSAP.to(foot, {
        //         autoAlpha: 0,
        //         duration: 2,
        //         ease: 'expo.out',
        //         onComplete: removeFoot
        //     })
        //     // }
        // }, 3000)
    }

    onMouseMove (event) {
        if (this.enableSteps && this.elements.mainSection.contains(event.target)) {
            this.addSteps(event)
            this.enableSteps = false
        }
    }
}
