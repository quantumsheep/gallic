import hljs from 'highlight.js'

import Polyfills from './Polyfills'

export default class Gallic extends EventTarget {
  static get MAIN_CLASS() { return 'gallic' }

  /**
   * @returns {string[][]}
   */
  static get PAIRS() {
    return [
      ['{', '}'],
      ['(', ')'],
      ['[', ']'],
      ['"', '"'],
    ]
  }

  /**
   * @param {string} c 
   * @return {string[]} 
   */
  static get_pair(c) {
    return this.PAIRS.find(pair => pair[0] === c)
  }

  /**
   * @param {HTMLTextAreaElement | string} target 
   */
  constructor(target) {
    super()

    /** @type {HTMLTextAreaElement} */
    this.textarea = (typeof target === 'string') ? document.querySelector(target) : target

    this.textarea.autocorrect = 'off'
    this.textarea.autocapitalize = 'off'
    this.textarea.spellcheck = false

    this.div = document.createElement('div')
    this.div.classList.add(Gallic.MAIN_CLASS)

    this.textarea.insertAdjacentElement('beforebegin', this.div)

    this.code = document.createElement('code')
    this.code.classList.add('tex')

    hljs.highlightBlock(this.code)

    this.pre = document.createElement('pre')
    this.pre.classList.add(Gallic.MAIN_CLASS)
    this.pre.appendChild(this.code)

    this.div.appendChild(this.textarea)
    this.div.appendChild(this.pre)

    this.update()

    this.textarea.addEventListener('keydown', (e) => {
      const pair = Gallic.get_pair(e.key)
      if (pair) {
        e.preventDefault()
        e.stopPropagation()

        const start = this.textarea.selectionStart
        const end = this.textarea.selectionEnd

        if (start === end) {
          let insert = e.key

          const possibilities = '\n\r})],. '

          if (!this.textarea.value[start] || possibilities.includes(this.textarea.value[start])) {
            insert += pair[1]
          }

          this.textarea.value = Polyfills.String.insert(this.textarea.value, start, insert)
          this.textarea.setSelectionRange(start + 1, end + 1)
        } else {
          this.textarea.value = Polyfills.String.insert(this.textarea.value, start, pair[0])
          this.textarea.value = Polyfills.String.insert(this.textarea.value, end + 1, pair[1])
          this.textarea.setSelectionRange(start + 1, end + 1, this.textarea.selectionDirection)
        }

        this.update()
      }
    })

    this.textarea.addEventListener('input', (e) => {
      this.update()
    })

    this.textarea.addEventListener('scroll', (e) => {
      this.code.scrollTo(this.textarea.scrollLeft, this.textarea.scrollTop)
    })

    this.textarea.addEventListener('select', () => this.update_selection())
  }

  update() {
    this.code.innerText = this.textarea.value
    this.update_selection()

    hljs.highlightBlock(this.code)

    this.dispatchEvent(new Event('input'));
  }

  update_selection() {
    this.selection = {
      start: this.textarea.selectionStart,
      end: this.textarea.selectionEnd,
      direction: this.textarea.selectionDirection,
      size: this.textarea.selectionEnd - this.textarea.selectionStart,
    }

    this.dispatchEvent(new Event('selection'));
  }
}
