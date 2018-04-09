(function(){
  const isNodeContext = typeof module !== 'undefined' && typeof module.exports !== 'undefined'
  if (isNodeContext) {
    const Draggabilly = require('draggabilly')
  }

  const tabTemplate = `
    <div class="chrome-tab">
      <div class="chrome-tab-background">
        <svg version="1.1" xmlns="http://www.w3.org/2000/svg"><defs><symbol id="topleft" viewBox="0 0 214 29" ><path d="M14.3 0.1L214 0.1 214 29 0 29C0 29 12.2 2.6 13.2 1.1 14.3-0.4 14.3 0.1 14.3 0.1Z"/></symbol><symbol id="topright" viewBox="0 0 214 29"><use xlink:href="#topleft"/></symbol><clipPath id="crop"><rect class="mask" width="100%" height="100%" x="0"/></clipPath></defs><svg width="50%" height="100%" transfrom="scale(-1, 1)"><use xlink:href="#topleft" width="214" height="29" class="chrome-tab-background"/><use xlink:href="#topleft" width="214" height="29" class="chrome-tab-shadow"/></svg><g transform="scale(-1, 1)"><svg width="50%" height="100%" x="-100%" y="0"><use xlink:href="#topright" width="214" height="29" class="chrome-tab-background"/><use xlink:href="#topright" width="214" height="29" class="chrome-tab-shadow"/></svg></g></svg>
      </div>
      <div class="chrome-tab-favicon"><i></i></div>
      <div class="chrome-tab-title"></div>
      <div class="chrome-tab-close"></div>
    </div>
  `;
  const tabViewTemplate = `
    <div class="chrome-tab-view">
      
    </div>
  `;

  const defaultTapProperties = {
    title: '',
    favicon: '',
    icon: '',
    src: '',
    type: 'webview'
  }

  let instanceId = 0

  class ChromeTabs {
    constructor() {
      this.draggabillyInstances = []
    }

    init(el, elView, options) {
      this.el = el
      this.tabViewEl = elView
      this.options = options

      this.instanceId = instanceId
      this.el.setAttribute('data-chrome-tabs-instance-id', this.instanceId)
      instanceId += 1

      this.setupStyleEl()
      this.setupEvents()
      this.layoutTabs()
      this.fixZIndexes()
      this.setupDraggabilly()
    }

    emit(eventName, data) {
      this.el.dispatchEvent(new CustomEvent(eventName, { detail: data }))
    }

    setupStyleEl() {
      this.animationStyleEl = document.createElement('style')
      this.el.appendChild(this.animationStyleEl)
    }

    setupEvents() {
      window.addEventListener('resize', event => this.layoutTabs())

      //this.el.addEventListener('dblclick', event => this.addTab())

      this.el.addEventListener('click', ({target}) => {
        if (target.classList.contains('chrome-tab')) {
          this.setCurrentTab(target)
        } else if (target.classList.contains('chrome-tab-close')) {
          this.removeTab(target.parentNode)
        } else if (target.classList.contains('chrome-tab-title') || target.classList.contains('chrome-tab-favicon')) {
          this.setCurrentTab(target.parentNode)
        }
      })
      this.el.querySelector('.chrome-tabs-reload-tab').addEventListener('click', ({target}) => {
        const currentTab = this.el.querySelector('.chrome-tab-current');
        if (currentTab) {
          this.reloadView(currentTab);
        }
      });
      this.el.querySelector('.chrome-tabs-open-tab').addEventListener('click', ({target}) => {
        const currentTab = this.el.querySelector('.chrome-tab-current');
        if (currentTab) {
          this.openInBrowser(currentTab);
        }
      });
    }

    get tabEls() {
      return Array.prototype.slice.call(this.el.querySelectorAll('.chrome-tab'))
    }

    get tabContentEl() {
      return this.el.querySelector('.chrome-tabs-content')
    }

    get tabWidth() {
      const tabsContentWidth = this.tabContentEl.clientWidth - this.options.tabOverlapDistance
      const width = (tabsContentWidth / this.tabEls.length) + this.options.tabOverlapDistance
      return Math.max(this.options.minWidth, Math.min(this.options.maxWidth, width))
    }

    get tabEffectiveWidth() {
      return this.tabWidth - this.options.tabOverlapDistance
    }

    get tabPositions() {
      const tabEffectiveWidth = this.tabEffectiveWidth
      let left = 0
      let positions = []

      this.tabEls.forEach((tabEl, i) => {
        positions.push(left)
        left += tabEffectiveWidth
      })
      return positions
    }

    layoutTabs() {
      const tabWidth = this.tabWidth

      this.cleanUpPreviouslyDraggedTabs()
      this.tabEls.forEach((tabEl) => tabEl.style.width = tabWidth + 'px')
      requestAnimationFrame(() => {
        let styleHTML = ''
        this.tabPositions.forEach((left, i) => {
          styleHTML += `
            .chrome-tabs[data-chrome-tabs-instance-id="${ this.instanceId }"] .chrome-tab:nth-child(${ i + 1 }) {
              transform: translate3d(${ left }px, 0, 0)
            }
          `
        })
        this.animationStyleEl.innerHTML = styleHTML
      })
    }

    fixZIndexes() {
      const bottomBarEl = this.el.querySelector('.chrome-tabs-bottom-bar')
      const tabEls = this.tabEls

      tabEls.forEach((tabEl, i) => {
        let zIndex = tabEls.length - i

        if (tabEl.classList.contains('chrome-tab-current')) {
          bottomBarEl.style.zIndex = tabEls.length + 1
          zIndex = tabEls.length + 2
        }
        tabEl.style.zIndex = zIndex
      })
    }

    createNewTabEl() {
      const div = document.createElement('div');
      div.innerHTML = tabTemplate;
      return div.firstElementChild;
    }
    
    createNewTabViewEl() {
      const div = document.createElement('div');
      div.innerHTML = tabViewTemplate;
      return div.firstElementChild;
    }

    addTab(tabProperties) {
      const tabEl = this.createNewTabEl();
      const tabViewEl = this.createNewTabViewEl();

      tabEl.classList.add('chrome-tab-just-added')
      setTimeout(() => tabEl.classList.remove('chrome-tab-just-added'), 500)

      tabProperties = Object.assign({}, defaultTapProperties, tabProperties)
      
      if(tabProperties.type == "webview"){
        var webview = document.createElement("webview");
        webview.setAttribute('src', tabProperties.src);
        tabViewEl.append(webview);
      }
      
      this.tabContentEl.appendChild(tabEl);
      tabEl.view = tabViewEl;
      this.tabViewEl.appendChild(tabViewEl);
    
      this.updateTab(tabEl, tabProperties)
      this.emit('tabAdd', { tabEl })
      this.setCurrentTab(tabEl)
      this.layoutTabs()
      this.fixZIndexes()
      this.setupDraggabilly()
    }

    setCurrentTab(tabEl) {
      const currentTab = this.el.querySelector('.chrome-tab-current');
      if (currentTab) {
        currentTab.classList.remove('chrome-tab-current');
        currentTab.view.classList.remove('active');
      }
      tabEl.classList.add('chrome-tab-current');
      tabEl.view.classList.add('active');
      this.fixZIndexes();
      this.emit('activeTabChange', { tabEl });
    }

    removeTab(tabEl) {
      if (tabEl.classList.contains('chrome-tab-current')) {
        if (tabEl.previousElementSibling) {
          this.setCurrentTab(tabEl.previousElementSibling)
        } else if (tabEl.nextElementSibling) {
          this.setCurrentTab(tabEl.nextElementSibling)
        }
      }
      tabEl.view.remove();
      tabEl.parentNode.removeChild(tabEl);
      
      this.emit('tabRemove', { tabEl })
      this.layoutTabs()
      this.fixZIndexes()
      this.setupDraggabilly()
    }

    updateTab(tabEl, tabProperties) {
      tabEl.querySelector('.chrome-tab-title').textContent = tabProperties.title;
      tabEl.querySelector('.chrome-tab-favicon').style.backgroundImage = `url('${tabProperties.favicon}')`;
      tabEl.querySelector('.chrome-tab-favicon i').setAttribute('class',tabProperties.icon);
      this.updateTabView(tabEl.view, tabProperties);
      
    }
    
    updateTabView(tabEl, tabProperties){
      if(tabProperties.webview){
        
      }
    }
    
    cleanUpPreviouslyDraggedTabs() {
      this.tabEls.forEach((tabEl) => tabEl.classList.remove('chrome-tab-just-dragged'))
    }

    setupDraggabilly() {
      const tabEls = this.tabEls
      const tabEffectiveWidth = this.tabEffectiveWidth
      const tabPositions = this.tabPositions

      this.draggabillyInstances.forEach(draggabillyInstance => draggabillyInstance.destroy())

      tabEls.forEach((tabEl, originalIndex) => {
        const originalTabPositionX = tabPositions[originalIndex]
        const draggabillyInstance = new Draggabilly(tabEl, {
          axis: 'x',
          containment: this.tabContentEl
        })

        this.draggabillyInstances.push(draggabillyInstance)

        draggabillyInstance.on('dragStart', () => {
          this.cleanUpPreviouslyDraggedTabs()
          tabEl.classList.add('chrome-tab-currently-dragged')
          this.el.classList.add('chrome-tabs-sorting')
          this.fixZIndexes()
        })

        draggabillyInstance.on('dragEnd', () => {
          const finalTranslateX = parseFloat(tabEl.style.left, 10)
          tabEl.style.transform = `translate3d(0, 0, 0)`

          // Animate dragged tab back into its place
          requestAnimationFrame(() => {
            tabEl.style.left = '0'
            tabEl.style.transform = `translate3d(${ finalTranslateX }px, 0, 0)`

            requestAnimationFrame(() => {
              tabEl.classList.remove('chrome-tab-currently-dragged')
              this.el.classList.remove('chrome-tabs-sorting')

              this.setCurrentTab(tabEl)
              tabEl.classList.add('chrome-tab-just-dragged')

              requestAnimationFrame(() => {
                tabEl.style.transform = ''

                this.setupDraggabilly()
              })
            })
          })
        })

        draggabillyInstance.on('dragMove', (event, pointer, moveVector) => {
          // Current index be computed within the event since it can change during the dragMove
          const tabEls = this.tabEls
          const currentIndex = tabEls.indexOf(tabEl)

          const currentTabPositionX = originalTabPositionX + moveVector.x
          const destinationIndex = Math.max(0, Math.min(tabEls.length, Math.floor((currentTabPositionX + (tabEffectiveWidth / 2)) / tabEffectiveWidth)))

          if (currentIndex !== destinationIndex) {
            this.animateTabMove(tabEl, currentIndex, destinationIndex)
          }
        })
      })
    }

    animateTabMove(tabEl, originIndex, destinationIndex) {
      if (destinationIndex < originIndex) {
        tabEl.parentNode.insertBefore(tabEl, this.tabEls[destinationIndex])
      } else {
        tabEl.parentNode.insertBefore(tabEl, this.tabEls[destinationIndex + 1])
      }
    }
    
    reloadView(tabEl){
      tabEl.view.querySelector('webview').reload();
    }
    openInBrowser(tabEl){
        function getCommandLine() {
           switch (process.platform) { 
            case 'darwin' : return 'open';
            case 'win32' : return 'start';
            case 'win64' : return 'start';
            default : return 'xdg-open';
           }
        }
        var exec = require('child_process').exec;
        exec(getCommandLine() + ' ' + tabEl.view.querySelector('webview').src);
    }
  }

  if (isNodeContext) {
    module.exports = ChromeTabs
  } else {
    window.ChromeTabs = ChromeTabs
  }
})()
