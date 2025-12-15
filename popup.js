document.addEventListener('DOMContentLoaded', () => {
	const enableBtn = document.getElementById('enableBtn');
	const closeBtn = document.getElementById('closeBtn');
	const status = document.getElementById('status');

	enableBtn.addEventListener('click', async () => {
		status.textContent = 'Requesting injection...';
		enableBtn.disabled = true;

		try {
			const tabs = await chrome.tabs.query({
				active: true,
				currentWindow: true,
			});
			if (!tabs || !tabs[0]) {
				status.textContent = 'No active tab found.';
				enableBtn.disabled = false;
				return;
			}

			const tab = tabs[0];
			// default to applying to all frames (iframes)
			const allFrames = true;

			chrome.runtime.sendMessage(
				{ type: 'inject', tabId: tab.id, allFrames },
				(response) => {
					enableBtn.disabled = false;
					if (chrome.runtime.lastError) {
						status.textContent = 'Error: ' + chrome.runtime.lastError.message;
						status.className = 'error';
						return;
					}
					if (response && response.success) {
						status.textContent = 'Fields enabled.';
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
			enableBtn.disabled = false;
		}
	});

	closeBtn.addEventListener('click', () => window.close());
});
