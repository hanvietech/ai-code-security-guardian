// 데모 화면 동작. 문구는 HTML의 data 속성에서 읽어 한국어·영어 페이지가 같은 스크립트를 쓴다.
// 모든 변경은 이 페이지 안에서만 일어나며 서버로 보내는 것은 없다.
(function () {
  const SCREENS = ['home', 'project', 'finding', 'inbox', 'agents'];
  const DEFAULT_SCREEN = 'home';

  function currentScreen() {
    const name = location.hash.replace('#', '');
    return SCREENS.includes(name) ? name : DEFAULT_SCREEN;
  }

  function showScreen() {
    const name = currentScreen();
    document.querySelectorAll('[data-screen]').forEach((el) => {
      el.classList.toggle('is-active', el.dataset.screen === name);
    });
    document.querySelectorAll('[data-go]').forEach((el) => {
      if (el.dataset.go === name) el.setAttribute('aria-current', 'page');
      else el.removeAttribute('aria-current');
    });
  }

  // 표시된 숫자를 함께 바꾼다. keys는 공백으로 구분한 data-counter 값이다.
  function adjust(keys, delta) {
    keys.split(' ').filter(Boolean).forEach((key) => {
      document.querySelectorAll(`[data-counter="${key}"]`).forEach((el) => {
        const value = Math.max(0, Number(el.textContent) + delta);
        el.textContent = String(value);
        if (el.classList.contains('badge')) el.toggleAttribute('data-zero', value === 0);
      });
    });
  }

  function setDisp(id, text) {
    document.querySelectorAll(`[data-disp="${id}"]`).forEach((el) => { el.textContent = text; });
  }

  function format(template, values) {
    return template.replace(/\{(\w+)\}/g, (_, key) => String(values[key]));
  }

  // 탭: data-tab="묶음:이름" 버튼이 같은 묶음의 data-panel을 바꾼다.
  function selectTab(id) {
    const group = id.split(':')[0];
    document.querySelectorAll(`[data-tab^="${group}:"]`).forEach((tab) => {
      tab.setAttribute('aria-selected', String(tab.dataset.tab === id));
    });
    document.querySelectorAll(`[data-panel^="${group}:"]`).forEach((panel) => {
      panel.classList.toggle('is-active', panel.dataset.panel === id);
    });
  }

  function setupTabs() {
    document.querySelectorAll('[data-tab]').forEach((tab) => {
      tab.addEventListener('click', () => selectTab(tab.dataset.tab));
    });
    document.querySelectorAll('[data-open-tab]').forEach((link) => {
      link.addEventListener('click', () => selectTab(link.dataset.openTab));
    });
  }

  // 프로젝트 목록: 고른 행을 한 번에 처리 중으로 바꾸고 되돌린다.
  function setupBulk() {
    const box = document.querySelector('[data-bulk]');
    if (!box) return;
    const bar = box.querySelector('[data-bulk-bar]');
    const count = box.querySelector('[data-bulk-count]');
    const all = box.querySelector('[data-bulk-all]');
    const panel = box.closest('[data-panel]');
    const toast = panel.querySelector('[data-toast]');
    const toastText = panel.querySelector('[data-toast-text]');
    const undoBtn = panel.querySelector('[data-toast-undo]');
    const rowBoxes = () => [...box.querySelectorAll('tbody tr:not([hidden]) input[type="checkbox"]')];
    let last = [];

    function refresh() {
      const checked = rowBoxes().filter((c) => c.checked);
      bar.hidden = checked.length === 0;
      count.textContent = format(box.dataset.sel, { n: checked.length });
      all.checked = checked.length > 0 && checked.length === rowBoxes().length;
    }

    box.addEventListener('change', (event) => {
      if (event.target === all) rowBoxes().forEach((c) => { c.checked = all.checked; });
      refresh();
    });
    box.querySelector('[data-bulk-clear]').addEventListener('click', () => {
      rowBoxes().forEach((c) => { c.checked = false; });
      refresh();
    });
    box.querySelector('[data-bulk-apply]').addEventListener('click', () => {
      last = rowBoxes().filter((c) => c.checked).map((c) => {
        const disp = c.closest('tr').querySelector('[data-disp]');
        const before = disp.textContent;
        if (disp.dataset.disp) setDisp(disp.dataset.disp, box.dataset.to);
        else disp.textContent = box.dataset.to;
        c.checked = false;
        return { disp, before };
      });
      refresh();
      toastText.textContent = format(box.dataset.done, { n: last.length });
      undoBtn.hidden = false;
      toast.hidden = false;
    });
    undoBtn.addEventListener('click', () => {
      last.forEach(({ disp, before }) => {
        if (disp.dataset.disp) setDisp(disp.dataset.disp, before);
        else disp.textContent = before;
      });
      last = [];
      toastText.textContent = box.dataset.undone;
      undoBtn.hidden = true;
    });
  }

  // 상세의 처분 저장: 처분 표시를 바꾸고 이력에 한 줄을 더한다.
  function setupDisposition() {
    const form = document.querySelector('[data-disp-form]');
    if (!form) return;
    const acceptOnly = form.querySelector('[data-accept-only]');
    const err = form.querySelector('[data-err]');
    const saved = form.querySelector('[data-saved-msg]');
    const history = document.querySelector('[data-history]');

    form.addEventListener('change', () => {
      acceptOnly.hidden = form.elements.disp.value !== 'accept';
    });
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const choice = form.querySelector('input[name="disp"]:checked');
      const until = form.elements.until.value;
      const reason = form.elements.reason.value.trim();
      saved.textContent = '';
      if (choice.value === 'accept' && !until) {
        err.textContent = form.dataset.needDate;
        err.hidden = false;
        return;
      }
      if (!reason) {
        err.textContent = form.dataset.needReason;
        err.hidden = false;
        return;
      }
      err.hidden = true;
      const label = choice.value === 'accept' ? `${choice.dataset.label} · ${until}` : choice.dataset.label;
      setDisp(form.dataset.target, label);
      const item = document.createElement('li');
      const time = document.createElement('time');
      time.textContent = form.dataset.now;
      item.append(time, `${label} · ${reason}`);
      history.prepend(item);
      form.elements.reason.value = '';
      saved.textContent = form.dataset.saved;
    });
  }

  // 검토함: 결정하면 목록에서 빼고 숫자를 줄이며, 최근 결정에서 되돌린다.
  function setupInbox() {
    const recent = document.querySelector('[data-recent]');
    if (!recent) return;

    function refreshList(list) {
      const cards = [...list.querySelectorAll('[data-card]')];
      const done = cards.filter((c) => c.hidden).length;
      list.querySelector('[data-progress-text]').textContent = format(list.dataset.tpl, { total: cards.length, done });
      list.querySelector('[data-progress-bar]').style.width = `${(done / cards.length) * 100}%`;
      list.querySelector('[data-empty]').hidden = done < cards.length;
    }

    document.querySelectorAll('[data-decide]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const card = btn.closest('[data-card]');
        const list = btn.closest('[data-review-list]');
        const row = btn.dataset.hideRow && document.querySelector(`[data-row="${btn.dataset.hideRow}"]`);
        const dispId = btn.dataset.setDisp;
        const dispEl = dispId && document.querySelector(`[data-disp="${dispId}"]`);
        const before = dispEl ? dispEl.textContent : '';

        adjust(btn.dataset.keys, -1);
        card.hidden = true;
        if (row) row.hidden = true;
        if (dispId) setDisp(dispId, btn.dataset.label);
        refreshList(list);

        const item = document.createElement('li');
        const label = document.createElement('b');
        label.textContent = btn.dataset.label;
        const meta = document.createElement('span');
        meta.className = 'sub';
        meta.textContent = `${card.querySelector('[data-where]').textContent.split(' · ')[0]} · ${recent.dataset.now}`;
        const undo = document.createElement('button');
        undo.type = 'button';
        undo.className = 'btn';
        undo.textContent = recent.dataset.undo;
        item.append(label, ` · ${card.querySelector('[data-title]').textContent}`, meta, undo);
        recent.prepend(item);

        undo.addEventListener('click', () => {
          adjust(btn.dataset.keys, 1);
          card.hidden = false;
          if (row) row.hidden = false;
          if (dispId) setDisp(dispId, before);
          item.remove();
          refreshList(list);
        });
      });
    });

    document.querySelectorAll('[data-skip]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const card = btn.closest('[data-card]');
        const list = btn.closest('[data-review-list]');
        list.insertBefore(card, list.querySelector('[data-empty]'));
      });
    });
  }

  // 에이전트: 설치 명령을 만들고, PC 연결을 끊는다.
  function setupAgents() {
    const form = document.querySelector('[data-install-form]');
    if (!form) return;
    const card = form.closest('.card');
    const err = card.querySelector('[data-err]');
    const box = card.querySelector('[data-cmd-box]');
    const cmd = card.querySelector('[data-cmd]');
    const copy = card.querySelector('[data-copy-btn]');
    const list = document.querySelector('[data-pc-list]');

    function randomCode() {
      const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
      const bytes = new Uint8Array(12);
      crypto.getRandomValues(bytes);
      const text = [...bytes].map((b) => chars[b % chars.length]).join('');
      return text.match(/.{4}/g).join('-');
    }

    function cutRow(btn) {
      const row = btn.closest('tr');
      row.cells[4].textContent = '';
      const dot = document.createElement('span');
      dot.className = 'dot dot--off';
      row.cells[4].append(dot, list.dataset.cut);
      btn.disabled = true;
    }

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const label = form.elements.label.value.trim();
      if (!label) {
        err.textContent = form.dataset.needLabel;
        err.hidden = false;
        return;
      }
      err.hidden = true;
      cmd.textContent = `curl -fsSL ${form.dataset.server}/install.sh | sh -s -- --code ${randomCode()}`;
      copy.textContent = form.dataset.copy;
      box.hidden = false;

      const row = document.createElement('tr');
      [label, '—', '—', form.dataset.now].forEach((text) => {
        const cell = document.createElement('td');
        cell.textContent = text;
        row.append(cell);
      });
      const state = document.createElement('td');
      const dot = document.createElement('span');
      dot.className = 'dot dot--off';
      state.append(dot, form.dataset.pending);
      const action = document.createElement('td');
      const cut = document.createElement('button');
      cut.type = 'button';
      cut.className = 'btn btn--danger';
      cut.textContent = list.dataset.cutBtn;
      cut.setAttribute('data-cut-row', '');
      action.append(cut);
      row.append(state, action);
      list.prepend(row);
      form.reset();
    });

    copy.addEventListener('click', () => {
      if (!navigator.clipboard) return;
      navigator.clipboard.writeText(cmd.textContent).then(() => {
        copy.textContent = form.dataset.copied;
      }, () => {});
    });

    list.addEventListener('click', (event) => {
      const btn = event.target.closest('[data-cut-row]');
      if (btn) cutRow(btn);
    });
  }

  window.addEventListener('hashchange', () => {
    showScreen();
    const stage = document.querySelector('#stage');
    if (stage) stage.scrollIntoView({ block: 'start' });
  });
  setupTabs();
  setupBulk();
  setupDisposition();
  setupInbox();
  setupAgents();
  showScreen();
})();
