// 데모 화면 동작. 문구는 HTML의 data 속성에서 읽어 한국어·영어 페이지가 같은 스크립트를 쓴다.
(function () {
  const SCREENS = ['dashboard', 'project', 'finding', 'review'];
  const DEFAULT_SCREEN = 'dashboard';

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

  // 표시된 숫자를 하나씩 줄인다.
  function decrement(keys) {
    keys.split(' ').filter(Boolean).forEach((key) => {
      document.querySelectorAll(`[data-counter="${key}"]`).forEach((el) => {
        el.textContent = String(Math.max(0, Number(el.textContent) - 1));
      });
    });
  }

  function setupTabs() {
    const tabs = document.querySelectorAll('[data-tab]');
    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        tabs.forEach((t) => t.setAttribute('aria-selected', String(t === tab)));
        document.querySelectorAll('[data-panel]').forEach((p) => {
          p.classList.toggle('is-active', p.dataset.panel === tab.dataset.tab);
        });
      });
    });
  }

  function setupReview() {
    const form = document.querySelector('[data-review-form]');
    if (!form) return;
    const status = form.querySelector('[data-status]');
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const all = event.submitter && event.submitter.name === 'all';
      const rows = [...form.querySelectorAll('tr[data-fp]')].filter((row) => {
        return all || row.querySelector('input[type="checkbox"]').checked;
      });
      if (!rows.length) {
        status.textContent = form.dataset.none;
        return;
      }
      rows.forEach((row) => {
        decrement(row.dataset.dec);
        document.querySelectorAll(`[data-fp-item="${row.dataset.fp}"]`).forEach((el) => {
          el.hidden = true;
        });
        row.remove();
      });
      status.textContent = form.dataset.done.replace('{n}', rows.length);
      if (!form.querySelector('tr[data-fp]')) {
        form.querySelector('[data-empty]').hidden = false;
        form.querySelectorAll('button').forEach((b) => { b.disabled = true; });
      }
    });
  }

  window.addEventListener('hashchange', () => {
    showScreen();
    const stage = document.querySelector('#stage');
    if (stage) stage.scrollIntoView({ block: 'start' });
  });
  setupTabs();
  setupReview();
  showScreen();
})();
