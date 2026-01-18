document.addEventListener('DOMContentLoaded', () => {
	const enableBtn = document.getElementById('enableBtn');
	const unhideBtn = document.getElementById('unhideBtn');
	const closeBtn = document.getElementById('closeBtn');
	const status = document.getElementById('status');

	const handleInjection = async (type, button, successMessage) => {
		status.textContent = 'Requesting injection...';
		button.disabled = true;
		enableBtn.disabled = true;
		unhideBtn.disabled = true;

		try {
			const tabs = await chrome.tabs.query({
				active: true,
				currentWindow: true,
			});
			if (!tabs || !tabs[0]) {
				status.textContent = 'No active tab found.';
				button.disabled = false;
				enableBtn.disabled = false;
				unhideBtn.disabled = false;
				return;
			}

			const tab = tabs[0];
			const allFrames = true;

			chrome.runtime.sendMessage(
				{ type, tabId: tab.id, allFrames },
				(response) => {
					button.disabled = false;
					enableBtn.disabled = false;
					unhideBtn.disabled = false;
					if (chrome.runtime.lastError) {
						status.textContent = 'Error: ' + chrome.runtime.lastError.message;
						status.className = 'error';
						return;
					}
					if (response && response.success) {
						status.textContent = successMessage;
						status.className = 'success';
						setTimeout(() => window.close(), 700);
					} else {
						status.textContent =
							'Injection failed: ' + (response && response.error);
						status.className = 'error';
					}
				}
			);
		} catch (err) {
			status.textContent = 'Unexpected error: ' + err.message;
			status.className = 'error';
			button.disabled = false;
			enableBtn.disabled = false;
			unhideBtn.disabled = false;
		}
	};

	enableBtn.addEventListener('click', () => {
		handleInjection('inject', enableBtn, 'Fields enabled.');
	});

	unhideBtn.addEventListener('click', () => {
		handleInjection('inject-unhide', unhideBtn, 'Elements unhidden.');
	});

	closeBtn.addEventListener('click', () => window.close());
});
