import { each, map } from 'lodash'
import GSAP from 'gsap'
import Prefix from 'prefix'
import AsyncLoad from './AsyncLoad.js'
import HeroSequence from '../animations/HeroSequence.js'
import MouseSteps from '../animations/MouseSteps.js'
import ScrollSteps from '../animations/ScrollSteps.js'
import FadeFacts from '../animations/FadeFacts.js'
// import AboutDescription from '../animations/AboutDescription.js'
import TextSlideUp from '../animations/Utils/TextSlideUp.js'
// import { mapEach } from 'utils/dom'

export default class Page {
    constructor ({ id, element, elements }) {
        this.id = id
        this.selector = element
        this.selectorChildren = {
            ...elements,
            lazyLoaders: '[data-src]',
            animationTextSlide: '[data-animation="textSlide"]'
        }

        this.transformPrefix = Prefix('transform')

        // console.log('this.elements.heroText 1', this.elements.heroText)
    }

    create () {
        this.element = document.querySelector(this.selector)
        this.elements = {}

        this.scroll = {
            target: 0,
            current: 0,
            last: 0,
            limit: 0
        }

        each(this.selectorChildren, (child, key) => {
            if (child instanceof window.HTMLElement || child instanceof window.NodeList || Array.isArray(child)) {
                this.elements[key] = child
            } else {
                // console.log('this.elements.heroText 1', this.selectorChildren.heroText)
                this.elements[key] = document.querySelectorAll(child)
                // console.log('this.elements.heroText 2', this.elements.heroText)

                if (this.elements[key].length === 0) {
                    this.elements[key] = null
                } else if (this.elements[key].length === 1) {
                    this.elements[key] = document.querySelector(child)
                }
                // if (this.element) {
                //     console.log('true')
                // }
            }
        })

        // console.log('this.elements', this.elements)

        // console.log('this.elements.wrapper', this.elements.wrapper)

        this.createAnimations()
        this.createAsyncLoad()
        this.onResize()
    }

    createAnimations () {
        // console.log('inside createAnimations: heroText', this.elements.heroText)
        // this.scrollAnimation = GSAP.timeline()
        this.animatedElements = []
        this.animatedSequences = []

        if (this.id === 'home') {
            this.heroSequence = new HeroSequence()

            this.animatedSequences.push(this.heroSequence)
        }

        if (this.id === 'about') {
            this.mouseSteps = new MouseSteps()
            this.scrollSteps = new ScrollSteps()
            this.fadeFacts = new FadeFacts()

            console.log('animationSlide', this.elements.animationTextSlide)

            this.animatedSequences.push(
                this.mouseSteps,
                this.scrollSteps,
                this.fadeFacts
            )
        }

        if (this.elements.animationTextSlide instanceof window.HTMLElement) {
            this.animateSlideUp = []
            this.animateSlideUp.push(new TextSlideUp({ element: this.elements.animationTextSlide }))
        } else if (this.elements.animationTextSlide) {
            this.animationSlideUp = map(this.elements.animationTextSlide, element => {
                console.log('elementSlide', element)
                return new TextSlideUp({ element })
            })
        }
    }

    createAsyncLoad () {
        // if (!this.lazyLoaders) return
        // console.log('lazyloaders ** ', this.elements.lazyLoaders)
        if (this.elements.lazyLoaders?.[Symbol.iterator]) {
            this.lazyLoaders = [...this.elements.lazyLoaders].map(element => {
                // console.log('in map, About to start', element)
                return new AsyncLoad({
                    element
                })
            })
        } else if (this.elements.lazyLoaders instanceof window.HTMLElement) {
            this.lazyLoaders = []
            const newLoader = new AsyncLoad({ element: this.elements.lazyLoaders })
            this.lazyLoaders.push(newLoader)
        }
        // console.log('lazyloaders after map', this.lazyLoaders)
    }

    show (animation) {
        // console.log('show')
        return new Promise(resolve => {
            if (animation) {
                this.animationIn = animation
            } else {
                this.animationIn = GSAP.timeline()

                this.animationIn.fromTo(this.element, {
                    autoAlpha: 0
                },
                {
                    autoAlpha: 1
                })
            }

            this.animationIn.call(_ => {
                this.addEventListeners()
                resolve()
            })
        })
    }

    hide () {
        return new Promise(resolve => {
            this.destroy()
            this.animationOut = GSAP.timeline()

            this.animationOut.to(this.element, {
                autoAlpha: 0,
                onComplete: resolve
            })
        })
    }

    // Events

    onWheel (event) {
        // const { deltaY } = event

        if (this.heroSequence && this.heroSequence.onWheel) {
            this.heroSequence.onWheel(event)
        }

        this.scroll.target += event.pixelY
        // console.log('limit', this.scroll.limit)
        // console.log('wheel')
    }

    onScroll (event) {
        // if (this.heroSequence && this.heroSequence.onWheel) {
        //     this.heroSequence.onWheel(event)
        // }
    }

    onMouseMove (event) {
        if (this.mouseSteps && this.mouseSteps.onMouseMove) {
            this.mouseSteps.onMouseMove(event)
        }
    }

    onResize () {
        if (this.element) {
            this.scroll.limit = this.element.clientHeight - window.innerHeight
        }

        // console.log('this.scroll.limit', this.scroll.limit)

        if (this.animationSlideUp) {
            // console.log('slideUP', this.animationSlideUp)
            this.animationSlideUp.forEach(item => {
                // console.log('InsideSlideLoop')
                item.onResize()
            })
        }

        // each(this.animatedElements, element => {
        //     element.onResize()
        // })
    }

    // Loop

    updateScroll () {
        // console.log('updating scroll')
        // console.log(this.scroll.target)
        this.scroll.target = GSAP.utils.clamp(0, this.scroll.limit, this.scroll.target)
        // console.log('scroll.target after', this.scroll.target)

        this.scroll.current = GSAP.utils.interpolate(this.scroll.current, this.scroll.target, 0.1)

        if (this.scroll.current < 0.1) {
            this.scroll.current = 0
        }

        // if (this.element) {
        //     this.scrollAnimation = GSAP.timeline()
        //     this.scrollAnimation.to(this.element, {
        //         // y: `-${this.scroll.current}px`
        //     })
        //     // window.scrollTo(0, this.scroll.current)
        //     // this.element.style[this.transformPrefix] = `translateY(-${this.scroll.current}px)`
        // }
    }

    // Listeners

    addEventListeners () {
        // window.addEventListener('mousewheel', this.onMouseWheelEvent)
        // console.log('listener Added')
    }

    removeEventListeners () {
        // window.removeEventListener('mousewheel', this.onMouseWheelEvent)
        if (this.heroSequence) {
            this.heroSequence.removeEventListeners()
        }
    }

    // Destroy

    destroy () {
        this.removeEventListeners()
    }
}
