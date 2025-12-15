(() => {
	try {
		const selector = 'input,select,textarea,button,[contenteditable]';
		const elems = Array.from(document.querySelectorAll(selector));

		elems.forEach((el) => {
			// prefer removing attributes as well as clearing properties
			try {
				if (el.removeAttribute) {
					el.removeAttribute('disabled');
					el.removeAttribute('readonly');
				}
				// set properties in case the page reads them
				el.disabled = false;
				el.readOnly = false;

				// make contenteditable elements editable
				if (el.hasAttribute && el.hasAttribute('contenteditable')) {
					el.setAttribute('contenteditable', 'true');
				} else if (el instanceof HTMLElement) {
					// for other elements, allow editing if appropriate
					el.contentEditable = 'true';
				}
			} catch (e) {
				// ignore per-element errors but log in console for debugging
				console.debug('field-enable: element update failed', e, el);
			}
		});

		console.log('field-enable: enabled', elems.length, 'elements');
	} catch (err) {
		console.error('field-enable: unexpected error', err);
	}
})();
