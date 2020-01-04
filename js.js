const PAGE_CONF_SET = 110
    const PAGE_CONF_GET = 111

    const SW_CONF_RETURN = 112
    const SW_CONF_CHANGE = 113

    const PAGE_READY_CHECK = 200
    const SW_READY = 201

    const sw = navigator.serviceWorker


    sw.addEventListener('message', onSwMsg)
    sendMsgToSw(PAGE_READY_CHECK)

    function popup(url) {
      const link = document.createElement('a')
      link.rel = 'noopener noreferrer'
      link.href = url
      link.click()
    }

    btnGo.onclick = function() {
      const text = txtURL.value.trim()
      if (text) {
        popup('https://js.mfss.cf/-----' + text)
      }
    }
    txtURL.onkeypress = function(e) {
      if (e.keyCode === 13) {
        btnGo.onclick()
      }
    }
    txtURL.setSelectionRange(0, txtURL.value.length)


    function onSwMsg(e) {
      const [cmd, msg] = e.data

      switch (cmd) {
      case SW_CONF_RETURN:
        conf = msg
        showConf()
        break

      case SW_CONF_CHANGE:
        conf = msg
        updateSelected()
        break

      case SW_READY:
        console.log('sw ready')
        showIcons()
        sendMsgToSw(PAGE_CONF_GET)
        break
      }
    }

    function onSwFail(err) {
      txtURL.value = err
    }

    selNode.onchange = function() {
      const item = this.options[this.selectedIndex]
      const node = item.value
      conf.node_default = node
      sendMsgToSw(PAGE_CONF_SET, conf)
    }

    function sendMsgToSw(cmd, val) {
      const ctl = sw.controller
      if (!ctl) {
        console.log('ctl is null')
        return
      }
      ctl.postMessage([cmd, val])
    }

    function showIcons() {
      list.innerHTML = SITE_LIST.map(v => {
        let [id, url] = v
        url = url || `www.${id}.com/`
        return `\
<a rel="noopener noreferrer" href=https://js.mfss.cf/-----https://${url}>\
<img width=128 height=128 src=__sys__/assets/ico/${id}.png></a>`
      }).join('')
    }

    function addNodeItem(id, text) {
      const optEl = document.createElement('option')
      optEl.id = '--' + id
      optEl.text = text
      optEl.value = id
      selNode.appendChild(optEl)
    }

    function updateSelected() {
      const id = conf.node_default
      const item = document.getElementById('--' + id)
      if (item) {
        item.selected = true
      } else {
        console.warn('unknown node:', id)
      }
    }

    function showConf() {
      for (const [id, node] of Object.entries(conf.node_map)) {
        if (!node.hidden) {
          addNodeItem(id, node.label)
        }
      }
      updateSelected()
    }