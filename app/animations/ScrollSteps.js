import Component from '../classes/Component.js'
import GSAP from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger.js'

export default class ScrollSteps extends Component {
    constructor () {
        super({
            element: '.about',
            elements: {
                stepsDiv: '.about_roadmap_steps',
                container: '.about_roadmap'
            }
        })

        this.leftFoot = document.createElement('img')
        this.leftFoot.src = 'leftFoot.svg'

        this.rightFoot = document.createElement('img')
        this.rightFoot.src = 'rightFoot.svg'

        this.direction = 'centerLeft'

        this.foot = 'left'

        GSAP.registerPlugin(ScrollTrigger)

        this.createSteps()
        this.addTrigger()
    }

    createSteps () {
        this.offset = 0
        // this.center = false

        const calcPosition = (index) => {
            const breakPoint = 6
            const startNum = 10

            const position = {
                left: 0,
                rotation: 0,
                height: 0
            }

            const toggleDirection = () => {
                if (this.direction === 'right') {
                    this.direction = 'rightBack'
                } else if (this.direction === 'rightBack') {
                    this.direction = 'centerRight'
                } else if (this.direction === 'centerRight') {
                    this.direction = 'left'
                } else if (this.direction === 'left') {
                    this.direction = 'leftBack'
                } else if (this.direction === 'leftBack') {
                    this.direction = 'centerLeft'
                } else if (this.direction === 'centerLeft') {
                    this.direction = 'right'
                }
            }

            if (index < startNum) return position

            if ((index - startNum) % breakPoint === 0) {
                toggleDirection()
            }

            if (this.direction === 'rightBack') {
                position.left = +(2 * (breakPoint - ((index - startNum) % breakPoint)))
                position.rotation = 30
                position.height = -25
            } else if (this.direction === 'right') {
                position.left = +(2 * ((index - startNum) % breakPoint))
                position.rotation = -30
                position.height = -25
            } else if (this.direction === 'left') {
                position.left = -(2 * ((index - startNum) % breakPoint))
                position.rotation = 30
                position.height = -25
            } else if (this.direction === 'leftBack') {
                position.left = -(2 * (breakPoint - ((index - startNum) % breakPoint)))
                position.rotation = -30
                position.height = -25
            } else if (this.direction === 'centerRight' || this.direction === 'centerLeft') {
                position.left = 0
                position.rotation = 0
                position.height = 0
            }

            // console.log('position', position)

            return position
        }

        for (let i = 0; i < 100; i++) {
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
            foot.classList.add('footScroll')

            this.position = calcPosition(i)
            foot.style.left = `${this.position.left}%`
            foot.style.transform = this.foot !== 'left' ? `translateX(50%) rotate(${180 + this.position.rotation}deg)` : `translateX(-50%) rotate(${180 + this.position.rotation}deg)`
            foot.style.top = ((i * 50) + this.position.height) + 'px'
            // foot.style.transform = `rotate(${180}deg)`

            this.elements.stepsDiv.appendChild(foot)
        }
    }

    addTrigger () {
        this.feetArr = document.querySelectorAll('.footScroll')

        this.timeline = GSAP.timeline({
            scrollTrigger: {
                trigger: this.elements.container,
                start: 'top 40%',
                end: 'bottom bottom',
                scrub: 0.5,
                // markers: true,
                ease: 'none'
            }
        })

        this.feetArr.forEach((foot) => {
            this.timeline.to(foot, {
                opacity: 0.8,
                ease: 'none'
            })
        })
    }
}
