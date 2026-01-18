(() => {
	try {
		const allElements = document.querySelectorAll('*');

		allElements.forEach((el) => {
			try {
				const style = window.getComputedStyle(el);
				if (style.display === 'none') {
					el.style.display = 'block';
				}
				if (style.visibility === 'hidden') {
					el.style.visibility = 'visible';
				}
				if (parseFloat(style.opacity) === 0) {
					el.style.opacity = '1';
				}
			} catch (e) {
				console.debug('unhide: element update failed', e, el);
			}
		});

		console.log('unhide: processed', allElements.length, 'elements');
	} catch (err) {
		console.error('unhide: unexpected error', err);
	}
})();
