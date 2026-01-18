(() => {
	try {
		const specimenImg = document.getElementById('Img1');
		if (specimenImg) {
			specimenImg.remove();
			console.log('remove-specimen: removed specimen watermark');
		} else {
			console.log('remove-specimen: specimen watermark not found');
		}
	} catch (err) {
		console.error('remove-specimen: unexpected error', err);
	}
})();
