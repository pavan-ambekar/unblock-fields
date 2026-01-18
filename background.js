// MV3 service worker background script.
// Receives injection requests from the popup (message) and injects `autofill.js`.

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	if (!message) return;

	const tabId = message.tabId;
	const allFrames = !!message.allFrames;

	if (!tabId) {
		console.error('No tabId provided for injection');
		sendResponse({ success: false, error: 'no_tabId' });
		return;
	}

	let filesToInject = [];
	if (message.type === 'inject') {
		filesToInject = ['autofill.js'];
	} else if (message.type === 'inject-unhide') {
		filesToInject = ['unhide.js'];
	} else if (message.type === 'inject-remove-specimen') {
		filesToInject = ['remove-specimen.js'];
	} else {
		sendResponse({ success: false, error: 'unknown_type' });
		return;
	}

	chrome.scripting
		.executeScript({
			target: { tabId, allFrames },
			files: filesToInject,
		})
		.then(() => {
			console.log(`${filesToInject[0]} injected into tab`, tabId);
			sendResponse({ success: true });
		})
		.catch((err) => {
			console.error('Injection failed for tab', tabId, err);
			sendResponse({ success: false, error: String(err) });
		});

	// Indicates we'll call sendResponse asynchronously
	return true;
});
