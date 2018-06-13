let bom = {
    queryString: {
      get: function(name) {
        let getAll = searchString => {
          let query = searchString.replace(/^\?/, '')
          let queryObject = {}
          let queryArray = query.split('&').filter(i => i).forEach((string, index) => {
            let parts = string.split('=')
            queryObject[parts[0]] = decodeURIComponent(parts[1])
          })
          return queryObject
        }
        if (arguments.length === 0) {
          return getAll(location.search)
        } else {
          return getAll(location.search)[name]
        }
      },
      set: function(name, value) {
        let set = (search, name, value) => {
          let regex = new RegExp(`(${encodeURIComponent(name)})=([^&]*)`, '')
          if (regex.test(search)) {
            return search.replace(regex, (match, c1, c2) => `${c1}=${encodeURIComponent(value)}`)
          } else {
            return search.replace(/&?$/, `&${encodeURIComponent(name)}=${encodeURIComponent(value)}`)
          }
        }
        if (arguments.length === 1 && typeof name === 'object' && name !== null) {
          let search = location.search
          for (let key in arguments[0]) {
            search = set(search, key, arguments[0][key])
          }
          location.search = search
        } else {
          location.search = set(location.search, name, value)
        }
      },
    },
  }
  
  let dom = {
    on: function(element, eventType, selector, fn) {
      element.addEventListener(eventType, e => {
        let el = e.target
        while (!el.matches(selector)) {
          if (element === el) {
            el = null
            break
          }
          el = el.parentNode
        }
        el && fn.call(el, e, el)
      })
      return element
    },
  
    onSwipe: function(element, fn) {
      let x0, y0
      element.addEventListener('touchstart', function(e) {
        x0 = e.touches[0].clientX
        y0 = e.touches[0].clientY
      })
      element.addEventListener('touchmove', function(e) {
        if (!x0 || !y0) {
          return
        }
        let xDiff = e.touches[0].clientX - x0
        let yDiff = e.touches[0].clientY - y0
  
        if (Math.abs(xDiff) > Math.abs(yDiff)) {
          if (xDiff > 0) {
            fn.call(element, e, 'right')
          } else {
            fn.call(element, e, 'left')
          }
        } else {
          if (yDiff > 0) {
            fn.call(element, e, 'down')
          } else {
            fn.call(element, e, 'up')
          }
        }
        x0 = undefined
        y0 = undefined
      })
    },
  
    index: function(element) {
      let siblings = element.parentNode.children
      for (let index = 0; index < siblings.length; index++) {
        if (siblings[index] === element) {
          return index
        }
      }
      return -1
    },
  
    uniqueClass: function(element, className) {
      dom.every(element.parentNode.children, el => {
        el.classList.remove(className)
      })
      element.classList.add(className)
      return element
    },
  
    every: function(nodeList, fn) {
      for (var i = 0; i < nodeList.length; i++) {
        fn.call(null, nodeList[i], i)
      }
      return nodeList
    },
  
    // http://stackoverflow.com/a/35385518/1262580
    create: function(html, children) {
      var template = document.createElement('template')
      template.innerHTML = html.trim()
      let node = template.content.firstChild
      if (children) {
        dom.append(node, children)
      }
      return node
    },
  
    append: function(parent, children) {
      if (children.length === undefined) {
        children = [children]
      }
      for (let i = 0; i < children.length; i++) {
        parent.appendChild(children[i])
      }
      return parent
    },
    prepend: function(parent, children) {
      if (children.length === undefined) {
        children = [children]
      }
      for (let i = children.length - 1; i >= 0; i--) {
        if (parent.firstChild) {
          parent.insertBefore(children[i], parent.firstChild)
        } else {
          parent.appendChild(children[i])
        }
      }
      return parent
    },
    removeChildren: function(element) {
      while (element.hasChildNodes()) {
        element.removeChild(element.lastChild)
      }
      return this
    },
  
    dispatchEvent: function(element, eventType, detail) {
      let event = new CustomEvent(eventType, { detail })
      element.dispatchEvent(event)
      return this
    },
  }

  class Pager {
    constructor(options) {
      let defaultOptions = {
        element: null,
        buttonCount: 10,
        currentPage: 1,
        totalPage: 1,
        pageQuery: '', // 'page'
        templates: {
          number: '<span>%page%</span>',
          prev: '<button class=prev>上一页</button>',
          next: '<button class=next>下一页</button>',
          first: '<button class=first>首页</button>',
          last: '<button class=last>末页</button>',
        },
      }
      this.options = Object.assign({}, defaultOptions, options)
      this.domRefs = {}
      this.currentPage = parseInt(this.options.currentPage, 10) || 1
      this.checkOptions().initHtml().bindEvents()
    }
    checkOptions() {
      if (!this.options.element) {
        throw new Error('element is required')
      }
      return this
    }
    bindEvents() {
      dom.on(this.options.element, 'click', 'ol[data-role="pageNumbers"]>li', (e, el) => {
        this.goToPage(parseInt(el.dataset.page, 10))
      })
      this.domRefs.first.addEventListener('click', () => {
        this.goToPage(1)
      })
      this.domRefs.last.addEventListener('click', () => {
        this.goToPage(this.options.totalPage)
      })
      this.domRefs.prev.addEventListener('click', () => {
        this.goToPage(this.currentPage - 1)
      })
      this.domRefs.next.addEventListener('click', () => {
        this.goToPage(this.currentPage + 1)
      })
    }
    goToPage(page) {
      if (!page || page > this.options.totalPage || page === this.currentPage) {
        return
      }
      if (this.options.pageQuery) {
        bom.queryString.set(this.options.pageQuery, page)
      }
      this.currentPage = page
      this.options.element.dispatchEvent(new CustomEvent('pageChange', { detail: { page } }))
      this.rerender()
    }
    rerender() {
      this._checkButtons()
      let newNumbers = this._createNumbers()
      let oldNumbers = this.domRefs.numbers
      oldNumbers.parentNode.replaceChild(newNumbers, oldNumbers)
      this.domRefs.numbers = newNumbers
    }
    initHtml() {
      let pager = (this.domRefs.pager = document.createElement('nav'))
      this.domRefs.first = dom.create(this.options.templates.first)
      this.domRefs.prev = dom.create(this.options.templates.prev)
      this.domRefs.next = dom.create(this.options.templates.next)
      this.domRefs.last = dom.create(this.options.templates.last)
      this._checkButtons()
      this.domRefs.numbers = this._createNumbers()
      pager.appendChild(this.domRefs.first)
      pager.appendChild(this.domRefs.prev)
      pager.appendChild(this.domRefs.numbers)
      pager.appendChild(this.domRefs.next)
      pager.appendChild(this.domRefs.last)
      this.options.element.appendChild(pager)
      return this
    }
    _checkButtons() {
      if (this.currentPage === 1) {
        this.domRefs.first.setAttribute('disabled', '')
        this.domRefs.prev.setAttribute('disabled', '')
      } else {
        this.domRefs.first.removeAttribute('disabled')
        this.domRefs.prev.removeAttribute('disabled')
      }
      if (this.currentPage === this.options.totalPage) {
        this.domRefs.next.setAttribute('disabled', '')
        this.domRefs.last.setAttribute('disabled', '')
      } else {
        this.domRefs.next.removeAttribute('disabled')
        this.domRefs.last.removeAttribute('disabled')
      }
    }
    _createNumbers() {
      let currentPage = this.currentPage
      let { buttonCount, totalPage } = this.options
      let start1 = Math.max(currentPage - Math.round(buttonCount / 2), 1)
      let end1 = Math.min(start1 + buttonCount - 1, totalPage)
      let end2 = Math.min(currentPage + Math.round(buttonCount / 2) - 1, totalPage)
      let start2 = Math.max(end2 - buttonCount + 1, 1)
      let start = Math.min(start1, start2)
      let end = Math.max(end1, end2)
  
      let ol = dom.create('<ol data-role="pageNumbers"></ol>')
      let numbers = []
      for (var i = start; i <= end; i++) {
        let li = dom.create(`<li data-page="${i}">${this.options.templates.number.replace('%page%', i)}</li>`)
        if (i === currentPage) {
          li.classList.add('current')
        }
        ol.appendChild(li)
      }
      return ol
    }
  }
  
  
  