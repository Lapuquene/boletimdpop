const url = 'journal.pdf'; // seu arquivo PDF

const flipbook = document.getElementById('flipbook');

async function renderPDF() {
    const pdf = await pdfjsLib.getDocument(url).promise;
    const totalPages = pdf.numPages;

    for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale: 2 });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({ canvasContext: context, viewport }).promise;

        const pageDiv = document.createElement('div');
        pageDiv.className = 'page';
        pageDiv.appendChild(canvas);
        flipbook.appendChild(pageDiv);
    }

    $('#flipbook').turn({
        width: 800,
        height: 500,
        autoCenter: true
    });
}

document.getElementById('prevBtn').addEventListener('click', () => {
    $('#flipbook').turn('previous');
});

document.getElementById('nextBtn').addEventListener('click', () => {
    $('#flipbook').turn('next');
});

renderPDF();
