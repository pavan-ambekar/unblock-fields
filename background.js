// MV3 service worker background script.
// Receives injection requests from the popup (message) and injects `autofill.js`.

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	if (!message || message.type !== 'inject') return;

	const tabId = message.tabId;
	const allFrames = !!message.allFrames;

	if (!tabId) {
		console.error('No tabId provided for injection');
		sendResponse({ success: false, error: 'no_tabId' });
		return;
	}

	chrome.scripting
		.executeScript({
			target: { tabId, allFrames },
			files: ['autofill.js'],
		})
		.then(() => {
			console.log('autofill.js injected into tab', tabId);
			sendResponse({ success: true });
		})
		.catch((err) => {
			console.error('Injection failed for tab', tabId, err);
			sendResponse({ success: false, error: String(err) });
		});

	// Indicates we'll call sendResponse asynchronously
	return true;
});
