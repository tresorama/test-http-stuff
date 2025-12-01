(() => {

  const sectionEl = document.querySelector('#cookie-editor');
  if (!sectionEl) return;

  const API_ENDPOINTS = {
    formDocumentSet: '/cookie-editor/set',
    formFetchSet: '/cookie-editor/set',
    fetchCheck: '/cookie-editor/check',
  };

  initFormMethodSelector();
  initFormDocument();
  initFormFetch();
  initFetchCheck();

  function initFormMethodSelector() {

    const nodes = {
      formMethodSelect: sectionEl.querySelectorAll('select.changeFormMethod'),
    };
    if (nodes.length === 0) return;

    nodes.formMethodSelect.forEach(selectEl => {
      // on change "select form method" -> update form HTML atrtibute
      selectEl.addEventListener('change', () => {
        const formEl = selectEl.closest('form');
        if (!formEl) return;
        formEl.setAttribute('method', selectEl.value);
      });
    });
  }

  function initFormDocument() {
    const nodes = {
      form: sectionEl.querySelector('.formDocumentSet form'),
      formMethodSelect: sectionEl.querySelector('.formDocumentSet select.changeFormMethod'),
    };

    if (!nodes.form) return;

    nodes.form.setAttribute('action', API_ENDPOINTS.formDocumentSet);
  }

  function initFormFetch() {

    const nodes = {
      form: sectionEl.querySelector('.formFetchSet form'),
      result: sectionEl.querySelector('.formFetchSet .result'),
    };

    if (!nodes.form) return;

    // prevent default form submit behavior
    nodes.form.setAttribute('action', 'EMPTY');

    // on submit form -> call server with fetch
    nodes.form.addEventListener('submit', async (e) => {
      e.preventDefault();
      try {

        // get form values
        const formData = new FormData(nodes.form);

        // get fetch method from form
        const method = nodes.form.getAttribute('method');

        // prepare request based on method
        /** @type {Promise<Response>} */
        let fetchPromise;
        if (method === 'get') {
          const url = new URL(API_ENDPOINTS.formFetchSet, window.location.origin);
          for (const [key, value] of formData) {
            url.searchParams.set(key, value);
          }
          fetchPromise = fetch(url, { method });
        } else {
          const url = new URL(API_ENDPOINTS.formFetchSet, window.location.origin);
          fetchPromise = fetch(url, {
            method,
            body: formData,
          });
        }

        // do fetch
        const result = await fetchPromise;
        const json = await result.json();
        nodes.result.innerHTML = JSON.stringify({
          status: result.status,
          json
        }, null, 2);
      } catch (error) {
        const errorJson = {
          name: error instanceof Error ? error.name : 'unknown',
          message: error instanceof Error ? error.message : 'unknown',
          stack: error instanceof Error ? error.stack : 'unknown',
        };
        nodes.result.innerHTML = "Error " + JSON.stringify(errorJson, null, 2);
      }
    });

  }

  function initFetchCheck() {
    const nodes = {
      button: sectionEl.querySelector('.fetchCheck button'),
      result: sectionEl.querySelector('.fetchCheck .result'),
    };

    if (!nodes.button) return;
    if (!nodes.result) return;

    nodes.button.addEventListener('click', async () => {
      try {
        const result = await fetch(API_ENDPOINTS.fetchCheck);
        const json = await result.json();
        nodes.result.innerHTML = JSON.stringify(json, null, 2);
      } catch (error) {
        nodes.result.innerHTML = JSON.stringify(error, null, 2);
      }
    });
  }

})();
