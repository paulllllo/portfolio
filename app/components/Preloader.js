import Component from 'classes/Component.js'
import GSAP from 'gsap'
// import { Texture } from 'ogl'
// import { each } from 'lodash'
// import { split } from '../utils/text.js'

export default class Preloader extends Component {
    constructor () {
        super({
            element: '.preloader',
            elements: {
                numberText: '.preloader_number_text',
                images: document.querySelectorAll('img')
            }
        })
        this.length = 0
        // this.canvas = canvas
        window.TEXTURES = {}

        // split({
        //     element: this.elements.title,
        //     expression: '<br>'
        // })

        // split({
        //     element: this.elements.title,
        //     expression: '<br>'
        // })

        // this.elements.titleSpans = this.elements.title.querySelectorAll('span span')
        // console.log('titleSpans', this.elements.titleSpans)

        this.createLoader()
    }

    createLoader () {
        if (window.ASSETS.length === 0) {
            return this.onLoaded()
        }

        this.seconds = 0

        this.counter = setInterval(() => {
            this.seconds += 1
        }, 1000)

        window.ASSETS.forEach(image => {
            // const texture = new Texture(this.canvas.gl, {
            //     generateMipmaps: false
            // })

            // console.log('image inside createloader ** ', image)

            const media = new window.Image()
            media.crossOrigin = 'anonymous'
            media.src = image

            media.onload = _ => {
                // texture.image = media

                this.onAssetLoaded()
            }

            // window.TEXTURES[image] = texture
        })
    }

    onAssetLoaded () {
        this.length += 1

        const percent = this.length / window.ASSETS.length

        this.elements.numberText.innerHTML = `${Math.round(percent * 100)}%`
        // console.log(Math.round(percent * 100))
        if (percent === 1 || window.ASSETS.length === 0) {
            if (!(this.seconds < 5)) {
                console.log('first, seconds')
                this.onLoaded()
            } else {
                setTimeout(() => {
                    this.onLoaded()
                }, 5000)
            }
        }
    }

    onLoaded () {
        clearInterval(this.counter)
        return new Promise(resolve => {
            this.animateOut = GSAP.timeline({
                delay: 2
            })

            // this.animateOut.to(this.elements.titleSpans, {
            //     duration: 1.5,
            //     ease: 'expo.out',
            //     stagger: 0.1,
            //     y: '100%'
            // })

            this.animateOut.to(this.elements.numberText, {
                duration: 1.5,
                ease: 'expo.out',
                stagger: 0.1,
                y: '100%'
            }, '-=1.4')

            this.animateOut.to(this.element, {
                duration: 1.5,
                ease: 'expo.out',
                scaleY: 0,
                transformOrigin: '0 0'
            }, '-=1')

            this.animateOut.call(_ => {
                this.emit('completed')
                console.log('completed preloader')
            })
        })
    }

    destroy () {
        // console.log('destroy', this.element)
        this.element.parentNode.removeChild(this.element)
    }
}
