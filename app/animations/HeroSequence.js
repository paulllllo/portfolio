import GSAP from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger.js'
import { ScrollToPlugin } from 'gsap/dist/ScrollToPlugin.js'
import Component from '../classes/Component.js'
// import { each } from 'lodash'

export default class HeroSequence extends Component {
    constructor () {
        super({
            element: '.home_hero',
            elements: {
                heroText: '.home_hero_text_wrapper',
                globe: '.home_hero_media',
                blurDiv: '.home_hero_blur',
                works: '.home_works',
                worksWrapper: '.home_works_wrapper',
                workTitle: '.home_works_title_text',
                titleWrapper: '.home_works_title',
                feedbackSection: '.home_feedback'
            }
        })

        this.scrollSize = 0

        this.scroll = {
            target: 0,
            current: 0,
            lerp: 0.1
        }

        this.scrollDirection = 'down'

        GSAP.registerPlugin(ScrollTrigger, ScrollToPlugin)

        this.worksWidth = this.elements.works.scrollWidth
        this.worksTop = this.elements.worksWrapper.offsetTop
        this.worksHeight = this.elements.worksWrapper.offsetHeight

        this.projects = document.querySelectorAll('.home_works_slider')

        this.changeIndex(0)

        this.wrapperLeftPadding = Number(window.getComputedStyle(this.elements.worksWrapper).getPropertyValue('padding-left').replace('px', ''))

        this.slidesMargin = Number(window.getComputedStyle(this.projects[0]).getPropertyValue('margin-right').replace('px', ''))

        this.update()

        this.createTimeline()
        this.addScrollEvent()
        this.initFeedback()
    }

    createTimeline () {
        // const getScroll = () => {
        //     return -(this.worksWidth - window.innerWidth)
        // }

        this.timeline = GSAP.timeline({
            scrollTrigger: {
                // containerAnimation: this.scrollAnimation,
                trigger: this.elements.heroText,
                pin: this.element,
                // pinSpacing: false,
                start: 'top 20%',
                end: '100% 40%',
                scrub: true
                // markers: true
            }
        })
        // console.log(this.observer)

        // this.timeline.to(this.elements.blurDiv, {
        //     // backdropFilter: 'blur(5px)',
        //     // '-webkit-backdrop-filter': 'blur(5px)'
        //     opacity: 1
        //     // autoAlpha: 1
        //     // y: -300
        // })

        this.timeline.to(this.elements.heroText, {
            autoAlpha: 0
            // y: -300
        }, '<')

        this.timeline.fromTo(this.elements.globe, {
            // autoAlpha: 0,
            scale: 1.2
            // y: -300
        }, {
            scale: 1
        }, '<')

        // this.workScrollTimeline = GSAP.timeline()

        // const snapAmount = ((this.projects[0].getBoundingClientRect().width + this.slidesMargin) / (this.worksWidth - this.wrapperLeftPadding)) * 1

        // console.log('snapCalc', snapAmount.toFixed(2))

        // this.workScrollTimeline.to(this.elements.worksWrapper, {
        //     scrollTrigger: {
        //         trigger: this.elements.worksWrapper,
        //         pin: this.elements.works,
        //         start: 'top top',
        //         end: () => `+=${(getScroll()) * -1} bottom`,
        //         scrub: 1,
        //         markers: true,
        //         invalidateOnRefresh: true
        //     },
        //     // autoAlpha: 0.3
        //     ease: 'none',
        //     x: () => ((getScroll() - 500)),
        //     onUpdate: () => {
        //         const value = Math.round(GSAP.getProperty(this.elements.worksWrapper, 'x'))
        //         // console.log('Value of x: ', value)
        //         this.scrollX = value
        //     }
        // })

        // const projectsArray = GSAP.utils.toArray(this.projects)

        // each(projectsArray, project => {
        //     GSAP.to(project, {
        //         scrollTrigger: {
        //             trigger: project,
        //             start: 'left center',
        //             end: 'right center',
        //             scrub: false,
        //             markers: true,
        //             containerAnimation: this.workScroll,
        //             toggleActions: 'play reset play reset'
        //         },
        //         scale: 1.2,
        //         duration: 3
        //     })
        // })

        this.xSetter = GSAP.quickTo(this.elements.worksWrapper, 'x', { duration: 0.4, ease: 'power3' })
    }

    changeIndex (index) {
        if (index < 0) {
            this.index = 0
        } else {
            this.index = index
            // console.log('changed index', this.index)
        }

        this.projects.forEach((project, i) => {
            if (i === this.index) {
                project.classList.add('active')

                // this.elements.workTitle.textContent = project.getAttribute('data-name')
                const indexTitle = project.getAttribute('data-name')
                const swapTimeline = GSAP.timeline()
                const newIndexText = document.createElement('span')
                newIndexText.textContent = indexTitle
                newIndexText.classList.add('home_works_title_text')
                // newIndexText.style.transform = 'translateX(100%)'
                newIndexText.style.position = 'absolute'

                GSAP.fromTo(newIndexText, {
                    autoAlpha: '0',
                    y: '100%',
                    onComplete: () => {
                        this.elements.titleWrapper.appendChild(newIndexText)
                    }
                }, {
                    autoAlpha: '0.4',
                    y: 0,
                    duration: 1,
                    ease: 'power2'
                    // delay: 1
                })

                swapTimeline.to(this.elements.workTitle, {
                    y: '-100%',
                    onComplete: () => {
                        this.elements.titleWrapper.removeChild(this.elements.workTitle)
                        // this.elements.titleWrapper.appendChild(newIndexText)
                        this.elements.workTitle = newIndexText
                    }
                })

                // const projectBounds = project.getBoundingClientRect()
                // const offset = Math.floor(((window.innerWidth / 2) - (projectBounds.x + (projectBounds.width / 2))))

                // this.scroll.current += offset
                // this.scroll.target += offset

                // this.xSetter(this.scroll.current)

                // GSAP.to(this.elements.worksWrapper, {
                //     x: `+=${offset}`,
                //     duration: 2,
                //     ease: 'ease'
                // })
            } else {
                project.classList.remove('active')
            }
        })
    }

    update () {
        const index = Math.floor(Math.abs((this.scroll.current) / (this.projects[0].getBoundingClientRect().width + this.slidesMargin)))

        // console.log('scrollCurrent projrctWidth index', this.scroll.current, this.projects[0].getBoundingClientRect().width, index)

        const updateFunc = this.update.bind(this)

        this.frame = window.requestAnimationFrame(_ => {
            if (this.index !== index) {
                this.changeIndex(index)
                // console.log('index in animationFrame', index)
            }

            // console.log('scroll current', this.scroll.current)

            // const position = Math.abs((this.elements.worksWrapper.offsetTop - document.documentElement.scrollTop) - 100)

            // console.log('worksWrapper.offsetTop, document.scrollTop, position', this.elements.worksWrapper.offsetTop, document.documentElement.scrollTop, position)

            // console.log('worksHeight, worksTop', this.worksHeight, this.worksTop)

            if (window.scrollY >= this.worksTop && window.scrollY <= (this.worksTop + 100)) {
                if (!(this.elements.works.classList.contains('fixed'))) {
                    // this.elements.works.style.top = `${this.elements.works.offsetTop}px`
                    // console.log('{works style}', this.elements.works.style)
                    // console.log('{works offsetTop}', this.elements.works.offsetTop)
                    this.elements.works.classList.add('fixed')
                    document.body.classList.add('stop-scrolling')
                    // console.log(' After Fixed!! this.worksHeight, this.worksTop', this.worksHeight, this.worksTop)

                    // if (this.scrollDirection === 'down') {
                    //     this.scroll.current += 10
                    // } else if (this.scrollDirection === 'up') {
                    //     this.scroll.current -= 10
                    // }

                    // console.log('className added')
                }
            } else if (this.elements.works.classList.contains('fixed')) {
                // this.scroll.current = this.scroll.target = 0
                this.elements.works.classList.remove('fixed')
                // console.log('scrollY after removing fixed', window.scrollY)
                document.body.classList.remove('stop-scrolling')
                // console.log('className removed')
            }

            updateFunc()
        })
    }

    updateWorksScroll (scrollSize) {
        // console.log('scrollsize before', scrollSize)
        // console.log('target before', this.scroll.target)
        // console.log('current init', this.scroll.current, scrollSize)
        this.scroll.target += scrollSize

        if (this.scroll.target > (this.worksWidth - window.innerWidth)) {
            this.scroll.target = this.scroll.current = Math.floor(this.worksWidth - window.innerWidth)
            // console.log('remove fixed now')
            // console.log('scrollY', window.scrollY)
            if (this.elements.works.classList.contains('fixed')) {
                window.scrollTo(0, window.scrollY + 100)
                // console.log('scrollY after', window.scrollY)
            }
        } else if (this.scroll.target < 0) {
            this.scroll.target = this.scroll.current = 0
            // console.log('remove fixed now top')
            if (this.elements.works.classList.contains('fixed')) {
                window.scrollTo(0, window.scrollY - 100)
            }
        } else {
            // console.log('current before', this.scroll.current, this.scroll.target, this.scroll.lerp)
            this.scroll.current = GSAP.utils.interpolate(this.scroll.current, this.scroll.target, this.scroll.lerp)
            // this.scroll.current = this.scroll.target
        }

        // console.log('current after', this.scroll.current)

        this.xSetter(-this.scroll.current)

        // GSAP.to(this.elements.worksWrapper, {
        //     x: -(this.scroll.current)
        // })
    }

    onWheel (event) {
        // this.scrollSize = scrollSize
        // event.preventDefault()

        // console.log('offsetTop, scrollTop', this.elements.worksWrapper.offsetTop, document.documentElement.scrollTop)

        // console.log('event', event)

        if (event.pixelY > 0) {
            this.scrollDirection = 'down'
        } else {
            this.scrollDirection = 'up'
        }

        if (this.elements.works.classList.contains('fixed')) {
            this.updateWorksScroll(Math.floor(event.pixelY))
            // console.log('scroll current', this.scroll.current)
            // console.log('pixelY', Math.floor(event.pixelY))
        }
        // else {
        //     // window.scrollTo(0, window.scrollY + event.pixelY)
        //     window.scrollTo(window.scrollX, window.scrollY)
        // }
    }

    addScrollEvent () {
        const onSwipe = (callback) => {
            // const touchItem = el
            // const threshold = 150
            let startY
            let distY
            const handleSwipe = callback || ((distY) => {})

            this.touchStartHandler = (event) => {
                // console.log('touchStarted')
                const touchObj = event.changedTouches[0]
                distY = 0
                startY = touchObj.pageY
            }

            this.touchMoveHandler = (event) => {
                // console.log('touchMoved')
                const touchObj = event.changedTouches[0]
                distY = touchObj.pageY - startY
                startY = touchObj.pageY

                handleSwipe({ pixelY: -(distY) })
            }

            document.body.addEventListener('touchstart', this.touchStartHandler.bind(this), false)

            document.body.addEventListener('touchmove', this.touchMoveHandler.bind(this), false)
        }

        onSwipe(this.onWheel.bind(this))
    }

    removeEventListeners () {
        document.body.removeEventListener('touchstart', this.touchStartHandler.bind(this))
        document.body.addEventListener('touchmove', this.touchMoveHandler.bind(this))

        if (this.frame) {
            window.cancelAnimationFrame(this.frame)
            this.frame = undefined
        }
    }

    initFeedback () {
        const tl = GSAP.timeline({
            scrollTrigger: {
                trigger: this.elements.feedbackSection,
                start: 'top 20%',
                end: 'bottom 20%',
                toggleActions: 'play reverse play reverse'
                // markers: true
            }
        })
        const backTexts = GSAP.utils.toArray('.home_feedback_span')

        backTexts.forEach((text, index) => {
            if (((index + 1) % 2 === 0)) {
                tl.from(text, {
                    xPercent: 100,
                    autoAlpha: 0,
                    duration: 2,
                    ease: 'expo'
                }, 0)
            } else {
                tl.from(text, {
                    xPercent: -100,
                    autoAlpha: 0,
                    duration: 2,
                    ease: 'expo'
                }, 0)
            }
        })

        const commentsTl = GSAP.timeline({ repeat: -1 })
        const comments = GSAP.utils.toArray('.home_feedback_block')

        comments.forEach((comment, index) => {
            const currentComment = comments[(comments.length - 1) - index]
            commentsTl.from(currentComment, {
                autoAlpha: 0,
                y: 100
            }, '>')

            commentsTl.to(currentComment, {
                y: -100,
                autoAlpha: 0,
                delay: 3
            }, '>')
        })
    }

    animateIn () {}

    animateOut () {
        if (this.elements.works.classList.contains('fixed')) {
            this.elements.works.classList.remove('fixed')
            document.body.classList.remove('stop-scrolling')
        }
    }

    onResize () {
        GSAP.ticker.refresh()
    }
}
