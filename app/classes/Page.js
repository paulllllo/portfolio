import { each } from 'lodash'
import GSAP from 'gsap'
import Prefix from 'prefix'
import AsyncLoad from './AsyncLoad.js'
import HeroSequence from '../animations/HeroSequence.js'

export default class Page {
    constructor ({ id, element, elements }) {
        this.id = id
        this.selector = element
        this.selectorChildren = {
            ...elements,
            lazyLoaders: '[data-src]'
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

        console.log('this.elements', this.elements)

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

    // onWheel ({ pixelY }) {
    //     // const { deltaY } = event

    //     this.scroll.target += pixelY
    //     console.log('limit', this.scroll.limit)
    //     // console.log('wheel')
    // }

    onResize () {
        if (this.element) {
            this.scroll.limit = this.element.clientHeight - window.innerHeight
        }

        console.log('this.scroll.limit', this.scroll.limit)

        each(this.animatedElements, element => {
            element.onResize()
        })
    }

    // Loop

    // updateScroll () {
    //     // console.log('updating scroll')
    //     // console.log(this.scroll.target)
    //     this.scroll.target = GSAP.utils.clamp(0, this.scroll.limit, this.scroll.target)
    //     // console.log('scroll.target after', this.scroll.target)

    //     this.scroll.current = GSAP.utils.interpolate(this.scroll.current, this.scroll.target, 0.1)

    //     if (this.scroll.current < 0.1) {
    //         this.scroll.current = 0
    //     }

    //     if (this.element) {
    //         this.scrollAnimation = GSAP.timeline()
    //         this.scrollAnimation.to(this.element, {
    //             // y: `-${this.scroll.current}px`
    //         })
    //         // window.scrollTo(0, this.scroll.current)
    //         // this.element.style[this.transformPrefix] = `translateY(-${this.scroll.current}px)`
    //     }
    // }

    // Listeners

    addEventListeners () {
        // window.addEventListener('mousewheel', this.onMouseWheelEvent)
        // console.log('listener Added')
    }

    removeEventListeners () {
        // window.removeEventListener('mousewheel', this.onMouseWheelEvent)
    }

    // Destroy

    destroy () {
        this.removeEventListeners()
    }
}
